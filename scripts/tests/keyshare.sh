#!/bin/bash


echo ""
echo "######################################################"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "######################################################"
echo ""


GENERATOR=ShareGenerator
BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2
BLOCK_TIME=5

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
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 -o json)
  echo "$RESULT"
}

echo "Staked account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --gas-prices 1frt --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[0].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Non staking account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $WALLET_1 --gas-prices 1frt --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"account is not staking"* ]]; then
  echo "ERROR: KeyShare module register validator error. Expected to get account is not staking error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi

GENERATED_RESULT=$($GENERATOR generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')
COMMITS=$(echo "$GENERATED_RESULT" | jq -r '.Commitments[0]')

echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY $COMMITS --from $VALIDATOR_1 --gas-prices 1frt --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[2].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Not trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY $COMMITS --from $WALLET_1 --gas-prices 1frt --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"address is not trusted"* ]]; then
  echo "ERROR: KeyShare module submit pub key from not trusted address error. Expected to get address is not trusted error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 0 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')


echo "Not registered account submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 0 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1frt --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"validator not registered"* ]]; then
  echo "ERROR: KeyShare module submit key share from not registered account error. Expected to get account not registered error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 0 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')


echo "Registered validator submit valid key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 0 $TARGET_HEIGHT --from $VALIDATOR_1 --gas-prices 1frt --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
RESULT_EVENT=$(echo "$RESULT" | jq -r '.logs[0].events[2].type')
if [ "$RESULT_EVENT" != "keyshare-aggregated" ]; then
  echo "ERROR: KeyShare module submit invalid key share from registered validator error. Expected the key to be aggregated, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

./scripts/tests/keyshareSender.sh $BINARY $CHAIN_DIR/$CHAINID_1 tcp://localhost:16657 $VALIDATOR_1 $CHAINID_1 $GENERATOR $GENERATED_SHARE > $CHAIN_DIR/keyshareSender.log 2>&1 &

echo "Query submitted key share on chain fairyring_test_1"
RESULT=$($BINARY query keyshare list-key-share --node tcp://localhost:16657 -o json)
RESULT_SENDER=$(echo "$RESULT" | jq -r '.keyShare[0].validator')
RESULT_KEYSHARE=$(echo "$RESULT" | jq -r '.keyShare[0].keyShare')
RESULT_HEIGHT=$(echo "$RESULT" | jq -r '.keyShare[0].blockHeight')
if [ "$RESULT_SENDER" != "$VALIDATOR_1" ] && [ "$RESULT_KEYSHARE" != "$EXTRACTED_SHARE" ] && [ "$RESULT_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module query submitted key share error, Expected to get the submitted key share, got '$RESULT'"
  exit 1
fi
echo "Key Share Successfully submitted: '$RESULT_KEYSHARE' for height '$RESULT_HEIGHT'"


echo "Query aggregated key share on chain fairyring_test_1"
RESULT=$($BINARY query keyshare list-aggregated-key-share --node tcp://localhost:16657 -o json)
RESULT_HEIGHT=$(echo "$RESULT" | jq -r '.aggregatedKeyShare[0].height')
RESULT_DATA=$(echo "$RESULT" | jq -r '.aggregatedKeyShare[0].data')
if [ "$RESULT_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module aggregate key share error. Expected to get an aggregated key, got '$RESULT'"
  exit 1
fi
echo "Key Share Successfully aggregated: '$RESULT_DATA'"


echo ""
echo "######################################################"
echo "#                SUCCESSFULLY TESTED                 #"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "######################################################"
echo ""
