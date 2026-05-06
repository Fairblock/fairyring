#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Multi-validator ZKP + CosmWasm e2e test for Fairyring.
#
# This script intentionally does NOT build any CosmWasm contract.
# It stores/instantiates a prebuilt wasm artifact, registers it as an x/zkp
# trusted contract, and exercises the trusted-contract authority path on a
# 4-validator local Fairyring network.
#
# Default prebuilt artifact:
#   /home/grider644/go/src/github.com/FairBlock/fairyring-contract/examples/elgamal_evm/artifacts/elgamal_evm.wasm
#
# Optional: set RUN_ZKP_QUERY_TESTER=1 and ZKP_QUERY_TESTER_WASM=/path/to/prebuilt.wasm
# to also run the wasm-binding malformed-proof query checks through a prebuilt
# tester contract. No build step is performed for that contract either.
# -----------------------------------------------------------------------------

# ---- Local network config ----------------------------------------------------
BASE_HOME="${BASE_HOME:-$HOME/.fairyring-zkp-e2e-4vals}"
CHAIN_ID="${CHAIN_ID:-fairy-zkp-e2e-1}"
KEYRING_BACKEND="${KEYRING_BACKEND:-test}"
DENOM="${DENOM:-ufairy}"
STAKE_AMOUNT="${STAKE_AMOUNT:-1000000000000${DENOM}}"
GENTX_AMOUNT="${GENTX_AMOUNT:-500000000000${DENOM}}"
GAS_PRICE="${GAS_PRICE:-0${DENOM}}"
CLEAN="${CLEAN:-1}"
STARTUP_TIMEOUT="${STARTUP_TIMEOUT:-90}"
BLOCK_TIMEOUT="${BLOCK_TIMEOUT:-240}"
TARGET_START_HEIGHT="${TARGET_START_HEIGHT:-5}"

NODE_COUNT=4
MONIKERS=(node1 node2 node3 node4)
KEY_NAMES=(validator validator2 validator3 validator4)
HOME_DIRS=(
  "$BASE_HOME/node1"
  "$BASE_HOME/node2"
  "$BASE_HOME/node3"
  "$BASE_HOME/node4"
)
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

NODE1_HOME="${HOME_DIRS[0]}"
NODE1_RPC_TCP="${RPC_LADDRS[0]}"
NODE1_RPC_HTTP="http://${NODE1_RPC_TCP#tcp://}"

# ---- Prebuilt confidential-transfer CW deployment ---------------------------
RUN_EXISTING_CW_DEPLOY="${RUN_EXISTING_CW_DEPLOY:-1}"
PREBUILT_CW_WASM="${PREBUILT_CW_WASM:-/home/grider644/go/src/github.com/FairBlock/fairyring-contract/examples/elgamal_evm/artifacts/elgamal_evm.wasm}"
CW_DEPLOY_OUT="${CW_DEPLOY_OUT:-$BASE_HOME/existing_cw_deploy_output.json}"
EXISTING_CW_LABEL="${EXISTING_CW_LABEL:-elgamal-prebuilt-zkp-e2e}"
WASM_STORE_GAS="${WASM_STORE_GAS:-15000000}"
WASM_INSTANTIATE_GAS="${WASM_INSTANTIATE_GAS:-1500000}"
TX_GAS="${TX_GAS:-500000}"

# ---- Optional prebuilt tester contract --------------------------------------
# Disabled by default because this script must not build contracts. Enable only
# if a prebuilt tester wasm exists with the same query API used below.
RUN_ZKP_QUERY_TESTER="${RUN_ZKP_QUERY_TESTER:-0}"
ZKP_QUERY_TESTER_WASM="${ZKP_QUERY_TESTER_WASM:-}"
TESTER_LABEL="${TESTER_LABEL:-zkp-query-tester-e2e}"

# ---- Deterministic local mnemonics ------------------------------------------
VALIDATOR_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"
VALIDATOR_MNEMONIC_2="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
VALIDATOR_MNEMONIC_3="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
VALIDATOR_MNEMONIC_4="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"
WALLET_MNEMONIC_1="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"

VAL_ADDRS=("" "" "" "")
WALLET1_ADDR=""
NODE_PIDS=("" "" "" "")
EXISTING_CW_CONTRACT_ADDR=""
TESTER_CONTRACT_ADDR=""

# ---- Utilities ---------------------------------------------------------------
need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR: '$1' is required." >&2
    exit 1
  }
}

log() { printf '\n>> %s\n' "$*"; }
pass() { printf '   ✅ %s\n' "$*"; }
fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }

require_tools() {
  need fairyringd
  need jq
  need curl
  need python3
}

kill_existing() {
  local pids
  pids="$(pgrep -x fairyringd || true)"
  if [[ -n "$pids" ]]; then
    log "Found running fairyringd instance(s): ${pids}; stopping them"
    kill ${pids} || true
    for _ in $(seq 1 20); do
      sleep 0.5
      pgrep -x fairyringd >/dev/null 2>&1 || break
    done
    pgrep -x fairyringd >/dev/null 2>&1 && pkill -9 -x fairyringd || true
  fi
}

