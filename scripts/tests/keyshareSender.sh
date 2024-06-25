#!/bin/bash

BINARY=$1
HOME=$2
NODE=$3
FROM=$4
CHAINID=$5
GENERATOR=$6

BLOCK_TIME=5

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
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $HOME --chain-id $CHAINID --node $NODE -o json)
  echo "$RESULT"
}

sleep 5
RESULT=$(fairyringd q keyshare show-active-pub-key --node $NODE -o json | jq)
GENERATED_SHARE=$(echo $RESULT | jq -r '.activePubKey.encryptedKeyShares[0].data')

while true
do
  CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $HOME --node $NODE -o json | jq -r '.block.header.height')
  TARGET_HEIGHT=$((CURRENT_BLOCK+1))
  EXTRACTED_RESULT=$($GENERATOR derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
  EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')
  RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $FROM --gas-prices 1ufairy --home $HOME --chain-id $CHAINID --node $NODE --broadcast-mode sync --keyring-backend test -o json -y)
  check_tx_code $RESULT
  RESULT=$(wait_for_tx $RESULT)
  RESULT_EVENT=$(echo "$RESULT" | jq -r '.logs[0].events[2].type')
  if [ "$RESULT_EVENT" != "keyshare-aggregated" ]; then
    echo "ERROR: KeyShare module submit invalid key share from registered validator error. Expected the key to be aggregated, got '$RESULT_EVENT'"
    echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  fi
  echo "Submitted keyshare for height: $TARGET_HEIGHT"
done