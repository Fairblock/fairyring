#!/bin/bash

die () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -eq 3 ] || die "3 argument required, $# provided, Usage: ./test_tx_execution {data_tx_target_height} {current sequence + 1} {tx_target_height}"

echo $1 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $1 provided"
echo $2 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $2 provided"
echo $3 | grep -E -q '^[0-9]+$' || die "Numeric argument required, $3 provided"

fairyringd tx fairblock submit-encrypted-tx "test-encrypted-tx-data" $1 --from alice --generate-only --yes > unsigned.json
SIGNED_DATA=`fairyringd tx sign unsigned.json --from alice --offline --account-number 0 --sequence $2 --yes`

fairyringd tx fairblock submit-encrypted-tx "$SIGNED_DATA" $3 --from alice --yes

echo "\n\nList encrypted Txs:"
fairyringd query fairblock list-encrypted-tx
