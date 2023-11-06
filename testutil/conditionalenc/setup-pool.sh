../../fairyringd tx ibc-transfer transfer transfer channel-1 osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj 5000frt --from star --node tcp://127.0.0.1:26659 -b sync  -y

sleep 10

export DENOM=$(sudo osmosisd q bank balances osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj --home ~/.osmosisd-local -o json | jq -r '.balances[] | select(.denom | contains("ibc")) | .denom')


cat > sample_pool.json <<EOF
{ 

        "weights": "1${DENOM},1uosmo", 

        "initial-deposit": "5000${DENOM},5000uosmo", 

        "swap-fee": "0.01", 

        "exit-fee": "0.00", 

        "future-governor": "168h" 

} 
EOF


sudo osmosisd tx gamm create-pool --pool-file sample_pool.json --from val --home ~/.osmosisd-local --keyring-backend test --chain-id localosmosis --gas auto --gas-adjustment 1.5 --fees 1349uosmo -b block -y
sleep 3
sudo osmosisd tx wasm store ../../contract/osmosis.wasm --from val --home ~/.osmosisd-local --keyring-backend test --chain-id localosmosis --gas auto --gas-adjustment 1.5 --fees 12105uosmo -b block -y
sleep 3
MSG=$(../../jenv/jenv.sh -c '{}') 

sudo osmosisd tx wasm instantiate 1 "$MSG" --no-admin --label squid --from val --home ~/.osmosisd-local --keyring-backend test --chain-id localosmosis --gas auto --gas-adjustment 1.5 --fees 6763uosmo -b block  -y
