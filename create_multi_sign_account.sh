#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 3 ] || die "3 argument required, $# provided, Usage: ./create_multi_sign_account {acc1,acc2...} {multi sig account name} {threshold}"

echo $3 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $3 provided"

IFS=',' read -ra ACCOUNTS_ARR <<< "$1"

[ $3 -le ${#ACCOUNTS_ARR[@]} ] || die "Invalid threshold, threshold must be less or equals to the number of accounts. $3 provided as threshold but ${#ACCOUNTS_ARR[@]} accounts provided."

ALICE_ADDRESS=`fairyringd keys show alice | grep "address:" | sed 's/^.*: //'`

for EACH_ACCOUNT in "${ACCOUNTS_ARR[@]}"
do
  fairyringd keys add $EACH_ACCOUNT
  EACH_ADDRESS=`fairyringd keys show $EACH_ACCOUNT | grep "address:" | sed 's/^.*: //'`
  fairyringd tx bank send $ALICE_ADDRESS $EACH_ADDRESS 100frt --from alice --yes
done

fairyringd keys add $2 --multisig-threshold=$3 --multisig $1

MULTI_SIGN_ADDRESS=`fairyringd keys show $2 | grep "address:" | sed 's/^.*: //'`

fairyringd tx bank send $ALICE_ADDRESS $MULTI_SIGN_ADDRESS 100frt --from alice --yes