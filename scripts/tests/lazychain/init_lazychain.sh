#!/bin/sh

set -e

# set variables for the chain
VALIDATOR_NAME=validator1
CHAIN_ID=lazychain_pep
BINARY=lazychaind
KEY_NAME=val2
TOKEN_AMOUNT="10000000000000000000000000ulazy"
STAKING_AMOUNT=1000000000ulazy
RELAYER_ADDRESS=lazy1avl4q6s02pss5q2ftrkjqaft3jk75q4ldesnwe

echo -e "\n Deleting existing $BINARY data... \n"
rm -rf "$HOME""/.lazychain"

# query the DA Layer start height, in this case we are querying
# an RPC endpoint provided by Celestia Labs. The RPC endpoint is
# to allow users to interact with Celestia's core network by querying
# the node's state and broadcasting transactions on the Celestia
# network.

# Mocha
DA_BLOCK_HEIGHT=$(curl public-celestia-mocha4-consensus.numia.xyz:26657/block |jq -r '.result.block.header.height')
AUTH_TOKEN=$(celestia light auth write --p2p.network mocha)
# Arabica
#DA_BLOCK_HEIGHT=$(curl https://rpc.celestia-arabica-11.com/block |jq -r '.result.block.header.height')
#AUTH_TOKEN=$(celestia light auth write --p2p.network arabica)

echo -e "\n Your DA_BLOCK_HEIGHT is $DA_BLOCK_HEIGHT \n"
echo -e "\n Your DA AUTH_TOKEN is $AUTH_TOKEN \n"

# reset any existing genesis/chain data
$BINARY tendermint unsafe-reset-all
$BINARY init $VALIDATOR_NAME --chain-id $CHAIN_ID


# update $BINARY configuration files to set chain details and enable necessary settings
# the sed commands here are editing various configuration settings for the $BINARY instance
# such as setting minimum gas prices, enabling the api, setting the chain id, setting the rpc address,
# adjusting time constants, and setting the denomination for bonds and minting.
sed -i'' -e 's/^minimum-gas-prices *= .*/minimum-gas-prices = "0ulazy"/' "$HOME"/.lazychain/config/app.toml
sed -i'' -e '/\[api\]/,+3 s/enable *= .*/enable = true/' "$HOME"/.lazychain/config/app.toml
sed -i'' -e "s/^chain-id *= .*/chain-id = \"$CHAIN_ID\"/" "$HOME"/.lazychain/config/client.toml
sed -i'' -e '/\[rpc\]/,+3 s/laddr *= .*/laddr = "tcp:\/\/0.0.0.0:26657"/' "$HOME"/.lazychain/config/config.toml
sed -i'' -e 's/"time_iota_ms": "1000"/"time_iota_ms": "10"/' "$HOME"/.lazychain/config/genesis.json
sed -i'' -e 's/bond_denom": ".*"/bond_denom": "ulazy"/' "$HOME"/.lazychain/config/genesis.json
sed -i'' -e 's/mint_denom": ".*"/mint_denom": "ulazy"/' "$HOME"/.lazychain/config/genesis.json

sed -i -e 's/timeout_commit = "5s"/timeout_commit = "5s"/g' "$HOME"/.lazychain/config/config.toml
sed -i -e 's/timeout_propose = "3s"/timeout_propose = "5s"/g' "$HOME"/.lazychain/config/config.toml
sed -i -e 's/index_all_keys = false/index_all_keys = true/g' "$HOME"/.lazychain/config/config.toml
sed -i -e 's/timeout_prevote = "1s"/timeout_prevote = "5s"/g' "$HOME"/.lazychain/config/config.toml
sed -i -e 's/timeout_precommit = "1s"/timeout_precommit = "5s"/g' "$HOME"/.lazychain/config/config.toml

sed -i -e 's/"voting_period": "172800s"/"voting_period": "60s"/g' "$HOME"/.lazychain/config/genesis.json
sed -i -e 's/"reward_delay_time": "604800s"/"reward_delay_time": "0s"/g' "$HOME"/.lazychain/config/genesis.json
TRUSTED_PARTIES='{"client_id": "07-tendermint-0", "connection_id": "connection-0", "channel_id": "channel-0"}'
sed -i -e 's/"trusted_counter_parties": \[\]/"trusted_counter_parties": \['"$TRUSTED_PARTIES"'\]/g' "$HOME"/.lazychain/config/genesis.json
sed -i -e 's/"key_expiry": "100"/"key_expiry": "10000"/g' "$HOME"/.lazychain/config/genesis.json
sed -i -e 's/"is_source_chain": true/"is_source_chain": false/g' "$HOME"/.lazychain/config/genesis.json
sed -i -e 's/"keyshare_channel_id": "channel-1"/"keyshare_channel_id": "channel-0"/g' "$HOME"/.lazychain/config/genesis.json
sed -i -e 's/"denom": "ufairy"/"denom": "ulazy"/g' "$HOME"/.lazychain/config/genesis.json

