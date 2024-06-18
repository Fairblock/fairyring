#!/bin/bash

BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"
VAL_MNEMONIC_2="angry twist harsh drastic left brass behave host shove marriage fall update business leg direct reward object ugly security warm tuna model broccoli choice"

WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_2="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
WALLET_MNEMONIC_3="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"
WALLET_MNEMONIC_4="open attitude harsh casino rent attitude midnight debris describe spare cancel crisp olive ride elite gallery leaf buffalo sheriff filter rotate path begin soldier"
WALLET_MNEMONIC_5="sleep garage unaware monster slide cruel barely blade sudden basic review mimic screen box human wing ritual use smooth ripple tuna ostrich pony eye"

RLY_MNEMONIC_1="alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"
RLY_MNEMONIC_2="record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"

P2PPORT_1=16656
P2PPORT_2=26656
RPCPORT_1=16657
RPCPORT_2=26657
RESTPORT_1=1316
RESTPORT_2=1317
ROSETTA_1=8080
ROSETTA_2=8081
GRPCPORT_1=9090
GRPCPORT_2=9092
GRPCWEB_1=9091
GRPCWEB_2=9093

BLOCK_TIME=5

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
rm -rf $CHAIN_DIR/$CHAINID_1 &> /dev/null
rm -rf $CHAIN_DIR/$CHAINID_2 &> /dev/null

# Add directories for both chains, exit if an error occurs
if ! mkdir -p $CHAIN_DIR/$CHAINID_1 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi

if ! mkdir -p $CHAIN_DIR/$CHAINID_2 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi

echo "Initializing $CHAINID_1 & $CHAINID_2..."
$BINARY init test --home $CHAIN_DIR/$CHAINID_1 --chain-id=$CHAINID_1 &> /dev/null
$BINARY init test --home $CHAIN_DIR/$CHAINID_2 --chain-id=$CHAINID_2 &> /dev/null

echo "Adding genesis accounts..."
echo $VAL_MNEMONIC_1 | $BINARY keys add val1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $VAL_MNEMONIC_2 | $BINARY keys add val2 --home $CHAIN_DIR/$CHAINID_2 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_1 | $BINARY keys add wallet1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_2 | $BINARY keys add wallet2 --home $CHAIN_DIR/$CHAINID_2 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_3 | $BINARY keys add wallet3 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_4 | $BINARY keys add wallet4 --home $CHAIN_DIR/$CHAINID_2 --recover --keyring-backend=test
RLY1_JSON=$(echo $RLY_MNEMONIC_1 | $BINARY keys add rly1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test --output json)
echo $RLY1_JSON | jq --arg mnemonic "$RLY_MNEMONIC_1" '. += $ARGS.named'> rly1.json
RLY2_JSON=$(echo $RLY_MNEMONIC_2 | $BINARY keys add rly2 --home $CHAIN_DIR/$CHAINID_2 --recover --keyring-backend=test --output json)
echo $RLY2_JSON | jq --arg mnemonic "$RLY_MNEMONIC_2" '. += $ARGS.named'> rly2.json

VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
VAL2_ADDR=$($BINARY keys show val2 --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test -a)
WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
WALLET2_ADDR=$($BINARY keys show wallet2 --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test -a)
WALLET3_ADDR=$($BINARY keys show wallet3 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
WALLET4_ADDR=$($BINARY keys show wallet4 --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test -a)
RLY1_ADDR=$($BINARY keys show rly1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
RLY2_ADDR=$($BINARY keys show rly2 --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test -a)

$BINARY genesis add-genesis-account $VAL1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $VAL2_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test
$BINARY genesis add-genesis-account $WALLET1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $WALLET2_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test
$BINARY genesis add-genesis-account $WALLET3_ADDR 1000000000000ufairy,1000000000000stake --vesting-amount 100000000000stake --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $WALLET4_ADDR 1000000000000ufairy,1000000000000stake --vesting-amount 100000000000stake --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test
$BINARY genesis add-genesis-account $RLY1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $RLY2_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_2 --keyring-backend test

echo "Creating and collecting gentx..."
$BINARY genesis gentx val1 100000000000stake --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --keyring-backend test
$BINARY genesis gentx val2 100000000000stake --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --keyring-backend test
$BINARY genesis collect-gentxs --home $CHAIN_DIR/$CHAINID_1 &> /dev/null
$BINARY genesis collect-gentxs --home $CHAIN_DIR/$CHAINID_2 &> /dev/null

echo "Changing defaults and ports in app.toml and config.toml files..."
sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$P2PPORT_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$RPCPORT_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/index_all_keys = false/index_all_keys = true/g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/enable = false/enable = true/g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's/swagger = false/swagger = true/g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$RESTPORT_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's#":8080"#":'"$ROSETTA_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's/minimum-gas-prices = ""/minimum-gas-prices = "1ufairy"/g' $CHAIN_DIR/$CHAINID_1/config/app.toml

sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$P2PPORT_2"'"#g' $CHAIN_DIR/$CHAINID_2/config/config.toml
sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$RPCPORT_2"'"#g' $CHAIN_DIR/$CHAINID_2/config/config.toml
sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' $CHAIN_DIR/$CHAINID_2/config/config.toml
sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' $CHAIN_DIR/$CHAINID_2/config/config.toml
sed -i -e 's/index_all_keys = false/index_all_keys = true/g' $CHAIN_DIR/$CHAINID_2/config/config.toml
sed -i -e 's/enable = false/enable = true/g' $CHAIN_DIR/$CHAINID_2/config/app.toml
sed -i -e 's/0.0.0.0:9090/0.0.0.0:'"$GRPCPORT_2"'/g' $CHAIN_DIR/$CHAINID_2/config/app.toml
sed -i -e 's/swagger = false/swagger = true/g' $CHAIN_DIR/$CHAINID_2/config/app.toml
sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$RESTPORT_2"'"#g' $CHAIN_DIR/$CHAINID_2/config/app.toml
sed -i -e 's#":8080"#":'"$ROSETTA_2"'"#g' $CHAIN_DIR/$CHAINID_2/config/app.toml
sed -i -e 's/minimum-gas-prices = ""/minimum-gas-prices = "1ufairy"/g' $CHAIN_DIR/$CHAINID_2/config/app.toml

echo "Changing genesis.json..."
sed -i -e 's/"voting_period": "172800s"/"voting_period": "60s"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"voting_period": "172800s"/"voting_period": "60s"/g' $CHAIN_DIR/$CHAINID_2/config/genesis.json

sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$CHAINID_2/config/genesis.json

sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'","'"$VAL2_ADDR"'"\]/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'","'"$VAL2_ADDR"'"\]/g' $CHAIN_DIR/$CHAINID_2/config/genesis.json

TRUSTED_PARTIES='{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}'

# sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' $CHAIN_DIR/$CHAINID_2/config/genesis.json

sed -i -e 's/"key_expiry": "100"/"key_expiry": "10000"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"key_expiry": "100"/"key_expiry": "10000"/g' $CHAIN_DIR/$CHAINID_2/config/genesis.json

sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json

jsonData2=$(cat "$CHAIN_DIR/$CHAINID_2/config/genesis.json")
modifiedJson2=$(echo "$jsonData2" |
  jq '.app_state.gov.params.channel_id = "channel-0" |
  .app_state.gov.params.trusted_counter_parties = [{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}] |
  .app_state.pep.params.keyshare_channel_id = "channel-0"')
echo "$modifiedJson2" | jq '.' > "$CHAIN_DIR/$CHAINID_2/config/genesis.json"

echo "Starting $CHAINID_1 in $CHAIN_DIR..."
echo "Creating log file at $CHAIN_DIR/$CHAINID_1.log"
$BINARY start --log_level info --log_format json --home $CHAIN_DIR/$CHAINID_1 --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_1" > $CHAIN_DIR/$CHAINID_1.log 2>&1 &

echo "Starting $CHAINID_2 in $CHAIN_DIR..."
echo "Creating log file at $CHAIN_DIR/$CHAINID_2.log"
$BINARY start --log_level trace --log_format json --home $CHAIN_DIR/$CHAINID_2 --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_2" > $CHAIN_DIR/$CHAINID_2.log 2>&1 &

echo "Checking if there is an existing keys for Hermes Relayer..."
HKEY_1=$(hermes --config hermes_config.toml keys list --chain fairyring_test_1 | sed -n '/SUCCESS/d; s/.*(\([^)]*\)).*/\1/p')
if [ "$HKEY_1" == "" ]; then
  echo "Key not found for chain id: fairyring_test_1 in Hermes Relayer Keys..."
  echo "Creating key..."
  hermes --config hermes_config.toml keys add --chain fairyring_test_1 --key-file rly1.json
fi

HKEY_2=$(hermes --config hermes_config.toml keys list --chain fairyring_test_2 | sed -n '/SUCCESS/d; s/.*(\([^)]*\)).*/\1/p')
if [ "$HKEY_2" == "" ]; then
  echo "Key not found for chain id: fairyring_test_1 in Hermes Relayer Keys..."
  echo "Creating key..."
  hermes --config hermes_config.toml keys add --chain fairyring_test_2 --key-file rly2.json
fi

rm rly1.json &> /dev/null
rm rly2.json &> /dev/null

echo "Waiting both chain to run..."
sleep $((BLOCK_TIME*2))

echo "Starting Hermes Relayer..."
echo "Creating log file at $CHAIN_DIR/relayer.log"
hermes --config hermes_config.toml start > $CHAIN_DIR/relayer.log 2>&1 &