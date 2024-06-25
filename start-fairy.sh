#!/bin/bash

# Path to fairyringd and share generator
fairyringPath="./fairyringd"

# Number of validators
read -p "Enter the number of validators: " n



# Run ready.py
python3 ./ready.py

# Get the input "i"
read -p "Enter the value for i: " i

# Remove existing genesis.json and gentx JSON
rm -r $HOME/.fairyring/config/genesis.json
rm -r $HOME/.fairyring/config/gentx

# Build fairyringd
go build ./cmd/fairyringd

# Initialize the chain
$fairyringPath init "fairytest-${i}" --chain-id "fairytest-${i}"

# Set the chain ID in the configuration
$fairyringPath config chain-id "fairytest-${i}"

# Create validators and add genesis accounts
addresses=()
for ((j=1; j<=n; j++))
do
    # Create validator
    echo y | $fairyringPath keys add v$j --keyring-backend test

    # Get validator address
    address=$($fairyringPath keys show v$j -a --keyring-backend test)
    addresses+=($address)

    # Add genesis account
    $fairyringPath add-genesis-account $address 5000000000000frt,5000000000000stake
done

# Create eli and add genesis account
echo y | $fairyringPath keys add eli --keyring-backend test
eli_address=$($fairyringPath keys show eli -a --keyring-backend test)
$fairyringPath add-genesis-account $eli_address 5000000000000frt,5000000000000stake

# Generate gentx for each validator
for ((j=1; j<=n; j++))
do
    $fairyringPath gentx v$j 1000000000stake --keyring-backend test
done

# Generate gentx for eli
$fairyringPath gentx eli 1000000000stake --keyring-backend test

# Collect gentxs
$fairyringPath collect-gentxs

# Path to the genesis.json file
GENESIS_FILE_PATH="$HOME/.fairyring/config/genesis.json"

# Prepare trusted_addresses and validatorSetList
trusted_addresses=()
validatorSetList=()

for address in "${addresses[@]}"
do
    trusted_addresses+=("\"$address\"")
    validatorSetList+=("{\"validator\":\"$address\", \"index\": \"$address\", \"isActive\":true}")
done

# Add eli to trusted_addresses and validatorSetList
trusted_addresses+=("\"$eli_address\"")
validatorSetList+=("{\"validator\":\"$eli_address\", \"index\": \"$eli_address\", \"isActive\":true}")

# Convert arrays to JSON arrays
trusted_addresses_json=$(printf ",%s" "${trusted_addresses[@]}")
trusted_addresses_json="[${trusted_addresses_json:1}]"

validatorSetList_json=$(printf ",%s" "${validatorSetList[@]}")
validatorSetList_json="[${validatorSetList_json:1}]"

# Update genesis.json with jq
jq --argjson ta "$trusted_addresses_json" \
   --argjson vs "$validatorSetList_json" \
   '.app_state.keyshare.params.trusted_addresses = $ta | .app_state.keyshare.validatorSetList = $vs' \
   $GENESIS_FILE_PATH > temp.json

# Replace the original genesis.json file with the updated one
mv temp.json $GENESIS_FILE_PATH

# Start the chain
$fairyringPath start --rpc.laddr tcp://127.0.0.1:26657 --grpc.address localhost:9090 --grpc-web.address localhost:9093 --api.address tcp://localhost:1318
