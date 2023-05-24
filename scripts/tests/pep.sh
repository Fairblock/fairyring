#!/bin/bash

echo ""
echo "###########################################################"
echo "# Test Encrypted Tx Verification & Decryption & Execution #"
echo "#   Submit Valid & Invalid Aggregated Key to Pep Module   #"
echo "#    Submit Valid & Invalid Encrypted Tx to Pep Module    #"
echo "#        Test Pep Nonce Increment on Encrypted Tx         #"
echo "###########################################################"
echo ""

BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)