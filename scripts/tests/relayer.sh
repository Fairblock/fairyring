#!/bin/bash

echo ""
echo "###########################################################"
echo "#           Setting up Relayer between two chain          #"
echo "###########################################################"
echo ""


CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2
CONFIG_FILE=hermes_config.toml

echo "Creating client on both chain..."
hermes --config $CONFIG_FILE create client --host-chain $CHAINID_1 --reference-chain $CHAINID_2
hermes --config $CONFIG_FILE create client --host-chain $CHAINID_2 --reference-chain $CHAINID_1

echo "Creating connection..."
hermes --config $CONFIG_FILE create connection --a-chain $CHAINID_1 --a-client 07-tendermint-0 --b-client 07-tendermint-0

echo "Creating channel..."
hermes --config $CONFIG_FILE create channel --a-chain $CHAINID_1 --a-connection connection-0 --a-port pep --b-port pep --channel-version pep-1


echo ""
echo "###########################################################"
echo "#      Successfully Setup Relayer between two chain       #"
echo "###########################################################"
echo ""