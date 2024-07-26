#!/bin/zsh

WORKING_DIR="$HOME/.chain_upgrade_test_env"
GIT_FAIRYRING_REPO=https://github.com/Fairblock/fairyring.git
GO_VERSION_FROM=go1.21
GO_VERSION_TO=system
GIT_TAG_UPGRADE_FROM=v0.6.0
GIT_TAG_UPGRADE_TO=update-cosmos-sdk-v0.50.6

BINARY=fairyringd
BINARY_FULL_PATH=$WORKING_DIR/$GIT_TAG_UPGRADE_FROM/build/$BINARY
UPGRADER=cosmovisor

##################
# Setup Binaries #
##################

echo "This script require 'cosmovisor' and 'gvm' installed"

echo "Cleaning up the testing environment"
rm -rf $WORKING_DIR &> /dev/null

echo "Creating testing environment: $WORKING_DIR"
if ! mkdir -p $WORKING_DIR 2>/dev/null; then
    echo "Failed to create chain upgrade testing environment. Aborting..."
    exit 1
fi

echo "Cloning $BINARY repo"
if ! cd "$WORKING_DIR" 2>/dev/null; then
  echo "Failed to change dir to $WORKING_DIR. Aborting..."
fi

[[ -s "$GVM_ROOT/scripts/gvm" ]] && source "$GVM_ROOT/scripts/gvm"

echo "Installing $GIT_TAG_UPGRADE_FROM $BINARY"
git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_FROM
cd "$WORKING_DIR/$GIT_TAG_UPGRADE_FROM"
git checkout $GIT_TAG_UPGRADE_FROM
echo "Building the 'Upgrade From' $BINARY"
gvm use $GO_VERSION_FROM
go mod tidy
make build

echo "Installing $GIT_TAG_UPGRADE_TO $BINARY"
cd "$WORKING_DIR"
git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_TO
cd "$WORKING_DIR/$GIT_TAG_UPGRADE_TO"
git checkout $GIT_TAG_UPGRADE_TO
echo "Building the 'Upgrade To' $BINARY"
gvm use $GO_VERSION_TO
go mod tidy
make build

###############
# Setup Chain #
###############

echo "Setting up the chain for testing..."

CHAIN_ID=test_chain_upgrade
CHAIN_HOME=$WORKING_DIR/chain_data
UPGRADE_NAME="$GIT_TAG_UPGRADE_FROM-to-$GIT_TAG_UPGRADE_TO"

cd "$WORKING_DIR/$GIT_TAG_UPGRADE_FROM"

$BINARY_FULL_PATH config chain-id test
$BINARY_FULL_PATH config keyring-backend test
$BINARY_FULL_PATH config broadcast-mode sync
$BINARY_FULL_PATH init test --chain-id $CHAIN_ID --home $CHAIN_HOME --overwrite

cat <<< $(jq '.app_state.gov.params.voting_period = "20s"' $CHAIN_HOME/config/genesis.json) > $CHAIN_HOME/config/genesis.json

$BINARY_FULL_PATH keys add validator --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH add-genesis-account validator 100000000000stake --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH gentx validator 1000000stake --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH collect-gentxs --home $CHAIN_HOME

export DAEMON_NAME=$BINARY
export DAEMON_HOME=$CHAIN_HOME
export DAEMON_RESTART_AFTER_UPGRADE=true

$UPGRADER init $WORKING_DIR/$GIT_TAG_UPGRADE_FROM/build/$BINARY

$UPGRADER run start --home $CHAIN_HOME --log_format json > $WORKING_DIR/$GIT_TAG_UPGRADE_FROM.log 2>&1 &

#######################
# Setup Chain Upgrade #
#######################

UPGRADE_PROPOSAL=$(cat <<-EOF
  {
    "messages": [
      {
        "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
        "authority": "fairy10d07y265gmmuvt4z0w9aw880jnsr700j5c6f67",
        "plan": {
          "name": "$UPGRADE_NAME",
          "time": "0001-01-01T00:00:00Z",
          "height": "10",
          "info": "",
          "upgraded_client_state": null
        }
      }
    ],
    "metadata": "ipfs://CID",
    "deposit": "10000000stake",
    "title": "chain-upgrade",
    "summary": "f"
  }
EOF
)

cd $WORKING_DIR

echo $UPGRADE_PROPOSAL > upgrade_proposal.json

echo "Setting up the chain upgrade..."
$UPGRADER add-upgrade $UPGRADE_NAME $WORKING_DIR/$GIT_TAG_UPGRADE_TO/build/$BINARY

sleep 10

$BINARY_FULL_PATH tx gov submit-proposal upgrade_proposal.json --from validator --keyring-backend test --home $CHAIN_HOME --yes
sleep 3
$BINARY_FULL_PATH tx gov vote 1 yes --from validator --yes --keyring-backend test --home $CHAIN_HOME

echo "Run 'pkill fairyringd' later to stop fairyring"