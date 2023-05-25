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

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)

echo "Staked account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[0].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Non staking account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $WALLET_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"account is not staking"* ]]; then
  echo "ERROR: KeyShare module register validator error. Expected to get account is not staking error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


echo "Registered validator submit invalid key share on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
RESULT=$($BINARY tx keyshare send-keyshare 0000 0000 0 $(($CURRENT_BLOCK + 2)) --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
BURN_EVENT=$(echo "$RESULT" | jq -r '.logs[0].events[0].type')
if [ "$BURN_EVENT" != "burn" ]; then
  echo "ERROR: KeyShare module submit invalid key share from registered validator error. Expected the account to be slashed, got '$BURN_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Not registered account submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare 0000 0000 0 $(($CURRENT_BLOCK + 4)) --from $WALLET_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"validator not registered"* ]]; then
  echo "ERROR: KeyShare module submit key share from not registered account error. Expected to get account not registered error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi

GENERATED_RESULT=$($GENERATOR generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')

echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[2].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Not trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY --from $WALLET_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"address is not trusted"* ]]; then
  echo "ERROR: KeyShare module submit pub key from not trusted address error. Expected to get address is not trusted error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


echo "Registered validator submit valid key share on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_HEIGHT=$(($CURRENT_BLOCK + 60))
EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 0 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')
EXTRACTED_COMMITMENT=$(echo "$EXTRACTED_RESULT" | jq -r '.Commitment')
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE $EXTRACTED_COMMITMENT 0 $TARGET_HEIGHT --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
RESULT_EVENT=$(echo "$RESULT" | jq -r '.logs[0].events[0].type')
if [ "$RESULT_EVENT" != "keyshare-aggregated" ]; then
  echo "ERROR: KeyShare module submit invalid key share from registered validator error. Expected the key to be aggregated, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
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


echo ""
echo "######################################################"
echo "#                SUCCESSFULLY TESTED                 #"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "######################################################"
echo ""
