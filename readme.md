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
