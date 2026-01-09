#!/usr/bin/env bash
set -euo pipefail

# -------------------------------
# Single-node Fairyring launcher
# Vote Extensions: DISABLED
# With pre-kill + block production check
# -------------------------------
#
# Requirements:
#   - fairyringd in PATH
#   - jq and curl installed
#
# Behavior:
#   - Kills any running fairyringd
#   - Initializes a fresh single-node chain
#   - Sets vote_extensions_enable_height = "0" without touching other consensus params
#   - Starts the node, waits for a few blocks, then shuts it down
#
# Usage:
#   ./start_fairyring_no_ve.sh
#
# Env overrides (optional):
#   HOME_DIR, CHAIN_ID, MONIKER, DENOM, STAKE_AMOUNT, GAS_PRICE, CLEAN
#   RPC_LADDR, P2P_LADDR, STARTUP_TIMEOUT, BLOCK_TIMEOUT, TARGET_BLOCKS
# -------------------------------

# ---- Config (override via env) ----
HOME_DIR="${HOME_DIR:-$HOME/.fairyring-veoff}"
CHAIN_ID="${CHAIN_ID:-fairy-local-1}"
MONIKER="${MONIKER:-node1}"
KEY_NAME="${KEY_NAME:-validator}"
DENOM="${DENOM:-ufairy}"
STAKE_AMOUNT="${STAKE_AMOUNT:-1000000000${DENOM}}"
GENTX_AMOUNT="${GENTX_AMOUNT:-500000000${DENOM}}"
GAS_PRICE="${GAS_PRICE:-0${DENOM}}"
CLEAN="${CLEAN:-1}"

RPC_LADDR="${RPC_LADDR:-tcp://127.0.0.1:26657}"
P2P_LADDR="${P2P_LADDR:-tcp://127.0.0.1:26656}"

# Verification parameters
STARTUP_TIMEOUT="${STARTUP_TIMEOUT:-60}"
BLOCK_TIMEOUT="${BLOCK_TIMEOUT:-120}"
TARGET_BLOCKS="${TARGET_BLOCKS:-5}"

# ---- Sanity checks ----
need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: '$1' is required. Please install it." >&2
    exit 1
  fi
}
need fairyringd
need jq
need curl

# ---- Kill any running fairyring ----
kill_existing() {
  local pids
  pids="$(pgrep -x fairyringd || true)"
  if [[ -n "${pids}" ]]; then
    echo ">> Found running fairyringd instance(s): ${pids}"
    echo ">> Sending SIGTERM…"
    kill ${pids} || true

    for _ in $(seq 1 20); do
      sleep 0.5
      if ! pgrep -x fairyringd >/dev/null 2>&1; then
        echo ">> fairyringd stopped."
        break
      fi
    done

    if pgrep -x fairyringd >/dev/null 2>&1; then
      echo ">> Forcing SIGKILL…"
      pkill -9 -x fairyringd || true
    fi
  else
    echo ">> No running fairyringd processes found."
  fi
}

# ---- Fresh home ----
prep_home() {
  if [[ "${CLEAN}" == "1" ]]; then
    echo ">> Removing ${HOME_DIR}"
    rm -rf "${HOME_DIR}"
  fi
  mkdir -p "${HOME_DIR}"
}

