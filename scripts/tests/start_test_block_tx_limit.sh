#!/bin/bash

BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"
WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_3="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"

P2PPORT_1=16656
RPCPORT_1=16657
RESTPORT_1=1316
ROSETTA_1=8080
GRPCPORT_1=9090
GRPCWEB_1=9091

BLOCK_TIME=$BLOCK_TIME
TOTAL_TEST_ACC_NUM=$TOTAL_ACC
GENERAL_TX_AMOUNT=$OTHER_TX

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

# Add directories for both chains, exit if an error occurs
if ! mkdir -p $CHAIN_DIR/$CHAINID_1 2>/dev/null; then
    echo "Failed to create chain folder. Aborting..."
    exit 1
fi


echo "Initializing $CHAINID_1 ..."
$BINARY init test --home $CHAIN_DIR/$CHAINID_1 --chain-id=$CHAINID_1 &> /dev/null

echo "Adding genesis accounts..."
echo $VAL_MNEMONIC_1 | $BINARY keys add val1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_1 | $BINARY keys add wallet1 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test
echo $WALLET_MNEMONIC_3 | $BINARY keys add wallet3 --home $CHAIN_DIR/$CHAINID_1 --recover --keyring-backend=test

for i in $(seq 0 $(($TOTAL_TEST_ACC_NUM-1)))
do
  $BINARY keys add "test$i" --home $CHAIN_DIR/$CHAINID_1 --keyring-backend=test
done


VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
WALLET3_ADDR=$($BINARY keys show wallet3 --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)


for i in $(seq 0 $(($TOTAL_TEST_ACC_NUM-1)))
do
 $BINARY add-genesis-account "test$i" 1000000000000ufair --home $CHAIN_DIR/$CHAINID_1
done


$BINARY keys add "normaltxacc" --home $CHAIN_DIR/$CHAINID_1 --keyring-backend=test
NORMALTXACC_ADDR=$($BINARY keys show normaltxacc --home $CHAIN_DIR/$CHAINID_1 --keyring-backend test -a)
$BINARY add-genesis-account $NORMALTXACC_ADDR 1000000000000ufair --home $CHAIN_DIR/$CHAINID_1


$BINARY add-genesis-account $VAL1_ADDR 1000000000000ufair,1000000000000stake --home $CHAIN_DIR/$CHAINID_1
$BINARY add-genesis-account $WALLET1_ADDR 1000000000000ufair --home $CHAIN_DIR/$CHAINID_1
$BINARY add-genesis-account $WALLET3_ADDR 1000000000000ufair --vesting-amount 10000000000stake --vesting-start-time $(date +%s) --vesting-end-time $(($(date '+%s') + 100000023)) --home $CHAIN_DIR/$CHAINID_1

echo "Creating and collecting gentx..."
$BINARY gentx val1 10000000000stake --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --keyring-backend test
$BINARY collect-gentxs --home $CHAIN_DIR/$CHAINID_1 &> /dev/null

echo "Changing defaults and ports in app.toml and config.toml files..."
sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$P2PPORT_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$RPCPORT_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/timeout_commit = "5s"/timeout_commit = "'"$BLOCK_TIME"'s"/g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/timeout_propose = "3s"/timeout_propose = "'"$BLOCK_TIME"'s"/g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/index_all_keys = false/index_all_keys = true/g' $CHAIN_DIR/$CHAINID_1/config/config.toml
sed -i -e 's/enable = false/enable = true/g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's/swagger = false/swagger = true/g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$RESTPORT_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/app.toml
sed -i -e 's#":8080"#":'"$ROSETTA_1"'"#g' $CHAIN_DIR/$CHAINID_1/config/app.toml

echo "Changing genesis.json..."
sed -i -e 's/"voting_period": "172800s"/"voting_period": "10s"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json
sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json

sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'"\]/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json

sed -i -e 's/"key_expiry": "100"/"key_expiry": "100000"/g' $CHAIN_DIR/$CHAINID_1/config/genesis.json

echo "Starting $CHAINID_1 in $CHAIN_DIR..."
echo "Creating log file at $CHAIN_DIR/$CHAINID_1.log"
$BINARY start --log_level trace --log_format json --home $CHAIN_DIR/$CHAINID_1 --pruning=nothing --grpc.address="0.0.0.0:$GRPCPORT_1" --grpc-web.address="0.0.0.0:$GRPCWEB_1" > $CHAIN_DIR/$CHAINID_1.log 2>&1 &

echo "Waiting  chain to run..."
sleep $BLOCK_TIME

