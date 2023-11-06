sudo rm -r $HOME/.osmosisd-local

cd ../../../osmosis && make localnet-init

make localnet-start