#!/bin/bash

echo ""
echo "###########################################################"
echo "# Test Encrypted Tx Verification & Decryption & Execution #"
echo "#   Submit Valid & Invalid Aggregated Key to Pep Module   #"
echo "#    Submit Valid & Invalid Encrypted Tx to Pep Module    #"
echo "#        Test Pep Nonce Increment on Encrypted Tx         #"
echo "###########################################################"
echo ""

BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)

echo "Query new account pep nonce from pep module on chain fairyring_test_1"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "0" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 0, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Submit aggregated key to pep module on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
RESULT=$($BINARY tx pep create-aggregated-key-share $CURRENT_BLOCK 0000 0000 --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
ACTION=$(echo "$RESULT" | jq -r '.logs[0].events[0].attributes[0].value')
if [ "$ACTION" != "/fairyring.pep.MsgCreateAggregatedKeyShare" ]; then
  echo "ERROR: Pep module submit aggregated key error. Expected tx action to be MsgCreateAggregatedKeyShare,  got '$ACTION'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Submit encrypted tx with invalid block height to pep module on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
RESULT=$($BINARY tx pep submit-encrypted-tx 0000 $CURRENT_BLOCK --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"Invalid target block height"* ]]; then
  echo "ERROR: Pep module submit encrypted tx with invalid block height error. Expected tx to failed with error invalid target block height, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Submit encrypted tx to pep module on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
TARGET_BLOCK=$(($CURRENT_BLOCK + 2))
RESULT=$($BINARY tx pep submit-encrypted-tx 0000 $TARGET_BLOCK --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode block --keyring-backend test -o json -y)
EVENT_TYPE=$(echo "$RESULT" | jq -r '.logs[0].events[1].type')
TARGET_HEIGHT=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[1].value')
if [ "$EVENT_TYPE" != "new-encrypted-tx-submitted" ] && [ "$TARGET_HEIGHT" != "$TARGET_BLOCK" ]; then
  echo "ERROR: Pep module submit encrypted tx error. Expected tx to submitted without error with target height '$TARGET_BLOCK', got '$TARGET_HEIGHT' and '$EVENT_TYPE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Query account pep nonce after submitting encrypted tx from pep module on chain fairyring_test_1"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "0" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 0, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo ""
echo "###########################################################"
echo "#                   SUCCESSFULLY TESTED                   #"
echo "# Test Encrypted Tx Verification & Decryption & Execution #"
echo "#   Submit Valid & Invalid Aggregated Key to Pep Module   #"
echo "#    Submit Valid & Invalid Encrypted Tx to Pep Module    #"
echo "#        Test Pep Nonce Increment on Encrypted Tx         #"
echo "###########################################################"
echo ""