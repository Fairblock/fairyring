#!/bin/bash


echo ""
echo "######################################################"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#       Submit KeyShare from Authorized address      #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "#                 Authorize address                  #"
echo "######################################################"
echo ""


GENERATOR=ShareGenerator
BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
BLOCK_TIME=5

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
WALLET_3=$($BINARY keys show wallet3 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
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
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[0].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Non staking account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"account is not staking"* ]]; then
  echo "ERROR: KeyShare module register validator error. Expected to get account is not staking error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi

echo "Non validator account authorizing another address to submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-authorized-address $VALIDATOR_1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"only validator can authorize address to submit key share"* ]]; then
  echo "ERROR: KeyShare module authorize address error. Expected to get account is not validator error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


GENERATED_RESULT=$($GENERATOR generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')
COMMITS=$(echo "$GENERATED_RESULT" | jq -r '.Commitments[0]')

echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY $COMMITS --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[2].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Not trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY $COMMITS --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
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
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"sender is not validator / authorized address to submit key share"* ]]; then
  echo "ERROR: KeyShare module submit key share from not registered account error. Expected to get account not validator / authorized address error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


echo "Registered validator authorize another address to submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-authorized-address $WALLET_1 --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
EVENT_ATR=$(echo "$RESULT" | jq -r '.logs[0].events[0].attributes[0].value')
if [ "$EVENT_ATR" != "/fairyring.keyshare.MsgCreateAuthorizedAddress" ]; then
  echo "ERROR: KeyShare module registered validator authorize address error. Expected the account to be authorized successfully, got '$EVENT_ATR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')


echo "Authorized account submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
KEYSHARE_HEIGHT=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[1].value')
if [ "$KEYSHARE_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the key received at height $TARGET_HEIGHT, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Registered validator remove authorized address that does not exists on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare delete-authorized-address $WALLET_3 --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"target authorized address not found"* ]]; then
  echo "ERROR: KeyShare module registered validator remove authorized address error. Expected target authorized address not found, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Registered validator remove authorized address to submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare delete-authorized-address $WALLET_1 --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
EVENT_ATR=$(echo "$RESULT" | jq -r '.logs[0].events[0].attributes[0].value')
if [ "$EVENT_ATR" != "/fairyring.keyshare.MsgDeleteAuthorizedAddress" ]; then
  echo "ERROR: KeyShare module registered validator remove authorized address error. Expected the account to be removed successfully, got '$EVENT_ATR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')


echo "Removed Authorized account tries submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"sender is not validator / authorized address to submit key share"* ]]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the key received at height $TARGET_HEIGHT, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')


echo "Registered validator submit VALID key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
RESULT_EVENT=$(echo "$RESULT" | jq -r '.logs[0].events[2].type')
if [ "$RESULT_EVENT" != "keyshare-aggregated" ]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the key to be aggregated, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')

echo "Registered validator submit valid key share but with current block height on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $CURRENT_BLOCK --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"key share height is lower than the current block height"* ]]; then
  echo "ERROR: KeyShare module submit valid key share but with current block height from registered validator error. Expected to get a key share height is lower than the current block height error, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo "$RESULT"
  exit 1
fi

CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
NEW_TARGET_HEIGHT=$((CURRENT_BLOCK+3))

echo "Registered validator submit valid key share with target block + 2 on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $NEW_TARGET_HEIGHT --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"key share height is higher than the current block height"* ]]; then
  echo "ERROR: KeyShare module submit valid key share with target block height + 2 from registered validator error. Expected to get a key share height is higher than the current block height error, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo "$RESULT"
  exit 1
fi

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

echo "Testing idle validator slashing logic"
STAKED=$(fairyringd q staking validators -o json --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657  | jq -r '.validators[0].tokens')
echo "Validator staked amount before testing slash idle validator: $STAKED"

sleep 60

NEW_STAKED=$(fairyringd q staking validators -o json --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657  | jq -r '.validators[0].tokens')
echo "Validator staked amount after being slashed because of idling: $NEW_STAKED"
if [ "$NEW_STAKED" -ge "$STAKED" ]; then
  echo "ERROR: KeyShare module didn't slash idle validator"
  exit 1
fi

./scripts/tests/keyshareSender.sh $BINARY $CHAIN_DIR/$CHAINID_1 tcp://localhost:16657 $VALIDATOR_1 $CHAINID_1 $GENERATOR $GENERATED_SHARE > $CHAIN_DIR/keyshareSender.log 2>&1 &

echo ""
echo "######################################################"
echo "#                SUCCESSFULLY TESTED                 #"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "######################################################"
echo ""
