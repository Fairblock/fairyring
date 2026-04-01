#!/bin/bash
# Run this ONCE after fairyring.service is up and the chain is producing blocks.
# Registers val1 as a validator in the keyshare module.
#
# Usage:
#   ./scripts/devnet/register-validator.sh

if [ -f "$HOME/go/bin/fairyringd" ]; then
    BINARY="$HOME/go/bin/fairyringd"
else
    BINARY=fairyringd
fi

CHAIN_DIR=$(pwd)/devnet_data
CHAINID=fairyring_devnet
RPCPORT=26657
BLOCK_TIME=5

VAL1_ADDR=$($BINARY keys show val1 --home $CHAIN_DIR/$CHAINID -a --keyring-backend test 2>/dev/null)
if [ -z "$VAL1_ADDR" ]; then
  echo "ERROR: val1 key not found. Run 'make devnet-up' first."
  exit 1
fi

echo "Registering val1 ($VAL1_ADDR) in keyshare module..."
RESULT=$($BINARY tx keyshare register-validator \
  --from val1 \
  --gas-prices 1ufair \
  --home $CHAIN_DIR/$CHAINID \
  --chain-id $CHAINID \
  --node tcp://localhost:$RPCPORT \
  --keyring-backend test \
  --broadcast-mode sync \
  -o json -y)

TX_CODE=$(echo "$RESULT" | jq -r '.code')
if [ "$TX_CODE" != "0" ]; then
  echo "ERROR: Tx failed with code $TX_CODE"
  echo "$RESULT" | jq
  exit 1
fi

echo "Transaction submitted. Waiting for confirmation..."
sleep $BLOCK_TIME
TXHASH=$(echo "$RESULT" | jq -r '.txhash')
CONFIRMED=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID --chain-id $CHAINID --node tcp://localhost:$RPCPORT -o json)
VALIDATOR_ADDR=$(echo "$CONFIRMED" | jq -r '.events[8].attributes[0].value')

if [ "$VALIDATOR_ADDR" != "$VAL1_ADDR" ]; then
  echo "WARNING: Unexpected validator address in response. Check result manually:"
  echo "$CONFIRMED" | jq
else
  echo "Validator registered successfully: $VALIDATOR_ADDR"
fi
