#!/bin/bash

ACCOUNTNAME=validator_account
INIT_TOKEN_AMT=100000000stake,100000000000frt
STAKE_AMT=100000000stake

if [ -f "/root/DONE" ]
then
  fairyringd start
else
  fairyringd init $1

  fairyringd keys add $ACCOUNTNAME --keyring-backend test

  VALIDATOR_ADDRESS=$(fairyringd keys show $ACCOUNTNAME -a --keyring-backend test)

  echo "Created $ACCOUNTNAME Account, Address: $VALIDATOR_ADDRESS"

  fairyringd add-genesis-account "$VALIDATOR_ADDRESS" $INIT_TOKEN_AMT --keyring-backend test

  fairyringd gentx $ACCOUNTNAME $STAKE_AMT --keyring-backend test

  echo "Done Setup"
fi

