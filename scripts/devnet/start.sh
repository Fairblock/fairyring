#!/bin/bash

BINARY=fairyringd
CHAIN_DIR=$(pwd)/devnet_data
CHAINID=fairyring_devnet
DST_CHIANID=destination_fairyring_devnet
FAIRYRINGCLIENT=fairyringclient
SHAREGENERATIONCLIENT=ShareGenerationClient
FAIRYPORT=fairyport
DEVNET_DIR=$(pwd)/scripts/devnet

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"

WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_2="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
WALLET_MNEMONIC_3="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"
WALLET_MNEMONIC_4="open attitude harsh casino rent attitude midnight debris describe spare cancel crisp olive ride elite gallery leaf buffalo sheriff filter rotate path begin soldier"
WALLET_MNEMONIC_5="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"

RLY_MNEMONIC_1="alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"
RLY_MNEMONIC_2="record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"

P2PPORT=26656
RPCPORT=26657
RESTPORT=1317
ROSETTA=8080
GRPCPORT=9090
GRPCWEB=9091

DST_P2PPORT=16656
DST_RPCPORT=16657
DST_RESTPORT=2317
DST_ROSETTA=7080
DST_GRPCPORT=8090
DST_GRPCWEB=8091

BLOCK_TIME=5

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
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node tcp://localhost:$RPCPORT -o json)
  echo "$RESULT"
}


# Stop if it is already running
if pgrep -x "$BINARY" >/dev/null; then
    echo "Terminating $BINARY..."
    killall $BINARY
fi

if pgrep -x "hermes" >/dev/null; then
    echo "Terminating Hermes Relayer..."
    killall hermes
fi

echo "Removing previous data..."
rm -rf $CHAIN_DIR/$CHAINID &> /dev/null
rm -rf $CHAIN_DIR/$DST_CHAINID &> /dev/null

# Add directories for both chains, exit if an error occurs
if ! mkdir -p $CHAIN_DIR/$CHAINID 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi
if ! mkdir -p $CHAIN_DIR/$DST_CHAINID 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi

