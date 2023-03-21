# fairyring

**fairyring** is a blockchain built using Cosmos SDK and Tendermint and created with [Ignite CLI](https://ignite.com/cli).

## Get started

### Running the chain

```
ignite chain serve
```

Optionally add `rv` tag to reset and have verbose output.

`serve` command installs dependencies, builds, initializes, and starts your blockchain in development.

```
export alice=$(fairyringd keys show alice -a)
export bob=$(fairyringd keys show bob -a)
```

Register the account as a validator

```
fairyringd tx fairyring register-validator --from $alice --gas auto
```

Send a keyshare message from validator

```
fairyringd tx fairyring send-keyshare <Message> <BlockHeight> --from $alice --gas auto
```

Submit an encrypted tx message

```
fairyringd tx fairblock submit-encrypted-tx <TxData> <TargetBlockHeight> --from $alice --gas auto
```

### Running a validator locally

1. Copy DistributedIBE inside fairyring directory

```
cp -r ../DistributedIBE ./
```

2. Build docker image

```
docker build -t fairyring .
```

3. Setup validator

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring setup.sh <moniker>
```

4. Create new genesis.json

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring fairyringd collect-gentxs
```

5. Start the validator

```
docker run -it -p 1317:1317 -p 9090:9090 -p 26657:26657 -p 26656:26656 -v ~/.fairyring:/root/.fairyring fairyring fairyringd start
```

#### Running multiple validator

1. Repeat step 1 - 3 on all the machines,

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

### Become a validator

1. Follow step 1 - 3 on [Run validator locally](#Running-a-validator-locally)

2. Make sure you have enough coins in your account

3. Replace the `genesis.json` and `config.toml`

4. Send the `fairyringd tx staking create-validator` command with the address created to become validator, for example:

```
fairyringd tx staking create-validator \
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

### Queries

Get all validators

```
fairyringd query fairyring list-validator-set
```

Get all broadcasted keyshares

```
fairyringd query fairyring list-key-share
```

Get specific validator

```
fairyringd query fairyring show-validator-set <Index>
```

Get specific keyshare

```
fairyringd query fairyring show-key-share <Validator> <BlockHeight>
```

Get all encrypted tx in state

```
fairyringd query fairblock list-encrypted-tx
```

Get all encrypted tx in state from a specific block height

```
fairyringd query fairblock list-encrypted-tx-from-block <blockHeight>
```

Get a single encrypted tx in state with a specific block height & tx index

```
fairyringd query fairblock show-encrypted-tx <blockHeight> <index>
```

### Sending keyshares every block

It is recommended to run [`fairyringclient`](https://github.com/FairBlock/fairyringclient) so that validator registration and key share submissions are automated.

### Aggregating key shares

It is recommended to run [`fairyringrelay`](https://github.com/FairBlock/fairyringrelay) to listen to broadcast keyshare events and aggregate the keys in each block.

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

## Release

To release a new version of your blockchain, create and push a new tag with `v` prefix. A new draft release with the configured targets will be created.

```
git tag v0.1
git push origin v0.1
```

After a draft release is created, make your final changes from the release page and publish it.

### Install

To install the latest version of your blockchain node's binary, execute the following command on your machine:

```
curl https://get.ignite.com/username/fairyring@latest! | sudo bash
```

`username/fairyring` should match the `username` and `repo_name` of the Github repository to which the source code was pushed. Learn more about [the install process](https://github.com/allinbits/starport-installer).

## Learn more

- [Ignite CLI](https://ignite.com/cli)
- [Tutorials](https://docs.ignite.com/guide)
- [Ignite CLI docs](https://docs.ignite.com)
- [Cosmos SDK docs](https://docs.cosmos.network)
- [Developer Chat](https://discord.gg/ignite)
