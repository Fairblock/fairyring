#!/bin/bash

BINARY=$1
HOME=$2
NODE=$3
FROM=$4
CHAINID=$5

BLOCK_TIME=0.5

check_tx_code () {
    local TX_CODE=$(echo "$1" | jq -r '.code' 2>/dev/null)
    if [ $? -ne 0 ]; then
      echo "0"
    elif [ "$TX_CODE" != 0 ]; then
      echo "0"
    else
      echo "1"
    fi
}

wait_for_tx () {
  while true
  do
    sleep $BLOCK_TIME
    local TXHASH=$(echo "$1" | jq -r '.txhash')
    RESULT=$($BINARY q tx --type=hash $TXHASH --home $HOME --chain-id $CHAINID --node $NODE -o json 2>/dev/null)
    if [ $? -ne 0 ]; then
      continue
    else
      echo "$RESULT"
      break
    fi
  done
}

sleep 3
RESULT=$(fairyringd q keyshare show-active-pub-key --node $NODE -o json | jq)
GENERATED_SHARE=$(echo $RESULT | jq -r '.active_pubkey.encrypted_keyshares[0].data')

while true
do
  CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $HOME --node $NODE -o json | jq -r '.block.header.height')
  TARGET_HEIGHT=$((CURRENT_BLOCK+1))
  EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
  EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')
  RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $FROM --gas-prices 1ufair --home $HOME --chain-id $CHAINID --node $NODE --broadcast-mode sync --keyring-backend test -o json -y)
  OUT=$(check_tx_code $RESULT)
  if [ $OUT -eq "0" ]; then
    echo "Error checking tx code, skip submitting $TARGET_HEIGHT key share"
    continue
  fi
  RESULT=$(wait_for_tx $RESULT)
  RESULT_EVENT=$(echo "$RESULT" | jq -r '.events[9].type' 2>/dev/null)
  if [ $? -ne 0 ]; then
    continue
  else
    if [ "$RESULT_EVENT" != "keyshare-aggregated" ]; then
      echo "ERROR: KeyShare module submit invalid key share from registered validator error. Expected the key to be aggregated, got '$RESULT_EVENT'"
      echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
    fi
    echo "Submitted keyshare for height: $TARGET_HEIGHT"
  fi
done