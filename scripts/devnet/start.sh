#!/bin/bash
# Configuration-only script: initializes chain data on first run and updates service configs.
# Does NOT start, stop, or restart any services — those are managed via systemd.
#
# Usage:
#   make devnet-up            # build binary + run this script
#
# After running (first time):
#   sudo cp scripts/devnet/systemd/*.service /etc/systemd/system/
#   sudo systemctl daemon-reload
#   sudo systemctl enable --now fairyring
#   ./scripts/devnet/register-validator.sh   # once fairyring is up
#   sudo systemctl enable --now fairyringclient sharegenerationclient fairyport
#
# Config update (subsequent runs, preserves all chain data):
#   make devnet-up
#   sudo systemctl restart fairyringclient sharegenerationclient fairyport

# Use the newly built binary from $HOME/go/bin if available, otherwise fall back to system binary
if [ -f "$HOME/go/bin/fairyringd" ]; then
    BINARY="$HOME/go/bin/fairyringd"
else
    BINARY=fairyringd
fi

# ───────────────────────── CONFIG ─────────────────────────
CHAIN_DIR=$(pwd)/devnet_data
CHAINID=fairyring_devnet

FAIRYRINGCLIENT=fairyringclient
SHAREGENERATIONCLIENT=ShareGenerationClient
FAIRYPORT=fairyport

# Vote Extensions (required for VE-based keyshare submissions)
VE_ENABLE_HEIGHT="${VE_ENABLE_HEIGHT:-30}"  # enable vote extensions at this height
KEYSHARER_INVALID_SHARE_PAUSE_THRESHOLD="${KEYSHARER_INVALID_SHARE_PAUSE_THRESHOLD:-3}"
# Optional override; if empty we'll derive from val1 key (recommended)
APP_PRIV_HEX="${APP_PRIV_HEX:-}"

# Where to clone/build deps if a binary is missing
DEPS_DIR="$(pwd)/.devnet_deps"

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"

WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_2="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
WALLET_MNEMONIC_3="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"
WALLET_MNEMONIC_4="open attitude harsh casino rent attitude midnight debris describe spare cancel crisp olive ride elite gallery leaf buffalo sheriff filter rotate path begin soldier"
WALLET_MNEMONIC_5="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"
WALLET_MNEMONIC_6="polar account muffin credit dice holiday honey diesel faculty maze senior curve clap hard similar club evolve wolf stable hedgehog secret used rebuild help"

RLY_MNEMONIC_1="alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"

P2PPORT=26656
RPCPORT=26657
RESTPORT=1317
ROSETTA=8080
GRPCPORT=9090
GRPCWEB=9091

BLOCK_TIME=5

# ───────────────────── Helper functions ────────────────────
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

# Ensure GOPATH/bin is in PATH so go-install'ed binaries are visible
if command -v go >/dev/null 2>&1; then
  export PATH="$PATH:$(go env GOPATH)/bin"
fi

# ─────────────── Pre-flight: basic prerequisites ───────────
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

