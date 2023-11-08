read -p "Enter the value for i: " i



# hermes keys add --chain localosmosis --mnemonic-file "./mnemonic-osmosis.txt"
# Change to ~/.hermes directory

# # Rename folders starting with fairytest-* to fairytest-${i}
# for folder in ~/.hermes/keys/fairytest-*; do
#     if [ -d "$folder" ]; then
#         new_folder_name="$HOME/.hermes/keys/fairytest-${i}"
#         mv "$folder" "$new_folder_name"
#         echo "Renamed folder to $new_folder_name"
#     fi
# done

# Write the configuration content to ~/.hermes/config.toml
cat > ~/.hermes/config.toml <<EOF
[global]
log_level = "info"

[mode.clients]
enabled = true
refresh = true
misbehaviour = true

[mode.connections]
enabled = false

[mode.channels]
enabled = false

[mode.packets]
enabled = true
clear_interval = 100
clear_on_start = true
tx_confirmation = false
auto_register_counterparty_payee = false

[rest]
enabled = false
host = "127.0.0.1"
port = 3000

[telemetry]
enabled = false
host = "127.0.0.1"
port = 3001

[telemetry.buckets.latency_submitted]
start = 500
end = 20000
buckets = 10

[telemetry.buckets.latency_confirmed]
start = 1000
end = 30000
buckets = 10



# [[chains]]
# id = 'band-laozi-testnet6'
# rpc_addr = 'https://rpc.laozi-testnet6.bandchain.org:443'
# grpc_addr = 'https://laozi-testnet6.bandchain.org:443'
# event_source = { url = "wss://rpc.laozi-testnet6.bandchain.org:443/websocket",  batch_delay = '50ms' , mode = "push" }
# rpc_timeout = '50s'
# account_prefix = 'band'
# key_name = 'testkey'
# store_prefix = 'ibc'
# default_gas = 1000000
# max_gas = 100000000
# gas_price = { price = 0.0025, denom = 'uband' }
# gas_multiplier = 3
# max_msg_num = 30
# max_tx_size = 2097152
# clock_drift = '5s'
# max_block_time = '10s'
# trusting_period = '14days'
# trust_threshold = { numerator = '1', denominator = '3' }
# address_type = { derivation = 'cosmos' }

[[chains]]
id = 'fairytest-${i}'
rpc_addr = 'http://localhost:26659'
grpc_addr = 'http://localhost:9092'
event_source = { url = "ws://localhost:26659/websocket",  batch_delay = '50ms' , mode = "push" }
rpc_timeout = '50s'
account_prefix = 'fairy'
key_name = 'requester'
store_prefix = 'ibc'
default_gas = 100000000
max_gas = 150000000
gas_price = { price = 0, denom = 'ustake' }
gas_multiplier = 3
max_msg_num = 20
max_tx_size = 209715
clock_drift = '20s'
max_block_time = '10s'
trusting_period = '10days'
trust_threshold = { numerator = '1', denominator = '3' }
address_type = { derivation = 'cosmos' }

[[chains]]
id = 'osmo-test-5'
rpc_addr = 'https://rpc.testnet.osmosis.zone:443'
grpc_addr = 'https://grpc.testnet.osmosis.zone:443'
event_source = { url = "wss://rpc.testnet.osmosis.zone:443/websocket",  batch_delay = '50ms' , mode = "push" }
rpc_timeout = '50s'
account_prefix = 'osmo'
key_name = 'wallet'
store_prefix = 'ibc'
default_gas = 1000000
max_gas = 100000000
gas_price = { price = 0.0025, denom = 'uosmo' }
gas_multiplier = 3
max_msg_num = 30
max_tx_size = 2097152
clock_drift = '5s'
max_block_time = '10s'
trusting_period = '2days'
trust_threshold = { numerator = '1', denominator = '3' }
address_type = { derivation = 'cosmos' }

# [[chains]]
# id = 'localosmosis'
# rpc_addr = 'http://localhost:26657'
# grpc_addr = 'http://localhost:9090'
# event_source = { url = "ws://localhost:26657/websocket",  batch_delay = '50ms' , mode = "push" }
# rpc_timeout = '50s'
# account_prefix = 'osmo'
# key_name = 'wallet'
# store_prefix = 'ibc'
# default_gas = 1000000
# max_gas = 100000000
# gas_price = { price = 0.0025, denom = 'uosmo' }
# gas_multiplier = 3
# max_msg_num = 30
# max_tx_size = 2097152
# clock_drift = '5s'
# max_block_time = '10s'
# trusting_period = '230s'
# trust_threshold = { numerator = '1', denominator = '3' }
# address_type = { derivation = 'cosmos' }
EOF

hermes keys add --chain "fairytest-${i}" --mnemonic-file "./mnemonic-fairy.txt"
# hermes keys add --chain osmo-test-5 --mnemonic-file "./mnemonic-osmosis.txt"
# hermes create channel --a-chain band-laozi-testnet6 --b-chain "fairytest-${i}" --a-port oracle --b-port pricefeed --order unordered --channel-version bandchain-1 --new-client-connection 
hermes create channel --a-chain osmo-test-5 --b-chain "fairytest-${i}" --a-port transfer --b-port transfer --order unordered --new-client-connection 
#hermes create channel --a-chain localosmosis --b-chain "fairytest-${i}" --a-port transfer --b-port transfer --order unordered --new-client-connection 

hermes start