#!/bin/bash

BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"

WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_3="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"

RLY_MNEMONIC_1="alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"

P2PPORT_1=16656
RPCPORT_1=16657
RESTPORT_1=1316
ROSETTA_1=8989
GRPCPORT_1=9494

BLOCK_TIME=5

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

# Add directories for both chains, exit if an error occurs
if ! mkdir -p $CHAIN_DIR/$CHAINID_1 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi

echo "Initializing $CHAINID_1 ..."
$BINARY init test --home $CHAIN_DIR/$CHAINID_1 --default-denom ufairy --chain-id=$CHAINID_1 &> /dev/null

echo "Adding genesis accounts..."
echo $VAL_MNEMONIC_1 | $BINARY keys add val1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_1 | $BINARY keys add wallet1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_3 | $BINARY keys add wallet3 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
RLY1_JSON=$(echo $RLY_MNEMONIC_1 | $BINARY keys add rly1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test --output json)
echo $RLY1_JSON | jq --arg mnemonic "$RLY_MNEMONIC_1" '. += $ARGS.named'> rly1.json

VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
WALLET3_ADDR=$($BINARY keys show wallet3 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
RLY1_ADDR=$($BINARY keys show rly1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)

$BINARY genesis add-genesis-account $VAL1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $WALLET1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $WALLET3_ADDR 1000000000000ufairy,1000000000000stake --vesting-amount 100000000000stake --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test
$BINARY genesis add-genesis-account $RLY1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test

echo "Creating and collecting gentx..."
$BINARY genesis gentx val1 100000000000ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --keyring-backend test
$BINARY genesis collect-gentxs --home $CHAIN_DIR/$CHAINID_1 &> /dev/null

echo "Changing defaults and ports in app.toml and config.toml files..."
sed -i -e 's#"localhost:6060"#"localhost:6969"#g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's#"tcp://127.0.0.1:26658"#"tcp://127.0.0.1:16658"#g' $CHAIN_DIR/$CHAINID_1/config/config.toml
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

sed -i -e 's/localhost:26657/localhost:16657/g' $CHAIN_DIR/$CHAINID_1/config/client.toml
sed -i -e 's/0.0.0.0:9090/0.0.0.0:'"$GRPCPORT_1"'/g' $CHAIN_DIR/$CHAINID_1/config/app.toml

echo "Changing genesis.json..."
sed -i -e 's/"voting_period": "172800s"/"voting_period": "60s"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'"\]/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"key_expiry": "100"/"key_expiry": "10000"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json

echo "Checking if there is an existing keys for Hermes Relayer..."
HKEY_1=$(hermes --config ./scripts/tests/lazychain/relayer_configs/hermes_config.toml keys list --chain fairyring_test_1 | sed -n '/SUCCESS/d; s/.*(\([^)]*\)).*/\1/p')
if [ "$HKEY_1" == "" ]; then
  echo "Key not found for chain id: fairyring_test_1 in Hermes Relayer Keys..."
  echo "Creating key..."
  hermes --config ./scripts/tests/lazychain/relayer_configs/hermes_config.toml keys add --chain fairyring_test_1 --key-file rly1.json
fi

rm rly1.json &> /dev/null

echo "Starting $CHAINID_1 in $CHAIN_DIR..."
echo "Creating log file at $CHAIN_DIR/$CHAINID_1.log"
$BINARY start --log_level info --log_format json --home $CHAIN_DIR/$CHAINID_1 --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_1"  > ./data/$CHAINID_1.log 2>&1 &