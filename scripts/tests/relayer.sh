#!/bin/bash

echo ""
echo "###########################################################"
echo "#           Setting up Relayer between two chain          #"
echo "###########################################################"
echo ""


CHAINID_1=fairyring_test_1
CHAINID_2=fairyring_test_2
CONFIG_FILE=hermes_config.toml

echo "Creating channel..."
hermes --config $CONFIG_FILE create channel --new-client-connection --a-chain $CHAINID_2 --b-chain $CHAINID_1 --a-port gov --b-port keyshare --channel-version keyshare-1 --yes
hermes --config $CONFIG_FILE create channel --a-chain $CHAINID_2 --a-connection connection-0 --a-port pep --b-port keyshare --channel-version keyshare-1


echo ""
echo "###########################################################"
echo "#      Successfully Setup Relayer between two chain       #"
echo "###########################################################"
echo ""