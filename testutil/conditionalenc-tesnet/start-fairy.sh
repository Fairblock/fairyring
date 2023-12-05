#!/bin/bash


python3 ./ready.py

# Get the input "i"
read -p "Enter the value for i: " i

# Remove existing genesis.json
rm -r $HOME/.fairyring/config/genesis.json

# Remove existing gentx JSON
rm -r $HOME/.fairyring/config/gentx

cd ../..

go build ./cmd/fairyringd

# Initialize the chain
./fairyringd init "fairytest-${i}" --chain-id "fairytest-${i}"

# Set the chain ID in the configuration
./fairyringd config chain-id "fairytest-${i}"

echo shrug make inmate anchor acid clock morning stage fiction build chef copy often inherit wonder pen boss join joke flock push morning chapter fever | ./fairyringd keys add star --recover
# Add a genesis account
./fairyringd add-genesis-account fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c 5000000000000frt,5000000000000stake 

# Generate a new gentx
./fairyringd gentx star 1000000000stake

# Collect gentxs
./fairyringd collect-gentxs

#!/bin/bash

# Path to the genesis.json file
GENESIS_FILE_PATH="$HOME/.fairyring/config/genesis.json"

# Use jq to update "symbol_requests" in the genesis.json file
jq '.app_state.pricefeed.symbol_requests = [{"symbol": "OSMO", "oracle_script_id": 396, "block_interval": 1, "price_step": 100}]' $GENESIS_FILE_PATH > temp.json
jq '.app_state.keyshare.params.trusted_addresses = ["fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c"]' temp.json > temp2.json

jq '.app_state.keyshare.validatorSetList = [{"validator":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c", "index": "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c", "isActive":true}]' temp2.json > temp3.json
# jq '.app_state.keyshare.authorizedAddressList = [{"Target":}]' temp3.json > temp4.json
# Use jq to update "source_channel" in the genesis.json file
jq '.app_state.conditionalenc.params.channel_id = "channel-1"' temp3.json > temp4.json
jq '.app_state.pricefeed.params.source_channel = "channel-0"' temp4.json > updated_genesis.json

# Replace the original genesis.json file with the updated one
mv updated_genesis.json $GENESIS_FILE_PATH

# Remove temporary file
rm temp.json


./fairyringd start --rpc.laddr tcp://127.0.0.1:26659 --grpc.address localhost:9092 --grpc-web.address localhost:9093 --api.address tcp://localhost:1318


