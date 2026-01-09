#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------
# 4-node Fairyring localnet launcher (all validators, VE enabled)
# - Add mnemonics for the validators
# - Generates gentx for all 4 validators, collects on node1, shares genesis
# - Starts 4 nodes with non-conflicting ports
# - Registers all 4 validators in keyshare module
# - Waits past VE height and greps VE/keyshare hints
# ---------------------------------------------------------------------

# ---- Config (override via env) ----
BASE_HOME="${BASE_HOME:-$HOME/.fairyring-ve-4vals}"
CHAIN_ID="${CHAIN_ID:-fairy-local-1}"
KEYRING_BACKEND="${KEYRING_BACKEND:-test}"

DENOM="${DENOM:-ufairy}"
STAKE_AMOUNT="${STAKE_AMOUNT:-1000000000000${DENOM}}"
GENTX_AMOUNT="${GENTX_AMOUNT:-500000000000${DENOM}}"
GAS_PRICE="${GAS_PRICE:-0${DENOM}}"
CLEAN="${CLEAN:-1}"
BLOCK_TIME=2

# Vote Extensions activation
VE_HEIGHT="${VE_HEIGHT:-30}"
AFTER_BLOCKS="${AFTER_BLOCKS:-50}"

# --- Node setup ---
NODE_COUNT=4
MONIKERS=(node1 node2 node3 node4)
KEY_NAMES=(validator validator2 validator3 validator4)

HOME_DIRS=(
  "$BASE_HOME/node1"
  "$BASE_HOME/node2"
  "$BASE_HOME/node3"
  "$BASE_HOME/node4"
)

# Ports per node (avoid collisions)
RPC_PORTS=(26657 26667 26677 26687)
P2P_PORTS=(26656 26666 26676 26686)
GRPC_PORTS=(9090 9093 9094 9095)
API_PORTS=(1317 1318 1319 1320)

RPC_LADDRS=(
  "tcp://127.0.0.1:${RPC_PORTS[0]}"
  "tcp://127.0.0.1:${RPC_PORTS[1]}"
  "tcp://127.0.0.1:${RPC_PORTS[2]}"
  "tcp://127.0.0.1:${RPC_PORTS[3]}"
)
P2P_LADDRS=(
  "tcp://127.0.0.1:${P2P_PORTS[0]}"
  "tcp://127.0.0.1:${P2P_PORTS[1]}"
  "tcp://127.0.0.1:${P2P_PORTS[2]}"
  "tcp://127.0.0.1:${P2P_PORTS[3]}"
)

# ------------
# MNEMONICS
# ------------
VALIDATOR_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"
VALIDATOR_MNEMONIC_2="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
VALIDATOR_MNEMONIC_3="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
VALIDATOR_MNEMONIC_4="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"

WALLET_MNEMONIC_1="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"

# App private key hex for keysharer.yaml
APP_PRIV_HEX_1="${APP_PRIV_HEX_1:-823ad58093b111e3c41369ca67103cba89e136995bdbd8a86c6b7eef9ca38b00}"
APP_PRIV_HEX_2="${APP_PRIV_HEX_2:-a267fb03b3e6dc381550ea0257ace31433698f16248ba111dfb75550364d31fe}"
APP_PRIV_HEX_3="${APP_PRIV_HEX_3:-ef1450bdc18396f2254f52d8c525c0d933a8f146ec2a681eaf319f5899f2f60d}"
APP_PRIV_HEX_4="${APP_PRIV_HEX_4:-5e09dab188b97c69835e0db998ab61a124cf2071cddb5fe5b0faededd47750dc}"

# Verification parameters
STARTUP_TIMEOUT="${STARTUP_TIMEOUT:-60}"
BLOCK_TIMEOUT="${BLOCK_TIMEOUT:-300}"

# ---------------------------------------------------------------------
# Requirements
# ---------------------------------------------------------------------
need() { command -v "$1" >/dev/null 2>&1 || { echo "ERROR: '$1' required." >&2; exit 1; }; }
need fairyringd
need jq
need curl

