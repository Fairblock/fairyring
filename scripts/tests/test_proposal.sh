#!/bin/bash

fairyringd tx gov submit-proposal draft_proposal.json --from wallet1 -o json --home ../../devnet_data/fairyring_devnet -y --keyring-backend test --gas-prices 1ufair

sleep 6

TOTAL_PROPOSALS=$(fairyringd q gov proposals --home ../../devnet_data/fairyring_devnet -o json | jq '.proposals | length')

fairyringd tx gov vote-encrypted $TOTAL_PROPOSALS no --from wallet1 --home ../../devnet_data/fairyring_devnet --keyring-backend test --gas-prices 1ufair -o json -y
