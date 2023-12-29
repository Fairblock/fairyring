# Chain Reset and Upgrade to fairyring v0.3.1

This is the instruction for performing chain reset and then upgrading the chain from v0.2.1 to v0.3.1

## Upgrading to fairyring v0.3.1

1. Move to your fairyring folder, then pull the latest version

```bash
cd fairyring
git pull
git checkout v0.3.1
```

2. Install the new version

make sure you have go version 1.21 installed

`make install`

## Resetting the chain

1. Resetting the chain

`fairyringd tendermint unsafe-reset-all`

**If your .fairyring directory is not the default one, please add --home [path] flag

2. Update Genesis file

Replace the `.fairyring/config/genesis.json` with the [new one](https://github.com/Fairblock/fairyring/blob/main/networks/testnets/fairytest-3/genesis.json)

## Start the chain

fairyringd start

**If your .fairyring directory is not the default one, please add --home [path] flag`
