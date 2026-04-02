#!/bin/bash
# prod-config.sh
#
# Configures fairyring, fairyringclient, ShareGenerationClient, and fairyport
# for production use WITHOUT resetting existing chain data or starting any process.
# Generates systemd .service files at the end.

set -e

# ───────────────────────── CONFIG ─────────────────────────
if [ -f "$HOME/go/bin/fairyringd" ]; then
    BINARY="$HOME/go/bin/fairyringd"
else
    BINARY=fairyringd
fi

CHAIN_DIR=$(pwd)/devnet_data
CHAINID=fairyring_devnet

FAIRYRINGCLIENT=fairyringclient
SHAREGENERATIONCLIENT=ShareGenerationClient
FAIRYPORT=fairyport

VE_ENABLE_HEIGHT="${VE_ENABLE_HEIGHT:-30}"
KEYSHARER_INVALID_SHARE_PAUSE_THRESHOLD="${KEYSHARER_INVALID_SHARE_PAUSE_THRESHOLD:-3}"
APP_PRIV_HEX="${APP_PRIV_HEX:-}"

DEPS_DIR="$(pwd)/.devnet_deps"

P2PPORT=26656
RPCPORT=26657
RESTPORT=1317
ROSETTA=8080
GRPCPORT=9090


VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"

WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_2="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
WALLET_MNEMONIC_3="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"
WALLET_MNEMONIC_4="open attitude harsh casino rent attitude midnight debris describe spare cancel crisp olive ride elite gallery leaf buffalo sheriff filter rotate path begin soldier"
WALLET_MNEMONIC_5="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"
WALLET_MNEMONIC_6="polar account muffin credit dice holiday honey diesel faculty maze senior curve clap hard similar club evolve wolf stable hedgehog secret used rebuild help"

RLY_MNEMONIC_1="alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"


# ───────────────────── Helper functions ─────────────────────
backup_if_exists() {
  local f="$1"
  if [ -f "$f" ]; then
    cp "$f" "$f.backup.$(date +%s)"
  fi
}

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    MISSING=1
  fi
}

# Ensure GOPATH/bin is in PATH
if command -v go >/dev/null 2>&1; then
  export PATH="$PATH:$(go env GOPATH)/bin"
fi

# ─────────────── Pre-flight checks ──────────────────────────
MISSING=0
need_cmd git
need_cmd go
need_cmd jq
need_cmd make
if [ "$MISSING" -eq 1 ]; then
  echo "Please install the missing prerequisites above and re-run."
  exit 1
fi

mkdir -p "$DEPS_DIR"

# ─────────────── Ensure client binaries exist ───────────────
ensure_sharegenerationclient() {
  if ! command -v "$SHAREGENERATIONCLIENT" >/dev/null 2>&1; then
    echo "Installing $SHAREGENERATIONCLIENT..."
    local repo="$DEPS_DIR/ShareGenerationClient"
    if [ ! -d "$repo" ]; then
      git clone https://github.com/Fairblock/ShareGenerationClient "$repo"
    fi
    ( cd "$repo"
      git fetch --tags
      git checkout "0.2.0"
      go mod tidy
      go install
    )
  else
    echo "$SHAREGENERATIONCLIENT found."
  fi
}

ensure_fairyringclient() {
  if ! command -v "$FAIRYRINGCLIENT" >/dev/null 2>&1; then
    echo "Installing $FAIRYRINGCLIENT..."
    local repo="$DEPS_DIR/fairyringclient"
    if [ ! -d "$repo" ]; then
      git clone https://github.com/Fairblock/fairyringclient "$repo"
    fi
    ( cd "$repo"
      git fetch --tags
      git checkout "v0.7.0"
      go mod tidy
      go install
    )
  else
    echo "$FAIRYRINGCLIENT found."
  fi
}

ensure_fairyport() {
  if ! command -v "$FAIRYPORT" >/dev/null 2>&1; then
    echo "Installing $FAIRYPORT..."
    local repo="$DEPS_DIR/fairyport"
    if [ ! -d "$repo" ]; then
      git clone https://github.com/Fairblock/fairyport "$repo"
    fi
    ( cd "$repo"
      make install
    )
  else
    echo "$FAIRYPORT found."
  fi
}

