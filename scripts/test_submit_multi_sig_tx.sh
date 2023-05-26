#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 6 ] || die "5 argument required, $# provided, Usage: ./test_submit_multi_sig_tx {acc1,acc2...} {multi sig account} {sender account} {tx_target_height} {to_address} {amount}"

echo $4 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $4 provided"

ACCOUNT_NAME=$2
CHAIN_ID="fairyring"
UNSIGNED_TX_FILE_NAME="script_multi_sig_unsigned.json"
SIGNED_TX_FILE_NAME="script_multi_sig_signed.json"

# Get the address of target account name
MULTI_SIG_ADDRESS=`fairyringd keys show $ACCOUNT_NAME -a`

# Create the unsigned tx data
fairyringd tx bank send $MULTI_SIG_ADDRESS $5 $6 --chain-id $CHAIN_ID --generate-only --yes > $UNSIGNED_TX_FILE_NAME

SIGNED_TX_FILE_LIST=""

IFS=',' read -ra ACCOUNTS_ARR <<< "$1"

MULTI_SIG_ACCOUNT_NUMBER=`fairyringd q account $MULTI_SIG_ADDRESS  | grep "account_number: " | sed 's/^.*: //'`
MULTI_SIG_ACCOUNT_NUMBER=`sed -e 's/^"//' -e 's/"$//' <<< "$MULTI_SIG_ACCOUNT_NUMBER"`

ACCOUNT_FAIRBLOCK_NONCE=`fairyringd query pep show-fairblock-nonce $MULTI_SIG_ADDRESS | grep "nonce:" | sed 's/^.*: //'`

if [ -z "${ACCOUNT_FAIRBLOCK_NONCE}" ]; then
  die "pep Nonce not found"
else # else, remove the string quote from the result
  ACCOUNT_FAIRBLOCK_NONCE=`sed -e 's/^"//' -e 's/"$//' <<< "$ACCOUNT_FAIRBLOCK_NONCE"`
fi

for EACH_ACCOUNT in "${ACCOUNTS_ARR[@]}"
do
  EACH_ADDRESS=`fairyringd keys show $EACH_ACCOUNT -a`

  #EACH_SIGNED_DATA=`fairyringd tx sign $UNSIGNED_TX_FILE_NAME --multisig $ACCOUNT_NAME --from $EACH_ACCOUNT --offline --account-number $MULTI_SIG_ACCOUNT_NUMBER --sequence $ACCOUNT_FAIRBLOCK_NONCE --chain-id $CHAIN_ID --yes --output-document $EACH_ACCOUNT$SIGNED_TX_FILE_NAME`
  EACH_SIGNED_DATA=`fairyringd tx sign $UNSIGNED_TX_FILE_NAME --multisig $ACCOUNT_NAME --from $EACH_ACCOUNT --chain-id $CHAIN_ID --yes --output-document $EACH_ACCOUNT$SIGNED_TX_FILE_NAME`

  SIGNED_TX_FILE_LIST="$SIGNED_TX_FILE_LIST $EACH_ACCOUNT$SIGNED_TX_FILE_NAME"
done

#FINAL_SIGNED_DATA=`fairyringd tx multisign $UNSIGNED_TX_FILE_NAME $ACCOUNT_NAME $SIGNED_TX_FILE_LIST --offline --account-number $MULTI_SIG_ACCOUNT_NUMBER --sequence $ACCOUNT_FAIRBLOCK_NONCE --chain-id $CHAIN_ID --yes`
FINAL_SIGNED_DATA=`fairyringd tx multisign $UNSIGNED_TX_FILE_NAME $ACCOUNT_NAME $SIGNED_TX_FILE_LIST --chain-id $CHAIN_ID --yes`
echo $FINAL_SIGNED_DATA
PUB_KEY=`fairyringd q fairyring show-latest-pub-key | grep "publicKey: " | sed 's/^.*: //'`

CIPHER=`./encrypter $4 $PUB_KEY $FINAL_SIGNED_DATA`

# Submit encrypted tx with the signed data
fairyringd tx pep submit-encrypted-tx $CIPHER $4 --from $3 --yes

rm $SIGNED_TX_FILE_LIST $UNSIGNED_TX_FILE_NAME

printf "\nRun 'fairyringd query bank balances $5' to check target account balance later\n"