# ---------------------------------------------------------------------
# Kill any running fairyring
# ---------------------------------------------------------------------
kill_existing() {
  local pids
  pids="$(pgrep -x fairyringd || true)"
  if [[ -n "${pids}" ]]; then
    echo ">> Found running fairyringd instance(s): ${pids}"
    kill ${pids} || true
    for _ in $(seq 1 20); do
      sleep 0.5
      pgrep -x fairyringd >/dev/null 2>&1 || break
    done
    pgrep -x fairyringd >/dev/null 2>&1 && pkill -9 -x fairyringd || true
  fi

  if pgrep -x "ShareGenerationClient" >/dev/null; then
    echo ">> Terminating ShareGenerationClient..."
    killall ShareGenerationClient || true
  fi
}

prep_home() {
  if [[ "${CLEAN}" == "1" ]]; then
    echo ">> Removing ${BASE_HOME}"
    rm -rf "${BASE_HOME}"
  fi
  mkdir -p "${BASE_HOME}"
  for h in "${HOME_DIRS[@]}"; do
    mkdir -p "$h"
  done
}

mnemonic_for_node() {
  local i="$1"
  case "$i" in
    1) echo "$VALIDATOR_MNEMONIC_1" ;;
    2) echo "$VALIDATOR_MNEMONIC_2" ;;
    3) echo "$VALIDATOR_MNEMONIC_3" ;;
    4) echo "$VALIDATOR_MNEMONIC_4" ;;
  esac
}

app_priv_for_node() {
  local i="$1"
  case "$i" in
    1) echo "$APP_PRIV_HEX_1" ;;
    2) echo "$APP_PRIV_HEX_2" ;;
    3) echo "$APP_PRIV_HEX_3" ;;
    4) echo "$APP_PRIV_HEX_4" ;;
  esac
}

# ---------------------------------------------------------------------
# Init all nodes + recover keys
# ---------------------------------------------------------------------
VAL_ADDRS=("" "" "" "")
WALLET1_ADDR=""

init_nodes_and_keys() {
  echo ">> Initializing ${NODE_COUNT} nodes..."

  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local moniker="${MONIKERS[$idx]}"
    local keyname="${KEY_NAMES[$idx]}"
    local mnemonic
    mnemonic="$(mnemonic_for_node "$i")"

    echo ">> Init ${moniker} @ ${home}"
    fairyringd init "${moniker}" \
      --chain-id "${CHAIN_ID}" \
      --home "${home}" \
      -o \
      --default-denom "${DENOM}"

    if [[ -z "${mnemonic}" ]]; then
      echo "ERROR: VALIDATOR_MNEMONIC_${i} is empty. Set it before running." >&2
      exit 1
    fi

    echo ">> Recovering key ${keyname} for ${moniker}"
    if fairyringd keys show "${keyname}" --keyring-backend "${KEYRING_BACKEND}" --home "${home}" &>/dev/null; then
      echo "   - key exists, skipping"
    else
      printf "%s\n" "${mnemonic}" | \
        fairyringd keys add "${keyname}" \
          --recover \
          --keyring-backend "${KEYRING_BACKEND}" \
          --home "${home}" \
          --output json > "${home}/key.${keyname}.json"
    fi

    VAL_ADDRS[$idx]="$(fairyringd keys show "${keyname}" -a --keyring-backend "${KEYRING_BACKEND}" --home "${home}")"
    echo "   - ${moniker} addr: ${VAL_ADDRS[$idx]}"
  done

  # wallet1 only in node1 (same mnemonic as your script)
  local home1="${HOME_DIRS[0]}"
  if [[ -z "${WALLET_MNEMONIC_1}" ]]; then
    echo "ERROR: WALLET_MNEMONIC_1 is empty." >&2
    exit 1
  fi
  if fairyringd keys show wallet1 --keyring-backend "${KEYRING_BACKEND}" --home "${home1}" &>/dev/null; then
    echo ">> wallet1 already exists (skipping recovery)"
  else
    printf "%s\n" "${WALLET_MNEMONIC_1}" | \
      fairyringd keys add wallet1 \
        --recover \
        --keyring-backend "${KEYRING_BACKEND}" \
        --home "${home1}" \
        --output json > "${home1}/key.wallet1.json"
  fi
  WALLET1_ADDR="$(fairyringd keys show wallet1 -a --keyring-backend "${KEYRING_BACKEND}" --home "${home1}")"
  echo ">> wallet1 addr: ${WALLET1_ADDR}"
}

