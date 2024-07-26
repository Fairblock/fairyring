#!/bin/bash

TOTAL_VALIDATOR_AMOUNT=2

BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAIN_ID=fairyring_test_1

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"
WALLET_MNEMONIC_1="banner spread envelope side kite person disagree path silver will brother under couch edit food venture squirrel civil budget number acquire point work mass"
WALLET_MNEMONIC_2="vacuum burst ordinary enact leaf rabbit gather lend left chase park action dish danger green jeans lucky dish mesh language collect acquire waste load"

P2PPORT_1=26656
RPCPORT_1=26657
RESTPORT_1=1317
ROSETTA_1=8081
GRPCPORT_1=9090
GRPCWEB_1=9091

BLOCK_TIME=5

# Stop if it is already running
if pgrep -x "$BINARY" >/dev/null; then
    echo "Terminating $BINARY..."
    killall $BINARY
fi

echo "Removing previous data..."
for i in $(seq 1 $TOTAL_VALIDATOR_AMOUNT)
do
  rm -rf $CHAIN_DIR/$CHAIN_ID/$i &> /dev/null
done

# Add directories for both chains, exit if an error occurs
for i in $(seq 1 $TOTAL_VALIDATOR_AMOUNT)
do
  if ! mkdir -p $CHAIN_DIR/$CHAIN_ID/$i 2>/dev/null; then
      echo "Failed to create chain folder. Aborting..."
      exit 1
  fi
done


for i in $(seq 1 $TOTAL_VALIDATOR_AMOUNT)
do
  echo "[$i] Initializing $CHAIN_ID at $CHAIN_DIR/$CHAIN_ID/$i"
  $BINARY init test$i --home $CHAIN_DIR/$CHAIN_ID/$i --chain-id=$CHAIN_ID &> /dev/null

  echo "[$i] Adding genesis accounts..."

  if [[ "$i" -eq "1" ]]; then
    echo $VAL_MNEMONIC_1 | $BINARY keys add val1 --home $CHAIN_DIR/$CHAIN_ID/$i --recover --keyring-backend=test
    echo $WALLET_MNEMONIC_1 | $BINARY keys add wallet1 --home $CHAIN_DIR/$CHAIN_ID/$i --recover --keyring-backend=test
    echo $WALLET_MNEMONIC_2 | $BINARY keys add wallet2 --home $CHAIN_DIR/$CHAIN_ID/$i --recover --keyring-backend=test
  else
    $BINARY keys add val1 --home $CHAIN_DIR/$CHAIN_ID/$i --keyring-backend=test
    $BINARY keys add wallet1 --home $CHAIN_DIR/$CHAIN_ID/$i  --keyring-backend=test
    $BINARY keys add wallet2 --home $CHAIN_DIR/$CHAIN_ID/$i --keyring-backend=test
  fi

  VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAIN_ID/$i --keyring-backend test -a)
  WALLET1_ADDR=$($BINARY keys show wallet1 --home $CHAIN_DIR/$CHAIN_ID/$i --keyring-backend test -a)
  WALLET2_ADDR=$($BINARY keys show wallet2 --home $CHAIN_DIR/$CHAIN_ID/$i --keyring-backend test -a)

  $BINARY genesis add-genesis-account $VAL1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAIN_ID/$i
  $BINARY genesis add-genesis-account $WALLET1_ADDR 1000000000000ufairy --home $CHAIN_DIR/$CHAIN_ID/$i
  $BINARY genesis dd-genesis-account $WALLET2_ADDR 1000000000000ufairy --home $CHAIN_DIR/$CHAIN_ID/$i

  if [ "$i" != "1" ]; then
    $BINARY genesis add-genesis-account $VAL1_ADDR 1000000000000ufairy,1000000000000stake --home $CHAIN_DIR/$CHAIN_ID/1
    $BINARY genesis add-genesis-account $WALLET1_ADDR 1000000000000ufairy --home $CHAIN_DIR/$CHAIN_ID/1
    $BINARY genesis add-genesis-account $WALLET2_ADDR 1000000000000ufairy --home $CHAIN_DIR/$CHAIN_ID/1
  fi

  echo "[$i] Creating gentx..."
  $BINARY genesis gentx val1 100000000000stake --home $CHAIN_DIR/$CHAIN_ID/$i --chain-id $CHAIN_ID --keyring-backend test
done

for i in $(seq 2 $TOTAL_VALIDATOR_AMOUNT)
do
  echo "Copying $i gentx to first validator gentx folder..."
  cp $CHAIN_DIR/$CHAIN_ID/$i/config/gentx/gentx-*.json $CHAIN_DIR/$CHAIN_ID/1/config/gentx/
done


echo "Collecting gentx..."
$BINARY genesis collect-gentxs --home $CHAIN_DIR/$CHAIN_ID/1 &> /dev/null

