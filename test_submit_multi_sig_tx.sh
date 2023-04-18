#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 5 ] || die "5 argument required, $# provided, Usage: ./test_submit_multi_sig_tx {acc1,acc2...} {multi sig account} {tx_target_height} {to_address} {amount}"

echo $3 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $3 provided"

ACCOUNT_NAME=$2
ACCOUNT_NUMBER=0
CHAIN_ID="fairyring"
UNSIGNED_TX_FILE_NAME="script_multi_sig_unsigned.json"
SIGNED_TX_FILE_NAME="script_multi_sig_signed.json"

# Get the address of target account name
MULTI_SIG_ADDRESS=`fairyringd keys show $ACCOUNT_NAME | grep "address:" | sed 's/^.*: //'`

echo "Multi sig address: $MULTI_SIG_ADDRESS $1 $2 $3 $4 $5"

# Create the unsigned tx data
fairyringd tx bank send $MULTI_SIG_ADDRESS $4 $5 --from $ACCOUNT_NAME --generate-only --yes > $UNSIGNED_TX_FILE_NAME

SIGNED_TX_FILE_LIST=""

IFS=',' read -ra ACCOUNTS_ARR <<< "$1"

for EACH_ACCOUNT in "${ACCOUNTS_ARR[@]}"
do
  EACH_ADDRESS=`fairyringd keys show $EACH_ACCOUNT | grep "address:" | sed 's/^.*: //'`
  EACH_FAIRBLOCK_NONCE=`fairyringd query fairblock show-fairblock-nonce $EACH_ADDRESS | grep "nonce:" | sed 's/^.*: //'`

  # Check if get nonce is success, if not assign 1 to the nonce
  if [ -z "${EACH_FAIRBLOCK_NONCE}" ]; then
    echo "$EACH_ACCOUNT nonce not found, init nonce as 1"
    EACH_FAIRBLOCK_NONCE=1
  else # else, remove the string quote from the result
    EACH_FAIRBLOCK_NONCE=`sed -e 's/^"//' -e 's/"$//' <<< "$EACH_FAIRBLOCK_NONCE"`
  fi

  printf "Got $EACH_ACCOUNT's FairblockNonce: $EACH_FAIRBLOCK_NONCE Account Balance:\n\n"

  fairyringd query bank balances $EACH_ADDRESS

  # Sign the unsigned tx that just created
  EACH_SIGNED_DATA=`fairyringd tx sign $UNSIGNED_TX_FILE_NAME --multisig $MULTI_SIG_ADDRESS --from $EACH_ACCOUNT --sequence $EACH_FAIRBLOCK_NONCE --chain-id $CHAIN_ID --yes --output-document $EACH_ACCOUNT$SIGNED_TX_FILE_NAME`

  SIGNED_TX_FILE_LIST="$SIGNED_TX_FILE_LIST $EACH_ACCOUNT$SIGNED_TX_FILE_NAME"
done

FINAL_SIGNED_DATA=`fairyringd tx multisign $UNSIGNED_TX_FILE_NAME $ACCOUNT_NAME $SIGNED_TX_FILE_LIST`

PUB_KEY=`fairyringd q fairyring show-latest-pub-key | grep "publicKey: " | sed 's/^.*: //'`

CIPHER=`./encrypter $3 $PUB_KEY $FINAL_SIGNED_DATA`

# Submit encrypted tx with the signed data
fairyringd tx fairblock submit-encrypted-tx $CIPHER $3 --from $ACCOUNT_NAME --yes

rm $SIGNED_TX_FILE_LIST $UNSIGNED_TX_FILE_NAME

