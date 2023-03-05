#!/bin/bash

TOTAL_VALIDATOR=4
MASTER_VALIDATOR_INDEX=$((TOTAL_VALIDATOR - 1))
INIT_TOKEN_AMT=100000000stake
VALIDATOR_PORT=26656
VALIDATORS_ADDR_BASE=192.1689.10.
VALIDATOR_HOST_ID_START=2

PEER_LIST=()

mkdir gentx

validatorIndex=0
currentValidatorHostID=$VALIDATOR_HOST_ID_START

while [ $validatorIndex -lt $TOTAL_VALIDATOR ]
do
  sudo docker cp fairyringdnode$validatorIndex:'/root/.fairyring/config/gentx/.' ./gentx/
  ADDR=$(sudo docker start fairyringdnode$validatorIndex >/dev/null 2>&1 && sudo docker exec -i fairyringdnode$validatorIndex fairyringd keys show validator_account -a --keyring-backend test)
  echo "Got the account from validator $validatorIndex: $ADDR"

  node_id=$(sudo docker start fairyringdnode$validatorIndex >/dev/null 2>&1 && sudo docker exec -i fairyringdnode$validatorIndex fairyringd tendermint show-node-id)

  PEER_LIST+=("${node_id}@${VALIDATORS_ADDR_BASE}${currentValidatorHostID}:${VALIDATOR_PORT}")

  if [ $validatorIndex -ne $MASTER_VALIDATOR_INDEX ]
  then
    sudo docker start fairyringdnode$MASTER_VALIDATOR_INDEX >/dev/null 2>&1 && sudo docker exec -i fairyringdnode$MASTER_VALIDATOR_INDEX fairyringd add-genesis-account $ADDR $INIT_TOKEN_AMT
    echo 'Added account to genesis in master validator'
  fi

  validatorIndex=$((validatorIndex + 1))
  currentValidatorHostID=$((currentValidatorHostID + 1))
done

joinedPeerList=$(IFS=','; echo "${PEER_LIST[*]}")

# Copy all gathered gentx file to the master validator container
sudo docker cp ./gentx/. fairyringdnode$MASTER_VALIDATOR_INDEX:'/root/.fairyring/config/gentx/'

# Collect all the gentx.json
sudo docker start fairyringdnode$MASTER_VALIDATOR_INDEX >/dev/null 2>&1 && sudo docker exec -i fairyringdnode$MASTER_VALIDATOR_INDEX fairyringd collect-gentxs

# Copy the new master genesis.json to host
sudo docker start fairyringdnode$MASTER_VALIDATOR_INDEX >/dev/null 2>&1 && sudo docker cp fairyringdnode$MASTER_VALIDATOR_INDEX:'/root/.fairyring/config/genesis.json' ./gentx/genesis.json

echo 'Got the new master genesis.json'

# Copy the new genesis.json to all the container
validatorIndex=0
while [ $validatorIndex -lt $TOTAL_VALIDATOR ]
do
  if [ $validatorIndex -ne $MASTER_VALIDATOR_INDEX ]
  then
      sudo docker start fairyringdnode$validatorIndex > /dev/null 2>&1 && sudo docker exec -i fairyringdnode$validatorIndex sed -i'' -e "s/presistent_peers = \"\"/presistent_peers = \"$joinedPeerList\"/g" /root/.fairyring/config/config.toml
      echo "Updated presistent_peers on validator $validatorIndex"
      sudo docker cp ./gentx/genesis.json fairyringdnode$validatorIndex:'/root/.fairyring/config/genesis.json'
      echo "Updated genesis.json on validator $validatorIndex"
  fi

  sudo docker start fairyringdnode$validatorIndex > /dev/null 2>&1 && sudo docker exec -i fairyringdnode$validatorIndex bash -c "echo '' >> /root/DONE"

  validatorIndex=$((validatorIndex + 1))
done

echo 'Done'