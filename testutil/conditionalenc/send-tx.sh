read -p "Enter the value for id: " i

enc=$($HOME/job/encrypter/encrypter ${i} a6798cf7364ba5e8337584394bf9c6d4970a174603aab18f06ed80ade5f65194e51522170814d2c38b68c2703bfb7ca0 "hi")
# '{
#   "source_port": "transfer",
#   "source_channel": "channel-1",
#   "token":{
#     "denom": "frt",
#     "amount": "500"
#   },
#   "sender": "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c",
#   "receiver": "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9",
#   "timeout_height":{
#     "revision_number": "10000000000",
#     "revision_height": "100000000000"
#   },
#   "timeout_timestamp": "1699052860444761679",
#   "memo": "{\"wasm\": {\"contract\": \"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9\", \"msg\": {\"swap_with_action\":{\"swap_msg\":{\"token_out_min_amount\":\"10\",\"path\":[{\"pool_id\":\"1\",\"token_out_denom\":\"uosmo\"}]},\"after_swap_action\":{\"ibc_transfer\":{\"receiver\":\"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c\",\"channel\":\"channel-0\"}},\"local_fallback_address\":\"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj\"}}}}"
# }')
#'{"source_port":"transfer","source_channel":"channel-1","token":{"denom":"frt","amount":"500"},"sender":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","receiver":"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9","timeout_height":{"revision_number":10000000000,"revision_height":100000000000},"timeout_timestamp":1699052860444761679,"memo":"{\"wasm\": {\"contract\": \"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9\", \"msg\": {\"swap_with_action\":{\"swap_msg\":{\"token_out_min_amount\":\"10\",\"path\":[{\"pool_id\":\"1\",\"token_out_denom\":\"uosmo\"}]},\"after_swap_action\":{\"ibc_transfer\":{\"receiver\":\"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c\",\"channel\":\"channel-0\"}},\"local_fallback_address\":\"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj\"}}}}"}}')
#'{"denom":"frt","amount":"130","sender":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","receiver":"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9","memo":"{\"wasm\": {\"contract\": \"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9\", \"msg\": {\"swap_with_action\":{\"swap_msg\":{\"token_out_min_amount\":\"10\",\"path\":[{\"pool_id\":\"1\",\"token_out_denom\":\"uosmo\"}]},\"after_swap_action\":{\"ibc_transfer\":{\"receiver\":\"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c\",\"channel\":\"channel-0\"}},\"local_fallback_address\":\"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj\"}}}}"}')


echo "${enc}"

../../fairyringd tx conditionalenc submit-encrypted-tx ${enc} ${i} --node tcp://127.0.0.1:26659 -b sync -y --from star
sleep 5
../../fairyringd tx keyshare create-latest-pub-key a6798cf7364ba5e8337584394bf9c6d4970a174603aab18f06ed80ade5f65194e51522170814d2c38b68c2703bfb7ca0 a6798cf7364ba5e8337584394bf9c6d4970a174603aab18f06ed80ade5f65194e51522170814d2c38b68c2703bfb7ca0 --node tcp://127.0.0.1:26659 -b sync -y --from star

output=$($HOME/job/ShareGenerator/ShareGenerator derive 2ecab484b7a96eb1a4d9113b03cf09459c79c178ce3098baa2f8eb2bdcbec920 0 ${i} | jq '.')

# Using jq to parse the JSON and extract the value of KeyShare
share=$(echo "$output" | jq -r '.KeyShare')
sleep 5
../../fairyringd tx keyshare create-general-key-share "" ${i} ${share} 1 123 123 --node tcp://127.0.0.1:26659 -b sync -y --from star