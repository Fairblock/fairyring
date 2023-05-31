#!/bin/bash


echo ""
echo "###########################################################"
echo "# Test Encrypted Tx Verification & Decryption & Execution #"
echo "#   Submit Valid & Invalid Aggregated Key to Pep Module   #"
echo "#    Submit Valid & Invalid Encrypted Tx to Pep Module    #"
echo "#        Test Pep Nonce Increment on Encrypted Tx         #"
echo "###########################################################"
echo ""


GENERATOR=ShareGenerator
ENCRYPTER=encrypter
BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAIN1_NODE=tcp://localhost:16657
CHAINID_2=fairyring_test_2
CHAIN2_NODE=tcp://localhost:26657


WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
WALLET_2=$($BINARY keys show wallet2 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_2)
VALIDATOR_2=$($BINARY keys show val2 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_2)


echo "Query new account pep nonce from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "0" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 0, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query aggregated key share from key share module for submitting to pep module on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE | jq -r '.block.header.height')
RESULT=$($BINARY query keyshare list-aggregated-key-share --node $CHAIN1_NODE -o json)
AGG_KEY_HEIGHT=$(echo "$RESULT" | jq -r '.aggregatedKeyShare[0].height')
AGG_KEY=$(echo "$RESULT" | jq -r '.aggregatedKeyShare[0].data')
if [ "$CURRENT_BLOCK" -ge "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Height of the aggregated key from key share module '$AGG_KEY_HEIGHT' is less than current block height '$CURRENT_BLOCK'"
  exit 1
fi


echo "Query master public key from key share module for submitting to pep module on chain fairyring_test_1"
PUB_KEY=$($BINARY query keyshare show-active-pub-key --node $CHAIN1_NODE -o json | jq -r '.activePubKey.publicKey')
if [ "$PUB_KEY" == "" ]; then
  echo "ERROR: Query master public key from key share module error, expecting an active public key, got '$PUB_KEY'"
  exit 1
fi


echo "Submit encrypted tx with invalid block height to pep module on chain fairyring_test_2"
CURRENT_BLOCK=$($BINARY query block --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 | jq -r '.block.header.height')
RESULT=$($BINARY tx pep submit-encrypted-tx 0000 $((CURRENT_BLOCK - 1)) --from $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode block --keyring-backend test -o json -y)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"Invalid target block height"* ]]; then
  echo "ERROR: Pep module submit encrypted tx with invalid block height error. Expected tx to failed with error invalid target block height, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query account pep nonce before submitting encrypted tx from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE_BEFORE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE_BEFORE" != "0" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 0, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query target account token balance before submitting encrypted tx from pep module on chain fairyring_test_2"
RESULT=$($BINARY query bank balances $WALLET_2 --node $CHAIN2_NODE -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL $TARGET_BAL_DENOM before encrypted bank send tx"


echo "Signing bank send tx with pep nonce: '$VALIDATOR_PEP_NONCE_BEFORE'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $VALIDATOR_2 $WALLET_2 1$TARGET_BAL_DENOM --from $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --keyring-backend test --generate-only -o json -y > unsigned.json
SIGNED_DATA=$($BINARY tx sign unsigned.json --from $VALIDATOR_2 --offline --account-number 0 --sequence $VALIDATOR_PEP_NONCE_BEFORE --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE  --keyring-backend test -y)


echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
CIPHER=$($ENCRYPTER $AGG_KEY_HEIGHT $PUB_KEY $SIGNED_DATA)


rm -r unsigned.json &> /dev/null


echo "Submit encrypted tx to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep submit-encrypted-tx $CIPHER $AGG_KEY_HEIGHT --from $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode block --keyring-backend test -o json -y)
EVENT_TYPE=$(echo "$RESULT" | jq -r '.logs[0].events[1].type')
TARGET_HEIGHT=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[1].value')
if [ "$EVENT_TYPE" != "new-encrypted-tx-submitted" ] && [ "$TARGET_HEIGHT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module submit encrypted tx error. Expected tx to submitted without error with target height '$AGG_KEY_HEIGHT', got '$TARGET_HEIGHT' and '$EVENT_TYPE' | '$CURRENT_BLOCK'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq '.')"
  exit 1
fi


echo "Query account pep nonce after submitting encrypted tx from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "0" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 0, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Submit valid aggregated key to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep create-aggregated-key-share $AGG_KEY_HEIGHT $AGG_KEY --from $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode block --keyring-backend test -o json -y)
ACTION=$(echo "$RESULT" | jq -r '.logs[0].events[0].attributes[0].value')
if [ "$ACTION" != "/fairyring.pep.MsgCreateAggregatedKeyShare" ]; then
  echo "ERROR: Pep module submit aggregated key error. Expected tx action to be MsgCreateAggregatedKeyShare,  got '$ACTION'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


sleep 2


echo "Query latest height from pep module on chain fairyring_test_2"
RESULT=$($BINARY q pep latest-height --node $CHAIN2_NODE -o json | jq -r '.height')
if [ "$RESULT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module query latest height error, Expected latest height to be same as aggregated key share height: '$AGG_KEY_HEIGHT', got '$RESULT'"
  exit 1
fi


echo "Query account pep nonce after encrypted tx being processed from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "1" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 1, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Query target account token balance after encrypted tx being executed from pep module on chain fairyring_test_2"
RESULT=$($BINARY query bank balances $WALLET_2 --node $CHAIN2_NODE -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"

echo "Submit invalid aggregated key to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep create-aggregated-key-share $((AGG_KEY_HEIGHT+1)) 123123123 --from $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode block --keyring-backend test -o json -y)
ACTION=$(echo "$RESULT" | jq -r '.logs[0].events[0].attributes[0].value')
if [ "$ACTION" != "/fairyring.pep.MsgCreateAggregatedKeyShare" ]; then
  echo "ERROR: Pep module submit aggregated key error. Expected tx action to be MsgCreateAggregatedKeyShare,  got '$ACTION'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

sleep 2 

echo "Query latest height from pep module on chain fairyring_test_2"
RESULT=$($BINARY q pep latest-height --node $CHAIN2_NODE -o json | jq -r '.height')
if [ "$RESULT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module query latest height error, Expected latest height to be same as aggregated key share height: '$AGG_KEY_HEIGHT', got '$RESULT'"
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
