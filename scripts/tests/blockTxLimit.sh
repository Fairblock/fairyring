#!/bin/bash

GENERATOR=ShareGenerator
BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2
CHAIN1_NODE=tcp://localhost:16657
BLOCK_TIME=2

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)

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
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE -o json)
  echo "$RESULT"
}


GENERATED_RESULT=$($GENERATOR generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')


echo "Staked account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[0].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[2].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


ACCOUNT_INFO=$($BINARY query account $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE -o json)
ACCOUNT_NUMBER=$(echo $ACCOUNT_INFO | jq -r '.account_number')
ACCOUNT_SEQ=$(echo $ACCOUNT_INFO | jq -r '.sequence')

echo "Testing Submit keyshare tx limit"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE | jq -r '.block.header.height')
echo "Current Block: $CURRENT_BLOCK"

SUBMITTED_TX_HASH=()

SUBMITTED=0
while true
do
  LATEST_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE | jq -r '.block.header.height')
  if [ "$LATEST_BLOCK" != "$CURRENT_BLOCK" ]; then
    echo "1 Block passed, current block: $LATEST_BLOCK, submitted: $SUBMITTED"

    TX_HASH_LENGTH=${#SUBMITTED_TX_HASH[*]}

    echo "Total Tx Hash: $TX_HASH_LENGTH"

    sleep $BLOCK_TIME

    for EACH_TX_HASH in "${SUBMITTED_TX_HASH[@]}"
    do
      RESP=$($BINARY q tx --type=hash $EACH_TX_HASH --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE -o json)
      echo "Tx Hash: $EACH_TX_HASH confirmed at block $(echo $RESP | jq -r '.height') with code: $(echo $RESP | jq -r '.code')"
    done

    break
  fi
  TARGET_HEIGHT=$(($CURRENT_BLOCK + $SUBMITTED))

  EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 0 $TARGET_HEIGHT)
  EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')
  EXTRACTED_COMMITMENT=$(echo "$EXTRACTED_RESULT" | jq -r '.Commitment')
  RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE $EXTRACTED_COMMITMENT 0 $TARGET_HEIGHT --from $VALIDATOR_1 --offline --account-number $ACCOUNT_NUMBER --sequence $ACCOUNT_SEQ --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode async --keyring-backend test -o json -y)

  TX_CODE=$(echo "$RESULT" | jq -r '.code')
  TX_HASH=$(echo "$RESULT" | jq -r '.txhash')
  echo "Tx Code: $TX_CODE, Tx Hash: $TX_HASH"
  SUBMITTED_TX_HASH+=("$TX_HASH")

  SUBMITTED=$(($SUBMITTED+1))
  ACCOUNT_SEQ=$(($ACCOUNT_SEQ+1))
done
