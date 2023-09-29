# Chain Reset and Upgrade to fairyring v0.2.1

This is the instruction for performing chain reset and then upgrading the chain from v0.1.0 to v0.2.1

## Upgrading to fairyring v0.2.1

1. Move to your fairyring folder, then pull the latest version

```bash
cd fairyring
git pull
```

2. Checkout to v0.2.1 version

```bash
git checkout v0.2.1
```

3. Install the new version

make sure you have go version 1.21 installed

```bash
make install
```

## Resetting the chain

1. Resetting the chain
   
```bash
fairyringd tendermint unsafe-reset-all
```

<small>**If your `.fairyring` directory is not the default one, please add `--home [path]` flag</small>

2. Update Genesis file

Replace the `.fairyring/config/genesis.json` with the [new one](https://github.com/Fairblock/fairyring/blob/main/networks/testnets/fairytest-1/genesis.json)


## Start the chain

```bash
fairyringd start
```

<small>**If your `.fairyring` directory is not the default one, please add `--home [path]` flag</small>