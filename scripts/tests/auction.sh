#!/bin/bash

echo ""
echo "##########################"
echo "# Testing Auction Module #"
echo "##########################"
echo ""


echo
echo
echo "Testing timed auction with no bid"
height=$(fairyringd q pep latest-height --output json | jq -r '.height')
target_height=$((height + 3))
fairyringd tx auction create-auction $target_height true ufairy --from wallet1 --keyring-backend test --yes --home devnet_data/fairyring_devnet --chain-id fairyring_devnet
sleep 1
echo "After placing bids, all auctions:"
out=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[0]')
echo $out | jq



echo
echo
echo "Testing timed auction with multiple bid"
height=$(fairyringd q pep latest-height --output json | jq -r '.height')
target_height=$((height + 10))
fairyringd tx auction create-auction $target_height true ufairy --from wallet1 --keyring-backend test --yes --home devnet_data/fairyring_devnet --chain-id fairyring_devnet
sleep 1

auction_1=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[1]')

pubkey_1=$(echo $auction_1 | jq -r '.pubkey')

id_1=$(echo $auction_1 | jq -r '.identity')

bid_1=$(fairyringd encrypt-bid $target_height $pubkey_1 "1ufairy")
bid_2=$(fairyringd encrypt-bid $target_height $pubkey_1 "2ufairy")
bid_3=$(fairyringd encrypt-bid $target_height $pubkey_1 "3ufairy")
bid_4=$(fairyringd encrypt-bid $target_height $pubkey_1 "4ufairy")

echo "Encrypted with pubkey: $pubkey_1 and ID: $target_height"
fairyringd tx auction place-bid $id_1 $bid_1 --from wallet1 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1
fairyringd tx auction place-bid $id_1 $bid_2 --from wallet2 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1
fairyringd tx auction place-bid $id_1 $bid_3 --from wallet3 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1
fairyringd tx auction place-bid $id_1 $bid_4 --from wallet4 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1

echo "After placing bids, all auctions:"
sleep 1.5
out=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[1]')
echo $out | jq

echo
echo
echo "Testing timed auction with invalid bid"
height=$(fairyringd q pep latest-height --output json | jq -r '.height')
target_height=$((height + 10))
fairyringd tx auction create-auction $target_height true ufairy --from wallet1 --keyring-backend test --yes --home devnet_data/fairyring_devnet --chain-id fairyring_devnet
sleep 1

auction_1=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[2]')

pubkey_1=$(echo $auction_1 | jq -r '.pubkey')

id_1=$(echo $auction_1 | jq -r '.identity')

bid_1=$(fairyringd encrypt-bid $target_height $pubkey_1 "1ufairy")
bid_2=$(fairyringd encrypt-bid $target_height $pubkey_1 "2ufairy")
bid_3=$(fairyringd encrypt-bid $target_height $pubkey_1 "9000000000000ufairy")
bid_4=$(fairyringd encrypt-bid $target_height $pubkey_1 "4ufairy")

echo "Encrypted with pubkey: $pubkey_1 and ID: $target_height"
fairyringd tx auction place-bid $id_1 $bid_1 --from wallet1 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1
fairyringd tx auction place-bid $id_1 $bid_2 --from wallet2 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1
fairyringd tx auction place-bid $id_1 $bid_3 --from wallet3 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1
fairyringd tx auction place-bid $id_1 $bid_4 --from wallet4 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet > /dev/null 2>&1

echo "After placing bids, all auctions:"
sleep 1.5
out=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[2]')
echo $out | jq

echo
echo
echo "Testing timed auction with 1 block duration"
height=$(fairyringd q pep latest-height --output json | jq -r '.height')
target_height=$((height + 3))

id_1="auction/fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq/$target_height/0"
pubkey_1=$(fairyringd q keyshare show-active-pub-key -o json | jq -r '.active_pubkey.public_key')
bid_1=$(fairyringd encrypt-bid $target_height $pubkey_1 "1ufairy")

out=$(fairyringd tx auction place-bid $id_1 $bid_1 --from wallet2 --keyring-backend test --gas 300000 --home devnet_data/fairyring_devnet --yes --chain-id fairyring_devnet --output json)
fairyringd tx auction create-auction $target_height true ufairy --from wallet1 --keyring-backend test --yes --home devnet_data/fairyring_devnet --chain-id fairyring_devnet

echo "Encrypted with pubkey: $pubkey_1 and ID: $target_height"
echo "using id: $id_1"

echo "place bid txid: $(echo $out | jq '.txhash')"

echo "After placing bids, all auctions:"
sleep 1.5
out=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[1]')
echo $out | jq