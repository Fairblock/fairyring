#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------
# Single-node Fairyring launcher (validator is keyshare holder)
# Vote Extensions: ENABLED at VE_HEIGHT
# Deterministic key from mnemonic; manual APP_PRIV_HEX
# ---------------------------------------------------------------------
#
# Requirements:
#   - fairyringd in PATH
#   - jq and curl installed
#
# Behavior:
#   - Kills any running fairyringd
#   - Fresh chain init + gentx
#   - Sets vote_extensions_enable_height in genesis
#   - Creates validator key from VALIDATOR_MNEMONIC (no randomness)
#   - Writes keysharer.yaml using APP_PRIV_HEX provided by developer
#   - Starts node, waits to VE height + AFTER_BLOCKS
#   - Greps logs for ExtendVote/KeyshareVE hints (best-effort)
#   - Shuts node down
#
# Usage:
#   ./start_fairyring_ve_with_keyshare_mnemonic.sh
#
# IMPORTANT:
#   - Set VALIDATOR_MNEMONIC below (or export env var) before running.
#   - Populate APP_PRIV_HEX with the correct secp256k1 private key hex (no 0x).
# ---------------------------------------------------------------------

# ---- Config (override via env) ----
HOME_DIR="${HOME_DIR:-$HOME/.fairyring-ve-holder}"
CHAIN_ID="${CHAIN_ID:-fairy-local-1}"
MONIKER="${MONIKER:-node1}"
KEY_NAME="${KEY_NAME:-validator}"
KEYRING_BACKEND="${KEYRING_BACKEND:-test}"

DENOM="${DENOM:-ufairy}"
STAKE_AMOUNT="${STAKE_AMOUNT:-1000000000000${DENOM}}"
GENTX_AMOUNT="${GENTX_AMOUNT:-500000000000${DENOM}}"
GAS_PRICE="${GAS_PRICE:-0${DENOM}}"
CLEAN="${CLEAN:-1}"
BLOCK_TIME=5

RPC_LADDR="${RPC_LADDR:-tcp://127.0.0.1:26657}"
P2P_LADDR="${P2P_LADDR:-tcp://127.0.0.1:26656}"

# Vote Extensions activation
VE_HEIGHT="${VE_HEIGHT:-30}"
AFTER_BLOCKS="${AFTER_BLOCKS:-50}"

# Validator mnemonic (REQUIRED): 24 words separated by spaces
# You can export this as an env var instead of editing the file.
VALIDATOR_MNEMONIC="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"
VAL_ADDR=""

WALLET_MNEMONIC_1="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"
WALLET1_ADDR=""

# App private key hex for keysharer.yaml (developer must set the correct one)
# If empty, VE submissions might not include decrypted shares; blocks will still continue.
APP_PRIV_HEX="${APP_PRIV_HEX:-823ad58093b111e3c41369ca67103cba89e136995bdbd8a86c6b7eef9ca38b00}"

# Verification parameters
STARTUP_TIMEOUT="${STARTUP_TIMEOUT:-60}"
BLOCK_TIMEOUT="${BLOCK_TIMEOUT:-300}"