function init_chain() {
  local LOCAL_CHAIN_ID=$1
  local LOCAL_P2PPORT=$2
  local LOCAL_RPCPORT=$3
  local LOCAL_ROSETTA=$4
  local LOCAL_RESTPORT=$5
  local LOCAL_GRPCPORT=$6
  local LOCAL_GRPCWEB=$7
  local LOCAL_RLY_KEY_FILE=$8
  local IS_SRC_CHAIN=$9

  echo "Initializing $LOCAL_CHAIN_ID ..."
  $BINARY init devnet --home $CHAIN_DIR/$LOCAL_CHAIN_ID --default-denom ufairy --chain-id=$LOCAL_CHAIN_ID &> /dev/null

  echo "Adding genesis accounts..."
  echo $VAL_MNEMONIC_1 | $BINARY keys add val1 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test
  echo $WALLET_MNEMONIC_1 | $BINARY keys add wallet1 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test
  echo $WALLET_MNEMONIC_2 | $BINARY keys add wallet2 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test
  echo $WALLET_MNEMONIC_3 | $BINARY keys add wallet3 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test
  echo $WALLET_MNEMONIC_4 | $BINARY keys add wallet4 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test
  echo $WALLET_MNEMONIC_5 | $BINARY keys add wallet5 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test
  RLY1_JSON=$(echo $RLY_MNEMONIC_1 | $BINARY keys add rly1 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test --output json)
  echo $RLY1_JSON | jq --arg mnemonic "$RLY_MNEMONIC_1" '. += $ARGS.named'> rly1.json
  RLY2_JSON=$(echo $RLY_MNEMONIC_2 | $BINARY keys add rly2 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --recover --keyring-backend=test --output json)
  echo $RLY2_JSON | jq --arg mnemonic "$RLY_MNEMONIC_2" '. += $ARGS.named'> rly2.json

  VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  WALLET2_ADDR=$($BINARY keys show wallet2 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  WALLET3_ADDR=$($BINARY keys show wallet3 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  WALLET4_ADDR=$($BINARY keys show wallet4 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  WALLET5_ADDR=$($BINARY keys show wallet5 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  RLY1_ADDR=$($BINARY keys show rly1 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)
  RLY2_ADDR=$($BINARY keys show rly2 --home $CHAIN_DIR/$LOCAL_CHAIN_ID --keyring-backend test -a)

  $BINARY add-genesis-account $VAL1_ADDR 1000000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $WALLET1_ADDR 1000000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $WALLET2_ADDR 1000000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $WALLET3_ADDR 1000000000000ufairy --vesting-amount 1000000000000ufairy --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $WALLET4_ADDR 1000000000000ufairy --vesting-amount 1000000000000ufairy --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $WALLET5_ADDR 1000000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $RLY1_ADDR 1000000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID
  $BINARY add-genesis-account $RLY2_ADDR 1000000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID

  echo "Creating and collecting gentx..."
  $BINARY gentx val1 100000000000ufairy --home $CHAIN_DIR/$LOCAL_CHAIN_ID --chain-id $LOCAL_CHAIN_ID --keyring-backend test
  $BINARY collect-gentxs --home $CHAIN_DIR/$LOCAL_CHAIN_ID &> /dev/null

  echo "Changing defaults and ports in app.toml and config.toml files..."

  sed -i -e 's/cors_allowed_origins = \[\]/cors_allowed_origins = \["*"\]/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/config.toml
  sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$LOCAL_P2PPORT"'"#g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/config.toml
  sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$LOCAL_RPCPORT"'"#g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/config.toml
  sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/config.toml
  sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/config.toml
  sed -i -e 's/index_all_keys = false/index_all_keys = true/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/config.toml

  sed -i -e 's/cors = false/cors = true/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/app.toml
  sed -i -e 's/enable = false/enable = true/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/app.toml
  sed -i -e 's/swagger = false/swagger = true/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/app.toml
  sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$LOCAL_RESTPORT"'"#g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/app.toml
  sed -i -e 's#":8080"#":'"$LOCAL_ROSETTA"'"#g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/app.toml
  sed -i -e 's/minimum-gas-prices = "0stake"/minimum-gas-prices = "0ufairy"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/app.toml


  echo "Changing genesis.json..."
  sed -i -e 's/"max_deposit_period": "172800s"/"max_deposit_period": "10s"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json
  sed -i -e 's/"voting_period": "172800s"/"voting_period": "10s"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json
  sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json

  sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'","'"$RLY1_ADDR"'","'"$WALLET5_ADDR"'","'"$RLY2_ADDR"'"\]/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json
  TRUSTED_PARTIES='{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-1"},{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}'

  sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json
  sed -i -e 's/"key_expiry": "100"/"key_expiry": "10"/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json

  if [ "$IS_SRC_CHAIN" = true ]; then
    sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' $CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json
#  else
#    jsonData2=$(cat "$CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json")
#    modifiedJson2=$(echo "$jsonData2" |
#      jq '.app_state.gov.params.channel_id = "channel-0" |
#      .app_state.gov.params.trusted_counter_parties = [{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}] |
#      .app_state.pep.params.keyshare_channel_id = "channel-1"')
#    echo "$modifiedJson2" | jq '.' > "$CHAIN_DIR/$LOCAL_CHAIN_ID/config/genesis.json"
  fi


  echo "Starting $LOCAL_CHAIN_ID in $CHAIN_DIR..."
  echo "Creating log file at $CHAIN_DIR/$LOCAL_CHAIN_ID.log"
  $BINARY start --log_level trace --log_format json --home $CHAIN_DIR/$LOCAL_CHAIN_ID --pruning=nothing --grpc.address="0.0.0.0:$LOCAL_GRPCPORT" --grpc-web.address="0.0.0.0:$LOCAL_GRPCWEB" > $CHAIN_DIR/$LOCAL_CHAIN_ID.log 2>&1 &

  echo "Checking if there is an existing keys for Hermes Relayer..."
  HKEY_1=$(hermes --config $DEVNET_DIR/devnet_hermes_config.toml keys list --chain $LOCAL_CHAIN_ID | sed -n '/SUCCESS/d; s/.*(\([^)]*\)).*/\1/p')
  if [ "$HKEY_1" == "" ]; then
    echo "Key not found for chain id: $LOCAL_CHAIN_ID in Hermes Relayer Keys..."
    echo "Creating key..."
    hermes --config $DEVNET_DIR/devnet_hermes_config.toml keys add --chain $LOCAL_CHAIN_ID --key-file $LOCAL_RLY_KEY_FILE
  fi

  rm $LOCAL_RLY_KEY_FILE &> /dev/null
}

init_chain $CHAINID $P2PPORT $RPCPORT $ROSETTA $RESTPORT $GRPCPORT $GRPCWEB rly1.json true
init_chain $DST_CHIANID $DST_P2PPORT $DST_RPCPORT $DST_ROSETTA $DST_RESTPORT $DST_GRPCPORT $DST_GRPCWEB rly2.json false

echo "Waiting Devnet & Destination Chain to run..."
sleep $((BLOCK_TIME*2))

echo "Setting up Devnet..."

echo "Registering as a validator in keyshare module..."
RESULT=$($BINARY tx keyshare register-validator --from val1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node tcp://localhost:$RPCPORT --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[0].value')
if [ "$VALIDATOR_ADDR" != "$VAL1_ADDR" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VAL1_ADDR', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Starting Hermes Relayer..."
echo "Creating log file at $CHAIN_DIR/relayer.log"
hermes --config $DEVNET_DIR/devnet_hermes_config.toml start > $CHAIN_DIR/relayer.log 2>&1 &

echo "Starting FairyRingClient..."
cd $DEVNET_DIR
$FAIRYRINGCLIENT start --config fairyringclient_config.yml > $CHAIN_DIR/fairyringclient.log 2>&1 &

echo "Starting ShareGenerationClient..."
sleep $BLOCK_TIME
$SHAREGENERATIONCLIENT start --config sharegenerationclient_config.yml > $CHAIN_DIR/sharegenerationclient.log 2>&1 &

echo "Starting FairyPort..."
sleep $BLOCK_TIME
$FAIRYPORT start --config config.yml > $CHAIN_DIR/fairyport.log 2>&1 &

echo "*********************************************************"
echo "*  Done Setting up Fairyring Devnet and is now running  *"
echo "*********************************************************"
echo "*      Available Wallet Addresses & Private keys:       *"
echo "---------------------------------------------------------"
echo "Name: 'wallet1' | Address: $WALLET1_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet1 --home $CHAIN_DIR/$CHAINID --keyring-backend test --unsafe --unarmored-hex)"
echo ""
echo "Name: 'wallet2' | Address: $WALLET2_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet2 --home $CHAIN_DIR/$CHAINID --keyring-backend test --unsafe --unarmored-hex)"
echo ""
echo "Name: 'wallet3' | Address: $WALLET3_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet3 --home $CHAIN_DIR/$CHAINID --keyring-backend test --unsafe --unarmored-hex)"
echo ""
echo "Name: 'wallet4' | Address: $WALLET4_ADDR"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet4 --home $CHAIN_DIR/$CHAINID --keyring-backend test --unsafe --unarmored-hex)"
echo ""
echo "Name: 'wallet5' | Address: $WALLET5_ADDR | (Trusted, for ShareGenerationClient)"
echo "PRIVATE KEY: $(echo y | $BINARY keys export wallet5 --home $CHAIN_DIR/$CHAINID --keyring-backend test --unsafe --unarmored-hex)"
echo "*******************************************************"
echo "*    Node RPC ENDPOINT: http://localhost:$RPCPORT        *"
echo "*    Node REST ENDPOINT: http://localhost:$RESTPORT        *"
echo "*    Node GRPC ENDPOINT: http://localhost:$GRPCPORT        *"
echo "*******************************************************"
echo "*      DST RPC ENDPOINT: http://localhost:$DST_RPCPORT      *"
echo "*      DST REST ENDPOINT: http://localhost:$DST_RESTPORT      *"
echo "*      DST GRPC ENDPOINT: http://localhost:$DST_GRPCPORT      *"
echo "*******************************************************"
echo "Devnet data directory: $(pwd)/devnet_data/"