prep_home() {
  if [[ "$CLEAN" == "1" ]]; then
    log "Removing $BASE_HOME"
    rm -rf "$BASE_HOME"
  fi
  mkdir -p "$BASE_HOME"
  for h in "${HOME_DIRS[@]}"; do
    mkdir -p "$h"
  done
}

mnemonic_for_node() {
  case "$1" in
    1) echo "$VALIDATOR_MNEMONIC_1" ;;
    2) echo "$VALIDATOR_MNEMONIC_2" ;;
    3) echo "$VALIDATOR_MNEMONIC_3" ;;
    4) echo "$VALIDATOR_MNEMONIC_4" ;;
    *) fail "unknown validator index $1" ;;
  esac
}

init_nodes_and_keys() {
  log "Initializing ${NODE_COUNT} validators"
  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local moniker="${MONIKERS[$idx]}"
    local keyname="${KEY_NAMES[$idx]}"
    local mnemonic
    mnemonic="$(mnemonic_for_node "$i")"

    fairyringd init "$moniker" \
      --chain-id "$CHAIN_ID" \
      --home "$home" \
      -o \
      --default-denom "$DENOM" >/dev/null

    printf "%s\n" "$mnemonic" | \
      fairyringd keys add "$keyname" \
        --recover \
        --keyring-backend "$KEYRING_BACKEND" \
        --home "$home" \
        --output json > "$home/key.$keyname.json"

    VAL_ADDRS[$idx]="$(fairyringd keys show "$keyname" -a --keyring-backend "$KEYRING_BACKEND" --home "$home")"
    pass "${moniker}: ${VAL_ADDRS[$idx]}"
  done

  printf "%s\n" "$WALLET_MNEMONIC_1" | \
    fairyringd keys add wallet1 \
      --recover \
      --keyring-backend "$KEYRING_BACKEND" \
      --home "$NODE1_HOME" \
      --output json > "$NODE1_HOME/key.wallet1.json"
  WALLET1_ADDR="$(fairyringd keys show wallet1 -a --keyring-backend "$KEYRING_BACKEND" --home "$NODE1_HOME")"
  pass "wallet1/zkp-authority: $WALLET1_ADDR"
}