echo $HOME_DIR
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

  if pgrep -x "ShareGenerationClient" >/dev/null; then
    echo "Terminating ShareGenerationClient..."
    killall ShareGenerationClient
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

  echo ">> Creating key (${KEY_NAME}) from provided mnemonic"
  if [[ -z "${VALIDATOR_MNEMONIC}" ]]; then
    echo "ERROR: VALIDATOR_MNEMONIC is empty. Set it as env var or in the script." >&2
    exit 1
  fi
  if [[ -z "${WALLET_MNEMONIC_1}" ]]; then
    echo "ERROR: WALLET_MNEMONIC_1 is empty. Set it as env var or in the script." >&2
    exit 1
  fi

  if fairyringd keys show "${KEY_NAME}" --keyring-backend "${KEYRING_BACKEND}" --home "${HOME_DIR}" &>/dev/null; then
    echo ">> Key ${KEY_NAME} already exists (skipping recovery)"
  else
    # Recover deterministically from mnemonic (non-interactive)
    printf "%s\n" "${VALIDATOR_MNEMONIC}" | \
      fairyringd keys add "${KEY_NAME}" \
        --recover \
        --keyring-backend "${KEYRING_BACKEND}" \
        --home "${HOME_DIR}" \
        --output json > "${HOME_DIR}/key.${KEY_NAME}.json"
  fi

  if fairyringd keys show wallet1 --keyring-backend "${KEYRING_BACKEND}" --home "${HOME_DIR}" &>/dev/null; then
    echo ">> Key wallet1 already exists (skipping recovery)"
  else
    # Recover deterministically from mnemonic (non-interactive)
    printf "%s\n" "${WALLET_MNEMONIC_1}" | \
      fairyringd keys add wallet1 \
        --recover \
        --keyring-backend "${KEYRING_BACKEND}" \
        --home "${HOME_DIR}" \
        --output json > "${HOME_DIR}/key.wallet1.json"
  fi

  VAL_ADDR="$(fairyringd keys show "${KEY_NAME}" -a --keyring-backend "${KEYRING_BACKEND}" --home "${HOME_DIR}")"
  echo ">> Validator address: ${VAL_ADDR}"

  WALLET1_ADDR="$(fairyringd keys show wallet1 -a --keyring-backend "${KEYRING_BACKEND}" --home "${HOME_DIR}")"
  echo ">> Wallet1 address: ${WALLET1_ADDR}"

  echo ">> Add genesis account: ${VAL_ADDR} -> ${STAKE_AMOUNT}"
  fairyringd genesis add-genesis-account "${VAL_ADDR}" "${STAKE_AMOUNT}" \
    --home "${HOME_DIR}" --keyring-backend "${KEYRING_BACKEND}"

  echo ">> Add genesis account: ${WALLET1_ADDR} -> ${STAKE_AMOUNT}"
  fairyringd genesis add-genesis-account "${WALLET1_ADDR}" "${STAKE_AMOUNT}" \
    --home "${HOME_DIR}" --keyring-backend "${KEYRING_BACKEND}"

  echo ">> gentx (${GENTX_AMOUNT}) and collect-gentxs"
  fairyringd genesis gentx "${KEY_NAME}" "${GENTX_AMOUNT}" \
    --chain-id "${CHAIN_ID}" --home "${HOME_DIR}" --keyring-backend "${KEYRING_BACKEND}" >/dev/null
  fairyringd genesis collect-gentxs --home "${HOME_DIR}" >/dev/null

  GENESIS="${HOME_DIR}/config/genesis.json"
  CONFIG_TOML="${HOME_DIR}/config/config.toml"
  APP_TOML="${HOME_DIR}/config/app.toml"

  # ---- Set VE height in the appropriate place without touching other params ----
  if [[ -f "${GENESIS}" ]]; then
    echo ">> Enabling Vote Extensions at height ${VE_HEIGHT}"
    tmp="$(mktemp)"
    if jq -e '.consensus_params? != null' "${GENESIS}" >/dev/null; then
      jq --arg veh "${VE_HEIGHT}" '
        .consensus_params.abci |= (.consensus_params.abci // {}) |
        .consensus_params.abci.vote_extensions_enable_height = $veh
      ' "${GENESIS}" > "${tmp}" && mv "${tmp}" "${GENESIS}"
      FORMAT="consensus_params.abci"
    elif jq -e '.consensus?.params? != null' "${GENESIS}" >/dev/null; then
      jq --arg veh "${VE_HEIGHT}" '
        .consensus.params.abci |= (.consensus.params.abci // {}) |
        .consensus.params.abci.vote_extensions_enable_height = $veh
      ' "${GENESIS}" > "${tmp}" && mv "${tmp}" "${GENESIS}"
      FORMAT="consensus.params.abci"
    else
      echo "WARN: Unknown consensus params layout; not modifying VE height." >&2
      FORMAT="unknown"
    fi
  else
    echo "ERROR: genesis.json not found at ${GENESIS}" >&2
    exit 1
  fi

  sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL_ADDR"'","'"$WALLET1_ADDR"'"\]/g' $GENESIS
  sed -i -e 's/"key_expiry": "100"/"key_expiry": "1000000"/g' $GENESIS
  sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' $GENESIS

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

  # Write keysharer.yaml with APP_PRIV_HEX as-is (no derivation attempts)
  echo ">> Writing keysharer.yaml (uses APP_PRIV_HEX as provided)"
  mkdir -p "${HOME_DIR}/config"
  cat > "${HOME_DIR}/keysharer.yaml" <<YAML
enabled: true
validator_account: "${VAL_ADDR}"
app_secp256k1_priv_hex: "${APP_PRIV_HEX}"
invalid_share_pause_threshold: 3
YAML
  cp -f "${HOME_DIR}/keysharer.yaml" "${HOME_DIR}/config/keysharer.yaml"

  echo ">> keysharer.yaml:"
  sed 's/^/    /' "${HOME_DIR}/keysharer.yaml"

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

# ---- Helpers for RPC ----
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

current_height() {
  local rpc url
  rpc="$(rpc_url_from_laddr "${RPC_LADDR}")"
  url="${rpc}/status"
  curl -fsS "${url}" | jq -r '.result.sync_info.latest_block_height | tonumber'
}

wait_until_height() {
  local target deadline h
  target="$1"
  deadline=$2
  echo ">> Waiting until height >= ${target} (timeout ${deadline}s)…"
  local end=$(( $(date +%s) + deadline  ))
  while true; do
    h="$(current_height)"
    h="${h:-0}"
    if (( h >= target )); then
      echo ">> ✅ Reached height ${h} (target ${target})"
      return 0
    fi
    if (( $(date +%s) > end )); then
      echo "ERROR: Timed out waiting for height ${target}. Last height=${h}. See ${HOME_DIR}/logs/node.log" >&2
      return 1
    fi
    sleep 1
  done
}

# ---- Best-effort VE detection in logs ----
print_ve_log_hints() {
  echo ">> Looking for vote-extension related log lines (best-effort)…"
  (grep -E -i 'ExtendVote|VerifyVoteExtension|vote extension|KeyshareVE|keyshare' "${HOME_DIR}/logs/node.log" || true) | tail -n 120
}

check_tx_code () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != 0 ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    exit 1
  fi
}

