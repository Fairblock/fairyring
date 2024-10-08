#!/bin/bash


echo ""
echo "###########################################################"
echo "# Test Encrypted Tx Verification & Decryption & Execution #"
echo "#   Submit Valid & Invalid Aggregated Key to Pep Module   #"
echo "#    Submit Valid & Invalid Encrypted Tx to Pep Module    #"
echo "#        Test Pep Nonce Increment on Encrypted Tx         #"
echo "#        Gas Deduction for encrypted tx execution         #"
echo "#               Test General Encrypted Txs                #"
echo "###########################################################"
echo ""


BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAIN1_NODE=tcp://localhost:16657
CHAINID_2=fairyring_test_2
CHAIN2_NODE=tcp://localhost:26657
BLOCK_TIME=5

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
WALLET_2=$($BINARY keys show wallet2 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_2)
VALIDATOR_2=$($BINARY keys show val2 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_2)

GENERATED_SHARE=$1

check_tx_code () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != "0" ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    exit 1
  fi
}

check_tx_err () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" -eq 0 ]; then
    return 0
  else
    return 1
  fi
}

wait_for_tx () {
  sleep $BLOCK_TIME
  sleep $BLOCK_TIME
  local TXHASH=$(echo "$1" | jq -r '.txhash')
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
  echo "$RESULT"
}

echo "Query new account pep nonce from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "1" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 1, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query master public key from key share module for submitting to pep module on chain fairyring_test_1"
PUB_KEY=$($BINARY query keyshare show-active-pub-key --node $CHAIN1_NODE -o json | jq -r '.activePubKey.publicKey')
if [ "$PUB_KEY" == "" ]; then
  echo "ERROR: Query master public key from key share module error, expecting an active public key, got '$PUB_KEY'"
  exit 1
fi


echo "Query master public key expiry height from key share module for submitting to pep module on chain fairyring_test_1"
PUB_KEY_EXPIRY=$($BINARY query keyshare show-active-pub-key --node $CHAIN1_NODE -o json | jq -r '.activePubKey.expiry')
if [ "$PUB_KEY_EXPIRY" == "" ]; then
  echo "ERROR: Query master public key expiry height from key share module error, expecting an active public key, got '$PUB_KEY'"
  exit 1
fi

echo "Pub Key expires at: $PUB_KEY_EXPIRY"

echo "Submit encrypted tx with invalid block height to pep module on chain fairyring_test_2"
CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.block.header.height')
RESULT=$($BINARY tx pep submit-encrypted-tx 0000 $((CURRENT_BLOCK - 1)) --from $VALIDATOR_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"Invalid target block height"* ]]; then
  echo "ERROR: Pep module submit encrypted tx with invalid block height error. Expected tx to failed with error invalid target block height, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Submit encrypted tx with block height much higher than queued public key to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep submit-encrypted-tx 0000 500000 --from $VALIDATOR_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"Invalid target block height"* ]]; then
  echo "ERROR: Pep module submit encrypted tx with invalid block height error. Expected tx to failed with error invalid target block height, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Submit encrypted tx with block height 1 block higher than the pub key expiry height to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep submit-encrypted-tx 0000 $((PUB_KEY_EXPIRY + 1)) --from $VALIDATOR_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"Invalid target block height"* ]]; then
  echo "ERROR: Pep module submit encrypted tx with invalid block height error. Expected tx to failed with error invalid target block height, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query account pep nonce before submitting encrypted tx from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE_BEFORE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE_BEFORE" != "1" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 1, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query target account token balance before submitting encrypted tx from pep module on chain fairyring_test_2"
RESULT=$($BINARY query bank balances $WALLET_2 --node $CHAIN2_NODE -o json)
echo $RESULT
echo $TARGET_BAL_DENOM
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL $TARGET_BAL_DENOM before encrypted bank send tx"


echo "Signing bank send tx with pep nonce: '$VALIDATOR_PEP_NONCE_BEFORE'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $VALIDATOR_2 $WALLET_2 1$TARGET_BAL_DENOM --from $VALIDATOR_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --keyring-backend test --generate-only -o json -y > unsigned.json
SIGNED_DATA=$($BINARY tx sign unsigned.json --from $VALIDATOR_2 --offline --account-number 0 --sequence $VALIDATOR_PEP_NONCE_BEFORE --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE  --keyring-backend test -y)