# ---- Init chain ----
init_chain() {
  echo ">> Init chain @ ${HOME_DIR} (CHAIN_ID=${CHAIN_ID}, MONIKER=${MONIKER})"
  fairyringd init "${MONIKER}" \
    --chain-id "${CHAIN_ID}" \
    --home "${HOME_DIR}" \
    -o \
    --default-denom "${DENOM}"

  echo ">> Creating key (${KEY_NAME})"
  if ! fairyringd keys show "${KEY_NAME}" --keyring-backend test --home "${HOME_DIR}" &>/dev/null; then
    fairyringd keys add "${KEY_NAME}" --keyring-backend test --home "${HOME_DIR}" --output json > "${HOME_DIR}/key.${KEY_NAME}.json"
  fi
  VAL_ADDR="$(fairyringd keys show "${KEY_NAME}" -a --keyring-backend test --home "${HOME_DIR}")"

  echo ">> Add genesis account: ${VAL_ADDR} -> ${STAKE_AMOUNT}"
  fairyringd genesis add-genesis-account "${VAL_ADDR}" "${STAKE_AMOUNT}" \
    --home "${HOME_DIR}" --keyring-backend test

  echo ">> gentx (${GENTX_AMOUNT}) and collect-gentxs"
  fairyringd genesis gentx "${KEY_NAME}" "${GENTX_AMOUNT}" \
    --chain-id "${CHAIN_ID}" --home "${HOME_DIR}" --keyring-backend test >/dev/null
  fairyringd genesis collect-gentxs --home "${HOME_DIR}" >/dev/null

  GENESIS="${HOME_DIR}/config/genesis.json"
  CONFIG_TOML="${HOME_DIR}/config/config.toml"
  APP_TOML="${HOME_DIR}/config/app.toml"

  # ---- Ensure vote extensions are DISABLED at genesis ----
  if [[ -f "${GENESIS}" ]]; then
    echo ">> Setting VE height to 0 while preserving existing consensus params"
    tmp="$(mktemp)"
    if jq -e '.consensus_params? != null' "${GENESIS}" >/dev/null; then
      jq '
        .consensus_params.abci |= (.consensus_params.abci // {}) |
        .consensus_params.abci.vote_extensions_enable_height = "0"
      ' "${GENESIS}" > "${tmp}"
      mv "${tmp}" "${GENESIS}"
      FORMAT="consensus_params.abci"
    elif jq -e '.consensus?.params? != null' "${GENESIS}" >/dev/null; then
      jq '
        .consensus.params.abci |= (.consensus.params.abci // {}) |
        .consensus.params.abci.vote_extensions_enable_height = "0"
      ' "${GENESIS}" > "${tmp}"
      mv "${tmp}" "${GENESIS}"
      FORMAT="consensus.params.abci"
    else
      echo "WARN: Unknown consensus params layout; not modifying VE height." >&2
      FORMAT="unknown"
    fi
  else
    echo "ERROR: genesis.json not found at ${GENESIS}" >&2
    exit 1
  fi

  # ---- Fast local block times & useful defaults ----
  echo ">> Tweaking config.toml for fast local blocks"
  sed -i.bak \
    -e "s|^laddr = \".*\"$|laddr = \"${RPC_LADDR}\"|g" \
    "${HOME_DIR}/config/config.toml"

  awk -v val="${P2P_LADDR}" '
    BEGIN{in_p2p=0}
    /^\[p2p\]/{in_p2p=1}
    /^\[.*\]/{if ($0 !~ /^\[p2p\]/) in_p2p=0}
    {
      if(in_p2p && $0 ~ /^laddr = /){
        sub(/=.*/, "= \"" val "\"")
      }
      print
    }
  ' "${HOME_DIR}/config/config.toml" > "${HOME_DIR}/config/config.toml.tmp" && mv "${HOME_DIR}/config/config.toml.tmp" "${HOME_DIR}/config/config.toml"

  sed -i \
    -e 's/^timeout_propose = .*/timeout_propose = "1s"/' \
    -e 's/^timeout_propose_delta = .*/timeout_propose_delta = "500ms"/' \
    -e 's/^timeout_prevote = .*/timeout_prevote = "1s"/' \
    -e 's/^timeout_prevote_delta = .*/timeout_prevote_delta = "500ms"/' \
    -e 's/^timeout_precommit = .*/timeout_precommit = "1s"/' \
    -e 's/^timeout_precommit_delta = .*/timeout_precommit_delta = "500ms"/' \
    -e 's/^timeout_commit = .*/timeout_commit = "1s"/' \
    "${HOME_DIR}/config/config.toml"

  echo ">> Setting minimum-gas-prices = ${GAS_PRICE}"
  sed -i.bak -E "s|^minimum-gas-prices = \".*\"|minimum-gas-prices = \"${GAS_PRICE}\"|g" "${APP_TOML}" || true

  VEH=$(jq -r '.consensus_params.abci.vote_extensions_enable_height // .consensus.params.abci.vote_extensions_enable_height // empty' "${GENESIS}")
  echo ">> vote_extensions_enable_height in genesis (${FORMAT}): ${VEH:-<not set>}"
}

# ---- Start node in background ----
NODE_PID=""
start_node() {
  echo ">> Launching fairyringd…"
  mkdir -p "${HOME_DIR}/logs"
  ( nohup fairyringd start --home "${HOME_DIR}" --log_level "info" > "${HOME_DIR}/logs/node.log" 2>&1 & echo $! > "${HOME_DIR}/logs/node.pid" ) || true
  NODE_PID="$(cat "${HOME_DIR}/logs/node.pid")"
  if [[ -z "${NODE_PID}" ]] || ! ps -p "${NODE_PID}" >/dev/null 2>&1; then
    echo "ERROR: failed to start fairyringd (no PID found)." >&2
    exit 1
  fi
  echo ">> fairyringd started with PID ${NODE_PID} (logs: ${HOME_DIR}/logs/node.log)"
  trap 'shutdown_node' EXIT
}

shutdown_node() {
  if [[ -n "${NODE_PID:-}" ]] && ps -p "${NODE_PID}" >/dev/null 2>&1; then
    echo ">> Stopping fairyringd (PID ${NODE_PID})…"
    kill "${NODE_PID}" || true
    for _ in $(seq 1 40); do
      sleep 0.25
      if ! ps -p "${NODE_PID}" >/dev/null 2>&1; then
        echo ">> fairyringd stopped."
        return
      fi
    done
    echo ">> Forcing kill…"
    kill -9 "${NODE_PID}" || true
  fi
}

# ---- Wait for RPC and blocks ----
rpc_url_from_laddr() {
  local laddr="$1"
  local hostport="${laddr#tcp://}"
  echo "http://${hostport}"
}

wait_for_status() {
  local rpc url deadline
  rpc="$(rpc_url_from_laddr "${RPC_LADDR}")"
  url="${rpc}/status"
  echo ">> Waiting for RPC at ${url} (timeout ${STARTUP_TIMEOUT}s)…"
  deadline=$(( $(date +%s) + STARTUP_TIMEOUT ))
  until curl -fsS "${url}" >/dev/null 2>&1; do
    if (( $(date +%s) > deadline )); then
      echo "ERROR: RPC did not come up in ${STARTUP_TIMEOUT}s. See ${HOME_DIR}/logs/node.log" >&2
      return 1
    fi
    sleep 1
  done
  echo ">> RPC is up."
  return 0
}

wait_for_blocks() {
  local rpc url target deadline cur_h started_at
  rpc="$(rpc_url_from_laddr "${RPC_LADDR}")"
  url="${rpc}/status"
  target="${TARGET_BLOCKS}"
  deadline=$(( $(date +%s) + BLOCK_TIMEOUT ))
  echo ">> Waiting for ${target} blocks (timeout ${BLOCK_TIMEOUT}s)…"

  started_at="$(curl -fsS "${url}" | jq -r '.result.sync_info.latest_block_height | tonumber')"
  started_at="${started_at:-0}"
  echo ">> Start height: ${started_at}"

  while true; do
    cur_h="$(curl -fsS "${url}" | jq -r '.result.sync_info.latest_block_height | tonumber')"
    cur_h="${cur_h:-0}"
    if (( cur_h - started_at >= target )); then
      echo ">> ✅ Blocks produced. Start=${started_at}, Current=${cur_h} (Δ=$((${cur_h}-${started_at})))"
      return 0
    fi
    if (( $(date +%s) > deadline )); then
      echo "ERROR: Timed out waiting for ${target} blocks. Last height=${cur_h}. See ${HOME_DIR}/logs/node.log" >&2
      return 1
    fi
    sleep 1
  done
}

main() {
  kill_existing
  prep_home
  init_chain
  start_node
  wait_for_status
  wait_for_blocks
  echo ">> Test complete; shutting down node."
}

main "$@"