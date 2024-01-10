# fairytest-3

> This chain is a testnet.

3rd testnet for FairyRing.

## Hardware Requirements

- **Minimal**
    - 4 GB RAM
    - 250 GB HDD
    - 1.4 GHz x2 CPU
- **Recommended**
    - 8 GB RAM
    - 500 GB HDD
    - 2.0 GHz x4 CPU

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

> Prerequisite: go1.21+ required [ref](https://golang.org/doc/install)

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
git clone git@github.com:FairBlock/fairyring.git
```

- Checkout release tag

```shell
cd fairyring
git fetch --tags
git checkout v0.3.1
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

### Upgrading from v0.2.1 to v0.3.1

### Prior to genesis creation and network launch

- [Install](#installation-steps) FairyRing application
- Remove data from previous run of `fairyringd`

```shell
fairyringd tendermint unsafe-reset-all
```

- Make a genesis transaction to become a validator

```shell
fairyringd gentx \
  [account_key_name] \
  100000000000stake \
  --commission-max-change-rate 0.01 \
  --commission-max-rate 0.2 \
  --commission-rate 0.05 \
  --min-self-delegation 1 \
  --details [optional-details] \
  --identity [optional-identity] \
  --security-contact "[optional-security@example.com]" \
  --website [optional.web.page.com] \
  --moniker [node_moniker] \
  --chain-id fairytest-3
```

- Copy the contents of `${HOME}/.fairyring/config/gentx/gentx-XXXXXXXX.json`
- Clone the [fairyring repository](https://github.com/FairBlock/fairyring) and create a new branch
- Create a file `gentx-{{VALIDATOR_NAME}}.json` under the `networks/testnets/fairytest-3/gentxs` folder in the newly created branch, paste the copied text into the file (note: find reference file `gentx-examplexxxxxxxx.json` in the same folder)
- Run `fairyringd tendermint show-node-id` and copy your nodeID
- Run `ifconfig` or `curl ipinfo.io/ip` and copy your publicly reachable IP address
- Create a file `peers-{{VALIDATOR_NAME}}.json` under the `networks/testnets/fairytest-3/peers` folder in the new branch, paste the copied text from the last two steps into the file (note: find reference file `peers-examplexxxxxxxx.json` in the same folder)
- Create a Pull Request to the `main` branch of the [fairyring repository](https://github.com/FairBlock/fairyring)
  > **NOTE:** the Pull Request will be merged by the maintainers to confirm the inclusion of the validator at the genesis. The final genesis file will be published under the file `networks/testnets/fairytest-3/genesis.json`.
- Once the submission process has closed and the genesis file has been created, replace the contents of your `${HOME}/.fairyring/config/genesis.json` with that of `networks/testnets/fairytest-3/genesis.json`
- Add the required `persistent_peers` or `seeds` in `${HOME}/.fairyring/config/config.toml` from `networks/testnets/fairytest-3/peers-nodes.txt`
- Update the `~/.fairyring/config/config.toml` file and make sure that the peer-port (26656) is publicly reachable. If you are running sentry nodes, make sure that the peer-port of your sentry is publicly reachable
- Start node

```shell
fairyringd start
```

---

## After genesis creation and network launch

### Step 1: Start a full node

- [Install](#installation-steps) FairyRing application
- Initialize node

```shell
fairyringd init {{NODE_NAME}}
```

- Replace the contents of your `${HOME}/.fairyring/config/genesis.json` with that of `networks/testnets/fairytest-3/genesis.json` from the `main` branch of [FairyRing repository](https://github.com/FairBlock/fairyring)

```shell
curl https://github.com/FairBlock/blob/main/fairyring/networks/testnets/fairytest-3/genesis.json > $HOME/.fairyring/config/genesis.json
```

- Add `persistent_peers` or `seeds` in `${HOME}/.fairyring/config/config.toml` from `networks/testnets/fairytest-3/peers-nodes.txt` from the `main` branch of [FairyRing repository](https://github.com/FairBlock/fairyring)
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
  --amount 100000000000stake \
  --commission-max-change-rate 0.01 \
  --commission-max-rate 0.2 \
  --commission-rate 0.1 \
  --from [account_key_name] \
  --fees 400000stake \
  --min-self-delegation 1 \
  --moniker [validator_moniker] \
  --pubkey $(fairyringd tendermint show-validator) \
  --chain-id fairytest-3 \
  -y
```

---

## Persistent Peers

The `persistent_peers` needs a comma-separated list of trusted peers on the network, you can acquire it from the [peer-nodes.txt](https://github.com/FairBlock/blob/main/networks/testnets/fairytest-3/peers-node.txt) for example:

```shell
cd1cbf64a3e85d511c2a40b9e3e7b2e9b40d5905@18.183.243.242:26656,525d605dc4cc1e92d6b1d9a6934b19066083e610@34.66.108.187:26656,a7129083c119e6082cf0bd75149a60e94217fb95@89.58.32.218:27675,3cda3bebf7aaeeb0533734496158420dcd3da4ad@94.130.137.119:26666,a8f1e49990081c3f3c28d12822ecb02fd9723779@65.109.85.226:2030,dbe29963ccda90bb812a14359bbd2a4f3deba169@195.14.6.182:26656,fe0713ceb31b8a273b25bdd0fe0026778f781526@147.135.105.3:24756,3c2db295cea0eed604ecf2e37f794737a67e742d@65.21.163.231:26656,12f315956f97ba54f8a6e61d85e5efd4e8fb735e@51.210.222.119:26656,58367aafa6a5377db22cad1742cd686f8aa13284@31.171.240.187:26656,497f19e96a1b783336235671fbf09cce068e843e@88.218.226.24:26656
```

## Version

This chain is currently running on fairyring [v0.3.1](https://github.com/FairBlock/fairyring/releases/tag/v0.3.1)
Commit Hash: [cb2e08a87bf7a9d75e2764d1b157a84c8e4fb775](https://github.com/FairBlock/fairyring/commit/cb2e08a87bf7a9d75e2764d1b157a84c8e4fb775)

## Binary

The binary can be downloaded from [here](https://github.com/FairBlock/fairyring/releases/tag/v0.3.1)

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
