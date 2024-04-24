#!/bin/bash

BINARY=fairyringd
ENCRYPTER=encrypter
CHAINID=fairyring_devnet
CHAIN_NODE=http://localhost:26657
CHAIN_DIR=$(pwd)/devnet_data
BLOCK_TIME=5

FROM_ACC=wallet1
FROM_ADDR=$($BINARY keys show $FROM_ACC -a --keyring-backend test --home $CHAIN_DIR/$CHAINID)

TO_ACC=wallet2
TO_ADDR=$($BINARY keys show $TO_ACC -a --keyring-backend test --home $CHAIN_DIR/$CHAINID)

check_tx_code () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != "0" ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    exit 1
  fi
}

wait_for_tx () {
  sleep $BLOCK_TIME
  local TXHASH=$(echo "$1" | jq -r '.txhash')
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node $CHAIN_NODE -o json)
  echo "$RESULT"
}

get_block_height () {
  local OUT=$($BINARY q block --node $CHAIN_NODE | jq -r '.block.header.height')
  echo "$OUT"
}

get_latest_height() {
  local OUT=$($BINARY q pep latest-height --node $CHAIN_NODE -o json | jq -r '.height')
  echo "$OUT"
}

get_pep_nonce() {
  local OUT=$($BINARY q pep show-pep-nonce $FROM_ADDR --node $CHAIN_NODE -o json | jq -r '.pepNonce.nonce')
  echo "$OUT"
}

query_block_result() {
  local HEIGHT=$1
  local OUT=$(curl -s $CHAIN_NODE/block_results?height=$HEIGHT)
  echo "$OUT"
}

get_encrypted_tx_result() {
  local TARGETHEIGHT=$1
  RESULT=$($BINARY q pep list-encrypted-tx-from-block $TARGETHEIGHT --node $CHAIN_NODE -o json)
  EXPIRED=$(echo $RESULT | jq -r '.encryptedTxArray.encryptedTx[0].expired')
  EXECUTED_AT=$(echo $RESULT | jq -r '.encryptedTxArray.encryptedTx[0].processedAtChainHeight')
  echo "Target Height: $TARGETHEIGHT, Executed At: $EXECUTED_AT, Expired: $EXPIRED"
  if [ "$EXPIRED" = true ]; then
    echo "Tx Expired..."
  else
    EXECUTE_RESULT=$(query_block_result $EXECUTED_AT | jq -r '.result.begin_block_events | .[] | select(.type | endswith("encrypted-tx"))')
    echo $EXECUTE_RESULT | jq
  fi
}

sign_encrypt_and_submit_tx() {
  local SEQUENCE=$1
  local TARGET_BLOCK=$2
  local ENCRYPTION_KEY=$3
  local UNSIGNED_TX_FILE=$4
  local FROM_ACC_NAME=$5
  local FROM_ACC_NUM=$6
  local SIGNED_DATA=$($BINARY tx sign $UNSIGNED_TX_FILE --from $FROM_ACC_NAME --offline --account-number $FROM_ACC_NUM --sequence $SEQUENCE --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node $CHAIN_NODE  --keyring-backend test -y)
  local CIPHER=$(ENCRYPTER $TARGET_BLOCK $ENCRYPTION_KEY $SIGNED_DATA)
  echo "Submitting Encrypted Tx with target heigh: $TARGET_BLOCK"
  local RESULT=$($BINARY tx pep submit-encrypted-tx $CIPHER $TARGET_BLOCK --from $FROM_ACC_NAME --gas-prices 1ufairy --gas 300000 --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node $CHAIN_NODE --broadcast-mode sync --keyring-backend test -o json -y)
  check_tx_code $RESULT
  local RESULT=$(wait_for_tx $RESULT)
  local EVENT_TYPE=$(echo "$RESULT" | jq -r '.logs[0].events[5].type')
  local TARGET_HEIGHT=$(echo "$RESULT" | jq -r '.logs[0].events[5].attributes[1].value')
  if [ "$EVENT_TYPE" != "new-encrypted-tx-submitted" ] && [ "$TARGET_HEIGHT" != "$EXPIRY" ]; then
    echo "ERROR: Pep module submit encrypted tx error. Expected tx to submitted without error with target height '$EXPIRY', got '$TARGET_HEIGHT' and '$EVENT_TYPE' | '$(get_block_height)'"
    echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
    echo "ERROR MESSAGE: $(echo "$RESULT" | jq '.')"
    exit 1
  fi
}

RESULT=$($BINARY q pep show-active-pub-key --node $CHAIN_NODE -o json)
PUBKEY=$(echo $RESULT | jq -r '.activePubKey.publicKey')
EXPIRY=$(echo $RESULT | jq -r '.activePubKey.expiry')
BLOCK_NOW=$(get_block_height)
ACC_NUMBER=$($BINARY q account $FROM_ADDR -o json --node $CHAIN_NODE | jq -r '.account_number')
echo "Public Key: $PUBKEY"
echo "Block now: $BLOCK_NOW, Pub Key Expiry: $EXPIRY"
echo "Pep nonce now: $(get_pep_nonce)"
echo "Account number: $ACC_NUMBER"

# Generate unsigned bank send tx
$BINARY tx bank send $FROM_ADDR $TO_ADDR 1ufairy --from $FROM_ACC --gas-prices 1ufairy --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node $CHAIN_NODE --keyring-backend test --generate-only -o json -y > unsigned.json

sign_encrypt_and_submit_tx $(get_pep_nonce) $(($EXPIRY-2)) $PUBKEY unsigned.json $FROM_ACC $ACC_NUMBER
sign_encrypt_and_submit_tx $(($(get_pep_nonce)+1)) $(($EXPIRY-1)) $PUBKEY unsigned.json $FROM_ACC $ACC_NUMBER
sign_encrypt_and_submit_tx $(($(get_pep_nonce)+2)) $EXPIRY $PUBKEY unsigned.json $FROM_ACC $ACC_NUMBER

rm -r unsigned.json &> /dev/null

echo "Waiting until expiry block..."
echo "Current Height: $(get_latest_height), Expiry: $EXPIRY"
# If current height is less than expiry height, sleep
while [ "$(get_latest_height)" -le "$(($EXPIRY+3))" ]; do
  sleep 1
done

echo "Encrypted Tx Result with target block height 2 block lower than expiry height:\n $(get_encrypted_tx_result $(($EXPIRY - 2)))"
echo "Encrypted Tx Result with target block height 1 block lower than expiry height:\n $(get_encrypted_tx_result $(($EXPIRY - 1)))"
echo "Encrypted Tx Result with target block height equals to pubkey expiry height:\n $(get_encrypted_tx_result $EXPIRY)"

