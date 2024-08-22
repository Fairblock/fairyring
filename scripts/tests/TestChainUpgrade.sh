#!/bin/zsh

WORKING_DIR="$HOME/.chain_upgrade_test_env"
GIT_FAIRYRING_REPO=https://github.com/Fairblock/fairyring.git
GO_VERSION_FROM=system
GO_VERSION_TO=system
GIT_TAG_UPGRADE_FROM=v0.8.2
GIT_TAG_UPGRADE_TO=0.8.3-release

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

$BINARY_FULL_PATH config set client chain-id $CHAIN_ID --home $CHAIN_HOME
$BINARY_FULL_PATH config set client keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH config set client broadcast-mode sync --home $CHAIN_HOME
$BINARY_FULL_PATH config set app minimum-gas-prices 0ufairy --home $CHAIN_HOME
$BINARY_FULL_PATH init test --chain-id $CHAIN_ID --home $CHAIN_HOME --overwrite

cat <<< $(jq '.app_state.gov.params.voting_period = "20s"' $CHAIN_HOME/config/genesis.json) > $CHAIN_HOME/config/genesis.json
cat <<< $(jq '.app_state.gov.params.expedited_voting_period = "10s"' $CHAIN_HOME/config/genesis.json) > $CHAIN_HOME/config/genesis.json

$BINARY_FULL_PATH keys add validator --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH keys add wallet1 --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis add-genesis-account validator 100000000000stake --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis add-genesis-account wallet1 100000000000stake --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis gentx validator 1000000stake --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis collect-gentxs --home $CHAIN_HOME

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

$BINARY_FULL_PATH tx gov submit-proposal upgrade_proposal.json --from validator --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes
sleep 5
$BINARY_FULL_PATH tx gov vote 1 yes --from validator --yes --keyring-backend test --chain-id $CHAIN_ID --home $CHAIN_HOME
sleep 5
VAL_OP_ADDR=$($BINARY_FULL_PATH q staking validators -o json | jq -r '.validators[0].operator_address')

OUT=$($BINARY_FULL_PATH tx staking delegate $VAL_OP_ADDR 10stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Delegate Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"

sleep 5

VAL_ADDR=$($BINARY_FULL_PATH keys show validator --keyring-backend test --home $CHAIN_HOME -a)
WAL1_ADDR=$($BINARY_FULL_PATH keys show wallet1 --keyring-backend test --home $CHAIN_HOME -a)

OUT=$($BINARY_FULL_PATH tx bank send $WAL1_ADDR $VAL_ADDR 1stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Bank Send Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"
sleep 6
echo "Sequence after tx: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after tx: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

echo "Waiting chain to upgrade..."
sleep 45

echo "Sequence after upgrade: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after upgrade: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

OUT=$($BINARY_FULL_PATH tx bank send $WAL1_ADDR $VAL_ADDR 1stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Bank Send Tx After UPGRADE: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"
sleep 6

echo "Sequence after tx: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after tx: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

OUT=$($BINARY_FULL_PATH tx staking delegate $VAL_OP_ADDR 10stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Delegate Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"

sleep 5

VAL_ADDR=$($BINARY_FULL_PATH keys show validator --keyring-backend test --home $CHAIN_HOME -a)
WAL1_ADDR=$($BINARY_FULL_PATH keys show wallet1 --keyring-backend test --home $CHAIN_HOME -a)

OUT=$($BINARY_FULL_PATH tx bank send $WAL1_ADDR $VAL_ADDR 1stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Bank Send Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"
sleep 6
echo "Sequence after tx: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after tx: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"


echo "Run 'pkill fairyringd' later to stop fairyring"