PEP_NONCE_2ND=$(($VALIDATOR_PEP_NONCE_BEFORE+1))
echo "Signing second bank send tx with pep nonce: '$PEP_NONCE_2ND' without gas fee"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $VALIDATOR_2 $WALLET_2 1$TARGET_BAL_DENOM --from $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --keyring-backend test --generate-only -o json -y > unsigned2.json
SIGNED_DATA_2=$($BINARY tx sign unsigned2.json --from $VALIDATOR_2 --offline --account-number 0 --sequence $PEP_NONCE_2ND --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE  --keyring-backend test -y)


echo "Query aggregated key share from key share module for submitting to pep module on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE -o json | jq -r '.block.header.height')
RESULT=$($BINARY query keyshare list-aggregated-key-share --node $CHAIN1_NODE -o json)
AGG_KEY_HEIGHT=$(echo "$RESULT" | jq -r '.aggregatedKeyShare | last | .height')
AGG_KEY=$(echo "$RESULT" | jq -r '.aggregatedKeyShare | last | .data')
if [ "$CURRENT_BLOCK" -gt "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Height of the aggregated key from key share module '$AGG_KEY_HEIGHT' is less than current block height '$CURRENT_BLOCK'"
  exit 1
fi

CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_2 --node $CHAIN2_NODE -o json | jq -r '.block.header.height')
echo "Chain 2 Current Block: $CURRENT_BLOCK"
echo "Submit valid aggregated key to pep module on chain fairyring_test_2 from address: $VALIDATOR_2"
RESULT=$($BINARY tx pep create-aggregated-key-share $AGG_KEY_HEIGHT $AGG_KEY --from $VALIDATOR_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ACTION=$(echo "$RESULT" | jq -r | jq '.events' | jq 'map(select(any(.type; contains("message"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("action"))))[]' | jq -r '.value')
if [ "$ACTION" != "/fairyring.pep.MsgCreateAggregatedKeyShare" ]; then
  echo "ERROR: Pep module submit aggregated key error. Expected tx action to be MsgCreateAggregatedKeyShare,  got '$ACTION'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query aggregated key share from key share module for submitting to pep module on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE -o json | jq -r '.block.header.height')
RESULT=$($BINARY query keyshare list-aggregated-key-share --node $CHAIN1_NODE -o json)
AGG_KEY_HEIGHT=$(echo "$RESULT" | jq -r '.aggregatedKeyShare | last | .height')
AGG_KEY=$(echo "$RESULT" | jq -r '.aggregatedKeyShare | last | .data')
if [ "$CURRENT_BLOCK" -gt "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Height of the aggregated key from key share module '$AGG_KEY_HEIGHT' is less than current block height '$CURRENT_BLOCK'"
  exit 1
fi


echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
CIPHER=$($BINARY encrypt $AGG_KEY_HEIGHT "" $SIGNED_DATA --node $CHAIN1_NODE)

echo "Encrypting 2nd signed tx with Pub key: '$PUB_KEY'"
CIPHER_2=$($BINARY encrypt $AGG_KEY_HEIGHT "" $SIGNED_DATA_2 --node $CHAIN1_NODE)


rm -r unsigned.json &> /dev/null
rm -r unsigned2.json &> /dev/null


RESULT=$($BINARY query bank balances $VALIDATOR_2 --node $CHAIN2_NODE -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance before submitting encrypted tx: $BAL_AMT$BAL_DENOM"


echo "Submit encrypted tx to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep submit-encrypted-tx $CIPHER $AGG_KEY_HEIGHT --from $VALIDATOR_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
TARGET_HEIGHT=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("new-encrypted-tx-submitted"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("height"))))[]' | jq -r '.value')
if [ "$TARGET_HEIGHT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module submit encrypted tx error. Expected tx to submitted without error with target height '$AGG_KEY_HEIGHT', got '$TARGET_HEIGHT' and '$EVENT_TYPE' | '$CURRENT_BLOCK'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq '.')"
  echo $RESULT | jq
  exit 1
fi


RESULT=$($BINARY query bank balances $VALIDATOR_2 --node $CHAIN2_NODE -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance after submitting first encrypted tx: $BAL_AMT$BAL_DENOM"


echo "Submit 2nd encrypted tx (without gas fee) to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep submit-encrypted-tx $CIPHER_2 $AGG_KEY_HEIGHT --from $VALIDATOR_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
TARGET_HEIGHT=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("new-encrypted-tx-submitted"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("height"))))[]' | jq -r '.value')
if [ "$TARGET_HEIGHT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module submit 2nd encrypted tx error. Expected tx to submitted without error with target height '$AGG_KEY_HEIGHT', got '$TARGET_HEIGHT' and '$EVENT_TYPE' | '$CURRENT_BLOCK'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq '.')"
  echo $RESULT | jq
  exit 1
fi


RESULT=$($BINARY query bank balances $VALIDATOR_2 --node $CHAIN2_NODE -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance after submitting second encrypted tx: $BAL_AMT$BAL_DENOM"


echo "Query account pep nonce after submitting encrypted tx from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "1" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 1, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_2 --node $CHAIN2_NODE -o json | jq -r '.block.header.height')
echo "Chain 2 Current Block: $CURRENT_BLOCK"
echo "Submit valid aggregated key to pep module on chain fairyring_test_2 from address: $VALIDATOR_2"
RESULT=$($BINARY tx pep create-aggregated-key-share $AGG_KEY_HEIGHT $AGG_KEY --from $VALIDATOR_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ACTION=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("message"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("action"))))[]' | jq -r '.value')
if [ "$ACTION" != "/fairyring.pep.MsgCreateAggregatedKeyShare" ]; then
  echo "ERROR: Pep module submit aggregated key error. Expected tx action to be MsgCreateAggregatedKeyShare,  got '$ACTION'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo $RESULT | jq
  exit 1
fi


sleep $BLOCK_TIME


echo "Query latest height from pep module on chain fairyring_test_2"
RESULT=$($BINARY q pep latest-height --node $CHAIN2_NODE -o json | jq -r '.height')
if [ "$RESULT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module query latest height error, Expected latest height to be same as aggregated key share height: '$AGG_KEY_HEIGHT', got '$RESULT'"
  exit 1
fi


echo "Query account pep nonce after encrypted tx being processed from pep module on chain fairyring_test_2"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
VALIDATOR_PEP_NONCE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE" != "3" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 3, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query target account token balance after encrypted tx being executed from pep module on chain fairyring_test_2"
RESULT=$($BINARY query bank balances $WALLET_2 --node $CHAIN2_NODE -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"
if [ "$TARGET_BAL_AFTER" == "$TARGET_BAL" ]; then
  echo "ERROR: Pep module encrypted tx execution error. Expected Target Balance to be updated, got same balance: '$TARGET_BAL_AFTER $TARGET_BAL_DENOM'"
  exit 1
fi

RESULT=$($BINARY query bank balances $VALIDATOR_2 --node $CHAIN2_NODE -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance after encrypted tx execution: $BAL_AMT$BAL_DENOM"

echo "Submit invalid aggregated key to pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep create-aggregated-key-share $((AGG_KEY_HEIGHT+1)) 123123123 --from $VALIDATOR_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
if [[ "$RESULT" != *"input string length must be equal to 96 bytes"* ]]; then
  echo "ERROR: Pep module submit aggregated key error. Expected tx action to be MsgCreateAggregatedKeyShare,  got '$ACTION'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

sleep $BLOCK_TIME

echo "Query latest height from pep module on chain fairyring_test_2"
RESULT=$($BINARY q pep latest-height --node $CHAIN2_NODE -o json | jq -r '.height')
if [ "$RESULT" != "$AGG_KEY_HEIGHT" ]; then
  echo "ERROR: Pep module query latest height error, Expected latest height to be same as aggregated key share height: '$AGG_KEY_HEIGHT', got '$RESULT'"
  exit 1
fi

FIRST_ENCRYPTED_TX_HEIGHT=$($BINARY query pep list-encrypted-tx --node $CHAIN2_NODE -o json | jq -r '.encryptedTxArray[0].encryptedTx[0].processedAtChainHeight')
SECOND_ENCRYPTED_TX_HEIGHT=$($BINARY query pep list-encrypted-tx --node $CHAIN2_NODE -o json | jq -r '.encryptedTxArray[0].encryptedTx[1].processedAtChainHeight')

echo "First Encrypted tx processed at height: $FIRST_ENCRYPTED_TX_HEIGHT, 2nd one processed at: $SECOND_ENCRYPTED_TX_HEIGHT"

FIRST_EVENT=$($BINARY q block-results $FIRST_ENCRYPTED_TX_HEIGHT -o json | jq '.finalize_block_events[] | select(.type == "reverted-encrypted-tx") | .attributes[] | select(.key == "reason") | .value')
if [[ "$FIRST_EVENT" != *"insufficient fees"* ]]; then
  echo "ERROR: Pep module expected first encrypted tx failed with reason insufficient fee, got: $FIRST_EVENT instead"
  exit 1
fi
echo "First Encrypted TX Failed with Reason: $FIRST_EVENT as expected."

SECOND_EVENT=$($BINARY q block-results $SECOND_ENCRYPTED_TX_HEIGHT -o json | jq '.finalize_block_events[] | select(.type == "executed-encrypted-tx") | .attributes[] | select(.key == "events") | .value')
if [[ "$SECOND_EVENT" != *"coin_received"* ]]; then
  echo "ERROR: Pep module expected second encrypted tx succeeded with events, got: $SECOND_EVENT instead"
  exit 1
fi
echo "Second Encrypted TX succeeded with Events: $(echo $SECOND_EVENT | jq) as expected."

echo "#############################################"
echo "Testing general keyshare on source chain"
echo "#############################################"

echo "Creating new General Enc Request in pep module on chain fairyring_test_1"
RESULT=$($BINARY tx pep request-general-keyshare 30s testing123 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 10

echo "Query general keyshare request on chain fairyring_test_1"
LIST_KEYSHARE_REQ=$($BINARY query pep list-keyshare-req --node $CHAIN1_NODE -o json)
IDENTITY=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].identity')
REQ_ID=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].request_id')
echo "Identity for keyshare request 1 is: $IDENTITY"

echo "Query account pep nonce before submitting encrypted tx from pep module on chain fairyring_test_1"
RESULT=$($BINARY query pep show-pep-nonce $WALLET_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE -o json)
PEP_NONCE_BEFORE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')

echo "Query target account token balance before submitting encrypted tx from pep module on chain fairyring_test_1"
RESULT=$($BINARY query bank balances $VALIDATOR_1 --node $CHAIN1_NODE -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL $TARGET_BAL_DENOM before encrypted bank send tx"


echo "Signing bank send tx with pep nonce: '$PEP_NONCE_BEFORE'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $WALLET_1 $VALIDATOR_1 1$TARGET_BAL_DENOM --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --keyring-backend test --generate-only -o json -y > unsigned.json
SIGNED_DATA=$($BINARY tx sign unsigned.json --from $WALLET_1 --offline --account-number 1 --sequence $PEP_NONCE_BEFORE --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE  --keyring-backend test -y)

PEP_NONCE_2ND=$(($PEP_NONCE_BEFORE+1))
echo "Signing second bank send tx with pep nonce: '$PEP_NONCE_2ND'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $WALLET_1 $VALIDATOR_1 1$TARGET_BAL_DENOM --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --keyring-backend test --generate-only -o json -y > unsigned2.json
SIGNED_DATA_2=$($BINARY tx sign unsigned2.json --from $WALLET_1 --offline --account-number 1 --sequence $PEP_NONCE_2ND --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE  --keyring-backend test -y)

echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
CIPHER=$($BINARY encrypt $IDENTITY "" $SIGNED_DATA --node $CHAIN1_NODE)
CIPHER2=$($BINARY encrypt $IDENTITY "" $SIGNED_DATA_2 --node $CHAIN1_NODE)

rm -r unsigned.json &> /dev/null
rm -r unsigned2.json &> /dev/null

sleep 10

echo "Submit general encrypted tx to pep module on chain fairyring_test_1"
RESULT=$($BINARY tx pep submit-general-encrypted-tx $CIPHER $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

echo "Query Keyshare request and check for encrypted tx"
TX=$($BINARY query pep show-keyshare-req $REQ_ID --node $CHAIN1_NODE -o json | jq -r '.keyshare.tx_list.encryptedTx[0].data')
if [ "$TX" != "$CIPHER" ]; then
  echo "Submitting general encrypted tx failed. Expected: $CIPHER, got $TX"
  exit 1
fi

echo "Submit 2nd general encrypted tx to pep module on chain fairyring_test_1"
RESULT=$($BINARY tx pep submit-general-encrypted-tx $CIPHER2 $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

echo "Request Generation of Aggr keyshare"
RESULT=$($BINARY tx pep get-general-keyshare $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $IDENTITY)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

while true; do
  echo "Submitting General Key Share"
  
  RESULT=$($BINARY tx keyshare create-general-key-share "private-gov-identity" $IDENTITY $EXTRACTED_SHARE 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 15

echo "Query target account token balance after general encrypted tx being executed from pep module on chain fairyring_test_1"
RESULT=$($BINARY query bank balances $VALIDATOR_1 --node $CHAIN1_NODE -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"
if [ "$TARGET_BAL_AFTER" == "$TARGET_BAL" ]; then
  echo "ERROR: Pep module encrypted tx execution error. Expected Target Balance to be updated, got same balance: '$TARGET_BAL_AFTER $TARGET_BAL_DENOM'"
  exit 1
fi


echo "#############################################"
echo "Testing general keyshare on destination chain"
echo "#############################################"

echo "Creating new General Enc Request in pep module on chain $CHAINID_2"
RESULT=$($BINARY tx pep request-general-keyshare 30s testing12345 --from $WALLET_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

while true; do
  echo "Query general keyshare request on chain $CHAINID_2"
  LIST_KEYSHARE_REQ=$($BINARY query pep list-keyshare-req --node $CHAIN2_NODE -o json)
  echo $LIST_KEYSHARE_REQ | jq
  IDENTITY=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].identity')
  REQ_ID=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].request_id')
  echo "Identity for keyshare request 1 is: $IDENTITY"
  echo "Request ID for keyshare request 1 is: $REQ_ID"
  if [[ "$IDENTITY" != "null" ]]; then
    echo "Found Identity & Request ID"
    break
  fi
  sleep 10
done

echo "Query account pep nonce before submitting encrypted tx from pep module on chain $CHAINID_2"
RESULT=$($BINARY query pep show-pep-nonce $WALLET_2 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE -o json)
PEP_NONCE_BEFORE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')

echo "Query target account token balance before submitting encrypted tx from pep module on chain $CHAINID_2"
RESULT=$($BINARY query bank balances $VALIDATOR_2 --node $CHAIN2_NODE -o json)
echo $RESULT
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
echo $TARGET_BAL_DENOM
TARGET_BAL=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL $TARGET_BAL_DENOM before encrypted bank send tx"


echo "Signing bank send tx with pep nonce: '$PEP_NONCE_BEFORE'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $WALLET_2 $VALIDATOR_2 5$TARGET_BAL_DENOM --from $WALLET_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --keyring-backend test --generate-only -o json -y > unsigned.json
SIGNED_DATA=$($BINARY tx sign unsigned.json --from $WALLET_2 --offline --account-number 1 --sequence $PEP_NONCE_BEFORE --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE  --keyring-backend test -y)

PEP_NONCE_2ND=$(($PEP_NONCE_BEFORE+1))
echo "Signing second bank send tx with pep nonce: '$PEP_NONCE_2ND'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $WALLET_2 $VALIDATOR_2 5$TARGET_BAL_DENOM --from $WALLET_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --keyring-backend test --generate-only -o json -y > unsigned2.json
SIGNED_DATA_2=$($BINARY tx sign unsigned2.json --from $WALLET_2 --offline --account-number 1 --sequence $PEP_NONCE_2ND --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE  --keyring-backend test -y)

echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
echo $IDENTITY $SIGNED_DATA
echo $IDENTITY $SIGNED_DATA_2
CIPHER=$($BINARY encrypt "$IDENTITY" "" "$SIGNED_DATA" --node $CHAIN2_NODE)
CIPHER2=$($BINARY encrypt "$IDENTITY"  "" "$SIGNED_DATA_2" --node $CHAIN2_NODE)

rm -r unsigned.json &> /dev/null
rm -r unsigned2.json &> /dev/null

sleep 10

echo "Submit general encrypted tx to pep module on chain $CHAINID_2"
RESULT=$($BINARY tx pep submit-general-encrypted-tx $CIPHER $REQ_ID --from $WALLET_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

echo "Query Keyshare request and check for encrypted tx"
TX=$($BINARY query pep show-keyshare-req $REQ_ID --node $CHAIN2_NODE -o json | jq -r '.keyshare.tx_list.encryptedTx[0].data')
if [ "$TX" != "$CIPHER" ]; then
  echo "Submitting general encrypted tx failed. Expected: $CIPHER, got $TX"
  exit 1
fi

echo "Submit 2nd general encrypted tx to pep module on chain $CHAINID_2"
RESULT=$($BINARY tx pep submit-general-encrypted-tx $CIPHER2 $REQ_ID --from $WALLET_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

echo "Request Generation of Aggr keyshare"
RESULT=$($BINARY tx pep get-general-keyshare $REQ_ID --from $WALLET_2 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $IDENTITY)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

while true; do
  echo "Submitting General Key Share"

  RESULT=$($BINARY tx keyshare create-general-key-share "private-gov-identity" $IDENTITY $EXTRACTED_SHARE 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 30

echo "Query target account token balance after general encrypted tx being executed from pep module on chain $CHAINID_2"
RESULT=$($BINARY query bank balances $VALIDATOR_2 --node $CHAIN2_NODE -o json)
echo $RESULT
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
echo $TARGET_BAL_DENOM
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"
if [ "$TARGET_BAL_AFTER" == "$TARGET_BAL" ]; then
  echo "ERROR: Pep module encrypted tx execution error. Expected Target Balance to be updated, got same balance: '$TARGET_BAL_AFTER $TARGET_BAL_DENOM'"
  exit 1
fi

echo "#############################################"
echo "Testing private keyshare on source chain"
echo "#############################################"

# RSA_KEY=$(cat ./scripts/public_key.pem)
SCEP_PUBKEY1="A/MdHVpitzHNSdD1Zw3kY+L5PEIPyd9l6sD5i4aIfXp9"
SCEP_PUBKEY2="Ak9iJuH5l5/XdmS6U+ojbutXnGzBnQf++HVOfKanVEc+"

SCEP_PRIV_KEY1="a267fb03b3e6dc381550ea0257ace31433698f16248ba111dfb75550364d31fe"
SCEP_PRIV_KEY2="ef1450bdc18396f2254f52d8c525c0d933a8f146ec2a681eaf319f5899f2f60d"

# echo "$SCEP_PUBKEY"

echo "Creating new Private Request in pep module on chain fairyring_test_1"
RESULT=$($BINARY tx pep request-private-keyshare test_req_1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 10

echo "Query private keyshare request on chain fairyring_test_1"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $WALLET_1/test_req_1 --node $CHAIN1_NODE -o json)
echo $SHOW_PRIVATE_REQ
REQ_ID=$(echo $SHOW_PRIVATE_REQ | jq -r '.req_id')
echo "Identity for private keyshare request 1 is: $REQ_ID"

sleep 10

echo "Requesting for private keyshares on Source chain"
RESULT=$($BINARY tx pep get-private-keyshare $REQ_ID $SCEP_PUBKEY1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 10

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

ENC_KS=$($BINARY secp-encrypter -p "$SCEP_PUBKEY1" -k "$EXTRACTED_SHARE")

# echo $ENC_KS

while true; do
  echo "Submitting Private Key Share"

  RESULT=$($BINARY tx keyshare submit-encrypted-keyshare $REQ_ID $WALLET_1 $ENC_KS 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 10

echo "Query private keyshare request on chain fairyring_test_1"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $WALLET_1/test_req_1 --node $CHAIN1_NODE -o json)
ENC_KEYSHARES=$(echo "$SHOW_PRIVATE_REQ" | jq -r '.encrypted_keyshares')

if [ "$ENC_KEYSHARES" = "[]" ]; then
  echo "encrypted_keyshares is empty."
  exit 1
fi

echo $SHOW_PRIVATE_REQ

echo "Sending get private keyshare request without previous entry"
REQ_ID="test_req_dummy_1"
RESULT=$($BINARY tx pep get-private-keyshare $REQ_ID $SCEP_PUBKEY1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 10

echo "Query private keyshare request on chain fairyring_test_1"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node $CHAIN1_NODE -o json)
echo $SHOW_PRIVATE_REQ

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

ENC_KS=$($BINARY secp-encrypter -p "$SCEP_PUBKEY1" -k "$EXTRACTED_SHARE")

# echo $ENC_KS

while true; do
  echo "Submitting Private Key Share"

  RESULT=$($BINARY tx keyshare submit-encrypted-keyshare $REQ_ID $WALLET_1 $ENC_KS 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 10

echo "Query private keyshare request on chain fairyring_test_1"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node $CHAIN1_NODE -o json)
ENC_KEYSHARES=$(echo "$SHOW_PRIVATE_REQ" | jq -r '.encrypted_keyshares')

if [ "$ENC_KEYSHARES" = "[]" ]; then
  echo "encrypted_keyshares is empty."
  exit 1
fi

echo $SHOW_PRIVATE_REQ

echo "#############################################"
echo "Testing private keyshare on destination chain"
echo "#############################################"

echo "Creating new Private Request in pep module on chain fairyring_test_2"
RESULT=$($BINARY tx pep request-private-keyshare test_req_2 --from $WALLET_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 20

echo "Query private keyshare request on chain fairyring_test_2"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $WALLET_2/test_req_2 --node $CHAIN2_NODE -o json)
echo $SHOW_PRIVATE_REQ
REQ_ID=$(echo $SHOW_PRIVATE_REQ | jq -r '.req_id')
echo "Identity for private keyshare request 2 is: $REQ_ID"

echo "Requesting for private keyshares on destination chain"
RESULT=$($BINARY tx pep get-private-keyshare $REQ_ID $SCEP_PUBKEY2 --from $WALLET_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 20

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

ENC_KS=$($BINARY secp-encrypter -p "$SCEP_PUBKEY2" -k "$EXTRACTED_SHARE")
# echo $ENC_KS

while true; do
  echo "Submitting Private Key Share"

  RESULT=$($BINARY tx keyshare submit-encrypted-keyshare $REQ_ID $WALLET_1 $ENC_KS 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 20

echo "Query private keyshare request on chain fairyring_test_2"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node $CHAIN2_NODE -o json)
ENC_KEYSHARES=$(echo "$SHOW_PRIVATE_REQ" | jq -r '.encrypted_keyshares')

if [ "$ENC_KEYSHARES" = "[]" ]; then
  echo "encrypted_keyshares is empty."
  exit 1
fi

echo $SHOW_PRIVATE_REQ

echo "Sending get private keyshare request without previous entry"
REQ_ID="test_req_dummy_2"
RESULT=$($BINARY tx pep get-private-keyshare $REQ_ID $SCEP_PUBKEY2 --from $WALLET_2 --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID_2 --chain-id $CHAINID_2 --node $CHAIN2_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 10

echo "Query private keyshare request on chain fairyring_test_2"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node $CHAIN2_NODE -o json)
echo $SHOW_PRIVATE_REQ

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

ENC_KS=$($BINARY secp-encrypter -p "$SCEP_PUBKEY2" -k "$EXTRACTED_SHARE")
# echo $ENC_KS

while true; do
  echo "Submitting Private Key Share"

  RESULT=$($BINARY tx keyshare submit-encrypted-keyshare $REQ_ID $WALLET_1 $ENC_KS 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 20

echo "Query private keyshare request on chain fairyring_test_2"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node $CHAIN2_NODE -o json)
ENC_KEYSHARES=$(echo "$SHOW_PRIVATE_REQ" | jq -r '.encrypted_keyshares')

if [ "$ENC_KEYSHARES" = "[]" ]; then
  echo "encrypted_keyshares is empty."
  exit 1
fi

echo $SHOW_PRIVATE_REQ

echo "#############################################"
echo "Testing decryption query on source chain     "
echo "#############################################"

echo "Query general keyshare request on chain fairyring_test_1"
LIST_KEYSHARE_REQ=$($BINARY query pep list-keyshare-req --node $CHAIN1_NODE -o json)
IDENTITY=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].identity')
AGGR_KEYSHARE=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].aggr_keyshare')
echo "Identity for keyshare request is: $IDENTITY"
echo "Aggregated keyshare for request is: $AGGR_KEYSHARE"

echo "Encrypting data with Pub key: '$PUB_KEY'"
TEST_DATA="test_data_1"
CIPHER=$($BINARY encrypt $IDENTITY $PUB_KEY $TEST_DATA --node $CHAIN1_NODE)

echo "Encrypted Data: '$CIPHER'"

echo "Attempting decryption of data via pep query"
RSP=$($BINARY query pep decrypt-data $PUB_KEY $AGGR_KEYSHARE $CIPHER --node $CHAIN1_NODE -o json)
DECRYPTED_DATA=$(echo $RSP | jq -r '.decrypted_data')

if [ "$TEST_DATA" = "$DECRYPTED_DATA" ]; then
  echo "Data successfully decrypted"
else
  echo "Data decryption unsuccessful. Expected: '$TEST_DATA' ; found: '$DECRYPTED_DATA'"
  echo "Response from decryption query: '$RSP'"
  exit 1
fi

echo "#############################################"
echo "#    Testing aggregation on source chain    #"
echo "#############################################"

TEST_DATA="test_data_2"
RSP=$($BINARY aggregate-keyshares "" $WALLET_1/test_req_1 $WALLET_1 $SCEP_PRIV_KEY1 --node $CHAIN1_NODE)
echo $RSP
CIPHER=$($BINARY encrypt $WALLET_1/test_req_1 $PUB_KEY $TEST_DATA --node $CHAIN1_NODE)
# LOCAL_AGGR_KEYSHARE=a237057f3eef909c8bcd799597046bfd02ca0020fa29153042f73df77eebdd96de0a7bf8541ca5b4bab8ad277735aa9af135ce6a0020a98b0c3e90caca5170368ad991c810be88b46134e3d070d29bcd24599d2d915d377e62b5932e44ea53e584a8a50d296b5740440b0400b083b55e69551626ef18c03d6b843b6c44099ad102ea3ef7000e98609fb0c55df7b144d85e6e082178af8d92146adaec18554c1d4cd32df88842d0f0087ce0051fb30ba4c9dbc259cc3ea9c6d7d19a6451afc3176b02de06f723ece83ce3daf0a8badf5436f909213c94dc8262b01bd310545b43fe9962223afd835687b74003d6d75f3e135e7f93abfc2b5977a42f31c1985108e8a5b2e2ab0ebb5c25a11402f50f2207029d1e38cfa67b1c3efacf6d06d0347327c0174f20a6010cdeb9114e1785b4a78535987bc8eee8e17b0c5dd96a332619bf8a2f0444ae
RSP=$($BINARY query pep decrypt-data $PUB_KEY $RSP $CIPHER --node $CHAIN1_NODE -o json)

DECRYPTED_DATA=$(echo $RSP | jq -r '.decrypted_data')

if [ "$TEST_DATA" = "$DECRYPTED_DATA" ]; then
  echo "Data successfully decrypted"
else
  echo "Data decryption unsuccessful. Expected: '$TEST_DATA' ; found: '$DECRYPTED_DATA'"
  echo "Response from decryption query: '$RSP'"
  exit 1
fi

echo $RSP

echo ""
echo "###########################################################"
echo "#                   SUCCESSFULLY TESTED                   #"
echo "# Test Encrypted Tx Verification & Decryption & Execution #"
echo "#   Submit Valid & Invalid Aggregated Key to Pep Module   #"
echo "#    Submit Valid & Invalid Encrypted Tx to Pep Module    #"
echo "#        Test Pep Nonce Increment on Encrypted Tx         #"
echo "#        Gas Deduction for encrypted tx execution         #"
echo "#               Test General Encrypted Txs                #"
echo "###########################################################"
echo ""

./scripts/tests/priv_gov.sh $PUB_KEY $1