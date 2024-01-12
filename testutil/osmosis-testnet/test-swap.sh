MEMO=$(../../jenv/jenv.sh -c '{"wasm":{"contract":"osmo1zl9ztmwe2wcdvv9std8xn06mdaqaqm789rutmazfh3z869zcax4sv0ctqw","msg":{"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"74","token_out_denom":"uion"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-4860"}},"local_fallback_address":"osmo1pw5aj2u5thkgumkpdms0x78y97e6ppfl6vmjpd"}}}}')

../../fairyringd tx ibc-transfer transfer transfer channel-1 osmo1zl9ztmwe2wcdvv9std8xn06mdaqaqm789rutmazfh3z869zcax4sv0ctqw 20000ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B --node tcp://127.0.0.1:26659   --from fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c -y  --memo "$MEMO"  -b async

sleep 20

../../fairyringd query bank balances fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c --node tcp://127.0.0.1:26659