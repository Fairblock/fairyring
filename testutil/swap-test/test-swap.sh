
../../fairyringd tx ibc-transfer transfer transfer channel-0 osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj 5000frt --from star --node tcp://127.0.0.1:26659 -b sync  -y

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

sudo osmosisd tx wasm store ../../contract/osmosis.wasm --from val --home ~/.osmosisd-local --keyring-backend test --chain-id localosmosis --gas auto --gas-adjustment 1.5 --fees 12105uosmo -b block -y

MSG=$(../../jenv/jenv.sh -c '{}') 

sudo osmosisd tx wasm instantiate 1 "$MSG" --no-admin --label squid --from val --home ~/.osmosisd-local --keyring-backend test --chain-id localosmosis --gas auto --gas-adjustment 1.5 --fees 6763uosmo -b block  -y

MEMO=$(../../jenv/jenv.sh -c '{"wasm": {"contract": "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9", "msg": {"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"1","token_out_denom":"uosmo"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-0"}},"local_fallback_address":"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj"}}}}') 

../../fairyringd tx ibc-transfer transfer transfer channel-0 osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9 150frt --keyring-backend test --node tcp://127.0.0.1:26659   --from star -y  --memo "$MEMO"  -b async 

sleep 20

../../fairyringd query bank balances fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c --node tcp://127.0.0.1:26659