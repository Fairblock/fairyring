#!/bin/zsh

WORKING_DIR="$HOME/.chain_upgrade_test_env"
GIT_FAIRYRING_REPO=https://github.com/Fairblock/fairyring.git
GIT_TAG_UPGRADE_FROM=v0.8.3
GIT_TAG_UPGRADE_TO=0.9.0-release
GIT_TAG_UPGRADE_TO_SECOND=fix-capability-store-error

BINARY=fairyringd
BINARY_FULL_PATH=$WORKING_DIR/$GIT_TAG_UPGRADE_FROM/build/$BINARY
NEW_BINARY_FULL_PATH=$WORKING_DIR/$GIT_TAG_UPGRADE_TO/build/$BINARY
NEW_2ND_BINARY_FULL_PATH=$WORKING_DIR/$GIT_TAG_UPGRADE_TO_SECOND/build/$BINARY
UPGRADER=cosmovisor

CURRENT_PATH=$(pwd)
BLOCK_TIME=6
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

echo "Installing $GIT_TAG_UPGRADE_FROM $BINARY"
git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_FROM
cd "$WORKING_DIR/$GIT_TAG_UPGRADE_FROM"
git checkout $GIT_TAG_UPGRADE_FROM
echo "Building the 'Upgrade From' $BINARY"
go mod tidy
make build

echo "Installing $GIT_TAG_UPGRADE_TO $BINARY"
cd "$WORKING_DIR"
git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_TO
cd "$WORKING_DIR/$GIT_TAG_UPGRADE_TO"
echo $GIT_TAG_UPGRADE_TO
git checkout $GIT_TAG_UPGRADE_TO
echo "Building the 'Upgrade To' $BINARY"
go mod tidy
make build

echo "Installing $GIT_TAG_UPGRADE_TO_SECOND $BINARY"
cd "$WORKING_DIR"
git clone $GIT_FAIRYRING_REPO $GIT_TAG_UPGRADE_TO_SECOND
cd "$WORKING_DIR/$GIT_TAG_UPGRADE_TO_SECOND"
echo $GIT_TAG_UPGRADE_TO_SECOND
git checkout $GIT_TAG_UPGRADE_TO_SECOND
echo "Building the 'Upgrade To' $BINARY"
go mod tidy
make build

###############
# Setup Chain #
###############

echo "Setting up the chain for testing..."

CHAIN_ID=test_chain_upgrade
CHAIN_HOME=$WORKING_DIR/chain_data
UPGRADE_NAME="$GIT_TAG_UPGRADE_FROM-to-$GIT_TAG_UPGRADE_TO"
UPGRADE_NAME_2ND="$GIT_TAG_UPGRADE_TO-to-$GIT_TAG_UPGRADE_TO_SECOND"

cd "$WORKING_DIR/$GIT_TAG_UPGRADE_FROM"

$BINARY_FULL_PATH config set client chain-id $CHAIN_ID --home $CHAIN_HOME
$BINARY_FULL_PATH config set client keyring-backend test --home $CHAIN_HOME
$BINARY_FULL_PATH config set client broadcast-mode sync --home $CHAIN_HOME
$BINARY_FULL_PATH config set app minimum-gas-prices 0ufairy --home $CHAIN_HOME
$BINARY_FULL_PATH init test --chain-id $CHAIN_ID --home $CHAIN_HOME --overwrite

cat <<< $(jq '.app_state.gov.params.voting_period = "20s"' $CHAIN_HOME/config/genesis.json) > $CHAIN_HOME/config/genesis.json
cat <<< $(jq '.app_state.gov.params.expedited_voting_period = "10s"' $CHAIN_HOME/config/genesis.json) > $CHAIN_HOME/config/genesis.json

VAL_MNEMONIC_1="clock post desk civil pottery foster expand merit dash seminar song memory figure uniform spice circle try happy obvious trash crime hybrid hood cushion"

echo $VAL_MNEMONIC_1 | $BINARY_FULL_PATH keys add validator --keyring-backend test --home $CHAIN_HOME --recover
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

