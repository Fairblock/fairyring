#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 3 ] || die "2 argument required, $# provided, Usage: ./test_tx_execution {tx_target_height} {to_address} {amount}"

echo $1 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $1 provided"

ACCOUNT_NAME="alice"
ACCOUNT_NUMBER=0
CHAIN_ID="fairyring"
UNSIGNED_TX_FILE_NAME="script_unsigned.json"

# Get the address of target account name
ADDRESS=`fairyringd keys show $ACCOUNT_NAME | grep "address:" | sed 's/^.*: //'`

# Get the fairblock nonce of target account address
FairblockNonce=`fairyringd query fairblock show-fairblock-nonce $ADDRESS | grep "nonce:" | sed 's/^.*: //'`

# Check if get nonce is success, if not assign 1 to the nonce
if [ -z "${FairblockNonce}" ]; then
  echo "$ACCOUNT_NAME nonce not found, init nonce as 1"
  FairblockNonce=1
else # else, remove the string quote from the result
  FairblockNonce=`sed -e 's/^"//' -e 's/"$//' <<< "$FairblockNonce"`
fi

printf "Got $ACCOUNT_NAME's FairblockNonce: $FairblockNonce Account Balance:\n\n"

fairyringd query bank balances $ADDRESS

# Create the unsigned tx data
fairyringd tx bank send $ADDRESS $2 $3 --from $ACCOUNT_NAME --generate-only --yes > $UNSIGNED_TX_FILE_NAME

# Sign the unsigned tx that just created
SIGNED_DATA=`fairyringd tx sign $UNSIGNED_TX_FILE_NAME --from $ACCOUNT_NAME --offline --account-number $ACCOUNT_NUMBER --sequence $FairblockNonce --chain-id $CHAIN_ID --yes`

PUB_KEY=`fairyringd q fairyring show-latest-pub-key | grep "publicKey: " | sed 's/^.*: //'`

CIPHER=`./encrypter $1 $PUB_KEY $SIGNED_DATA`

# Submit encrypted tx with the signed data
fairyringd tx fairblock submit-encrypted-tx $CIPHER $1 --from $ACCOUNT_NAME --yes

# List all the encrypted txs
printf "\n\nList encrypted Txs:\n\n"
fairyringd query fairblock list-encrypted-tx

# Remove the unsigned tx file
rm $UNSIGNED_TX_FILE_NAME
printf "\nUnsigned TX JSON File Removed\n"

printf "\nAccount Balance after submitting Encrypted Tx"
fairyringd query bank balances $ADDRESS

printf "\nTarget To Account Balance after submitting Encrypted Tx"
fairyringd query bank balances $2

printf "\nRun 'fairyringd query bank balances $2' to check target account balance later\n"