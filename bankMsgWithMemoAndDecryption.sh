#!/bin/bash

# Prompt for user input
echo "Enter recipient address:"
read RECIPIENT

echo "Enter amount to send (e.g., 100ufairy):"
read AMOUNT

echo "Enter account name:"
read ACCOUNT_NAME

echo "Enter note for the transaction (will be encrypted):"
read NOTE

# Get the public key for encryption
PUBKEY=$(fairyringd query pep show-active-pub-key -o json | jq -r '.active_pubkey.public_key')

ACC_ADDR=$(fairyringd keys show $ACCOUNT_NAME -a --keyring-backend test --home devnet_data/fairyring_devnet)
echo $ACC_ADDR

# Generate unsigned transaction **with note included**
fairyringd tx bank send $ACC_ADDR $RECIPIENT $AMOUNT --from $ACCOUNT_NAME --gas-prices 1ufairy --generate-only -o json -y \
  --keyring-backend test --home devnet_data/fairyring_devnet --chain-id fairyring_devnet \
  --note "$NOTE" > unsigned.json

ACC_NUM=$(fairyringd query auth account $ACC_ADDR -o json | jq -r '.account.value.account_number')
echo "Acc number: $ACC_NUM"

ACC_SEQ=$(fairyringd query pep show-pep-nonce $ACC_ADDR -o json | jq -r '.pep_nonce.nonce')
echo "Acc seq: $ACC_SEQ"

# Sign the transaction (note is already included)
SIGNED=$(fairyringd tx sign unsigned.json --from $ACCOUNT_NAME --offline \
  --keyring-backend test --home devnet_data/fairyring_devnet --chain-id fairyring_devnet --account-number $ACC_NUM --sequence $ACC_SEQ)

CURRENT_HEIGHT=$(fairyringd query pep latest-height --output json | jq -r '.height')
echo "Current height: $CURRENT_HEIGHT"

# Encrypt the signed transaction
echo "Enter target height for execution:"
read TARGET_HEIGHT
ENCRYPTED=$(fairyringd encrypt $TARGET_HEIGHT $PUBKEY "$SIGNED")

# Submit the encrypted transaction
echo "Submitting transaction..."
TX_SUBMISSION_OUTPUT=$(fairyringd tx pep submit-encrypted-tx $ENCRYPTED $TARGET_HEIGHT --from $ACCOUNT_NAME --gas-prices 1ufairy -y \
  --keyring-backend test --home devnet_data/fairyring_devnet --chain-id fairyring_devnet)

echo "Transaction submitted successfully."
echo "Transaction Output: $TX_SUBMISSION_OUTPUT"

# Extract the transaction hash
TX_HASH=$(echo "$TX_SUBMISSION_OUTPUT" | grep -oE "txhash: [A-Fa-f0-9]+" | awk '{print $2}')

if [[ -z "$TX_HASH" ]]; then
    echo "Error: Unable to extract transaction hash."
    exit 1
fi

echo "Transaction Hash: $TX_HASH"

new_target=$(($TARGET_HEIGHT+5))
echo "Wait until block height passed target height"
while [[ $new_target -gt $CURRENT_HEIGHT ]]; do
  CURRENT_HEIGHT=$(fairyringd query pep latest-height --output json | jq -r '.height')
  sleep 2
done


fairyringd list-decrypted-txs $TARGET_HEIGHT --output json | jq 