UPGRADE_PROPOSAL_2ND=$(cat <<-EOF
  {
    "messages": [
      {
        "@type": "/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade",
        "authority": "fairy10d07y265gmmuvt4z0w9aw880jnsr700j5c6f67",
        "plan": {
          "name": "$UPGRADE_NAME_2ND",
          "time": "0001-01-01T00:00:00Z",
          "height": "20",
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
echo $UPGRADE_PROPOSAL_2ND > upgrade_proposal_2.json

echo "Setting up the chain upgrade..."
$UPGRADER add-upgrade $UPGRADE_NAME $WORKING_DIR/$GIT_TAG_UPGRADE_TO/build/$BINARY
$UPGRADER add-upgrade $UPGRADE_NAME_2ND $WORKING_DIR/$GIT_TAG_UPGRADE_TO_SECOND/build/$BINARY

sleep $(($BLOCK_TIME * 2))

$BINARY_FULL_PATH tx gov submit-proposal upgrade_proposal.json --from validator --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes
sleep $BLOCK_TIME
$BINARY_FULL_PATH tx gov vote 1 yes --from validator --yes --keyring-backend test --chain-id $CHAIN_ID --home $CHAIN_HOME
sleep $BLOCK_TIME
VAL_OP_ADDR=$($BINARY_FULL_PATH q staking validators -o json | jq -r '.validators[0].operator_address')

OUT=$($BINARY_FULL_PATH tx staking delegate $VAL_OP_ADDR 10stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Delegate Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"

sleep $BLOCK_TIME

VAL_ADDR=$($BINARY_FULL_PATH keys show validator --keyring-backend test --home $CHAIN_HOME -a)
WAL1_ADDR=$($BINARY_FULL_PATH keys show wallet1 --keyring-backend test --home $CHAIN_HOME -a)

OUT=$($BINARY_FULL_PATH tx bank send $WAL1_ADDR $VAL_ADDR 1stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Bank Send Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"
sleep $BLOCK_TIME
echo "Sequence after tx: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after tx: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

echo "Waiting chain to upgrade..."
sleep 45

echo "Sequence after upgrade: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after upgrade: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

echo "Submitting another proposal for chain upgrade"

$BINARY_FULL_PATH tx gov submit-proposal upgrade_proposal_2.json --from validator --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes
sleep $BLOCK_TIME
$BINARY_FULL_PATH tx gov vote 2 yes --from validator --yes --keyring-backend test --chain-id $CHAIN_ID --home $CHAIN_HOME
sleep $BLOCK_TIME

echo "Waiting chain to upgrade 2nd time..."
sleep 45

OUT=$($BINARY_FULL_PATH tx bank send $WAL1_ADDR $VAL_ADDR 1stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Bank Send Tx After UPGRADE: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"
sleep $BLOCK_TIME

echo "Sequence after tx: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after tx: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

OUT=$($BINARY_FULL_PATH tx staking delegate $VAL_OP_ADDR 10stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Delegate Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"

sleep $BLOCK_TIME

VAL_ADDR=$($BINARY_FULL_PATH keys show validator --keyring-backend test --home $CHAIN_HOME -a)
WAL1_ADDR=$($BINARY_FULL_PATH keys show wallet1 --keyring-backend test --home $CHAIN_HOME -a)

OUT=$($BINARY_FULL_PATH tx bank send $WAL1_ADDR $VAL_ADDR 1stake --from wallet1 --chain-id $CHAIN_ID --keyring-backend test --home $CHAIN_HOME --yes -o json)
echo "Sent Bank Send Tx: Code: $(echo $OUT | jq -r '.code'), Logs: $(echo $OUT | jq -r '.raw_log'), Hash: $(echo $OUT | jq -r '.txhash')"
sleep $BLOCK_TIME
echo "Sequence after tx: $($BINARY_FULL_PATH q auth account $WAL1_ADDR -o json | jq -r '.account.value.sequence'), Balance after tx: $($BINARY_FULL_PATH q bank balances $VAL_ADDR -o json | jq -r '.balances[0]')"

BINARY=$NEW_BINARY_FULL_PATH
CHAINID_1=$CHAIN_ID

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_HOME)
VALIDATOR_1=$($BINARY keys show validator -a --keyring-backend test --home $CHAIN_HOME)

check_tx_code () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" != 0 ]; then
    echo "ERROR: Tx failed with code: $TX_CODE"
    exit 1
  fi
}

check_tx_err () {
  local TX_CODE=$(echo "$1" | jq -r '.code')
  if [ "$TX_CODE" -eq 0 ]; then
    return 0
  else
    return 1
  fi
}

wait_for_tx () {
  sleep $BLOCK_TIME
  local TXHASH=$(echo "$1" | jq -r '.txhash')
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_HOME --chain-id $CHAINID_1 -o json)
  echo "$RESULT"
}

echo "###########################"
echo "# Testing Keyshare Module #"
echo "###########################"


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

sleep 2

CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_HOME -o json | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')

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

echo $(pwd)
echo $CURRENT_PATH
$CURRENT_PATH/scripts/tests/keyshareSender.sh $BINARY $CHAIN_HOME tcp://localhost:26657 $VALIDATOR_1 $CHAINID_1 > $WORKING_DIR/keyshareSender.log 2>&1 &

CONTRACT_DIR=$CURRENT_PATH/scripts/tests/fairyring_contract

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

echo "######################"
echo "# Testing PEP Module #"
echo "######################"

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
TARGET_BLOCK=$(($CURRENT_BLOCK+3))
echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
CIPHER=$($BINARY encrypt $TARGET_BLOCK "" $SIGNED_DATA --node tcp://localhost:26657)

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

sleep $(($BLOCK_TIME * 5))

echo "Query target account token balance after encrypted tx being executed from pep module on chain $CHAINID_1"
RESULT=$($BINARY query bank balances $WALLET_1 -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"
if [[ "$TARGET_BAL_AFTER" -eq "$TARGET_BAL" ]]; then
  echo "ERROR: Pep module encrypted tx execution error. Expected Target Balance to be updated, got same balance: '$TARGET_BAL_AFTER $TARGET_BAL_DENOM'"
  exit 1
fi

RESULT=$($BINARY query bank balances $VALIDATOR_1 -o json)
BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
BAL_AMT=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Balance after encrypted tx execution: $BAL_AMT$BAL_DENOM"


echo "############################"
echo "# Testing General Keyshare #"
echo "############################"

echo "Creating new General Enc Request in pep module on chain $CHAIN_ID"
RESULT=$($BINARY tx pep request-general-keyshare 30s testing123 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep $(($BLOCK_TIME * 2))

echo "Query general keyshare request on chain $CHAIN_ID"
LIST_KEYSHARE_REQ=$($BINARY query pep list-keyshare-req -o json)
IDENTITY=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].identity')
REQ_ID=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].request_id')
echo "Identity for keyshare request 1 is: $IDENTITY"


echo "Query account pep nonce before submitting encrypted tx from pep module on chain $CHAIN_ID"
RESULT=$($BINARY query pep show-pep-nonce $WALLET_1 --home $CHAIN_HOME --chain-id $CHAINID_1 -o json)
PEP_NONCE_BEFORE=$(echo "$RESULT" | jq -r '.pepNonce.nonce')

echo "Query target account token balance before submitting encrypted tx from pep module on chain $CHAIN_ID"
RESULT=$($BINARY query bank balances $VALIDATOR_1 -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL $TARGET_BAL_DENOM before encrypted bank send tx"


echo "Signing bank send tx with pep nonce: '$PEP_NONCE_BEFORE'"
echo "Sending 1 $TARGET_BAL_DENOM to target address"
$BINARY tx bank send $WALLET_1 $VALIDATOR_1 1$TARGET_BAL_DENOM --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --keyring-backend test --generate-only -o json -y > unsigned.json
SIGNED_DATA=$($BINARY tx sign unsigned.json --from $WALLET_1 --offline --account-number 1 --sequence $PEP_NONCE_BEFORE --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1  --keyring-backend test -y)

echo "Encrypting signed tx with Pub key: '$PUB_KEY'"
CIPHER=$($BINARY encrypt $IDENTITY "" $SIGNED_DATA --node tcp://localhost:26657)

rm -r unsigned.json &> /dev/null

echo "Submit general encrypted tx to pep module on chain $CHAIN_ID"
RESULT=$($BINARY tx pep submit-general-encrypted-tx $CIPHER $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep $BLOCK_TIME

echo "Query Keyshare request and check for encrypted tx"
TX=$($BINARY query pep show-keyshare-req $REQ_ID -o json | jq -r '.keyshare.tx_list.encryptedTx[0].data')
if [ "$TX" != "$CIPHER" ]; then
  echo "Submitting general encrypted tx failed. Expected: $CIPHER, got $TX"
  exit 1
fi

sleep $BLOCK_TIME

echo "Request Generation of Aggr keyshare"
RESULT=$($BINARY tx pep get-general-keyshare $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep $BLOCK_TIME

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $IDENTITY)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')

while true; do
  echo "Submitting General Key Share"

  RESULT=$($BINARY tx keyshare create-general-key-share "private-gov-identity" $IDENTITY $EXTRACTED_SHARE 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 15

echo "Query target account token balance after general encrypted tx being executed from pep module on chain $CHAIN_ID"
RESULT=$($BINARY query bank balances $VALIDATOR_1 -o json)
TARGET_BAL_DENOM=$(echo "$RESULT" | jq -r '.balances[0].denom')
TARGET_BAL_AFTER=$(echo "$RESULT" | jq -r '.balances[0].amount')
echo "Target account has: $TARGET_BAL_AFTER $TARGET_BAL_DENOM after encrypted bank send tx being executed, balance increased $(($TARGET_BAL_AFTER - $TARGET_BAL)) $TARGET_BAL_DENOM"
if [[ "$TARGET_BAL_AFTER" == "$TARGET_BAL" ]]; then
  echo "ERROR: Pep module encrypted tx execution error. Expected Target Balance to be updated, got same balance: '$TARGET_BAL_AFTER $TARGET_BAL_DENOM'"
  exit 1
fi


echo "############################"
echo "# Testing Private KeyShare #"
echo "############################"

SCEP_PUBKEY1="A/MdHVpitzHNSdD1Zw3kY+L5PEIPyd9l6sD5i4aIfXp9"
SCEP_PUBKEY2="Ak9iJuH5l5/XdmS6U+ojbutXnGzBnQf++HVOfKanVEc+"

SCEP_PRIV_KEY1="a267fb03b3e6dc381550ea0257ace31433698f16248ba111dfb75550364d31fe"
SCEP_PRIV_KEY2="ef1450bdc18396f2254f52d8c525c0d933a8f146ec2a681eaf319f5899f2f60d"

echo "Creating new Private Request in pep module on chain $CHAIN_ID"
RESULT=$($BINARY tx pep request-private-keyshare test_req_1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep $(($BLOCK_TIME * 2))

echo "Query private keyshare request on chain $CHAIN_ID"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $WALLET_1/test_req_1 --node tcp://localhost:26657 -o json)
echo $SHOW_PRIVATE_REQ
REQ_ID=$(echo $SHOW_PRIVATE_REQ | jq -r '.req_id')
echo "Identity for private keyshare request 1 is: $REQ_ID"

sleep $(($BLOCK_TIME * 2))

echo "Requesting for private keyshares on Source chain"
RESULT=$($BINARY tx pep get-private-keyshare $REQ_ID $SCEP_PUBKEY1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep $(($BLOCK_TIME * 2))

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')

ENC_KS=$($BINARY secp-encrypter -p "$SCEP_PUBKEY1" -k "$EXTRACTED_SHARE")

# echo $ENC_KS

while true; do
  echo "Submitting Private Key Share"

  RESULT=$($BINARY tx keyshare submit-encrypted-keyshare $REQ_ID $WALLET_1 $ENC_KS 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [[ $? -eq 0 ]]; then
    break
  fi
done

sleep $(($BLOCK_TIME * 2))

echo "Query private keyshare request on chain $CHAIN_ID"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $WALLET_1/test_req_1 --node tcp://localhost:26657 -o json)
ENC_KEYSHARES=$(echo "$SHOW_PRIVATE_REQ" | jq -r '.encrypted_keyshares')

if [ "$ENC_KEYSHARES" = "[]" ]; then
  echo "encrypted_keyshares is empty."
  exit 1
fi

echo $SHOW_PRIVATE_REQ

echo "Sending get private keyshare request without previous entry"
REQ_ID="test_req_dummy_1"
RESULT=$($BINARY tx pep get-private-keyshare $REQ_ID $SCEP_PUBKEY1 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep $(($BLOCK_TIME * 2))

echo "Query private keyshare request on chain $CHAIN_ID"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node tcp://localhost:26657 -o json)
echo $SHOW_PRIVATE_REQ

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')

ENC_KS=$($BINARY secp-encrypter -p "$SCEP_PUBKEY1" -k "$EXTRACTED_SHARE")

while true; do
  echo "Submitting Private Key Share"

  RESULT=$($BINARY tx keyshare submit-encrypted-keyshare $REQ_ID $WALLET_1 $ENC_KS 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [[ $? -eq 0 ]]; then
    break
  fi
done

sleep $(($BLOCK_TIME * 2))

echo "Query private keyshare request on chain $CHAIN_ID"
SHOW_PRIVATE_REQ=$($BINARY query pep show-private-keyshare-req $REQ_ID --node tcp://localhost:26657 -o json)
ENC_KEYSHARES=$(echo "$SHOW_PRIVATE_REQ" | jq -r '.encrypted_keyshares')

if [ "$ENC_KEYSHARES" = "[]" ]; then
  echo "encrypted_keyshares is empty."
  exit 1
fi

echo $SHOW_PRIVATE_REQ

echo "############################"
echo "# Testing Decryption Query #"
echo "############################"

echo "Query general keyshare request on chain $CHAIN_ID"
LIST_KEYSHARE_REQ=$($BINARY query pep list-keyshare-req --node tcp://localhost:26657 -o json)
IDENTITY=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].identity')
AGGR_KEYSHARE=$(echo $LIST_KEYSHARE_REQ | jq -r '.keyshares[0].aggr_keyshare')
echo "Identity for keyshare request is: $IDENTITY"
echo "Aggregated keyshare for request is: $AGGR_KEYSHARE"

echo "Encrypting data with Pub key: '$PUB_KEY'"
TEST_DATA="test_data_1"
CIPHER=$($BINARY encrypt $IDENTITY $PUB_KEY $TEST_DATA --node tcp://localhost:26657)

echo "Encrypted Data: '$CIPHER'"

echo "Attempting decryption of data via pep query"
RSP=$($BINARY query pep decrypt-data $PUB_KEY $AGGR_KEYSHARE $CIPHER --node tcp://localhost:26657 -o json)
DECRYPTED_DATA=$(echo $RSP | jq -r '.decrypted_data')

if [[ "$TEST_DATA" == "$DECRYPTED_DATA" ]]; then
  echo "Data successfully decrypted"
else
  echo "Data decryption unsuccessful. Expected: '$TEST_DATA' ; found: '$DECRYPTED_DATA'"
  echo "Response from decryption query: '$RSP'"
  exit 1
fi

echo "#############################################"
echo "# Testing contract callback on source chain #"
echo "#############################################"

cd $CONTRACT_DIR

echo "Compiling contract"
cargo build --release --target wasm32-unknown-unknown

echo "Optimizing Contract"
docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/optimizer:0.16.0

echo "Deploying smart contract on source chain"
RESULT=$($BINARY tx wasm store $CONTRACT_DIR/artifacts/fairyring_contract.wasm --from $WALLET_1 --gas 9000000 --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test --fees 9000000ufairy -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
echo $RESULT

sleep 10

echo "Instantiating the contract"
RESULT=$($BINARY tx wasm instantiate 1 '{"identity": "init_identity", "pubkey": "init_pubkey", "aggr_keyshare": "init_keyshare"}' --admin $WALLET_1 --from $WALLET_1 --gas 9000000 --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test --fees 9000000ufairy --label test_contract_1 -o json -y)
check_tx_code $RESULT

sleep 10

echo "Creating new General keyshare Request on chain fairyring_test_1"
RESULT=$($BINARY tx pep request-general-keyshare 30s contract123 --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT

sleep 10

REQ_ID="$WAL1_ADDR/contract123"
CONTRACT_ADDR="fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v"


echo "Registering contract with identity"
RESULT=$($BINARY tx pep register-contract $CONTRACT_ADDR $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx_source $RESULT)

sleep 10

echo "Request Generation of Aggr keyshare"
RESULT=$($BINARY tx pep get-general-keyshare $REQ_ID --from $WALLET_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
echo "$RESULT"
check_tx_code $RESULT

sleep 6

EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $REQ_ID)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')

while true; do
  echo "Submitting General Key Share"

  RESULT=$($BINARY tx keyshare create-general-key-share "private-gov-identity" $REQ_ID $EXTRACTED_SHARE 1 --from $VALIDATOR_1 --gas-prices 1ufairy --gas 900000 --home $CHAIN_HOME --chain-id $CHAINID_1 --node tcp://localhost:26657 --broadcast-mode sync --keyring-backend test -o json -y)
  echo "$RESULT"
  check_tx_err $RESULT
  if [ $? -eq 0 ]; then
    break
  fi
done

sleep 15

echo "Query Contract state"
RSP=$($BINARY q wasm contract-state smart $CONTRACT_ADDR '{"get_stored_data":{"identity": "'"$REQ_ID"'"}}' --node tcp://localhost:26657 -o json)
echo $RSP

echo "#########################################################"
echo "# Testing decryption from contract request source chain #"
echo "#########################################################"

echo "Testing with pubkey provided explicitly"
RSP=$($BINARY q wasm contract-state smart $CONTRACT_ADDR '{"decrypt_data": {"pubkey": "a2a4472488440341db3252447af1c31e06fd32d7067e300ed60052fcdd131fd702bf901e1dd0122a312bb582a9a375a3", "aggr_keyshare": "a3b49bbffd655aa37e0b71a4d90862e1f70bdd0aab48587307ef74c2b3e12fd2ea42d88fc5f592e5caf83d33d7f93454196f32137817ceb5ecb41fbe48c3734bb11510febd6988302dd2c362deb3479b4946daa399fb149e63c0a5c45b48292d", "encrypted_data": "6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a686e4a7641376d5655797679397166465230447849417464374c3152586371484542687736306a316f325a446e567453626a4759374a4d2f5a524752654e536b0a574d6f56567966674d55546f363944502f4f624a6544424e6f47694b50746a6b316a523075464276536372326d766948543238524f6e473755647835683077510a6c734767656554424336786e7834626e496d737874410a2d2d2d20793668724135506e5233563568414a35646f732b574e325932334b72742b383946306d4d743138595a59490a43129dfd9ddbb210374314a96ab1b06260b4e1abf7d3fac77029043c8bdbe0a6efd2b73f95f75be0"}}' --node tcp://localhost:26657 -o json)
echo $RSP

echo "Testing with pubkey not provided"
RSP=$($BINARY q wasm contract-state smart $CONTRACT_ADDR '{"decrypt_data": {"pubkey": "", "aggr_keyshare": "a3b49bbffd655aa37e0b71a4d90862e1f70bdd0aab48587307ef74c2b3e12fd2ea42d88fc5f592e5caf83d33d7f93454196f32137817ceb5ecb41fbe48c3734bb11510febd6988302dd2c362deb3479b4946daa399fb149e63c0a5c45b48292d", "encrypted_data": "6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a686e4a7641376d5655797679397166465230447849417464374c3152586371484542687736306a316f325a446e567453626a4759374a4d2f5a524752654e536b0a574d6f56567966674d55546f363944502f4f624a6544424e6f47694b50746a6b316a523075464276536372326d766948543238524f6e473755647835683077510a6c734767656554424336786e7834626e496d737874410a2d2d2d20793668724135506e5233563568414a35646f732b574e325932334b72742b383946306d4d743138595a59490a43129dfd9ddbb210374314a96ab1b06260b4e1abf7d3fac77029043c8bdbe0a6efd2b73f95f75be0"}}' --node tcp://localhost:26657 -o json)
echo $RSP

echo "Run 'pkill fairyringd' to stop fairyring"