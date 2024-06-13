#!/bin/bash

# make BLOCK_TIME= TOTAL_ACC= OTHER_TX= MAX_TIMES= INTERVAL= test-block-tx-limit

GENERATOR=ShareGenerator
BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAIN1_NODE=tcp://localhost:16657

MAX_TEST_TIMES=$MAX_TIMES
EACH_TEST_INTERVAL=$INTERVAL

GENERAL_TX_AMOUNT=$OTHER_TX
BLOCK_TIME=$BLOCK_TIME
TOTAL_TEST_ACC_NUM=$TOTAL_ACC

THRESHOLD=$(echo "scale=5; $TOTAL_TEST_ACC_NUM*(2/3)" | bc | perl -nl -MPOSIX -e 'print ceil($_);')

TARGET_BLOCK_PLUS=$(echo "scale=5; $TOTAL_TEST_ACC_NUM/7" | bc | perl -nl -MPOSIX -e 'print ceil($_);')

TARGET_BLOCK_PLUS=$((TARGET_BLOCK_PLUS>=10 ? TARGET_BLOCK_PLUS : 10))

WAIT_MULTIPLY=$(($TARGET_BLOCK_PLUS+2))

PIPE_PREFIX=/tmp/testfairyring

echo "Block Time: $BLOCK_TIME, Total Acc number: $TOTAL_TEST_ACC_NUM, Threshold: $THRESHOLD"
echo "Target block plus: $TARGET_BLOCK_PLUS, Wait multiply: $WAIT_MULTIPLY"

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
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE -o json)
  echo "$RESULT"
}


GENERATED_RESULT=$($GENERATOR generate $TOTAL_TEST_ACC_NUM $THRESHOLD)
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')

GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')


echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY --from $VALIDATOR_1 --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node $CHAIN1_NODE --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq -r '.logs[0].events[1].attributes[2].value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


for i in $(seq 0 $(($TOTAL_TEST_ACC_NUM-1)))
do
  # echo "account test$i registering as a validator on chain fairyring_test_1"
  NOW_ADDR=$($BINARY keys show test$i -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
  RESULT=$($BINARY tx keyshare register-validator --from test$i --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode async --keyring-backend test -o json -y)
  check_tx_code $RESULT
done

sleep $BLOCK_TIME

echo "All account registered as validator"

echo "Max Testing times: $MAX_TEST_TIMES, Interval: $EACH_TEST_INTERVAL"

KEYSHARE_TEST_RESULTS=()
NORMAL_TEST_RESULTS=()

for testing_i in $(seq 1 $MAX_TEST_TIMES)
do
  echo "Current Testing Times: $testing_i"

  CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE -o json | jq -r '.block.header.height')

  TARGET_BLOCK=$(($CURRENT_BLOCK+$TARGET_BLOCK_PLUS))

  PIPES=()

  for i in $(seq 0 $(($TOTAL_TEST_ACC_NUM-1)))
  do
    CURRENT_KEYSHARE_INDEX=$(($i-1))
    GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r ".Shares[$CURRENT_KEYSHARE_INDEX].Value")
    ADDR=$($BINARY keys show test$i -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)

    PIPE_NAME="$PIPE_PREFIX""submit_tx$i"

    if [[ ! -p "$PIPE_NAME" ]]; then
      mkfifo $PIPE_NAME
    fi
    #echo "Address: $ADDR | Share: $GENERATED_SHARE | Index: $i"
    ./scripts/tests/submitTx.sh $ADDR $BLOCK_TIME $GENERATED_SHARE $i $TARGET_BLOCK $PIPE_NAME > $CHAIN_DIR/submit_tx_test$i.log &

    PIPES+=( $PIPE_NAME )
  done

  echo "Started all submit KeyShare tx client"

  if [[ "$GENERAL_TX_AMOUNT" -ge "1" ]]; then
    ADDR=$($BINARY keys show "normaltxacc" -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)

    PIPE_NAME="$PIPE_PREFIX""normaltx$i"

    if [[ ! -p "$PIPE_NAME" ]]; then
      mkfifo $PIPE_NAME
    fi

    ./scripts/tests/submitNormalTx.sh $ADDR $BLOCK_TIME $TARGET_BLOCK $GENERAL_TX_AMOUNT $PIPE_NAME > $CHAIN_DIR/normaltxacc.log &

    PIPES+=( $PIPE_NAME )
  fi

  echo "Started submit general tx client"

  sleep $(($BLOCK_TIME*5))

  echo "Start getting block height..."

  while true; do
    CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node $CHAIN1_NODE | jq -r '.block.header.height')

    for i in "${PIPES[@]}"; do
      echo "$CURRENT_BLOCK" >$i
    done

    if [ "$CURRENT_BLOCK" -ge "$TARGET_BLOCK" ]; then
      break
    fi

    sleep 0.5
  done

  echo "Target block height reached..."

  echo ""
  echo "Remember to kill all 'fairyringd' process & remove the 'data' directory"
  echo ""
  echo "Block Time: $BLOCK_TIME, Total Acc number: $TOTAL_TEST_ACC_NUM, Threshold: $THRESHOLD"
  echo "Target block plus: $TARGET_BLOCK_PLUS, Wait multiply: $WAIT_MULTIPLY"

  sleep $(($BLOCK_TIME*$WAIT_MULTIPLY))

  SUM_RESULT=0

  for i in $(seq 0 $(($TOTAL_TEST_ACC_NUM-1)))
  do
    OUT=$(tail -n 1 $CHAIN_DIR/submit_tx_test$i.log)
    SUM_RESULT=$(($OUT+$SUM_RESULT))
  done

  echo ""
  echo "Total Submit Keyshare Tx confirmed in the next block: $SUM_RESULT"

  KEYSHARE_TEST_RESULTS+=( "$SUM_RESULT" )

  sleep $(($BLOCK_TIME*($WAIT_MULTIPLY/4)))

  echo ""
  echo "Total Normal Tx confirmed in the next block:"
  NORMAL_RESULT=$(tail -n 1 $CHAIN_DIR/normaltxacc.log)
  echo "$NORMAL_RESULT"

  NORMAL_TEST_RESULTS+=( "$NORMAL_RESULT" )
done

echo "Max Testing times: $MAX_TEST_TIMES, Interval: $EACH_TEST_INTERVAL"

echo "All Test done"

echo "All KeyShare Test Result: ${KEYSHARE_TEST_RESULTS[*]}"
KEYSHARE_TEST_LEN=${#KEYSHARE_TEST_RESULTS[@]}

echo "All Normal Test Result: ${NORMAL_TEST_RESULTS[*]}"
NORMAL_TEST_LEN=${#NORMAL_TEST_RESULTS[@]}

KEYSHARE_TEST_SUM=0
for i in "${KEYSHARE_TEST_RESULTS[@]}";
do
  KEYSHARE_TEST_SUM=$(($KEYSHARE_TEST_SUM+$i))
done

echo "KEYSHARE TEST AVG: $(($KEYSHARE_TEST_SUM/$KEYSHARE_TEST_LEN))"

NORMAL_TEST_SUM=0
for i in "${NORMAL_TEST_RESULTS[@]}";
do
  NORMAL_TEST_SUM=$(($NORMAL_TEST_SUM+$i))
done

echo "NORMAL TEST AVG: $(($NORMAL_TEST_SUM/$NORMAL_TEST_LEN))"