# add a key to keyring-backend test
$BINARY keys add $KEY_NAME --keyring-backend test

WALLET_MNEMONIC_2="veteran try aware erosion drink dance decade comic dawn museum release episode original list ability owner size tuition surface ceiling depth seminar capable only"
WALLET_MNEMONIC_4="open attitude harsh casino rent attitude midnight debris describe spare cancel crisp olive ride elite gallery leaf buffalo sheriff filter rotate path begin soldier"
RLY_MNEMONIC_2="record gift you once hip style during joke field prize dust unique length more pencil transfer quit train device arrive energy sort steak upset"

echo $WALLET_MNEMONIC_2 | $BINARY keys add wallet2  --recover --keyring-backend=test
echo $WALLET_MNEMONIC_4 | $BINARY keys add wallet4  --recover --keyring-backend=test
RLY2_JSON=$(echo $RLY_MNEMONIC_2 | $BINARY keys add rly2  --recover --keyring-backend=test --output json)
echo $RLY2_JSON | jq --arg mnemonic "$RLY_MNEMONIC_2" '. += $ARGS.named'> rly2.json

# add a genesis account
$BINARY genesis add-genesis-account $KEY_NAME $TOKEN_AMOUNT --keyring-backend test
$BINARY genesis add-genesis-account $RELAYER_ADDRESS $TOKEN_AMOUNT --keyring-backend test

$BINARY genesis add-genesis-account wallet2 $TOKEN_AMOUNT --keyring-backend test
$BINARY genesis add-genesis-account wallet4 $TOKEN_AMOUNT --keyring-backend test
$BINARY genesis add-genesis-account rly2 $TOKEN_AMOUNT --keyring-backend test

# set the staking amounts in the genesis transaction
$BINARY genesis gentx $KEY_NAME $STAKING_AMOUNT --chain-id $CHAIN_ID --keyring-backend test

# collect gentxs
$BINARY genesis collect-gentxs

VAL2_ADDR=$($BINARY keys show val2 --keyring-backend test -a)
sed -i -e 's/"trusted_addresses": \[\]/"trusted_addresses": \["'"$VAL2_ADDR"'"\]/g' "$HOME"/.lazychain/config/genesis.json

# copy centralized sequencer address into genesis.json
# Note: validator and sequencer are used interchangeably here
ADDRESS=$(jq -r '.address' ~/.lazychain/config/priv_validator_key.json)
PUB_KEY=$(jq -r '.pub_key' ~/.lazychain/config/priv_validator_key.json)
jq --argjson pubKey "$PUB_KEY" '.consensus["validators"]=[{"address": "'$ADDRESS'", "pub_key": $pubKey, "power": "1000", "name": "Rollkit Sequencer"}]' ~/.lazychain/config/genesis.json > temp.json && mv temp.json ~/.lazychain/config/genesis.json

HKEY_2=$(hermes --config ./scripts/tests/lazychain/relayer_configs/hermes_config.toml keys list --chain $CHAIN_ID | sed -n '/SUCCESS/d; s/.*(\([^)]*\)).*/\1/p')
if [ "$HKEY_2" == "" ]; then
  echo "Key not found for chain id: $CHAIN_ID in Hermes Relayer Keys..."
  echo "Creating key..."
  hermes --config ./scripts/tests/lazychain/relayer_configs/hermes_config.toml keys add --chain $CHAIN_ID --key-file rly2.json
fi

rm rly2.json

# start the chain
# removed temporarily --rollkit.lazy_aggregator
nohup $BINARY start --pruning=nothing --log_level info --log_format json --rollkit.aggregator --rollkit.da_auth_token=$AUTH_TOKEN --rollkit.da_namespace 00000000000000000000000000000000000000000008e5f679bf7116cb --rollkit.da_start_height $DA_BLOCK_HEIGHT --rpc.laddr tcp://127.0.0.1:26657 --grpc.address 127.0.0.1:9290 --p2p.laddr "0.0.0.0:26656" --minimum-gas-prices="1ulazy" --api.enable --api.enabled-unsafe-cors &> "./data/$CHAIN_ID.log" &
if [[ $? -ne 0 ]]; then
  echo "Failed to start lazychaind."
  exit 1
else
  echo "lazychaind started successfully. Logs at ./data/$CHAIN_ID.log."
fi