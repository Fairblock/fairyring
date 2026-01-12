#!/bin/bash


echo ""
echo "######################################################"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#       Submit KeyShare from Authorized address      #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "#                 Authorize address                  #"
echo "######################################################"
echo ""


BINARY=fairyringd
CHAIN_DIR=$(pwd)/data
CHAINID_1=fairyring_test_1
BLOCK_TIME=1.5

WALLET_1=$($BINARY keys show wallet1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)
VALIDATOR_1=$($BINARY keys show val1 -a --keyring-backend test --home $CHAIN_DIR/$CHAINID_1)

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
  RESULT=$($BINARY q tx --type=hash $TXHASH --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 -o json)
  echo "$RESULT"
}

echo "Non Validator deregistering validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare deregister-validator --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"validator not registered"* ]]; then
  echo "ERROR: KeyShare module deregister validator error. Expected to get validator not registered error, got '$ERROR_MSG'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Staked account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("validator"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Validator deregistering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare deregister-validator --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("validator"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module deregister validator error. Expected deregistered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

RESULT=$($BINARY q keyshare list-validator-set --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 -o json)
CURRENT_SET_LEN=$(echo $RESULT | jq '.validator_set | length')
if [ "$CURRENT_SET_LEN" != "0" ]; then
  echo "ERROR: KeyShare module deregister validator error, Expected total validator set to be empty, got '$(echo $RESULT | jq '.validator_set')'"
  exit 1
fi

echo "Staked account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("validator"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module register validator error. Expected registered validator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Non staking account registering as a validator on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare register-validator --from $WALLET_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"account is not staking"* ]]; then
  echo "ERROR: KeyShare module register validator error. Expected to get account is not staking error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi

echo "Non validator account authorizing another address to submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-authorized-address $VALIDATOR_1 --from $WALLET_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"only validator can authorize address to submit key share"* ]]; then
  echo "ERROR: KeyShare module authorize address error. Expected to get account is not validator error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


GENERATED_RESULT=$($BINARY share-generation generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')
COMMITS=$(echo "$GENERATED_RESULT" | jq -r '.Commitments[0]')

echo "Trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pubkey $PUB_KEY $COMMITS 1 '[{"data":"'"$GENERATED_SHARE"'","validator":"'"$VALIDATOR_1"'"}]' --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("pubkey"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module submit pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Not trusted address submit pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-latest-pubkey $PUB_KEY $COMMITS 1 '[{"data":"'"$GENERATED_SHARE"'","validator":"'"$VALIDATOR_1"'"}]' --from $WALLET_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"address is not trusted"* ]]; then
  echo "ERROR: KeyShare module submit pub key from not trusted address error. Expected to get address is not trusted error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 0 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')


echo "Not registered account submit key share on chain fairyring_test_1"
CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.block.header.height')
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"sender is not validator / authorized address to submit key share"* ]]; then
  echo "ERROR: KeyShare module submit key share from not registered account error. Expected to get account not validator / authorized address error, got '$ERROR_MSG'"
  echo "$RESULT"
  exit 1
fi

GENERATED_RESULT=$($BINARY share-generation generate 1 1)
GENERATED_SHARE=$(echo "$GENERATED_RESULT" | jq -r '.Shares[0].Value')
PUB_KEY=$(echo "$GENERATED_RESULT" | jq -r '.MasterPublicKey')
COMMITS=$(echo "$GENERATED_RESULT" | jq -r '.Commitments[0]')

echo "Trusted address override pub key on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare override-latest-pubkey $PUB_KEY $COMMITS 1 '[{"data":"'"$GENERATED_SHARE"'","validator":"'"$VALIDATOR_1"'"}]' --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
VALIDATOR_ADDR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("pubkey"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("creator"))))[]' | jq -r '.value')
if [ "$VALIDATOR_ADDR" != "$VALIDATOR_1" ]; then
  echo "ERROR: KeyShare module override pub key from trusted address error. Expected creator address '$VALIDATOR_1', got '$VALIDATOR_ADDR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi

echo "Registered validator authorize another address to submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare create-authorized-address $WALLET_1 --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
EVENT_ATR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("message"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("action"))))[]' | jq -r '.value')
if [ "$EVENT_ATR" != "/fairyring.keyshare.MsgCreateAuthorizedAddress" ]; then
  echo "ERROR: KeyShare module registered validator authorize address error. Expected the account to be authorized successfully, got '$EVENT_ATR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+2))
EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')


echo "Authorized account submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
KEYSHARE_HEIGHT=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("keyshare"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("keyshare-height"))))[]' | jq -r '.value')
if [ "$KEYSHARE_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the key received at height $TARGET_HEIGHT, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


echo "Registered validator remove authorized address to submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare delete-authorized-address $WALLET_1 --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
EVENT_ATR=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("message"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("action"))))[]' | jq -r '.value')
if [ "$EVENT_ATR" != "/fairyring.keyshare.MsgDeleteAuthorizedAddress" ]; then
  echo "ERROR: KeyShare module registered validator remove authorized address error. Expected the account to be removed successfully, got '$EVENT_ATR'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+1))
EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')


echo "Removed Authorized account tries submit key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $WALLET_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
ERROR_MSG=$(echo "$RESULT" | jq -r '.raw_log')
if [[ "$ERROR_MSG" != *"sender is not validator / authorized address to submit key share"* ]]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the key received at height $TARGET_HEIGHT, got '$RESULT_EVENT'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  exit 1
fi


CURRENT_BLOCK=$($BINARY query consensus comet block-latest --home $CHAIN_DIR/$CHAINID_1 --node tcp://localhost:16657 -o json | jq -r '.block.header.height')
TARGET_HEIGHT=$((CURRENT_BLOCK+2))
EXTRACTED_RESULT=$($BINARY share-generation derive $GENERATED_SHARE 1 $TARGET_HEIGHT)
EXTRACTED_SHARE=$(echo "$EXTRACTED_RESULT" | jq -r '.Keyshare')


echo "Registered validator submit valid key share on chain fairyring_test_1"
RESULT=$($BINARY tx keyshare send-keyshare $EXTRACTED_SHARE 1 $TARGET_HEIGHT --from $VALIDATOR_1 --gas-prices 1ufair --home $CHAIN_DIR/$CHAINID_1 --chain-id $CHAINID_1 --node tcp://localhost:16657 --broadcast-mode sync --keyring-backend test -o json -y)
check_tx_code $RESULT
RESULT=$(wait_for_tx $RESULT)
AGGRED_SHARE=$(echo "$RESULT" | jq '.events' | jq 'map(select(any(.type; contains("keyshare-aggregated"))))[]' | jq '.attributes' | jq 'map(select(any(.key; contains("data"))))[]' | jq -r '.value')
if [ "$AGGRED_SHARE" != $EXTRACTED_SHARE ]; then
  echo "ERROR: KeyShare module submit valid key share from registered validator error. Expected the aggregated key to be $EXTRACTED_SHARE, got '$AGGRED_SHARE'"
  echo "ERROR MESSAGE: $(echo "$RESULT" | jq -r '.raw_log')"
  echo $RESULT | jq
exit 1
fi

#if [ ! -f "$HOME/.fairyringclient/config.yml" ]; then
#    fairyringclient config init
#fi
#
#cp "$HOME/.fairyringclient/config.yml" "$HOME/.fairyringclient/config.yml.backup"
#cp ./scripts/tests/fairyringclient_config.yml "$HOME/.fairyringclient/config.yml"
#
#fairyringclient start > $CHAIN_DIR/fairyringclient.log 2>&1 &

./scripts/tests/keyshareSender.sh $BINARY $CHAIN_DIR/$CHAINID_1 tcp://localhost:16657 $VALIDATOR_1 $CHAINID_1 > $CHAIN_DIR/keyshareSender.log 2>&1 &

echo "Query submitted key share on chain fairyring_test_1"
RESULT=$($BINARY query keyshare list-keyshares --node tcp://localhost:16657 -o json)
RESULT_SENDER=$(echo "$RESULT" | jq -r '.keyshare[0].validator')
RESULT_KEYSHARE=$(echo "$RESULT" | jq -r '.keyshare[0].keyshare')
RESULT_HEIGHT=$(echo "$RESULT" | jq -r '.keyshare[0].blockHeight')
if [ "$RESULT_SENDER" != "$VALIDATOR_1" ] && [ "$RESULT_KEYSHARE" != "$EXTRACTED_SHARE" ] && [ "$RESULT_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module query submitted key share error, Expected to get the submitted key share, got '$RESULT'"
  echo $RESULT | jq
exit 1
fi
echo "Key Share Successfully submitted: '$RESULT_KEYSHARE' for height '$RESULT_HEIGHT'"


echo "Query aggregated key share on chain fairyring_test_1"
RESULT=$($BINARY query keyshare list-decryption-keys --node tcp://localhost:16657 -o json)
RESULT_HEIGHT=$(echo "$RESULT" | jq -r '.decryption_keys[0].height')
RESULT_DATA=$(echo "$RESULT" | jq -r '.decryption_keys[0].data')
if [ "$RESULT_HEIGHT" != "$TARGET_HEIGHT" ]; then
  echo "ERROR: KeyShare module aggregate key share error. Expected to get an aggregated key, got '$RESULT'"
  echo $RESULT | jq
exit 1
fi
echo "Key Share Successfully aggregated: '$RESULT_DATA'"


echo ""
echo "######################################################"
echo "#                SUCCESSFULLY TESTED                 #"
echo "# Submit Valid & Invalid KeyShare to KeyShare Module #"
echo "#     Register as a validator in KeyShare Module     #"
echo "#        Submit Public Key to KeyShare Module        #"
echo "######################################################"
echo ""

./scripts/tests/pep.sh $GENERATED_SHARE