# ─────────────── Service installers & configurators ─────────
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

  # Config
  local cfgdir="$HOME/.ShareGenerationClient"
  local cfg="$cfgdir/config.yml"
  mkdir -p "$cfgdir"
  if [ ! -f "$cfg" ]; then
    echo "Initializing $SHAREGENERATIONCLIENT config..."
    $SHAREGENERATIONCLIENT config init
  fi
  if [ ! -f "$(pwd)/scripts/devnet/sharegenerationclient_config.yml" ]; then
    echo "ERROR: Missing devnet config file scripts/devnet/sharegenerationclient_config.yml"
    exit 1
  fi
  backup_if_exists "$cfg"
  cp -f "$(pwd)/scripts/devnet/sharegenerationclient_config.yml" "$cfg"
  echo "$SHAREGENERATIONCLIENT config updated at $cfg"
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

  # Config
  local cfgdir="$HOME/.fairyringclient"
  local cfg="$cfgdir/config.yml"
  mkdir -p "$cfgdir"
  if [ ! -f "$cfg" ]; then
    echo "Initializing $FAIRYRINGCLIENT config..."
    $FAIRYRINGCLIENT config init
  fi
  if [ ! -f "$(pwd)/scripts/devnet/fairyringclient_config.yml" ]; then
    echo "ERROR: Missing devnet config file scripts/devnet/fairyringclient_config.yml"
    exit 1
  fi
  backup_if_exists "$cfg"
  cp -f "$(pwd)/scripts/devnet/fairyringclient_config.yml" "$cfg"
  echo "$FAIRYRINGCLIENT config updated at $cfg"
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

  # Config
  local cfgdir="$HOME/.fairyport"
  local cfg="$cfgdir/config.yml"
  mkdir -p "$cfgdir"
  if [ ! -f "$cfg" ]; then
    echo "Initializing $FAIRYPORT config..."
    $FAIRYPORT init
  fi
  if [ ! -f "$(pwd)/scripts/devnet/config.yml" ]; then
    echo "ERROR: Missing devnet config file scripts/devnet/config.yml (for fairyport)"
    exit 1
  fi
  backup_if_exists "$cfg"
  cp -f "$(pwd)/scripts/devnet/config.yml" "$cfg"
  echo "$FAIRYPORT config updated at $cfg"
}

# ─────────────── Install & configure services ─────────────
ensure_sharegenerationclient
ensure_fairyringclient
ensure_fairyport