# ---------------------------------------------------------------------
# Genesis: add accounts, gentx all, collect on node1, set VE height
# ---------------------------------------------------------------------
build_shared_genesis() {
  local home1="${HOME_DIRS[0]}"
  local genesis="${home1}/config/genesis.json"

  echo ">> Adding genesis accounts to node1 (all validators + wallet1)..."
  # node1's genesis must know about ALL validator balances + wallet1
  for addr in "${VAL_ADDRS[@]}"; do
    fairyringd genesis add-genesis-account "${addr}" "${STAKE_AMOUNT}" \
      --home "${home1}" --keyring-backend "${KEYRING_BACKEND}"
  done
  fairyringd genesis add-genesis-account "${WALLET1_ADDR}" "${STAKE_AMOUNT}" \
    --home "${home1}" --keyring-backend "${KEYRING_BACKEND}"

  echo ">> Adding per-node genesis balances for gentx (nodes 2..${NODE_COUNT})..."
  # gentx on node2/3/4 also needs its local genesis to fund its own validator
  # (node1 already has its balance above, so start from i=2)
  for i in $(seq 2 $NODE_COUNT); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local addr="${VAL_ADDRS[$idx]}"

    fairyringd genesis add-genesis-account "${addr}" "${STAKE_AMOUNT}" \
      --home "${home}" --keyring-backend "${KEYRING_BACKEND}"
  done

  echo ">> Generating gentxs on all nodes..."
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local keyname="${KEY_NAMES[$idx]}"

    echo "   - gentx from ${keyname} @ ${home}"
    fairyringd genesis gentx "${keyname}" "${GENTX_AMOUNT}" \
      --chain-id "${CHAIN_ID}" \
      --home "${home}" \
      --keyring-backend "${KEYRING_BACKEND}" >/dev/null
  done

  echo ">> Copying gentxs to node1 and collecting..."
  mkdir -p "${home1}/config/gentx"
  for i in $(seq 2 $NODE_COUNT); do
    local idx=$((i-1))
    cp -f "${HOME_DIRS[$idx]}/config/gentx/"*.json "${home1}/config/gentx/" || true
  done
  fairyringd genesis collect-gentxs --home "${home1}" >/dev/null

  # Enable VE height
  echo ">> Enabling Vote Extensions at height ${VE_HEIGHT}"
  tmp="$(mktemp)"
  if jq -e '.consensus_params? != null' "${genesis}" >/dev/null; then
    jq --arg veh "${VE_HEIGHT}" '
      .consensus_params.abci |= (.consensus_params.abci // {}) |
      .consensus_params.abci.vote_extensions_enable_height = $veh
    ' "${genesis}" > "${tmp}" && mv "${tmp}" "${genesis}"
  elif jq -e '.consensus?.params? != null' "${genesis}" >/dev/null; then
    jq --arg veh "${VE_HEIGHT}" '
      .consensus.params.abci |= (.consensus.params.abci // {}) |
      .consensus.params.abci.vote_extensions_enable_height = $veh
    ' "${genesis}" > "${tmp}" && mv "${tmp}" "${genesis}"
  else
    echo "WARN: Unknown consensus params layout; not modifying VE height." >&2
  fi

  # Trusted addresses: all validators + wallet1
  local trusted_list=""
  for addr in "${VAL_ADDRS[@]}"; do
    trusted_list="${trusted_list}\"${addr}\","
  done
  trusted_list="${trusted_list}\"${WALLET1_ADDR}\""
  sed -i -E "s/\"trusted_addresses\": \[\]/\"trusted_addresses\": \[${trusted_list}\]/g" "${genesis}"

  sed -i -e 's/"key_expiry": "100"/"key_expiry": "1000000"/g' "${genesis}"
  sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' "${genesis}"

  # Share genesis to other nodes
  for i in $(seq 2 $NODE_COUNT); do
    local idx=$((i-1))
    cp -f "${genesis}" "${HOME_DIRS[$idx]}/config/genesis.json"
  done

  local veh
  veh=$(jq -r '.consensus_params.abci.vote_extensions_enable_height // .consensus.params.abci.vote_extensions_enable_height // empty' "${genesis}")
  echo ">> vote_extensions_enable_height in genesis: ${veh:-<not set>}"
}

# ---------------------------------------------------------------------
# Configure per-node ports + peers + faster timeouts
# ---------------------------------------------------------------------
configure_nodes() {
  echo ">> Configuring ports, peers, and fast local timeouts..."

  # node IDs first
  local node_ids=("" "" "" "")
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    node_ids[$idx]="$(fairyringd tendermint show-node-id --home "${HOME_DIRS[$idx]}")"
  done

  # build peer strings and apply config changes
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local rpc_laddr="${RPC_LADDRS[$idx]}"
    local p2p_laddr="${P2P_LADDRS[$idx]}"
    local grpc_port="${GRPC_PORTS[$idx]}"
    local api_port="${API_PORTS[$idx]}"

    local cfg="${home}/config/config.toml"
    local app="${home}/config/app.toml"

    # ---- PPROF: give each node a unique port to avoid 6060 clashes ----
    # node1: 6060, node2: 6061, node3: 6062, node4: 6063
    local pprof_port=$((6060 + idx))
    sed -i.bak -E 's|^pprof_laddr = ".*"|pprof_laddr = "localhost:'"${pprof_port}"'"|g' "${cfg}" || true

    # ---- Localnet-friendly P2P settings ----
    # allow localhost / duplicate IPs so 4 validators on 127.0.0.1 can peer
    sed -i.bak -E 's/^addr_book_strict *= .*/addr_book_strict = false/' "${cfg}" || true
    sed -i.bak -E 's/^allow_duplicate_ip *= .*/allow_duplicate_ip = true/' "${cfg}" || true

    # rpc / p2p laddr
    sed -i.bak -E "s|^laddr = \".*26657\"|laddr = \"${rpc_laddr}\"|g" "${cfg}"
    awk -v val="${p2p_laddr}" '
      BEGIN{in_p2p=0}
      /^\[p2p\]/{in_p2p=1}
      /^\[.*\]/{if ($0 !~ /^\[p2p\]/) in_p2p=0}
      {
        if(in_p2p && $0 ~ /^laddr = /){
          sub(/=.*/, "= \"" val "\"")
        }
        print
      }
    ' "${cfg}" > "${cfg}.tmp" && mv "${cfg}.tmp" "${cfg}"

    # persistent peers: all other nodes
    local peers=""
    for j in $(seq 1 $NODE_COUNT); do
      [[ "$j" == "$i" ]] && continue
      local jdx=$((j-1))
      peers+="${node_ids[$jdx]}@127.0.0.1:${P2P_PORTS[$jdx]},"
    done
    peers="${peers%,}"
    sed -i.bak -E "s|^persistent_peers = \".*\"|persistent_peers = \"${peers}\"|g" "${cfg}"

    # fast blocks
    sed -i \
      -e 's/^timeout_propose = .*/timeout_propose = "1s"/' \
      -e 's/^timeout_propose_delta = .*/timeout_propose_delta = "500ms"/' \
      -e 's/^timeout_prevote = .*/timeout_prevote = "1s"/' \
      -e 's/^timeout_prevote_delta = .*/timeout_prevote_delta = "500ms"/' \
      -e 's/^timeout_precommit = .*/timeout_precommit = "1s"/' \
      -e 's/^timeout_precommit_delta = .*/timeout_precommit_delta = "500ms"/' \
      -e 's/^timeout_commit = .*/timeout_commit = "1s"/' \
      "${cfg}"

    # minimum gas prices
    sed -i.bak -E "s|^minimum-gas-prices = \".*\"|minimum-gas-prices = \"${GAS_PRICE}\"|g" "${app}" || true

    # unique grpc + api ports (avoid bind failures)
    sed -i.bak -E "s|^address = \".*:9090\"|address = \"0.0.0.0:${grpc_port}\"|g" "${app}" || true
    sed -i.bak -E "s|^address = \"tcp://.*:1317\"|address = \"tcp://0.0.0.0:${api_port}\"|g" "${app}" || true

    # keysharer.yaml per node
    local privhex
    privhex="$(app_priv_for_node "$i")"
    cat > "${home}/keysharer.yaml" <<YAML
enabled: true
validator_account: "${VAL_ADDRS[$idx]}"
app_secp256k1_priv_hex: "${privhex}"
invalid_share_pause_threshold: 3
YAML
    cp -f "${home}/keysharer.yaml" "${home}/config/keysharer.yaml"
  done
}

# ---------------------------------------------------------------------
# Start all nodes
# ---------------------------------------------------------------------
NODE_PIDS=("" "" "" "")
start_nodes() {
  echo ">> Starting ${NODE_COUNT} nodes..."
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    mkdir -p "${home}/logs"

    ( nohup fairyringd start --home "${home}" --log_level "info" \
        > "${home}/logs/node.log" 2>&1 & echo $! > "${home}/logs/node.pid" ) || true

    NODE_PIDS[$idx]="$(cat "${home}/logs/node.pid")"
    echo "   - ${MONIKERS[$idx]} PID ${NODE_PIDS[$idx]} (logs: ${home}/logs/node.log)"
  done

  trap 'shutdown_nodes' EXIT
}

shutdown_nodes() {
  echo ">> Shutting down nodes..."
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local pid="${NODE_PIDS[$idx]}"
    [[ -z "${pid}" ]] && continue
    if ps -p "${pid}" >/dev/null 2>&1; then
      kill "${pid}" || true
    fi
  done
}

# ---------------------------------------------------------------------
# RPC helpers (use node1 as canonical)
# ---------------------------------------------------------------------
rpc_http_from_laddr() {
  local hostport="${1#tcp://}"
  echo "http://${hostport}"
}

NODE1_RPC_TCP="${RPC_LADDRS[0]}"
NODE1_RPC_HTTP="$(rpc_http_from_laddr "${RPC_LADDRS[0]}")"

wait_for_all_status() {
  echo ">> Waiting for all RPCs..."
  local deadline end
  end=$(( $(date +%s) + STARTUP_TIMEOUT ))
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local url
    url="$(rpc_http_from_laddr "${RPC_LADDRS[$idx]}")/status"
    deadline=$end
    until curl -fsS "${url}" >/dev/null 2>&1; do
      if (( $(date +%s) > deadline )); then
        echo "ERROR: RPC for ${MONIKERS[$idx]} did not come up. See ${HOME_DIRS[$idx]}/logs/node.log" >&2
        exit 1
      fi
      sleep 1
    done
    echo "   - ${MONIKERS[$idx]} RPC up"
  done
}

current_height() {
  curl -fsS "${NODE1_RPC_HTTP}/status" | jq -r '.result.sync_info.latest_block_height | tonumber'
}

wait_until_height() {
  local target="$1"
  local deadline="$2"
  echo ">> Waiting until height >= ${target} (timeout ${deadline}s)…"
  local end=$(( $(date +%s) + deadline ))
  while true; do
    local h
    h="$(current_height || echo 0)"
    if (( h >= target )); then
      echo ">> ✅ Reached height ${h} (target ${target})"
      return 0
    fi
    if (( $(date +%s) > end )); then
      echo "ERROR: Timed out waiting for height ${target}. Last height=${h}" >&2
      return 1
    fi
    sleep 1
  done
}

# ---------------------------------------------------------------------
# TX helpers
# ---------------------------------------------------------------------
check_tx_code () {
  local TX_CODE
  TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != 0 ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    echo "RAW LOG: $(echo "$1" | jq -r '.raw_log')" >&2
    exit 1
  fi
}

wait_for_tx () {
  sleep $BLOCK_TIME
  local home="$1"
  local txjson="$2"
  local TXHASH
  TXHASH=$(echo "$txjson" | jq -r '.txhash')
  fairyringd q tx --type=hash "$TXHASH" --home "$home" --chain-id "$CHAIN_ID" --node "$NODE1_RPC_TCP" -o json
}

extract_registered_validator_addr() {
  # best-effort extraction; fallback to old index if needed
  local result="$1"
  local addr
  addr="$(echo "$result" | jq -r '
     .events[]? 
     | .attributes[]? 
     | select(.key|test("validator";"i")) 
     | .value
  ' | head -n1)"
  if [[ -z "${addr}" || "${addr}" == "null" ]]; then
    addr="$(echo "$result" | jq -r '.events[8].attributes[0].value // empty')"
  fi
  echo "$addr"
}

register_all_validators_keyshare() {
  echo ">> Registering all validators in keyshare module..."
  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local keyname="${KEY_NAMES[$idx]}"

    local res txres regaddr
    res=$(fairyringd tx keyshare register-validator \
      --from "${keyname}" \
      --gas-prices "1${DENOM}" \
      --home "${home}" \
      --chain-id "${CHAIN_ID}" \
      --keyring-backend "${KEYRING_BACKEND}" \
      --broadcast-mode sync \
      --node "$NODE1_RPC_TCP" \
      -o json -y)

    check_tx_code "$res"
    txres="$(wait_for_tx "$home" "$res")"

    regaddr="$(extract_registered_validator_addr "$txres")"
    if [[ -n "${regaddr}" && "${regaddr}" != "${VAL_ADDRS[$idx]}" ]]; then
      echo "WARN: register-validator addr mismatch for ${keyname}. expected ${VAL_ADDRS[$idx]} got ${regaddr}"
    fi
    echo "   - ${keyname} registered"
  done
}

# ---------------------------------------------------------------------
# VE log hints
# ---------------------------------------------------------------------
print_ve_log_hints() {
  local home="$1"
  echo ">> [${home}] vote-extension related log lines (best-effort)…"
  (grep -E -i 'ExtendVote|VerifyVoteExtension|vote extension|KeyshareVE|keyshare' "${home}/logs/node.log" || true) | tail -n 80
}

# ---------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------
main() {
  kill_existing
  prep_home
  init_nodes_and_keys
  build_shared_genesis
  configure_nodes
  start_nodes
  wait_for_all_status

  echo ">> Waiting for network to stabilize..."
  sleep $((BLOCK_TIME*10))

  register_all_validators_keyshare

  echo ">> Starting ShareGenerationClient..."
  ShareGenerationClient start \
    --config /home/grider644/go/src/github.com/FairBlock/fairyring/scripts/devnet/sharegenerationclient_config.yml \
    > "${BASE_HOME}/sharegenerationclient.log" 2>&1 &
  sleep $BLOCK_TIME

  # Ensure we cross VE activation
  local pre=$(( VE_HEIGHT - 1 ))
  (( pre < 1 )) && pre=1
  wait_until_height "${pre}" 180
  local post=$(( VE_HEIGHT + AFTER_BLOCKS ))
  wait_until_height "${post}" "${BLOCK_TIMEOUT}"

  echo ">> ✅ Blocks continued past VE height (${VE_HEIGHT})."

  for i in $(seq 1 $NODE_COUNT); do
    local idx=$((i-1))
    print_ve_log_hints "${HOME_DIRS[$idx]}"
    echo ">> [${MONIKERS[$idx]}] KeyshareVE trace (last 120 lines)…"
    grep -E 'KeyshareVE/' -n "${HOME_DIRS[$idx]}/logs/node.log" | tail -n 120 || true
  done

  echo ">> Test complete."
}

main "$@"
