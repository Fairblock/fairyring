#!/bin/bash

echo ""
echo "###########################################################"
echo "#           Setting up Relayer between two chain          #"
echo "###########################################################"
echo ""


CHAINID_1=fairyring_test_1
CHAINID_2=lazychain_pep

echo "Creating channel..."

hermes --config ./scripts/tests/lazychain/relayer_configs/hermes_config.toml create channel --new-client-connection --a-chain $CHAINID_1 --b-chain $CHAINID_2 --a-port keyshare --b-port pep --channel-version keyshare-1 --yes

echo "Setting up go relayer..."

rly chains add --file ./scripts/tests/lazychain/relayer_configs/fairyring_test_1.json fairyring_test_1
rly chains add --file ./scripts/tests/lazychain/relayer_configs/lazychain_pep.json lazychain_pep

rly keys restore lazychain_pep default "record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"
rly keys restore fairyring_test_1 default "alley afraid soup fall idea toss can goose become valve initial strong forward bright dish figure check leopard decide warfare hub unusual join cart"

rly paths add lazychain_pep fairyring_test_1 fairyring_test_1-lazychain_pep --file ./scripts/tests/lazychain/relayer_configs/fairyring_test_1-lazychain_pep.json

echo "Starting relayer..."
rly start fairyring_test_1-lazychain_pep > ./data/relayer.log 2>&1 &

echo ""
echo "###########################################################"
echo "#      Successfully Setup Relayer between two chain       #"
echo "###########################################################"
echo ""