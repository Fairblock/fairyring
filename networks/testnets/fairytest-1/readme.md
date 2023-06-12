# fairytest-1

> This chain is a testnet.

1st testnet for FairyRing.

## Hardware Requirements

- **Minimal**
  - 1 GB RAM
  - 25 GB HDD
  - 1.4 GHz CPU
- **Recommended**
  - 2 GB RAM
  - 100 GB HDD
  - 2.0 GHz x2 CPU

---

## Operating System

- Linux/Windows/MacOS(x86)
- **Recommended**
  - Linux(x86_64)
  - Ubuntu 20.04 LTS

---

## Network

- Sentry node architecture and secure firewall configurations are highly recommended [ref](https://forum.cosmos.network/t/sentry-node-architecture-overview/454)
- Port & Firewall settings (Ports Allowed)
  - rpc port: 26657
  - p2p port: 26656
  - grpc port: 9090

---

## Installation Steps

> Prerequisite: go1.18+ required [ref](https://golang.org/doc/install)

```shell
sudo snap install --classic go
```

> Prerequisite: git [ref](https://github.com/git/git)

```shell
sudo apt install -y git gcc make
```

> Prerequisite: Set environment variables

```shell
sudo nano $HOME/.profile
# Add the following two lines at the end of the file
GOPATH=$HOME/go
PATH=$GOPATH/bin:$PATH
# Save the file and exit the editor
source $HOME/.profile
# Now you should be able to see your variables like this:
echo $GOPATH
/home/[your_username]/go
echo $PATH
/home/[your_username]/go/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin
```

> Recommended requirement: Increase 'number of open files' limit

```shell
sudo nano /etc/security/limits.conf
# Before the end of the file, add:
[your_username] soft nofile 4096
# Then reboot the instance for it to take effect and check with:
ulimit -Sn
```

> Optional requirement: GNU make [ref](https://www.gnu.org/software/make/manual/html_node/index.html)

- Clone git repository

```shell
git clone https://github.com/FairBlock/fairyring
```

- Checkout release tag

```shell
cd fairyring
git fetch --tags
git checkout v0.1.0
```

- Install

```shell
cd fairyring
go mod tidy
make install
```

### Generate keys

`fairyringd keys add [key_name]`

or

`fairyringd keys add [key_name] --recover` to regenerate keys with your [BIP39](https://github.com/bitcoin/bips/tree/master/bip-0039) mnemonic

---

## Node start and validator setup

### Prior to genesis creation and network launch

- [Install](#installation-steps) FairyRing application
- Remove any data from previous run of `fairyringd`

```shell
rm -rf ~/.fairyring
```

- Initialize node

```shell
fairyringd init {{NODE_NAME}} --chain-id fairytest-1
```

>IMPORTANT: Make sure to use the exact chain-id `fairytest-1` to avoid making incompatible genesis transactions

- Create a new key

```shell
fairyringd keys add <keyName>
```

- Add a genesis account with `500000000000 tokens`

```shell
fairyringd add-genesis-account {{KEY_NAME}} 500000000000ufairy
```

- Make a genesis transaction to become a validator

```shell
fairyringd gentx \
  [account_key_name] \
  100000000000ufairy \
  --commission-max-change-rate 0.01 \
  --commission-max-rate 0.2 \
  --commission-rate 0.05 \
  --min-self-delegation 1 \
  --details [optional-details] \
  --identity [optional-identity] \
  --security-contact "[optional-security@example.com]" \
  --website [optional.web.page.com] \
  --moniker [node_moniker] \
  --chain-id fairytest-1
```

- Copy the contents of `${HOME}/.fairyring/config/gentx/gentx-XXXXXXXX.json`
- Clone the [fairyring repository](https://github.com/FairBlock/fairyring) and create a new branch
- Create a file `gentx-{{VALIDATOR_NAME}}.json` under the `networks/testnets/fairytest-1/gentxs` folder in the newly created branch, paste the copied text into the file (note: find reference file `gentx-examplexxxxxxxx.json` in the same folder)
- Run `fairyringd tendermint show-node-id` and copy your nodeID
- Run `ifconfig` or `curl ipinfo.io/ip` and copy your publicly reachable IP address
- Create a file `peers-{{VALIDATOR_NAME}}.json` under the `networks/testnets/fairytest-1/peers` folder in the new branch, paste the copied text from the last two steps into the file (note: find reference file `peers-examplexxxxxxxx.json` in the same folder)
- Create a Pull Request to the `main` branch of the [fairyring repository](https://github.com/FairBlock/fairyring)
  > **NOTE:** the Pull Request will be merged by the maintainers to confirm the inclusion of the validator at the genesis. The final genesis file will be published under the file `networks/testnets/fairytest-1/genesis.json`.
- Once the submission process has closed and the genesis file has been created, replace the contents of your `${HOME}/.fairyring/config/genesis.json` with that of `networks/testnets/fairytest-1/genesis.json`
- Add the required `persistent_peers` or `seeds` in `${HOME}/.fairyring/config/config.toml` from `networks/testnets/fairytest-1/peers-nodes.txt`
- Start node

```shell
fairyringd start
```

## Genesis Time

The genesis transactions sent before 1200HRS UTC 14th June, 2023 will be used to publish the `genesis.json` at 1500HRS UTC 14th June 2023

<!-- > Submitting Gentx is now closed. Genesis has been published and block generation has started -->

---

## After genesis creation and network launch

### Step 1: Start a full node

- [Install](#installation-steps) FairyRing application
- Initialize node

```shell
fairyringd init {{NODE_NAME}}
```

- Replace the contents of your `${HOME}/.fairyring/config/genesis.json` with that of `networks/testnets/fairytest-1/genesis.json` from the `main` branch of [FairyRing repository](https://github.com/FairBlock/fairyring)

```shell
curl https://github.com/FairBlock/blob/main/fairyring/networks/testnets/fairytest-1/genesis.json > $HOME/.fairyring/config/genesis.json
```

- Add `persistent_peers` or `seeds` in `${HOME}/.fairyring/config/config.toml` from `networks/testnets/fairytest-1/peers-nodes.txt` from the `main` branch of [FairyRing repository](https://github.com/FairBlock/fairyring)
- Start node

```shell
fairyringd start
```

> Note: if you are only planning to run a full node, you can stop here

### Step 2: Create a validator

- Acquire FAIRY tokens (contact maintainers on telegram)
- Wait for your full node to catch up to the latest block
- Run `fairyringd tendermint show-validator` and copy your consensus public key
- Send a create-validator transaction

```shell
fairyringd tx staking create-validator \
  --amount 50000000ufairy \
  --commission-max-change-rate 0.01 \
  --commission-max-rate 0.2 \
  --commission-rate 0.1 \
  --from [account_key_name] \
  --fees 400000ufairy \
  --min-self-delegation 1 \
  --moniker [validator_moniker] \
  --pubkey $(fairyringd tendermint show-validator) \
  --chain-id fairytest-1 \
  -y
```

---

## Persistent Peers

The `persistent_peers` needs a comma-separated list of trusted peers on the network, you can acquire it from the [peer-nodes.txt](https://github.com/FairBlock/blob/main/networks/testnets/fairytest-1/peer-nodes.txt) for example:

```shell
4980b478f91de9be0564a547779e5c6cb07eb995@3.239.15.80:26656,0e7042be1b77707aaf0597bb804da90d3a606c08@3.88.40.53:26656
```

## Version

This chain is currently running on fairyring [v0.1.0](https://github.com/FairBlock/fairyring/releases/tag/v0.1.0)
Commit Hash: [63dd8e8081e572f60fc02e0359657e41624e47c6](https://github.com/FairBlock/fairyring/commit/63dd8e8081e572f60fc02e0359657e41624e47c6)

## Binary

The binary can be downloaded from [here](https://github.com/FairBlock/fairyring/releases/tag/v0.1.0)

## Explorer

Coming Soon!!

<!-- >The Block Explorer for this chain is available [here]() -->

## Faucet

Coming Soon!!
<!-- > Discord Faucet is available [here]() -->

### RPC & API

Coming Soon!!
<!-- >- RPC is available [here]() -->
<!-- >- API is available [here]() -->