# ─────────────── Chain initialization (first run only) ────
# If genesis.json already exists, the chain has been initialized — skip to
# avoid overwriting data.  Re-running this script is safe and idempotent.
if [ ! -f "$CHAIN_DIR/$CHAINID/config/genesis.json" ]; then
  echo "First-time chain initialization..."

  if ! mkdir -p $CHAIN_DIR/$CHAINID 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
  fi

  echo "Initializing $CHAINID ..."
  $BINARY init devnet --home $CHAIN_DIR/$CHAINID --default-denom ufair --chain-id=$CHAINID &> /dev/null

  echo "Adding genesis accounts..."
  echo $VAL_MNEMONIC_1 | $BINARY keys add val1 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $WALLET_MNEMONIC_1 | $BINARY keys add wallet1 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $WALLET_MNEMONIC_2 | $BINARY keys add wallet2 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $WALLET_MNEMONIC_3 | $BINARY keys add wallet3 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $WALLET_MNEMONIC_4 | $BINARY keys add wallet4 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $WALLET_MNEMONIC_5 | $BINARY keys add wallet5 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $WALLET_MNEMONIC_6 | $BINARY keys add wallet6 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test
  echo $RLY_MNEMONIC_1 | $BINARY keys add rly1 --home $CHAIN_DIR/$CHAINID --recover --keyring-backend test

  _VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _WALLET2_ADDR=$($BINARY keys show wallet2 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _WALLET3_ADDR=$($BINARY keys show wallet3 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _WALLET4_ADDR=$($BINARY keys show wallet4 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _WALLET5_ADDR=$($BINARY keys show wallet5 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _WALLET6_ADDR=$($BINARY keys show wallet6 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)
  _RLY1_ADDR=$($BINARY keys show rly1 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test)

  $BINARY genesis add-genesis-account $_VAL1_ADDR 1000000000000ufair --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_WALLET1_ADDR 10000000000000000ufair,1000000000000fusdc --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_WALLET2_ADDR 1000000000000ufair --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_WALLET3_ADDR 1000000000000ufair --vesting-amount 1000000000000ufair --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_WALLET4_ADDR 1000000000000ufair --vesting-amount 1000000000000ufair --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_WALLET5_ADDR 1000000000000ufair --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_WALLET6_ADDR 100000000000000ufair --home $CHAIN_DIR/$CHAINID --keyring-backend test
  $BINARY genesis add-genesis-account $_RLY1_ADDR 1000000000000ufair --home $CHAIN_DIR/$CHAINID --keyring-backend test

  echo "Creating and collecting gentx..."
  $BINARY genesis gentx val1 100000000000ufair --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --keyring-backend test
  $BINARY genesis collect-gentxs --home $CHAIN_DIR/$CHAINID &> /dev/null

  echo "Changing defaults and ports in app.toml and config.toml files..."

  sed -i -e 's/cors_allowed_origins = \[\]/cors_allowed_origins = \["*"\]/g' $CHAIN_DIR/$CHAINID/config/config.toml
  sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$P2PPORT"'"#g' $CHAIN_DIR/$CHAINID/config/config.toml
  sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$RPCPORT"'"#g' $CHAIN_DIR/$CHAINID/config/config.toml
  sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' $CHAIN_DIR/$CHAINID/config/config.toml
  sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' $CHAIN_DIR/$CHAINID/config/config.toml
  sed -i -e 's/index_all_keys = false/index_all_keys = true/g' $CHAIN_DIR/$CHAINID/config/config.toml

  # Increase RPC max request body size to allow large transactions (e.g., 500 transfers with proofs)
  if ! grep -q "max_body_bytes" $CHAIN_DIR/$CHAINID/config/config.toml; then
      sed -i '/\[rpc\]/a max_body_bytes = 52428800' $CHAIN_DIR/$CHAINID/config/config.toml
  else
      sed -i -e 's/^max_body_bytes = .*/max_body_bytes = 52428800/g' $CHAIN_DIR/$CHAINID/config/config.toml
  fi

  # Increase CometBFT mempool tx size limit
  if grep -q "^max_tx_bytes" $CHAIN_DIR/$CHAINID/config/config.toml; then
      sed -i -e 's/^max_tx_bytes = .*/max_tx_bytes = 52428800/g' $CHAIN_DIR/$CHAINID/config/config.toml
  fi

  sed -i -e 's/cors = false/cors = true/g' $CHAIN_DIR/$CHAINID/config/app.toml
  sed -i -e 's/enable = false/enable = true/g' $CHAIN_DIR/$CHAINID/config/app.toml
  sed -i -e 's/swagger = false/swagger = true/g' $CHAIN_DIR/$CHAINID/config/app.toml
  sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$RESTPORT"'"#g' $CHAIN_DIR/$CHAINID/config/app.toml
  sed -i -e 's#":8080"#":'"$ROSETTA"'"#g' $CHAIN_DIR/$CHAINID/config/app.toml
  sed -i -e 's/minimum-gas-prices = ""/minimum-gas-prices = "0ufair"/g' $CHAIN_DIR/$CHAINID/config/app.toml

  # Increase transaction size limits to allow large batch transactions
  if ! grep -q "^\[mempool\]" $CHAIN_DIR/$CHAINID/config/app.toml; then
      echo "" >> $CHAIN_DIR/$CHAINID/config/app.toml
      echo "[mempool]" >> $CHAIN_DIR/$CHAINID/config/app.toml
  fi

  if ! grep -q "^max_tx_bytes" $CHAIN_DIR/$CHAINID/config/app.toml; then
      sed -i '/^\[mempool\]/a max_tx_bytes = 52428800' $CHAIN_DIR/$CHAINID/config/app.toml
  else
      sed -i -e 's/^max_tx_bytes = .*/max_tx_bytes = 52428800/g' $CHAIN_DIR/$CHAINID/config/app.toml
  fi

  # Ensure wasm section exists and enable Stargate queries for CosmWasm contracts
  cat >> $CHAIN_DIR/$CHAINID/config/app.toml << 'EOF'

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

EOF

  echo "Changing genesis.json..."
  sed -i -e 's/"max_deposit_period": "172800s"/"max_deposit_period": "10s"/g' $CHAIN_DIR/$CHAINID/config/genesis.json
  sed -i -e 's/"voting_period": "172800s"/"voting_period": "10s"/g' $CHAIN_DIR/$CHAINID/config/genesis.json
  sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$CHAINID/config/genesis.json

  # Increase max_tx_bytes and enable vote extensions
  jq --arg veh "$VE_ENABLE_HEIGHT" '
    .consensus.params.abci |= (.consensus.params.abci // {}) |
    .consensus.params.abci.vote_extensions_enable_height = $veh |
    .consensus.params.block.max_tx_bytes = "52428800" |
    .consensus.params.evidence.max_tx_bytes = "52428800"
  ' $CHAIN_DIR/$CHAINID/config/genesis.json > $CHAIN_DIR/$CHAINID/config/genesis.json.tmp && mv $CHAIN_DIR/$CHAINID/config/genesis.json.tmp $CHAIN_DIR/$CHAINID/config/genesis.json

  sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$_VAL1_ADDR"'","'"$_RLY1_ADDR"'","'"$_WALLET5_ADDR"'"\]/g' $CHAIN_DIR/$CHAINID/config/genesis.json
  TRUSTED_PARTIES='{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}'
  sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' $CHAIN_DIR/$CHAINID/config/genesis.json
  sed -i -e 's/"key_expiry": "100"/"key_expiry": "1000000"/g' $CHAIN_DIR/$CHAINID/config/genesis.json
  sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' $CHAIN_DIR/$CHAINID/config/genesis.json

  echo "Chain initialized."
else
  echo "Chain data found at $CHAIN_DIR/$CHAINID — skipping genesis initialization."
fi

# ─────────────── Read addresses from keyring (always) ────────
# Keys are derived from fixed mnemonics so these are always stable.
VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
WALLET2_ADDR=$($BINARY keys show wallet2 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
WALLET3_ADDR=$($BINARY keys show wallet3 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
WALLET4_ADDR=$($BINARY keys show wallet4 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
WALLET5_ADDR=$($BINARY keys show wallet5 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
WALLET6_ADDR=$($BINARY keys show wallet6 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)

# ─────────────── keysharer.yaml (always refresh) ─────────────
if [ -z "$APP_PRIV_HEX" ]; then
  APP_PRIV_HEX=$(echo y | $BINARY keys export val1 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1 | tr -d '\r\n')
fi

if [ -z "$APP_PRIV_HEX" ]; then
  echo "WARN: APP_PRIV_HEX could not be derived; VE keyshare submission may be disabled."
fi

cat > $CHAIN_DIR/$CHAINID/keysharer.yaml <<EOF
enabled: true
validator_account: "$VAL1_ADDR"
app_secp256k1_priv_hex: "$APP_PRIV_HEX"
invalid_share_pause_threshold: $KEYSHARER_INVALID_SHARE_PAUSE_THRESHOLD
EOF
cp -f $CHAIN_DIR/$CHAINID/keysharer.yaml $CHAIN_DIR/$CHAINID/config/keysharer.yaml

# ─────────────── Generate systemd service files ──────────────
# These are written to scripts/devnet/systemd/ with fully-resolved paths.
# Install them with:
#   sudo cp scripts/devnet/systemd/*.service /etc/systemd/system/
#   sudo systemctl daemon-reload
SYSTEMD_DIR="$(pwd)/scripts/devnet/systemd"
mkdir -p "$SYSTEMD_DIR"

SERVICE_USER="${SERVICE_USER:-$(id -u -n)}"
SCRIPTS_DEVNET_DIR="$(pwd)/scripts/devnet"

# Resolve absolute binary paths
BINARY_ABS="$BINARY"
[ -f "$HOME/go/bin/fairyringd" ] && BINARY_ABS="$HOME/go/bin/fairyringd"
FAIRYRINGCLIENT_ABS="$(command -v "$FAIRYRINGCLIENT" 2>/dev/null || echo "$(go env GOPATH)/bin/$FAIRYRINGCLIENT")"
SHAREGENERATIONCLIENT_ABS="$(command -v "$SHAREGENERATIONCLIENT" 2>/dev/null || echo "$(go env GOPATH)/bin/$SHAREGENERATIONCLIENT")"
FAIRYPORT_ABS="$(command -v "$FAIRYPORT" 2>/dev/null || echo "$(go env GOPATH)/bin/$FAIRYPORT")"

cat > "$SYSTEMD_DIR/fairyring.service" <<EOF
[Unit]
Description=FairyRing Blockchain Node
After=network.target

[Service]
Type=simple
User=$SERVICE_USER
ExecStart=$BINARY_ABS start --log_level info --log_format json --home $CHAIN_DIR/$CHAINID --pruning=nothing --grpc.address=0.0.0.0:$GRPCPORT
Restart=on-failure
RestartSec=5
LimitNOFILE=65535
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

cat > "$SYSTEMD_DIR/fairyringclient.service" <<EOF
[Unit]
Description=FairyRing Client
After=network.target fairyring.service
Requires=fairyring.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$SCRIPTS_DEVNET_DIR
ExecStart=$FAIRYRINGCLIENT_ABS start --config $SCRIPTS_DEVNET_DIR/fairyringclient_config.yml
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

cat > "$SYSTEMD_DIR/sharegenerationclient.service" <<EOF
[Unit]
Description=ShareGeneration Client
After=network.target fairyring.service fairyringclient.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$SCRIPTS_DEVNET_DIR
ExecStart=$SHAREGENERATIONCLIENT_ABS start --config $SCRIPTS_DEVNET_DIR/sharegenerationclient_config.yml
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

cat > "$SYSTEMD_DIR/fairyport.service" <<EOF
[Unit]
Description=FairyPort
After=network.target fairyring.service

[Service]
Type=simple
User=$SERVICE_USER
WorkingDirectory=$SCRIPTS_DEVNET_DIR
ExecStart=$FAIRYPORT_ABS start --config $SCRIPTS_DEVNET_DIR/config.yml
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo "Systemd service files written to $SYSTEMD_DIR/"

# ─────────────── Summary ─────────────────────────────────────
echo ""
echo "*********************************************************"
echo "*       Fairyring Devnet Configuration Complete         *"
echo "*********************************************************"
echo "*      Available Wallet Addresses & Private keys:       *"
echo "---------------------------------------------------------"
echo "Name: 'wallet1' | Address: $WALLET1_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet1 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1)"
echo ""
echo "Name: 'wallet2' | Address: $WALLET2_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet2 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1)"
echo ""
echo "Name: 'wallet3' | Address: $WALLET3_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet3 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1)"
echo ""
echo "Name: 'wallet4' | Address: $WALLET4_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet4 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1)"
echo ""
echo "Name: 'wallet5' | Address: $WALLET5_ADDR | (Trusted, for ShareGenerationClient)"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet5 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1)"
echo ""
echo "Name: 'wallet6' | Address: $WALLET6_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet6 --home $CHAIN_DIR/$CHAINID --unsafe --unarmored-hex --keyring-backend test 2>/dev/null | tail -n 1)"
echo "*******************************************************"
echo "*    Node RPC ENDPOINT: http://localhost:$RPCPORT        *"
echo "*    Node REST ENDPOINT: http://localhost:$RESTPORT        *"
echo "*    Node GRPC ENDPOINT: http://localhost:$GRPCPORT        *"
echo "*******************************************************"
echo "Devnet data directory: $(pwd)/devnet_data/"
echo ""
echo "─── Next steps ─────────────────────────────────────────────"
echo "1. Install systemd service files:"
echo "   make devnet-install-services"
echo "   (or: sudo cp scripts/devnet/systemd/*.service /etc/systemd/system/ && sudo systemctl daemon-reload)"
echo ""
echo "2. Start the chain node:"
echo "   sudo systemctl enable --now fairyring"
echo ""
echo "3. Register validator (first time only, once fairyring is running):"
echo "   ./scripts/devnet/register-validator.sh"
echo ""
echo "4. Start remaining services:"
echo "   sudo systemctl enable --now fairyringclient sharegenerationclient fairyport"
echo ""
echo "To restart services after a config update:"
echo "   sudo systemctl restart fairyringclient sharegenerationclient fairyport"
echo "────────────────────────────────────────────────────────────"