echo "Creating persistent peers list..."
PEERS_LIST=""
PEER_LIST_FOR_FIRST_VAL=""
for i in $(seq 1 $TOTAL_VALIDATOR_AMOUNT)
do
  NODE_ID=$($BINARY tendermint show-node-id --home $CHAIN_DIR/$CHAIN_ID/$i)
  P2P_PORT=$(($P2PPORT_1+100*($i-1)))

  if [ "$i" == "1" ]; then
    PEERS_LIST="$NODE_ID@127.0.0.1:$P2P_PORT"
  else
    PEERS_LIST="$PEERS_LIST,$NODE_ID@127.0.0.1:$P2P_PORT"
  fi

  if [ "$i" != "1" ]; then
    if [ "$i" == "2" ]; then
        PEER_LIST_FOR_FIRST_VAL="$NODE_ID@192.168.2.12:26656"
    else
      PEER_LIST_FOR_FIRST_VAL="$PEER_LIST_FOR_FIRST_VAL,$NODE_ID@192.168.2.12:26656"
    fi
  fi
done

printf "Done creating peers list:\n$PEERS_LIST\n"
printf "Done creating first validator peers list:\n$PEER_LIST_FOR_FIRST_VAL\n"

for i in $(seq 1 $TOTAL_VALIDATOR_AMOUNT)
do
  echo "[$i] Updating defaults and ports in app.toml and config.toml files..."
  P2P_PORT=$(($P2PPORT_1+100*($i-1)))
  RPC_PORT=$(($RPCPORT_1+100*($i-1)))
  RESTPORT=$(($RESTPORT_1+100*($i-1)))
  ROSETTA=$(($ROSETTA_1+100*($i-1)))

  echo "[$i] $P2P_PORT $RPC_PORT $RESTPORT $ROSETTA"
  sed -i -e 's/persistent_peers = "'"$PEER_LIST_FOR_FIRST_VAL"'"/persistent_peers = "'"$PEERS_LIST"'"/g' $CHAIN_DIR/$CHAIN_ID/$i/config/config.toml
  sed -i -e 's/persistent_peers = ""/persistent_peers = "'"$PEERS_LIST"'"/g' $CHAIN_DIR/$CHAIN_ID/$i/config/config.toml
  sed -i -e 's#"tcp://0.0.0.0:26656"#"tcp://0.0.0.0:'"$P2P_PORT"'"#g' $CHAIN_DIR/$CHAIN_ID/$i/config/config.toml
  sed -i -e 's#"tcp://127.0.0.1:26657"#"tcp://0.0.0.0:'"$RPC_PORT"'"#g' $CHAIN_DIR/$CHAIN_ID/$i/config/config.toml
  sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' $CHAIN_DIR/$CHAIN_ID/$i/config/config.toml
  sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' $CHAIN_DIR/$CHAIN_ID/$i/config/config.toml

#  sed -i -e 's/index_all_keys = false/index_all_keys = true/g' $CHAIN_DIR/$CHAIN_ID/1/config/config.toml
#  sed -i -e 's/enable = false/enable = true/g' $CHAIN_DIR/$CHAIN_ID/1/config/app.toml
#  sed -i -e 's/swagger = false/swagger = true/g' $CHAIN_DIR/$CHAIN_ID/1/config/app.toml
  sed -i -e 's#"tcp://localhost:1317"#"tcp://localhost:'"$RESTPORT"'"#g' $CHAIN_DIR/$CHAIN_ID/$i/config/app.toml
#  sed -i -e 's#":8080"#":'"$ROSETTA"'"#g' $CHAIN_DIR/$CHAIN_ID/1/config/app.toml
  #sed -i -e 's/minimum-gas-prices = "0stake"/minimum-gas-prices = "1ufairy"/g' $CHAIN_DIR/$CHAIN_ID/1/config/app.toml
done

echo "Updating genesis.json..."
#sed -i -e 's/"voting_period": "172800s"/"voting_period": "10s"/g' $CHAIN_DIR/$CHAIN_ID/1/config/genesis.json
#sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' $CHAIN_DIR/$CHAIN_ID/1/config/genesis.json
sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL1_ADDR"'","'"$WALLET1_ADDR"'"\]/g' $CHAIN_DIR/$CHAIN_ID/1/config/genesis.json
TRUSTED_PARTIES='{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}'
sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' $CHAIN_DIR/$CHAIN_ID/1/config/genesis.json
sed -i -e 's/"key_expiry": "100"/"key_expiry": "10000"/g' $CHAIN_DIR/$CHAIN_ID/1/config/genesis.json

for i in $(seq 2 $TOTAL_VALIDATOR_AMOUNT)
do
  echo "Copying updated genesis file to [$i] validator node..."
  cp $CHAIN_DIR/$CHAIN_ID/1/config/genesis.json $CHAIN_DIR/$CHAIN_ID/$i/config/genesis.json
done

for i in $(seq 1 $TOTAL_VALIDATOR_AMOUNT)
do
  GRPC=$(($GRPCPORT_1+100*($i-1)))
  GRPC_WEB=$(($GRPCWEB_1+100*($i-1)))
  echo "[$i] Starting $CHAIN_ID in $CHAIN_DIR, with GRPC port: $GRPC and GRPC Web port: $GRPC_WEB"
  echo "[$i] Creating log file at $CHAIN_DIR/$CHAIN_ID/$i"_"$BINARY.log"
  $BINARY start --log_level trace --log_format json --home $CHAIN_DIR/$CHAIN_ID/$i --grpc.address="0.0.0.0:$GRPC" --grpc-web.address="0.0.0.0:$GRPC_WEB" > $CHAIN_DIR/$CHAIN_ID/$i"_"$BINARY.log 2>&1 &
done


echo "Waiting all the chains to run..."
sleep $((BLOCK_TIME*2))
echo "Done"