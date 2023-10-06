#!/bin/bash

ACCOUNTNAME=validator_account
INIT_TOKEN_AMT=10000000000000ufairy
STAKE_AMT=100000000000ufairy

if [ -f "/root/DONE" ]
then
  fairyringd start
else
  fairyringd init $1 --chain-id 'fairytest-1' --default-denom 'ufairy'

  fairyringd keys add $ACCOUNTNAME --keyring-backend test
  fairyringd keys add alice --keyring-backend test
  fairyringd keys add bob --keyring-backend test

  VALIDATOR_ADDRESS=$(fairyringd keys show $ACCOUNTNAME -a --keyring-backend test)
  ALICE_ADDRESS=$(fairyringd keys show alice -a --keyring-backend test)
  BOB_ADDRESS=$(fairyringd keys show bob -a --keyring-backend test)

  echo "Created $ACCOUNTNAME Account, Address: $VALIDATOR_ADDRESS"
  echo "Created alice Account, Address: $ALICE_ADDRESS"
  echo "Created bob Account, Address: $BOB_ADDRESS"

  fairyringd add-genesis-account "$VALIDATOR_ADDRESS" $INIT_TOKEN_AMT --keyring-backend test
  fairyringd add-genesis-account "$ALICE_ADDRESS" $INIT_TOKEN_AMT --keyring-backend test
  fairyringd add-genesis-account "$BOB_ADDRESS" $INIT_TOKEN_AMT --keyring-backend test

  fairyringd gentx $ACCOUNTNAME $STAKE_AMT --keyring-backend test

  echo "Done Setup"
fi