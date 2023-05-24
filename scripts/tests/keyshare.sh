#!/bin/bash

echo ""
echo "######################################################"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "######################################################"
echo ""

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

echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key 0000 --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[2].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Not trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key 0000 --from $WALLET_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"address is not trusted"* ]]; then
  echo "ERROR: KeyShare module submit pub key from not trusted address error. Expected to get address is not trusted error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi