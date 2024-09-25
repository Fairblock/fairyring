#!/bin/zsh

WORKING_DIR="$HOME/.chain_upgrade_test_env"
GIT_FAIRYRING_REPO=https://github.com/Fairblock/fairyring.git
GO_VERSION_FROM=system
GO_VERSION_TO=system
GIT_TAG_UPGRADE_FROM=v0.8.3
GIT_TAG_UPGRADE_TO=main

BINARY=fairyringd
BINARY_FULL_PATH=$WORKING_DIR/$GIT_TAG_UPGRADE_FROM/build/$BINARY
UPGRADER=cosmovisor

##################
# Setup Binaries #
##################
#
#echo "This script require 'cosmovisor' and 'gvm' installed"
#
#echo "Cleaning up the testing environment"
#rm -rf $WORKING_DIR &> /dev/null
#
#echo "Creating testing environment: $WORKING_DIR"
#if ! mkdir -p $WORKING_DIR 2>/dev/null; then
#    echo "Failed to create chain upgrade testing environment. Aborting..."
#    exit 1
#fi
#
#echo "Cloning $BINARY repo"
#if ! cd "$WORKING_DIR" 2>/dev/null; then
#  echo "Failed to change dir to $WORKING_DIR. Aborting..."
#fi
#
#[[ -s "$GVM_ROOT/scripts/gvm" ]] && source "$GVM_ROOT/scripts/gvm"
#
#echo "Installing $GIT_TAG_UPGRADE_FROM $BINARY"
#git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_FROM
#cd "$WORKING_DIR/$GIT_TAG_UPGRADE_FROM"
#git checkout $GIT_TAG_UPGRADE_FROM
#echo "Building the 'Upgrade From' $BINARY"
#gvm use $GO_VERSION_FROM
#go mod tidy
#make build

#echo "Installing $GIT_TAG_UPGRADE_TO $BINARY"
#cd "$WORKING_DIR"
#git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_TO
cd "$WORKING_DIR/$GIT_TAG_UPGRADE_TO"
echo $GIT_TAG_UPGRADE_TO
#git checkout $GIT_TAG_UPGRADE_TO
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
$BINARY_FULL_PATH genesis add-genesis-account validator 100000000000ufairy,10000000000000stake --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis add-genesis-account wallet1 100000000000ufairy,10000000000000stake --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis gentx validator 10000000000stake --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH genesis collect-gentxs --home $CHAIN_HOME

export DAEMON_NAME=$BINARY
export DAEMON_HOME=$CHAIN_HOME
export DAEMON_RESTART_AFTER_UPGRADE=true

$UPGRADER init $WORKING_DIR/$GIT_TAG_UPGRADE_FROM/build/$BINARY

VALIDATOR_1=$($BINARY keys show validator -a --keyring-backend test --home $CHAIN_HOME)
sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VALIDATOR_1"'"\]/g' $CHAIN_HOME/config/genesis.json
sed -i -e 's/"key_expiry": "100"/"key_expiry": "10000"/g' $CHAIN_HOME/config/genesis.json
sed -i -e 's/"is_source_chain": false/"is_source_chain": true/g' $CHAIN_HOME/config/genesis.json

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


BINARY=$BINARY_FULL_PATH
CHAINID_1=$CHAIN_ID
BLOCK_TIME=6

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_HOME)
VALIDATOR_1=$($BINARY keys show validator -a --keyring-backend test --home $CHAIN_HOME)

check_tx_code () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != 0 ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    exit 1
  fi
}

wait_for_tx () {
  sleep $BLOCK_TIME
  local TXHASH=$(echo "$1" | jq -r '.txhash')
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_HOME --chain-id $CHAINID_1 -o json)
  echo "$RESULT"
}


echo "Staked account registering as a validator on chain $CHAINID_1"
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("validator"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

GENERATED_RESULT=$($BINARY share-generation generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')
COMMITS=$(echo "$GENERATED_RESULT" | jq -r '.Commitments[0]')

echo "Trusted address submit pub key on chain $CHAINID_1"
RESULT=$($BINARY tx keyshare create-latest-pub-key $PUB_KEY $COMMITS 1 '[{"data":"'"$GENERATED_SHARE"'","validator":"'"$VALIDATOR_1"'"}]' --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("pubkey"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_HOME -o json | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.KeyShare')

echo "Registered validator submit valid key share on chain $CHAINID_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
AGGRED_SHARE=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("keyshare-aggregated"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("data"))))[]' | jq -r '.value')
if [ "$AGGRED_SHARE" != $EXTRACTED_SHARE ]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the aggregated key to be $EXTRACTED_SHARE, got '$AGGRED_SHARE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo $RESULT | jq
exit 1
fi

./scripts/tests/keyshareSender.sh $BINARY $CHAIN_HOME tcp://localhost:26657 $VALIDATOR_1 $CHAINID_1 > $WORKING_DIR/keyshareSender.log 2>&1 &


echo "Query submitted key share on chain $CHAINID_1"
RESULT=$($BINARY query keyshare list-key-share -o json)
RESULT_SENDER=$(echo "$RESULT" | jq -r '.keyShare[0].validator')
RESULT_KEYSHARE=$(echo "$RESULT" | jq -r '.keyShare[0].keyShare')
RESULT_HEIGHT=$(echo "$RESULT" | jq -r '.keyShare[0].blockHeight')
if [ "$RESULT_SENDER" != "$VALIDATOR_1" ] && [ "$RESULT_KEYSHARE" != "$EXTRACTED_SHARE" ] && [ "$RESULT_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module query submitted key share error, Expected to get the submitted key share, got '$RESULT'"
  echo $RESULT | jq
exit 1
fi
echo "Key Share Successfully submitted: '$RESULT_KEYSHARE' for height '$RESULT_HEIGHT'"


echo "Query aggregated key share on chain $CHAINID_1"
RESULT=$($BINARY query keyshare list-aggregated-key-share -o json)
RESULT_HEIGHT=$(echo "$RESULT" | jq -r '.aggregatedKeyShare[0].height')
RESULT_DATA=$(echo "$RESULT" | jq -r '.aggregatedKeyShare[0].data')
if [ "$RESULT_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module aggregate key share error. Expected to get an aggregated key, got '$RESULT'"
  echo $RESULT | jq
exit 1
fi
echo "Key Share Successfully aggregated: '$RESULT_DATA'"

# PEP

echo "Query account pep nonce before submitting encrypted tx from pep module on chain $CHAINID_1"
RESULT=$($BINARY query pep show-pep-nonce $VALIDATOR_1 --home $CHAIN_HOME --chain-id $CHAINID_1 -o json)
VALIDATOR_PEP_NONCE_BEFORE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')
if [ "$VALIDATOR_PEP_NONCE_BEFORE" != "1" ]; then
  echo "ERROR: Pep module query Pep Nonce error. Expected Pep Nonce to be 1, got '$VALIDATOR_PEP_NONCE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Query target account token balance before submitting encrypted tx from pep module on chain $CHAINID_1"
RESULT=$($BINARY query bank balances $WALLET_1 -o json)
echo $RESULT
echo $TARGET_BAL_DENOM
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL $TARGET_BAL_DENOM before encrypted bank send tx"


echo "Signing bank send tx with pep nonce: '$VALIDATOR_PEP_NONCE_BEFORE'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $VALIDATOR_1 $WALLET_1 1$TARGET_BAL_DENOM --from $VALIDATOR_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --keyring-backend test --generate-only -o json -y > unsigned.json
SIGNED_DATA=$($BINARY tx sign unsigned.json --from $VALIDATOR_1 --offline --account-number 0 --sequence $VALIDATOR_PEP_NONCE_BEFORE --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1  --keyring-backend test -y)

CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_HOME  -o json | jq -r '.block.header.height')
TARGET_BLOCK=$(($CURRENT_BLOCK+5))
echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
CIPHER=$($BINARY encrypt $TARGET_BLOCK "" $SIGNED_DATA --node $CHAIN1_NODE)

rm -r unsigned.json &> /dev/null

RESULT=$($BINARY query bank balances $VALIDATOR_1 -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance before submitting encrypted tx: $BAL_AMT$BAL_DENOM"


echo "Submit encrypted tx to pep module on chain $CHAINID_1"
RESULT=$($BINARY tx pep submit-encrypted-tx $CIPHER $TARGET_BLOCK --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
TARGET_HEIGHT=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("new-encrypted-tx-submitted"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("height"))))[]' | jq -r '.value')
if [ "$TARGET_HEIGHT" != "$TARGET_BLOCK" ]; then
  echo "ERROR: Pep module submit encrypted tx error. Expected tx to submitted without error with target height '$TARGET_BLOCK', got '$TARGET_HEIGHT' and '$EVENT_TYPE' | '$CURRENT_BLOCK'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq '.')"
  echo $RESULT | jq
  exit 1
fi


RESULT=$($BINARY query bank balances $VALIDATOR_1 -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance after submitting first encrypted tx: $BAL_AMT$BAL_DENOM"


echo "Query target account token balance after encrypted tx being executed from pep module on chain $CHAINID_1"
RESULT=$($BINARY query bank balances $WALLET_1 -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"
if [ "$TARGET_BAL_AFTER" == "$TARGET_BAL" ]; then
  echo "ERROR: Pep module encrypted tx execution error. Expected Target Balance to be updated, got same balance: '$TARGET_BAL_AFTER $TARGET_BAL_DENOM'"
  exit 1
fi

RESULT=$($BINARY query bank balances $VALIDATOR_1 -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance after encrypted tx execution: $BAL_AMT$BAL_DENOM"

echo "Run 'pkill fairyringd' later to stop fairyring"