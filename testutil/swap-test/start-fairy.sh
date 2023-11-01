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

# Add a genesis account
./fairyringd add-genesis-account fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c 5000000000000frt,5000000000000stake 

# Generate a new gentx
./fairyringd gentx star 1000000000stake

# Collect gentxs
./fairyringd collect-gentxs

./fairyringd start --rpc.laddr tcp://127.0.0.1:26659 --grpc.address localhost:9092 --grpc-web.address localhost:9093 --api.address tcp://localhost:1318


