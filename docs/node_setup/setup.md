# Node Setup

This section details how to configure and run a Fairyring node

## Generate keys

`fairyringd keys add [key_name]`

or

`fairyringd keys add [key_name] --recover` to regenerate keys with your [BIP39](https://github.com/bitcoin/bips/tree/master/bip-0039) mnemonic

---

## Connect to a chain and start node

> IMPORTANT: Make sure you have fairyring binary installed before proceeding

- Initialize node

```shell
fairyringd init {{NODE_NAME}} --chain-id fairyring-2
```

Select network to join

- Replace `${HOME}/.fairyring/config/genesis.json` with the genesis file of the chain.
- Add `persistent_peers` or `seeds` in `${HOME}/.fairyring/config/config.toml`
- Start node

```shell
fairyringd start
```

---

## Network Compatibility Matrix

| Version | Mainnet | Testnet | SDK Version |
|:-------:|:-------:|:-------:|:-----------:|
|  v0.0.1 |    ✗    |    ✓    |   v0.47.3   |

---

## Active Networks

### Mainnet

Coming Soon!!

### Testnet

Coming Soon!!

### Initialize a new chain and start node

- Initialize: `fairyringd init [node_name] --chain-id [chain_name]`
- Add key for genesis account `fairyringd keys add [genesis_key_name]`
- Add genesis account `fairyringd add-genesis-account [genesis_key_name] 10000000000000000000stake`
- Create a validator at genesis `fairyringd gentx [genesis_key_name] 10000000stake --chain-id [chain_name]`
- Collect genesis transactions `fairyringd collect-gentxs`
- Start node `fairyringd start`

### Reset chain

```shell
rm -rf ~/.fairyring
```

### Shutdown node

```shell
killall fairyringd
```

### Check version

```shell
fairyringd version
```