jq_set_vote_extensions_disabled='
  if .consensus_params? != null then
    .consensus_params.abci |= (.consensus_params.abci // {}) |
    .consensus_params.abci.vote_extensions_enable_height = "0"
  elif .consensus?.params? != null then
    .consensus.params.abci |= (.consensus.params.abci // {}) |
    .consensus.params.abci.vote_extensions_enable_height = "0"
  else . end
'

build_shared_genesis() {
  local genesis="$NODE1_HOME/config/genesis.json"
  log "Building shared genesis"

  for addr in "${VAL_ADDRS[@]}"; do
    fairyringd genesis add-genesis-account "$addr" "$STAKE_AMOUNT" \
      --home "$NODE1_HOME" --keyring-backend "$KEYRING_BACKEND" >/dev/null
  done
  fairyringd genesis add-genesis-account "$WALLET1_ADDR" "$STAKE_AMOUNT" \
    --home "$NODE1_HOME" --keyring-backend "$KEYRING_BACKEND" >/dev/null

  # Local genesis balances are needed so gentx can be created on node2..node4.
  for i in $(seq 2 "$NODE_COUNT"); do
    local idx=$((i-1))
    fairyringd genesis add-genesis-account "${VAL_ADDRS[$idx]}" "$STAKE_AMOUNT" \
      --home "${HOME_DIRS[$idx]}" --keyring-backend "$KEYRING_BACKEND" >/dev/null
  done

  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    fairyringd genesis gentx "${KEY_NAMES[$idx]}" "$GENTX_AMOUNT" \
      --chain-id "$CHAIN_ID" \
      --home "${HOME_DIRS[$idx]}" \
      --keyring-backend "$KEYRING_BACKEND" >/dev/null
  done

  mkdir -p "$NODE1_HOME/config/gentx"
  for i in $(seq 2 "$NODE_COUNT"); do
    local idx=$((i-1))
    cp -f "${HOME_DIRS[$idx]}/config/gentx/"*.json "$NODE1_HOME/config/gentx/"
  done
  fairyringd genesis collect-gentxs --home "$NODE1_HOME" >/dev/null

  # x/zkp trusted-contract updates are authority-gated. For e2e we make wallet1
  # the genesis authority so deploy/test scripts can register contracts directly.
  local tmp jq_filter authority
  tmp="$(mktemp)"
  jq_filter="$jq_set_vote_extensions_disabled
    | .app_state.zkp.params.authority = \$authority
    | .app_state.zkp.trusted_contracts = (.app_state.zkp.trusted_contracts // [])
    | if .app_state.wasm?.params?.code_upload_access? then
        .app_state.wasm.params.code_upload_access.permission = \"Everybody\"
      else . end
  "
  jq --arg authority "$WALLET1_ADDR" "$jq_filter" "$genesis" > "$tmp" && mv "$tmp" "$genesis"

  # Keep old Fairyring devnet defaults generous when these fields exist.
  sed -i -e 's/"key_expiry": "100"/"key_expiry": "1000000"/g' "$genesis" || true
  sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' "$genesis" || true

  for i in $(seq 2 "$NODE_COUNT"); do
    local idx=$((i-1))
    cp -f "$genesis" "${HOME_DIRS[$idx]}/config/genesis.json"
  done

  authority="$(jq -r '.app_state.zkp.params.authority' "$genesis")"
  [[ "$authority" == "$WALLET1_ADDR" ]] || fail "genesis zkp authority mismatch: $authority"
  pass "genesis x/zkp authority set to wallet1"
}

configure_nodes() {
  log "Configuring node ports, peers, and fast local timeouts"
  local node_ids=("" "" "" "")
  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    node_ids[$idx]="$(fairyringd tendermint show-node-id --home "${HOME_DIRS[$idx]}")"
  done

  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    local cfg="$home/config/config.toml"
    local app="$home/config/app.toml"
    local rpc_laddr="${RPC_LADDRS[$idx]}"
    local p2p_laddr="${P2P_LADDRS[$idx]}"
    local grpc_port="${GRPC_PORTS[$idx]}"
    local api_port="${API_PORTS[$idx]}"
    local pprof_port=$((6060 + idx))

    sed -i.bak -E 's|^pprof_laddr = ".*"|pprof_laddr = "localhost:'"$pprof_port"'"|g' "$cfg" || true
    sed -i.bak -E 's/^addr_book_strict *= .*/addr_book_strict = false/' "$cfg" || true
    sed -i.bak -E 's/^allow_duplicate_ip *= .*/allow_duplicate_ip = true/' "$cfg" || true
    sed -i.bak -E "s|^laddr = \".*26657\"|laddr = \"${rpc_laddr}\"|g" "$cfg"

    awk -v val="$p2p_laddr" '
      BEGIN{in_p2p=0}
      /^\[p2p\]/{in_p2p=1}
      /^\[.*\]/{if ($0 !~ /^\[p2p\]/) in_p2p=0}
      { if(in_p2p && $0 ~ /^laddr = /){ sub(/=.*/, "= \"" val "\"") } print }
    ' "$cfg" > "$cfg.tmp" && mv "$cfg.tmp" "$cfg"

    local peers=""
    for j in $(seq 1 "$NODE_COUNT"); do
      [[ "$j" == "$i" ]] && continue
      local jdx=$((j-1))
      peers+="${node_ids[$jdx]}@127.0.0.1:${P2P_PORTS[$jdx]},"
    done
    peers="${peers%,}"
    sed -i.bak -E "s|^persistent_peers = \".*\"|persistent_peers = \"${peers}\"|g" "$cfg"

    sed -i \
      -e 's/^timeout_propose = .*/timeout_propose = "1s"/' \
      -e 's/^timeout_propose_delta = .*/timeout_propose_delta = "500ms"/' \
      -e 's/^timeout_prevote = .*/timeout_prevote = "1s"/' \
      -e 's/^timeout_prevote_delta = .*/timeout_prevote_delta = "500ms"/' \
      -e 's/^timeout_precommit = .*/timeout_precommit = "1s"/' \
      -e 's/^timeout_precommit_delta = .*/timeout_precommit_delta = "500ms"/' \
      -e 's/^timeout_commit = .*/timeout_commit = "1s"/' \
      "$cfg"

    sed -i.bak -E "s|^minimum-gas-prices = \".*\"|minimum-gas-prices = \"${GAS_PRICE}\"|g" "$app" || true
    sed -i.bak -E "s|^address = \".*:9090\"|address = \"0.0.0.0:${grpc_port}\"|g" "$app" || true
    sed -i.bak -E "s|^address = \"tcp://.*:1317\"|address = \"tcp://0.0.0.0:${api_port}\"|g" "$app" || true
  done
}

start_nodes() {
  log "Starting ${NODE_COUNT} validators"
  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    local home="${HOME_DIRS[$idx]}"
    mkdir -p "$home/logs"
    ( nohup fairyringd start --home "$home" --log_level "info" > "$home/logs/node.log" 2>&1 & echo $! > "$home/logs/node.pid" ) || true
    NODE_PIDS[$idx]="$(cat "$home/logs/node.pid")"
    pass "${MONIKERS[$idx]} PID ${NODE_PIDS[$idx]} logs=$home/logs/node.log"
  done
  trap 'shutdown_nodes' EXIT
}

shutdown_nodes() {
  log "Shutting down nodes"
  for pid in "${NODE_PIDS[@]}"; do
    [[ -z "${pid:-}" ]] && continue
    if ps -p "$pid" >/dev/null 2>&1; then
      kill "$pid" || true
    fi
  done
}

wait_for_all_status() {
  log "Waiting for all RPC endpoints"
  local end=$(( $(date +%s) + STARTUP_TIMEOUT ))
  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    local url="http://${RPC_LADDRS[$idx]#tcp://}/status"
    until curl -fsS "$url" >/dev/null 2>&1; do
      if (( $(date +%s) > end )); then
        fail "RPC for ${MONIKERS[$idx]} did not come up. See ${HOME_DIRS[$idx]}/logs/node.log"
      fi
      sleep 1
    done
    pass "${MONIKERS[$idx]} RPC up"
  done
}

current_height() {
  curl -fsS "$NODE1_RPC_HTTP/status" | jq -r '.result.sync_info.latest_block_height | tonumber'
}

wait_until_height() {
  local target="$1"
  local timeout="$2"
  log "Waiting until height >= $target"
  local end=$(( $(date +%s) + timeout ))
  while true; do
    local h
    h="$(current_height || echo 0)"
    if (( h >= target )); then
      pass "height $h reached"
      return 0
    fi
    if (( $(date +%s) > end )); then
      fail "timed out waiting for height $target; last height=$h"
    fi
    sleep 1
  done
}

# ---- TX/query helpers --------------------------------------------------------
base_tx_flags() {
  printf '%s' "--home $NODE1_HOME --keyring-backend $KEYRING_BACKEND --chain-id $CHAIN_ID --node $NODE1_RPC_TCP"
}

base_query_flags() {
  printf '%s' "--chain-id $CHAIN_ID --node $NODE1_RPC_TCP -o json"
}

check_tx_code() {
  local txjson="$1"
  local code
  code="$(echo "$txjson" | jq -r '.code // 0')"
  if [[ "$code" != "0" ]]; then
    echo "$txjson" | jq . >&2 || echo "$txjson" >&2
    fail "broadcast failed with code=$code"
  fi
}

wait_for_tx_result() {
  local txhash="$1"
  local end=$(( $(date +%s) + 60 ))
  local out=""
  while true; do
    set +e
    out="$(fairyringd q tx --type=hash "$txhash" --home "$NODE1_HOME" --chain-id "$CHAIN_ID" --node "$NODE1_RPC_TCP" -o json 2>&1)"
    local rc=$?
    set -e
    if [[ "$rc" == "0" ]]; then
      echo "$out"
      return 0
    fi
    if (( $(date +%s) > end )); then
      echo "$out" >&2
      fail "timed out waiting for tx $txhash"
    fi
    sleep 1
  done
}

wait_for_tx() {
  local txhash="$1"
  local out code
  out="$(wait_for_tx_result "$txhash")"
  code="$(echo "$out" | jq -r '.code // 0')"
  if [[ "$code" != "0" ]]; then
    echo "$out" | jq . >&2 || echo "$out" >&2
    fail "on-chain tx failed code=$code"
  fi
  echo "$out"
}

broadcast_tx() {
  local cmd="$1"
  local res txhash
  res="$(eval "$cmd --broadcast-mode sync -o json -y")"
  check_tx_code "$res"
  txhash="$(echo "$res" | jq -r '.txhash')"
  wait_for_tx "$txhash" >/dev/null
  echo "$txhash"
}

expect_tx_fail_contains() {
  local cmd="$1"
  local needle="$2"
  local out rc code raw txhash qtx qcode qraw
  set +e
  out="$(eval "$cmd --broadcast-mode sync -o json -y" 2>&1)"
  rc=$?
  set -e

  if [[ "$rc" == "0" ]] && echo "$out" | jq . >/dev/null 2>&1; then
    code="$(echo "$out" | jq -r '.code // 0')"
    raw="$(echo "$out" | jq -r '.raw_log // .logs // empty')"
    if [[ "$code" != "0" ]] && grep -qi "$needle" <<<"$raw"; then
      pass "expected tx failure observed at CheckTx: $needle"
      return 0
    fi

    txhash="$(echo "$out" | jq -r '.txhash // empty')"
    if [[ -n "$txhash" ]]; then
      qtx="$(wait_for_tx_result "$txhash")"
      qcode="$(echo "$qtx" | jq -r '.code // 0')"
      qraw="$(echo "$qtx" | jq -r '.raw_log // .logs // empty')"
      if [[ "$qcode" != "0" ]] && grep -qi "$needle" <<<"$qraw"; then
        pass "expected tx failure observed at DeliverTx: $needle"
        return 0
      fi
      if [[ "$qcode" == "0" ]]; then
        echo "$qtx" | jq . >&2 || echo "$qtx" >&2
        fail "expected tx to fail with '$needle', but it succeeded on-chain"
      fi
    fi
  fi

  if grep -qi "$needle" <<<"$out"; then
    pass "expected tx failure observed: $needle"
    return 0
  fi

  echo "$out" >&2
  fail "expected tx to fail with '$needle'"
}

extract_event_value() {
  local txjson="$1"
  local event_regex="$2"
  local key_regex="$3"
  echo "$txjson" | jq -r --arg et "$event_regex" --arg kt "$key_regex" '
    .events[]? | select(.type | test($et)) | .attributes[]? | select(.key | test($kt)) | .value
  ' | tail -n1
}

query_trusted_contracts_json() {
  fairyringd q zkp trusted-contracts $(base_query_flags)
}

is_trusted_contract() {
  local addr="$1"
  query_trusted_contracts_json | jq -e --arg addr "$addr" '(.ContractAddresses // .contract_addresses // []) | index($addr)' >/dev/null
}

assert_trusted_contains() {
  local addr="$1"
  is_trusted_contract "$addr" || {
    query_trusted_contracts_json | jq . >&2 || true
    fail "trusted contract list does not contain $addr"
  }
  pass "trusted contract present: $addr"
}

assert_trusted_not_contains() {
  local addr="$1"
  if query_trusted_contracts_json | jq -e --arg addr "$addr" '(.ContractAddresses // .contract_addresses // []) | index($addr)' >/dev/null; then
    query_trusted_contracts_json | jq . >&2 || true
    fail "trusted contract list unexpectedly contains $addr"
  fi
  pass "trusted contract absent: $addr"
}

assert_zkp_authority() {
  local got
  got="$(fairyringd q zkp params $(base_query_flags) | jq -r '.params.authority')"
  [[ "$got" == "$WALLET1_ADDR" ]] || fail "x/zkp authority mismatch. expected=$WALLET1_ADDR got=$got"
  pass "x/zkp params authority is wallet1"
}

# ---- Prebuilt contract deployment -------------------------------------------
deploy_prebuilt_confidential_transfer_contract() {
  if [[ "$RUN_EXISTING_CW_DEPLOY" != "1" ]]; then
    log "Skipping prebuilt CW deploy because RUN_EXISTING_CW_DEPLOY=$RUN_EXISTING_CW_DEPLOY"
    return 0
  fi

  [[ -f "$PREBUILT_CW_WASM" ]] || fail "PREBUILT_CW_WASM not found: $PREBUILT_CW_WASM"

  log "Storing prebuilt confidential-transfer CosmWasm contract"
  local res qtx code_id txhash init_msg
  res="$(fairyringd tx wasm store "$PREBUILT_CW_WASM" \
    --from wallet1 \
    $(base_tx_flags) \
    --gas "$WASM_STORE_GAS" \
    --broadcast-mode sync \
    -o json -y)"
  check_tx_code "$res"
  txhash="$(echo "$res" | jq -r '.txhash')"
  qtx="$(wait_for_tx "$txhash")"
  code_id="$(extract_event_value "$qtx" 'store[_-]?code' '^code_id$')"
  [[ -n "$code_id" && "$code_id" != "null" ]] || fail "failed to extract code_id from store_code event"
  pass "prebuilt CW code_id=$code_id"

  init_msg="$(jq -cn --arg addr "$WALLET1_ADDR" '{allowed_addresses:[$addr]}')"

  log "Instantiating prebuilt confidential-transfer CosmWasm contract"
  res="$(fairyringd tx wasm instantiate "$code_id" "$init_msg" \
    --no-admin \
    --from wallet1 \
    $(base_tx_flags) \
    --gas "$WASM_INSTANTIATE_GAS" \
    --label "$EXISTING_CW_LABEL" \
    --broadcast-mode sync \
    -o json -y)"
  check_tx_code "$res"
  txhash="$(echo "$res" | jq -r '.txhash')"
  qtx="$(wait_for_tx "$txhash")"
  EXISTING_CW_CONTRACT_ADDR="$(extract_event_value "$qtx" 'instantiate|instantiate_contract' '_contract_address|contract_address')"
  [[ -n "$EXISTING_CW_CONTRACT_ADDR" && "$EXISTING_CW_CONTRACT_ADDR" != "null" ]] || fail "failed to extract contract address"

  jq -n \
    --arg code_id "$code_id" \
    --arg contract_address "$EXISTING_CW_CONTRACT_ADDR" \
    --arg artifact "$PREBUILT_CW_WASM" \
    --arg chain_id "$CHAIN_ID" \
    --arg payer "wallet1" \
    --arg payer_address "$WALLET1_ADDR" \
    --arg contract_label "$EXISTING_CW_LABEL" \
    '{code_id:$code_id, contract_address:$contract_address, artifact:$artifact, chain_id:$chain_id, payer:$payer, payer_address:$payer_address, allowed_addresses:[$payer_address], label:$contract_label, no_admin:true}' \
    > "$CW_DEPLOY_OUT"

  fairyringd q wasm contract "$EXISTING_CW_CONTRACT_ADDR" $(base_query_flags) >/dev/null
  pass "prebuilt CW contract is queryable: $EXISTING_CW_CONTRACT_ADDR"
  pass "wrote deploy metadata: $CW_DEPLOY_OUT"
}

register_trusted_contract() {
  local addr="$1"
  local out rc code raw txhash qtx qcode qraw

  if is_trusted_contract "$addr"; then
    pass "trusted contract already present; continuing: $addr"
    return 0
  fi

  log "Registering trusted contract: $addr"
  set +e
  out="$(eval "fairyringd tx zkp add-trusted-contract '$addr' --from wallet1 $(base_tx_flags) --gas $TX_GAS --broadcast-mode sync -o json -y" 2>&1)"
  rc=$?
  set -e

  if [[ "$rc" != "0" ]]; then
    if grep -qi "already trusted" <<<"$out"; then
      pass "add-trusted-contract reported already trusted; continuing: $addr"
      assert_trusted_contains "$addr"
      return 0
    fi
    echo "$out" >&2
    fail "failed to broadcast add-trusted-contract for $addr"
  fi

  if ! echo "$out" | jq . >/dev/null 2>&1; then
    echo "$out" >&2
    fail "add-trusted-contract returned non-json output"
  fi

  code="$(echo "$out" | jq -r '.code // 0')"
  raw="$(echo "$out" | jq -r '.raw_log // .logs // empty')"
  if [[ "$code" != "0" ]]; then
    if grep -qi "already trusted" <<<"$raw"; then
      pass "add-trusted-contract reported already trusted at CheckTx; continuing: $addr"
      assert_trusted_contains "$addr"
      return 0
    fi
    echo "$out" | jq . >&2 || echo "$out" >&2
    fail "add-trusted-contract failed at CheckTx code=$code"
  fi

  txhash="$(echo "$out" | jq -r '.txhash // empty')"
  [[ -n "$txhash" ]] || fail "add-trusted-contract did not return txhash"
  qtx="$(wait_for_tx_result "$txhash")"
  qcode="$(echo "$qtx" | jq -r '.code // 0')"
  qraw="$(echo "$qtx" | jq -r '.raw_log // .logs // empty')"
  if [[ "$qcode" != "0" ]]; then
    if grep -qi "already trusted" <<<"$qraw"; then
      pass "add-trusted-contract reported already trusted at DeliverTx; continuing: $addr"
      assert_trusted_contains "$addr"
      return 0
    fi
    echo "$qtx" | jq . >&2 || echo "$qtx" >&2
    fail "add-trusted-contract failed on-chain code=$qcode"
  fi

  assert_trusted_contains "$addr"
}

remove_trusted_contract() {
  local addr="$1"
  log "Removing trusted contract: $addr"
  broadcast_tx "fairyringd tx zkp remove-trusted-contract '$addr' --from wallet1 $(base_tx_flags) --gas $TX_GAS" >/dev/null
  assert_trusted_not_contains "$addr"
}

run_existing_contract_trust_cases() {
  [[ "$RUN_EXISTING_CW_DEPLOY" == "1" ]] || return 0
  [[ -n "$EXISTING_CW_CONTRACT_ADDR" ]] || fail "existing CW contract address missing"

  log "Case 1: authority can add deployed CW contract to x/zkp trusted list"
  register_trusted_contract "$EXISTING_CW_CONTRACT_ADDR"

  log "Case 2: duplicate trusted-contract registration is harmless"
  register_trusted_contract "$EXISTING_CW_CONTRACT_ADDR"

  log "Case 3: non-authority cannot remove trusted contract"
  expect_tx_fail_contains \
    "fairyringd tx zkp remove-trusted-contract '$EXISTING_CW_CONTRACT_ADDR' --from validator2 --home '${HOME_DIRS[1]}' --keyring-backend '$KEYRING_BACKEND' --chain-id '$CHAIN_ID' --node '$NODE1_RPC_TCP' --gas '$TX_GAS'" \
    "unauthorized"
  assert_trusted_contains "$EXISTING_CW_CONTRACT_ADDR"

  log "Case 4: authority can remove trusted contract"
  remove_trusted_contract "$EXISTING_CW_CONTRACT_ADDR"

  log "Case 5: removing a missing trusted contract is rejected"
  expect_tx_fail_contains \
    "fairyringd tx zkp remove-trusted-contract '$EXISTING_CW_CONTRACT_ADDR' --from wallet1 $(base_tx_flags) --gas $TX_GAS" \
    "not in the trusted list"

  log "Case 6: authority can re-add trusted contract after removal"
  register_trusted_contract "$EXISTING_CW_CONTRACT_ADDR"
}

# ---- Optional prebuilt ZKP query tester --------------------------------------
store_and_instantiate_tester_contract() {
  local wasm="$1"
  [[ -f "$wasm" ]] || fail "ZKP_QUERY_TESTER_WASM not found: $wasm"

  log "Storing prebuilt ZKP query tester contract"
  local res qtx code_id txhash
  res="$(fairyringd tx wasm store "$wasm" \
    --from wallet1 \
    $(base_tx_flags) \
    --gas "$WASM_STORE_GAS" \
    --broadcast-mode sync \
    -o json -y)"
  check_tx_code "$res"
  txhash="$(echo "$res" | jq -r '.txhash')"
  qtx="$(wait_for_tx "$txhash")"
  code_id="$(extract_event_value "$qtx" 'store[_-]?code' '^code_id$')"
  [[ -n "$code_id" && "$code_id" != "null" ]] || fail "failed to extract tester code_id"
  pass "tester code_id=$code_id"

  log "Instantiating prebuilt ZKP query tester contract"
  res="$(fairyringd tx wasm instantiate "$code_id" '{}' \
    --no-admin \
    --from wallet1 \
    $(base_tx_flags) \
    --gas "$WASM_INSTANTIATE_GAS" \
    --label "$TESTER_LABEL" \
    --broadcast-mode sync \
    -o json -y)"
  check_tx_code "$res"
  txhash="$(echo "$res" | jq -r '.txhash')"
  qtx="$(wait_for_tx "$txhash")"
  TESTER_CONTRACT_ADDR="$(extract_event_value "$qtx" 'instantiate|instantiate_contract' '_contract_address|contract_address')"
  [[ -n "$TESTER_CONTRACT_ADDR" && "$TESTER_CONTRACT_ADDR" != "null" ]] || fail "failed to extract tester contract address"
  pass "tester contract=$TESTER_CONTRACT_ADDR"

  fairyringd q wasm contract-state smart "$TESTER_CONTRACT_ADDR" '{"ping":{}}' $(base_query_flags) >/dev/null
  pass "tester ping query works"
}

wasm_smart_query() {
  local contract="$1"
  local msg="$2"
  fairyringd q wasm contract-state smart "$contract" "$msg" $(base_query_flags)
}

expect_wasm_query_fail_contains() {
  local contract="$1"
  local msg="$2"
  local needle="$3"
  local out rc
  set +e
  out="$(wasm_smart_query "$contract" "$msg" 2>&1)"
  rc=$?
  set -e
  if [[ "$rc" == "0" ]]; then
    echo "$out" >&2
    fail "expected wasm smart query to fail with '$needle', but it succeeded"
  fi
  if ! grep -qi "$needle" <<<"$out"; then
    echo "$out" >&2
    fail "expected wasm smart query failure to contain '$needle'"
  fi
  pass "expected wasm query failure observed: $needle"
}

extract_query_valid() {
  jq -r 'if (.data? | type) == "object" then .data.valid else .valid end'
}

extract_query_error() {
  jq -r 'if (.data? | type) == "object" then (.data.error // "") else (.error // "") end'
}

expect_wasm_query_valid_false_contains() {
  local contract="$1"
  local msg="$2"
  local needle="$3"
  local out valid err
  out="$(wasm_smart_query "$contract" "$msg")"
  valid="$(echo "$out" | extract_query_valid)"
  err="$(echo "$out" | extract_query_error)"
  [[ "$valid" == "false" ]] || {
    echo "$out" | jq . >&2 || echo "$out" >&2
    fail "expected valid=false, got valid=$valid"
  }
  if ! grep -qi "$needle" <<<"$err"; then
    echo "$out" | jq . >&2 || echo "$out" >&2
    fail "expected query error to contain '$needle', got '$err'"
  fi
  pass "trusted ZKP query returned valid=false: $needle"
}

short_b64() {
  python3 - <<'PY'
import base64
print(base64.b64encode(b"\x01\x02\x03").decode())
PY
}

oversized_b64() {
  python3 - <<'PY'
import base64
print(base64.b64encode(bytes([7]) * 16384).decode())
PY
}

zero32_b64() {
  python3 - <<'PY'
import base64
print(base64.b64encode(bytes(32)).decode())
PY
}

make_withdraw_query_short() {
  local short="$1"
  local zero32="$2"
  jq -cn \
    --arg short "$short" \
    --arg zero32 "$zero32" \
    '{verify_withdraw_proofs:{equality_proof_data:$short,range_proof_data:$short,user_pubkey:$zero32,ciphertext_commitment:$zero32,ciphertext_handle:$zero32,expected_nonce:0}}'
}

make_withdraw_query_bad_base64() {
  local short="$1"
  local zero32="$2"
  jq -cn \
    --arg short "$short" \
    --arg zero32 "$zero32" \
    '{verify_withdraw_proofs:{equality_proof_data:"%%%not-base64%%%",range_proof_data:$short,user_pubkey:$zero32,ciphertext_commitment:$zero32,ciphertext_handle:$zero32,expected_nonce:0}}'
}

make_transfer_query_payload() {
  local payload="$1"
  local zero32="$2"
  jq -cn \
    --arg payload "$payload" \
    --arg zero32 "$zero32" \
    '{verify_transfer_proofs:{equality_proof_data:$payload,range_proof_data:$payload,validity_proof_data:$payload,sender_pubkey:$zero32,recipient_pubkey:$zero32,current_balance_commitment:$zero32,current_balance_handle:$zero32}}'
}

run_prebuilt_zkp_query_tester_cases() {
  if [[ "$RUN_ZKP_QUERY_TESTER" != "1" ]]; then
    log "Skipping prebuilt ZKP query tester because RUN_ZKP_QUERY_TESTER=$RUN_ZKP_QUERY_TESTER"
    return 0
  fi
  [[ -n "$ZKP_QUERY_TESTER_WASM" ]] || fail "RUN_ZKP_QUERY_TESTER=1 requires ZKP_QUERY_TESTER_WASM=/path/to/prebuilt_tester.wasm"

  local short oversized zero32 withdraw_short withdraw_bad64 transfer_short transfer_oversized withdraw_oversized_bad64
  store_and_instantiate_tester_contract "$ZKP_QUERY_TESTER_WASM"

  short="$(short_b64)"
  oversized="$(oversized_b64)"
  zero32="$(zero32_b64)"
  withdraw_short="$(make_withdraw_query_short "$short" "$zero32")"
  withdraw_bad64="$(make_withdraw_query_bad_base64 "$short" "$zero32")"
  transfer_short="$(make_transfer_query_payload "$short" "$zero32")"
  transfer_oversized="$(make_transfer_query_payload "$oversized" "$zero32")"
  withdraw_oversized_bad64="$(make_withdraw_query_bad_base64 "${oversized}%%%bad%%%" "$zero32")"

  assert_trusted_not_contains "$TESTER_CONTRACT_ADDR"

  log "Tester Case 1: untrusted contract cannot call custom ZKP query path"
  expect_wasm_query_fail_contains "$TESTER_CONTRACT_ADDR" "$withdraw_short" "not authorized"

  log "Tester Case 2: authority can trust contract"
  register_trusted_contract "$TESTER_CONTRACT_ADDR"

  log "Tester Case 3: trusted withdraw query reaches keeper and rejects malformed proof cleanly"
  expect_wasm_query_valid_false_contains "$TESTER_CONTRACT_ADDR" "$withdraw_short" "invalid equality proof data length"

  log "Tester Case 4: trusted transfer query reaches keeper and rejects malformed proof cleanly"
  expect_wasm_query_valid_false_contains "$TESTER_CONTRACT_ADDR" "$transfer_short" "invalid equality proof data length"

  log "Tester Case 5: malformed base64 is rejected in wasm binding before keeper verification"
  expect_wasm_query_fail_contains "$TESTER_CONTRACT_ADDR" "$withdraw_bad64" "base64"

  log "Tester Case 6: oversized valid base64 reaches keeper and fails proof-length checks"
  expect_wasm_query_valid_false_contains "$TESTER_CONTRACT_ADDR" "$transfer_oversized" "invalid equality proof data length"

  log "Tester Case 7: oversized malformed base64 is rejected in wasm binding before keeper verification"
  expect_wasm_query_fail_contains "$TESTER_CONTRACT_ADDR" "$withdraw_oversized_bad64" "base64"

  log "Tester Case 8: removing trust blocks the custom ZKP query path again"
  remove_trusted_contract "$TESTER_CONTRACT_ADDR"
  expect_wasm_query_fail_contains "$TESTER_CONTRACT_ADDR" "$withdraw_short" "not authorized"
}

print_log_hints_on_failure() {
  local rc="$1"
  [[ "$rc" == "0" ]] && return 0
  echo "" >&2
  echo "==== node log tails ====" >&2
  for i in $(seq 1 "$NODE_COUNT"); do
    local idx=$((i-1))
    local log_path="${HOME_DIRS[$idx]}/logs/node.log"
    echo "---- ${MONIKERS[$idx]}: $log_path ----" >&2
    [[ -f "$log_path" ]] && tail -n 80 "$log_path" >&2 || true
  done
}

main() {
  require_tools
  kill_existing
  prep_home
  init_nodes_and_keys
  build_shared_genesis
  configure_nodes
  start_nodes
  wait_for_all_status
  wait_until_height "$TARGET_START_HEIGHT" "$BLOCK_TIMEOUT"

  assert_zkp_authority
  deploy_prebuilt_confidential_transfer_contract
  run_existing_contract_trust_cases
  run_prebuilt_zkp_query_tester_cases

  log "✅ ZKP multi-validator CosmWasm e2e completed successfully"
  echo "BASE_HOME=$BASE_HOME"
  echo "PREBUILT_CW_WASM=$PREBUILT_CW_WASM"
  [[ -n "$EXISTING_CW_CONTRACT_ADDR" ]] && echo "EXISTING_CW_CONTRACT_ADDR=$EXISTING_CW_CONTRACT_ADDR"
  [[ -n "$TESTER_CONTRACT_ADDR" ]] && echo "TESTER_CONTRACT_ADDR=$TESTER_CONTRACT_ADDR"
}

set +e
main "$@"
rc=$?
set -e
print_log_hints_on_failure "$rc"
exit "$rc"
