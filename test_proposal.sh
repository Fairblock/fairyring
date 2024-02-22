#!/bin/bash

fairyringd tx gov submit-proposal draft_proposal.json --from val2 -o json --home ./data/fairyring_test_2/ -y --keyring-backend test --gas-prices 1ufairy

sleep 6

TOTAL_PROPOSALS=$(fairyringd q gov proposals --home ./data/fairyring_test_2/ -o json | jq '.proposals | length')

fairyringd tx gov vote-encrypted $TOTAL_PROPOSALS no --from val2 --home ./data/fairyring_test_2/ --keyring-backend test --gas-prices 1ufairy -o json -y

