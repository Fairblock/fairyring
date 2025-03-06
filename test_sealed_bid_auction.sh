#!/bin/bash

echo ""
echo "######################################"
echo "#       Testing Auction Module       #"
echo "#      Test Bidder registration      #"
echo "# Test auction valid & invalid bids  #"
echo "#    Test auction bids decryption    #"
echo "#       Test auction settlement      #"
echo "######################################"
echo ""

CHAIN_HOME=devnet_data/fairyring_devnet
CHAIN_ID=fairyring_devnet
CHAIN_NODE=tcp://127.0.0.1:26657

check_tx_code () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != "0" ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    exit 1
  fi
}

wait_for_tx () {
  sleep 2
  local TXHASH=$(echo "$1" | jq -r '.txhash')
  RESULT=$(fairyringd q tx --type=hash $TXHASH --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
  echo "$RESULT"
}

WALLET_1_ADDR=$(fairyringd keys show wallet1 -a --keyring-backend test --home $CHAIN_HOME)
WALLET_2_ADDR=$(fairyringd keys show wallet2 -a --keyring-backend test --home $CHAIN_HOME)


echo "Creating new account for testing insufficient fund for registering as a bidder in auction module"
ACC_INFO=$(fairyringd keys add new_temp --home $CHAIN_HOME --keyring-backend test --output json)
echo $ACC_INFO
NEW_ACC_ADDR=$(echo $ACC_INFO | jq -r '.address')

OUT=$(fairyringd tx bank send $WALLET_1_ADDR $NEW_ACC_ADDR 1ufairy --from wallet1 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE  -o json)
check_tx_code $OUT
OUT=$(wait_for_tx $OUT)

echo "Sent 1 ufairy to new account: $NEW_ACC_ADDR"

echo "Registering as a bidder with insufficient funds to delegate"
OUT=$(fairyringd tx auction register-bidder --from new_temp --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE  -o json)
check_tx_code $OUT
OUT=$(wait_for_tx $OUT)

MSG=$(echo $OUT | jq -r '.raw_log')
if [[ "$MSG" != *"insufficient funds to register as a bidder"* ]]; then
  echo "ERROR: Auction module register bidder with insufficient funds error. Expected tx to failed with error insufficient funds, got '$MSG'"
  echo "ERROR MESSAGE: $MSG"
  exit 1
fi
echo "Tx failed with insufficient funds as expected."

bal=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance before registering as a bidder: $bal ufairy"

echo "Registering as a bidder with sufficient funds to delegate"
OUT=$(fairyringd tx auction register-bidder --from wallet1 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE  -o json)
check_tx_code $OUT
OUT=$(wait_for_tx $OUT)
echo "Account successfully registered as a bidder"

echo "Registered bidders info:"
OUT=$(fairyringd q auction registered-bidders --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
INFO=$(echo $OUT | jq -r '.bidders[0]')
ACTIVE=$(echo $INFO | jq -r '.active')
if [[ "$ACTIVE" != "true" ]]; then
  echo "ERROR: Auction module register bidder with sufficient funds error. Expected sender registered as bidder without error"
  echo "Current bidders: $OUT"
  exit 1
fi
echo $INFO | jq
echo "Account with sufficient balance successfully registered as bidder"

bal_after=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance after registering as a bidder: $bal_after ufairy"
if [[ "$bal_after" == "$bal" ]]; then
  echo "ERROR: Auction module register bidder error. Expected bidder balance to be deducted, before balance: $bal, after: $bal_after"
  exit 1
fi
echo "Balance successfully deducted after registering as a bidder"

echo "Testing deregister bidder"
OUT=$(fairyringd tx auction deregister-bidder --from wallet1 --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE --keyring-backend test --yes -o json)
check_tx_code $OUT
OUT=$(wait_for_tx $OUT)

bal_dereg=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance after deregistering as a bidder: $bal_dereg ufairy"
if [[ "$bal_after" == "$bal_dereg" ]]; then
  echo "ERROR: Auction module deregister bidder error. Expected bidder balance to be increased, before balance: $bal_after, after: $bal_dereg"
  exit 1
fi
echo "Delegation for registering as a bidder successfully refunded to bidder after deregistering"

echo "Registering to be a bidder again for testing timed auction with bids"
OUT=$(fairyringd tx auction register-bidder --from wallet1 --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE --keyring-backend test --yes -o json)
check_tx_code $OUT
OUT=$(wait_for_tx $OUT)

echo "Testing timed auction with no bid"
height=$(fairyringd q pep latest-height --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE --output json | jq -r '.height')
target_height=$((height + 3))
out=$(fairyringd tx auction create-auction $target_height true ufairy --from wallet1 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)
sleep 5
echo "All auctions:"
out=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[0]')
echo $out | jq
resolved=$(echo $out | jq -r '.is_resolved')
if [[ "$resolved" != "true" ]]; then
  echo "ERROR: Auction module timed auction error, expected auction resolved by now"
  exit 1
fi
echo "Timed auction without bids successfully resolved automatically."

echo ""
echo "Testing timed auction with single bid"

bal=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance before placing bid: $bal"

creator_bal=$(fairyringd q bank balances $WALLET_2_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance before creating auction: $creator_bal"

height=$(fairyringd q pep latest-height --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE --output json | jq -r '.height')
target_height=$((height + 10))
out=$(fairyringd tx auction create-auction $target_height true ufairy --from wallet2 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)

auction_1=$(fairyringd q auction list-auction --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json | jq -r '.auction_details[1]')

pubkey_1=$(echo $auction_1 | jq -r '.pubkey')
id_1=$(echo $auction_1 | jq -r '.identity')

bid=$(fairyringd encrypt-bid $target_height $pubkey_1 "1ufairy")

echo "Encrypted with pubkey: $pubkey_1 and ID: $target_height"
out=$(fairyringd tx auction place-bid $id_1 $bid --from wallet1 --keyring-backend test --gas 300000 --home $CHAIN_HOME --yes --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)

echo "After placing bid, all auctions:"
sleep 8
out=$(fairyringd q auction list-auction --node $CHAIN_NODE -o json | jq -r '.auction_details[1]')
echo $out | jq

bal_after=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
if [[ "$bal_after" == "$bal" ]]; then
  echo "ERROR: Auction module auction settlement winner balance deduction error. Expected bidder balance to be decreased, before balance: $bal, after: $bal_after"
  exit 1
fi
echo "Bidder Balance after placing bid and winning: $bal_after ufairy"

creator_bal_after=$(fairyringd q bank balances $WALLET_2_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
if [[ "$creator_bal_after" == "$creator_bal" ]]; then
  echo "ERROR: Auction module auction settlement auction creator balance error. Expected auction creator balance to be increased, before balance: $creator_bal, after: $creator_bal_after"
  exit 1
fi
echo "Auction creator balance after auction settlement: $creator_bal_after ufairy"

echo ""
echo "Test not registered bidder trying to place bid"

height=$(fairyringd q pep latest-height --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE --output json | jq -r '.height')
target_height=$((height + 10))
out=$(fairyringd tx auction create-auction $target_height true ufairy --from wallet2 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)

auction_2=$(fairyringd q auction list-auction --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json | jq -r '.auction_details[2]')

pubkey_2=$(echo $auction_2 | jq -r '.pubkey')
id_2=$(echo $auction_2 | jq -r '.identity')

bid=$(fairyringd encrypt-bid $target_height $pubkey_2 "1ufairy")

echo "Encrypted with pubkey: $pubkey_2 and ID: $target_height"
out=$(fairyringd tx auction place-bid $id_2 $bid --from new_temp --keyring-backend test --gas 300000 --home $CHAIN_HOME --yes --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)

MSG=$(echo $out | jq -r '.raw_log')
echo $MSG
if [[ "$MSG" != *"bid creator is not a registered bidder in auction module"* ]]; then
  echo "ERROR: Auction module unregistered bidder place bid error. Expected tx to failed with error not registered bidder, got '$MSG'"
  echo "ERROR MESSAGE: $MSG"
  exit 1
fi
echo "Tx failed with not registered bidder as expected."


echo
echo "Testing timed auction with invalid bid (bid > balance)"
bal=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance before placing bid: $bal"

creator_bal=$(fairyringd q bank balances $WALLET_2_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
echo "Balance before creating auction: $creator_bal"

height=$(fairyringd q pep latest-height --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE --output json | jq -r '.height')
target_height=$((height + 10))
out=$(fairyringd tx auction create-auction $target_height true ufairy --from wallet2 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)

auction_1=$(fairyringd q auction list-auction --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json | jq -r '.auction_details[3]')

pubkey_1=$(echo $auction_1 | jq -r '.pubkey')
id_1=$(echo $auction_1 | jq -r '.identity')

bid=$(fairyringd encrypt-bid $target_height $pubkey_1 "999999999999999ufairy")

echo "Encrypted with pubkey: $pubkey_1 and ID: $target_height"
out=$(fairyringd tx auction place-bid $id_1 $bid --from wallet1 --keyring-backend test --gas 300000 --home $CHAIN_HOME --yes --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
check_tx_code $out
out=$(wait_for_tx $out)

echo "After placing bid, all auctions:"
sleep 8
out=$(fairyringd q auction list-auction --node $CHAIN_NODE -o json | jq -r '.auction_details[3]')
echo $out | jq

creator_bal_after=$(fairyringd q bank balances $WALLET_2_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
if [[ "$creator_bal_after" != "$creator_bal" ]]; then
  echo "ERROR: Auction module auction settlement auction creator balance error. Expected auction creator balance to be the same, before balance: $creator_bal, after: $creator_bal_after"
  exit 1
fi
echo "Auction creator balance after auction settlement: $creator_bal_after ufairy"

echo "Registered bidders info:"
OUT=$(fairyringd q auction registered-bidders --home $CHAIN_HOME --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
INFO=$(echo $OUT | jq -e '.bidders')
if [[ $? -ne 0 ]]; then
  echo "Bidder placed invalid bid is removed from the registered bidders set as expected."
else
  echo "ERROR: Auction module invalid bid error. Expected invalid bid creator to be removed from the registered bidder."
  echo "Current bidders: $OUT"
  exit 1
fi

bal_after=$(fairyringd q bank balances $WALLET_1_ADDR --home $CHAIN_HOME --node $CHAIN_NODE -o json | jq -r '.balances[0].amount')
if [[ "$bal_after" != "$bal" ]]; then
  echo "ERROR: Auction module auction settlement invalid bid error. Expected bidder balance to be the same, before balance: $bal, after: $bal_after"
  exit 1
fi
echo "Bidder Balance after placing invalid bid: $bal_after ufairy"

#echo
#echo
#echo "Testing timed auction with 1 block duration"
#height=$(fairyringd q pep latest-height --output json | jq -r '.height')
#target_height=$((height + 3))
#
#id_1="auction/fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq/$target_height/0"
#pubkey_1=$(fairyringd q keyshare show-active-pub-key -o json | jq -r '.active_pubkey.public_key')
#bid_1=$(fairyringd encrypt-bid $target_height $pubkey_1 "1ufairy")
#
#out=$(fairyringd tx auction place-bid $id_1 $bid_1 --from wallet2 --keyring-backend test --gas 300000 --home $CHAIN_HOME --yes --chain-id $CHAIN_ID --output json)
#fairyringd tx auction create-auction $target_height true ufairy --from wallet1 --keyring-backend test --yes --home $CHAIN_HOME --chain-id $CHAIN_ID
#
#echo "Encrypted with pubkey: $pubkey_1 and ID: $target_height"
#echo "using id: $id_1"
#
#echo "place bid txid: $(echo $out | jq '.txhash')"
#
#echo "After placing bids, all auctions:"
#sleep 1.5
#out=$(fairyringd q auction list-auction -o json | jq -r '.auction_details[1]')
#echo $out | jq