ensure_sharegenerationclient
ensure_fairyringclient
ensure_fairyport

# ─────────────── 1. Initialize fairyring (skip if exists) ───
if [ -d "$CHAIN_DIR/$CHAINID/config" ]; then
  echo "Chain data already exists at $CHAIN_DIR/$CHAINID — skipping genesis init."
else
  echo "Initializing $CHAINID at $CHAIN_DIR/$CHAINID ..."
  mkdir -p "$CHAIN_DIR/$CHAINID"
  $BINARY init prod --home "$CHAIN_DIR/$CHAINID" --default-denom ufair --chain-id="$CHAINID" &> /dev/null

  echo "Adding genesis accounts..."
  echo "$VAL_MNEMONIC_1"   | $BINARY keys add val1    --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$WALLET_MNEMONIC_1" | $BINARY keys add wallet1 --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$WALLET_MNEMONIC_2" | $BINARY keys add wallet2 --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$WALLET_MNEMONIC_3" | $BINARY keys add wallet3 --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$WALLET_MNEMONIC_4" | $BINARY keys add wallet4 --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$WALLET_MNEMONIC_5" | $BINARY keys add wallet5 --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$WALLET_MNEMONIC_6" | $BINARY keys add wallet6 --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test
  echo "$RLY_MNEMONIC_1"   | $BINARY keys add rly1    --home "$CHAIN_DIR/$CHAINID" --recover --keyring-backend test

  VAL1_ADDR=$($BINARY keys show val1    --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  WALLET1_ADDR=$($BINARY keys show wallet1 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  WALLET2_ADDR=$($BINARY keys show wallet2 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  WALLET3_ADDR=$($BINARY keys show wallet3 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  WALLET4_ADDR=$($BINARY keys show wallet4 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  WALLET5_ADDR=$($BINARY keys show wallet5 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  WALLET6_ADDR=$($BINARY keys show wallet6 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)
  RLY1_ADDR=$($BINARY keys show rly1    --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test)

  $BINARY genesis add-genesis-account "$VAL1_ADDR"    1000000000000ufair                        --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$WALLET1_ADDR" 10000000000000000ufair,1000000000000fusdc  --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$WALLET2_ADDR" 1000000000000ufair                        --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$WALLET3_ADDR" 1000000000000ufair \
    --vesting-amount 1000000000000ufair \
    --vesting-start-time "$(date +%s)" \
    --vesting-end-time "$(($(date '+%s') + 100000023))" \
    --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$WALLET4_ADDR" 1000000000000ufair \
    --vesting-amount 1000000000000ufair \
    --vesting-start-time "$(date +%s)" \
    --vesting-end-time "$(($(date '+%s') + 100000023))" \
    --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$WALLET5_ADDR" 1000000000000ufair    --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$WALLET6_ADDR" 100000000000000ufair  --home "$CHAIN_DIR/$CHAINID" --keyring-backend test
  $BINARY genesis add-genesis-account "$RLY1_ADDR"    1000000000000ufair    --home "$CHAIN_DIR/$CHAINID" --keyring-backend test

  echo "Creating and collecting gentx..."
  $BINARY genesis gentx val1 100000000000ufair \
    --home "$CHAIN_DIR/$CHAINID" --chain-id "$CHAINID" --keyring-backend test
  $BINARY genesis collect-gentxs --home "$CHAIN_DIR/$CHAINID" &> /dev/null
fi

# Resolve addresses (needed for genesis patches and keysharer.yaml)
VAL1_ADDR=$($BINARY keys show val1    --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test 2>/dev/null || echo "")
RLY1_ADDR=$($BINARY keys show rly1    --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test 2>/dev/null || echo "")
WALLET5_ADDR=$($BINARY keys show wallet5 --home "$CHAIN_DIR/$CHAINID" -a --keyring-backend test 2>/dev/null || echo "")

# ─────────────── 2. config.toml ─────────────────────────────
echo "Updating config.toml..."
CFG="$CHAIN_DIR/$CHAINID/config/config.toml"

sed -i -e 's/cors_allowed_origins = \[\]/cors_allowed_origins = \["*"\]/g' "$CFG"
sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$P2PPORT"'"#g' "$CFG"
sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$RPCPORT"'"#g' "$CFG"
sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' "$CFG"
sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' "$CFG"
sed -i -e 's/index_all_keys = false/index_all_keys = true/g' "$CFG"

if ! grep -q "max_body_bytes" "$CFG"; then
    sed -i '/\[rpc\]/a max_body_bytes = 52428800' "$CFG"
else
    sed -i -e 's/^max_body_bytes = .*/max_body_bytes = 52428800/g' "$CFG"
fi

if grep -q "^max_tx_bytes" "$CFG"; then
    sed -i -e 's/^max_tx_bytes = .*/max_tx_bytes = 52428800/g' "$CFG"
fi

# ─────────────── 3. app.toml ────────────────────────────────
echo "Updating app.toml..."
APP="$CHAIN_DIR/$CHAINID/config/app.toml"

sed -i -e 's/cors = false/cors = true/g' "$APP"
sed -i -e 's/enable = false/enable = true/g' "$APP"
sed -i -e 's/swagger = false/swagger = true/g' "$APP"
sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$RESTPORT"'"#g' "$APP"
sed -i -e 's#":8080"#":'"$ROSETTA"'"#g' "$APP"
sed -i -e 's/minimum-gas-prices = ""/minimum-gas-prices = "0ufair"/g' "$APP"

if ! grep -q "^\[mempool\]" "$APP"; then
    echo "" >> "$APP"
    echo "[mempool]" >> "$APP"
fi
if ! grep -q "^max_tx_bytes" "$APP"; then
    sed -i '/^\[mempool\]/a max_tx_bytes = 52428800' "$APP"
else
    sed -i -e 's/^max_tx_bytes = .*/max_tx_bytes = 52428800/g' "$APP"
fi

if ! grep -q "\[wasm\]" "$APP"; then
cat >> "$APP" << 'WASM_EOF'
###############################################################################
###                           WASM Configuration                            ###
###############################################################################
[wasm]
# Maximum gas that can be consumed by a single smart contract query (0 = no limit).
query_gas_limit = 3000000
# Number of cached modules in wasm VM. 0 = use default.
lru_size = 0
# Capabilities the node is willing to support. Must include "stargate" to allow
# contracts to perform Stargate / gRPC queries into SDK modules.
available_capabilities = [
  "iterator",
  "staking",
  "stargate",
  "cosmwasm_1_1",
  "cosmwasm_1_2",
  "cosmwasm_1_3",
  "cosmwasm_1_4",
  "cosmwasm_2_0",
]
WASM_EOF
fi

# ─────────────── 4. genesis.json ────────────────────────────
echo "Updating genesis.json..."
GEN="$CHAIN_DIR/$CHAINID/config/genesis.json"

sed -i -e 's/"max_deposit_period": "172800s"/"max_deposit_period": "10s"/g' "$GEN"
sed -i -e 's/"voting_period": "172800s"/"voting_period": "10s"/g' "$GEN"
sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' "$GEN"

jq --arg veh "$VE_ENABLE_HEIGHT" '
  .consensus.params.abci |= (.consensus.params.abci // {}) |
  .consensus.params.abci.vote_extensions_enable_height = $veh |
  .consensus.params.block.max_tx_bytes = "52428800" |
  .consensus.params.evidence.max_tx_bytes = "52428800"
' "$GEN" > "$GEN.tmp" && mv "$GEN.tmp" "$GEN"

if [ -n "$VAL1_ADDR" ] && [ -n "$RLY1_ADDR" ] && [ -n "$WALLET5_ADDR" ]; then
  sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'","'"$RLY1_ADDR"'","'"$WALLET5_ADDR"'"\]/g' "$GEN"
fi

TRUSTED_PARTIES='{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}'
sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' "$GEN"
sed -i -e 's/"key_expiry": "100"/"key_expiry": "1000000"/g' "$GEN"
sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' "$GEN"

# ─────────────── 5. keysharer.yaml ──────────────────────────
echo "Writing keysharer.yaml..."
if [ -z "$APP_PRIV_HEX" ] && [ -n "$VAL1_ADDR" ]; then
  APP_PRIV_HEX=$(echo y | $BINARY keys export val1 \
    --home "$CHAIN_DIR/$CHAINID" --unsafe --unarmored-hex --keyring-backend test \
    2>/dev/null | tail -n 1 | tr -d '\r\n')
fi

cat > "$CHAIN_DIR/$CHAINID/config/keysharer.yaml" << EOF
enabled: true
validator_account: "$VAL1_ADDR"
app_secp256k1_priv_hex: "$APP_PRIV_HEX"
invalid_share_pause_threshold: $KEYSHARER_INVALID_SHARE_PAUSE_THRESHOLD
EOF
echo "keysharer.yaml written to $CHAIN_DIR/$CHAINID/config/keysharer.yaml"

# ─────────────── 6. Configure fairyringclient ───────────────
echo "Configuring fairyringclient..."
FRCLIENT_CFGDIR="$HOME/.fairyringclient"
FRCLIENT_CFG="$FRCLIENT_CFGDIR/config.yml"
mkdir -p "$FRCLIENT_CFGDIR"
if [ ! -f "$FRCLIENT_CFG" ] && command -v "$FAIRYRINGCLIENT" >/dev/null 2>&1; then
  $FAIRYRINGCLIENT config init
fi
if [ -f "$(pwd)/scripts/devnet/fairyringclient_config.yml" ]; then
  backup_if_exists "$FRCLIENT_CFG"
  cp -f "$(pwd)/scripts/devnet/fairyringclient_config.yml" "$FRCLIENT_CFG"
  echo "fairyringclient config written to $FRCLIENT_CFG"
fi

# ─────────────── 7. Configure ShareGenerationClient ─────────
echo "Configuring ShareGenerationClient..."
SGC_CFGDIR="$HOME/.ShareGenerationClient"
SGC_CFG="$SGC_CFGDIR/config.yml"
mkdir -p "$SGC_CFGDIR"
if [ ! -f "$SGC_CFG" ] && command -v "$SHAREGENERATIONCLIENT" >/dev/null 2>&1; then
  $SHAREGENERATIONCLIENT config init
fi
if [ -f "$(pwd)/scripts/devnet/sharegenerationclient_config.yml" ]; then
  backup_if_exists "$SGC_CFG"
  cp -f "$(pwd)/scripts/devnet/sharegenerationclient_config.yml" "$SGC_CFG"
  echo "ShareGenerationClient config written to $SGC_CFG"
fi

# ─────────────── 8. Configure fairyport ─────────────────────
echo "Configuring fairyport..."
FP_CFGDIR="$HOME/.fairyport"
FP_CFG="$FP_CFGDIR/config.yml"
mkdir -p "$FP_CFGDIR"
if [ -f "$(pwd)/scripts/devnet/config.yml" ]; then
  backup_if_exists "$FP_CFG"
  cp -f "$(pwd)/scripts/devnet/config.yml" "$FP_CFG"
  echo "fairyport config written to $FP_CFG"
fi

CHAIN_HOME_ABS="$(realpath "$CHAIN_DIR/$CHAINID")"

echo ""
echo "************************************************************"
echo "*    prod-config complete — no processes were started      *"
echo "************************************************************"
echo "  Chain home : $CHAIN_HOME_ABS"
echo "  Chain ID   : $CHAINID"
echo ""
echo "  Client configs:"
echo "    fairyringclient       -> $FRCLIENT_CFG"
echo "    ShareGenerationClient -> $SGC_CFG"
echo "    fairyport             -> $FP_CFG"
echo ""
echo "************************************************************"