# Overview 

**fairyring** is a Cosmos SDK blockchain that leverages identity-based encryption (IBE) to enable pre-execution privacy on Cosmos SDK app-chains.
`fairyring` consists of two main components, a blockchain purpose-built for management of decryption keys in a decentralized manner, as well as a Cosmos SDK module that other app-chains can use to integrate with fairyring. 

## Requirement


## Get started

### Compiling & Installing FairyRing chain executable

1. Clone the repo
   
```bash
git clone https://github.com/Fairblock/fairyring.git && cd fairyring
```

2. Building fairyring

```bash
make build
```

3. Installing the fairyringd

```bash
make install
```

4. Running fairyringd

```bash
fairyringd
```

### Running the chain locally

1. After building the fairyring executable and before running the script,
make sure you have previous node data removed, to remove the data, run the following command

```bash
rm -rf ~/.fairyring
```

2. Then, run the following script to setup the node

```bash
./setup.sh <moniker>
```

- moniker can be any string you want, is the nickname of your node

3. Collect all the gentxs and create the new genesis

```bash
fairyringd collect-gentxs
```

4. Run the chain by 

```bash
fairyringd start
```


### Running a validator locally with Docker

Make sure that you have installed Docker already 

1. Build docker image

```
docker build -t fairyring .
```

2. Setup validator

Chance <moniker> with your name 

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring setup.sh <moniker>
```

3. Create new genesis.json

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring fairyringd collect-gentxs
```

4. Start the validator

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring fairyringd start
```

#### Running multiple validator

1. Repeat step 1 - 2 on all the machines,

2. Run the following command for all the address created in other machine in the master validator:

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring fairyringd add-genesis-account <address> 100000000stake
```

3. Add all the gentx.json at `~/.fairyring/config/gentx/gentx-{node_id}.json` from all the machines to master validator, then run the command on step 4

4. replace the old `genesis.json` with the new one created in master validator

5. Open config.toml at `~/.fairyring/config/config.toml` on master validator and replace the IP Address & Port of the peers

6. Update the config.toml for all the other machine to include all the validator peers:

```
presistent_peers = "node_id@ip:port,node_id2@ip:port"
```

You can get the node id by the following command:

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring fairyringd tendermint show-node-id
```

7. Start the validator on all the machines

### Becoming a validator

1. Follow step 1 - 2 on [Run validator locally](#Running-a-validator-locally-with-Docker)

2. Make sure you have enough coins in your account

3. Replace the `genesis.json` and `config.toml`

4. Send the `fairyringd tx staking create-validator` command with the address created to become validator, for example:

```
docker exec -it $(docker ps --latest --format '{{.ID}}') fairyringd tx staking create-validator \
  --amount=100000000stake \
  --pubkey=$(fairyringd tendermint show-validator) \
  --moniker="choose a moniker" \
  --chain-id="fairyring" \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1000000" \
  --from validator_account
```

5. Start the validator

### Transactions command

#### KeyShare module

Create pub key

```
fairyringd tx keyshare create-latest-pub-key <pub-key-in-hex>
```

Register as a validator

```
fairyringd tx keyshare register-validator
```

Submit a KeyShare

```
fairyringd tx send-key-share <keyshare-in-hex> <commitment-in-hex> <keyshare-index> <keyshare-block-height>
```

#### Pep module

Submit aggregated key share

```
fairyringd tx pep create-aggregated-key-share <aggregated-key-share-height> <aggregated-key-share-in-hex> <public-key-in-hex>
```

Submit encrypted transaction

```
fairyringd tx pep submit-encrypted-tx <encrypted-tx-cipher-in-hex> <target-block-height>
```

### Queries

#### KeyShare module

Get all validators

```
fairyringd query keyshare list-validator-set
```

Get all broadcasted keyshares

```
fairyringd query keyshare list-key-share
```

Get specific validator

```
fairyringd query keyshare show-validator-set <Index>
```

Get specific keyshare

```
fairyringd query keyshare show-key-share <Validator> <BlockHeight>
```

#### Pep module

Get all encrypted tx in state

```
fairyringd query pep list-encrypted-tx
```

Get all encrypted tx in state from a specific block height

```
fairyringd query pep list-encrypted-tx-from-block <blockHeight>
```

Get a single encrypted tx in state with a specific block height & tx index

```
fairyringd query pep show-encrypted-tx <blockHeight> <index>
```

### Sending keyshares every block

It is recommended to run [`fairyringclient`](https://github.com/FairBlock/fairyringclient) so that validator registration and key share submissions are automated.

### Aggregating key shares

It is recommended to run [`fairyport`](https://github.com/FairBlock/fairyport) to listen to broadcast keyshare events and aggregate the keys in each block.

### Configure

Your blockchain in development can be configured with `config.yml`. To learn more, see the [Ignite CLI docs](https://docs.ignite.com).

### Web Frontend

Ignite CLI has scaffolded a Vue.js-based web app in the `vue` directory. Run the following commands to install dependencies and start the app:

```
cd vue
npm install
npm run serve
```

The frontend app is built using the `@starport/vue` and `@starport/vuex` packages. For details, see the [monorepo for Ignite front-end development](https://github.com/ignite/web).


## Setup a testing environment

1. Building the `fairyringd` executable

```bash
make build
```

2. Installing the executable for calling it from terminal

```bash
make install
```

3. Building the executable of [ShareGenerator](https://github.com/FairBlock/ShareGenerator) and [Encrypter](https://github.com/FairBlock/encrypter) and put them in this directory


4. Install [Hermes Relayer](https://hermes.informal.systems/) by following this [guide](https://hermes.informal.systems/quick-start/installation.html)


5. Running the tests 

```bash
make integration-test-all
```