wait_for_tx () {
  sleep $BLOCK_TIME
  local TXHASH=$(echo "$1" | jq -r '.txhash')
  RESULT=$(fairyringd q tx --type=hash $TXHASH --home $HOME_DIR --chain-id $CHAIN_ID -o json)
  echo "$RESULT"
}

main() {
  kill_existing
  prep_home
  init_chain
  start_node
  wait_for_status

  echo "Waiting test setup to run..."
  sleep $((BLOCK_TIME*2))

  echo "Setting up test environment..."

  echo "Registering as a validator in keyshare module..."
  RESULT=$(fairyringd tx keyshare register-validator --from validator --gas-prices 1ufairy --home $HOME_DIR --chain-id $CHAIN_ID --keyring-backend test --broadcast-mode sync -o json -y)
  check_tx_code $RESULT
  RESULT=$(wait_for_tx $RESULT)
  echo $RESULT
  VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.events[8].attributes[0].value')
  if [ "$VALIDATOR_ADDR" != "$VAL_ADDR" ]; then
    echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VAL_ADDR', got '$VALIDATOR_ADDR'"
    echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
    echo "$RESULT" | jq
    exit 1
  fi

  echo "Starting ShareGenerationClient..."
  ShareGenerationClient start --config /home/grider644/go/src/github.com/FairBlock/fairyring/scripts/devnet/sharegenerationclient_config.yml > $HOME_DIR/sharegenerationclient.log 2>&1 &
  sleep $BLOCK_TIME

  # Ensure we cross VE activation
  pre=$(( VE_HEIGHT - 1 ))
  if (( pre < 1 )); then pre=1; fi
  wait_until_height "${pre}" 120
  post=$(( VE_HEIGHT + AFTER_BLOCKS ))
  wait_until_height "${post}" "${BLOCK_TIMEOUT}"

  echo ">> ✅ Blocks continued past VE height (${VE_HEIGHT})."
  print_ve_log_hints
  
  echo ">> KeyshareVE trace (last 200 lines)…"
  grep -E 'KeyshareVE/' -n "${HOME_DIR}/logs/node.log" | tail -n 200

  echo ">> Test complete; shutting down node."
  kill_existing
}

main "$@"