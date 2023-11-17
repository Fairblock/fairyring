# Threshold Encrypted Stop Loss Orders

This document describes how to enable threshold encrypted stop loss orders on Osmosis using Fairblock.

## Motivation

Existing protocols like 1inch or 0x that support limit orders/stop orders are all in the clear.
Generally, this is not advisable as searchers/adversaries are able to see key levels of a particular trading pair and possibly manipulate the market to trigger your order.
By encrypting the contents of a limit order, this market manipulation is prevented.

## Design

We give a simple example for what the desired user flow should look like.

User has 500OSMO. The current price (TWAP oracle) is 0.5USDC/OSMO. 
The user places a limit sell for 500OSMO with a trigger price of 0.4USDC/OSMO.
When the current price (TWAP oracle) `<= 0.4`, the user's stop loss is triggered, and ends with ~200USDC (definitely less due to fees, slippage, etc).

Using Fairblock's `conditionalenc` module, the functionality to arbitrarily encrypt any Osmosis message/transaction using any ID is possible without requiring the module to be installed on Osmosis. 

For stop loss orders, we encrypt using a combination of the TWAP (at fix-width ticks) and a global nonce. 

We use the global nonce as a way to keep track of how many times a particular price tick has been hit.
This is because once a particular nonce has been used, the decryption key will already be released and future orders would already be able to be decrypted.

### Encryption of User Orders

We use an encrypted version of swap functions available in the 0xsquid contract to faciliate the stop loss. 
Using the above example, the current TWAP is 0.5USDC/OSMO. 
We encrypt the swap message using the ID `(0.4USDC/OSMO, 0)` 
assuming the current global nonce for all ticks is 0, tick size of 0.05, and a reasonable `TokenOutMinAmount` value. 
Then we submit the encrypted payload in a `MsgSubmitEncryptedTx` message.

Suppose the following block, the TWAP becomes 0.35USDC/OSMO. Then, the following execution flow occurs:

1. Decryption key request is sent for `(trigger, nonce) = (0.5USDC/OSMO, 0), (0.45USDC/OSMO, 0), (0.4USDC/OSMO, 0), (0.35USDC/OSMO, 0)`. 
2. Increment global nonce for the affected ticks: `(trigger, new_nonce) = (0.5USDC/OSMO, 1), (0.45USDC/OSMO, 1), ...`.
3. For every encrypted limit order in store: 
    - attempt to decrypt the transaction using all released keys
    - relay the transaction to the 0xsquid contract on Osmosis chain

### Execution Details

We provide some additional details on how execution might occur for these types of orders.
In order to execute the swap messages on Osmosis chain, we require an ibc relayer between Fairyring and Osmosis chains. The validity of the decrypted swap messages is not verified on Fairyring so it is important to ensure the correctness of the swap message in advance to prevent fund losses.

To address the issue of spam on the network, one can perhaps make this service available to only OSMO stakers. 
Another alternative is to have a fixed fee for submitting an order for the network.
Finally, one can add an expiry mechanism so that old orders are flushed and removed from state (maybe the fixed fee is a function of time in force).

## Architecture Diagram

![](./assets/osmosis-swap.png)

---

## Other Notes (Don't publish)

There are a lot of uncertainty around execution. 
For example, if there are many stop loss orders at a particular tick, users may incur a high slippage. 
We want to guarantee execution, however this would also depend on the slippage limits a user sets. 
Setting `TokenOutMinAmount` as the minimum possible value would potentially drain a pool.
Perhaps batching the stop loss orders at each tick, executing the swap, and then running `protorev` might result in better price execution.

Another detail is on the quantity of these orders. An attacker may be able to flood the chain with dummy orders and slow down decryption. 
Perhaps an expiry mechanism can be added, so that really old orders are flushed and removed from the state.
Alternatively, some sort of collateral/fee can be used to address spam issue.

## Osmosis Swap Test (Local Osmosis)

In order to test the swap functionality using the squid contract on Osmosis chain, follow the below steps:

1. Clone the osmosis chain repository in the same directory where the fairyring direcotry is located.

```bash
git clone git@github.com:osmosis-labs/osmosis.git
```

2. Setup and run the Fairyring chain using the provided script in `fairyring/testutil/swap-test/start-fairy.sh`.
When running this script, it asks for a number `i` to set the chain id as `fairytest-i`.


3. Setup and run a local version of Osmosis chain using the provided script in `fairyring/testutil/swap-test/start-osmo.sh`.

4. Start the IBC relayer using the provided script in `fairyring/testutil/swap-test/relayer.sh`.
Input the same value for `i` as in step 2.

5. Perform a swap from `frt` to `uosmo` using the provided script in `fairyring/testutil/swap-test/test-swap.sh`.
This script will send some `frt` to the Osmosis chain to be able to create a pool. Then deploys the squid contract and creates the pool.
Finally, it will send a swap packet to the contract and after receiving the output `uosmo` in the format of an ibc transferred token, it will query and show the balance of the user on Fairyring chain which now includes the new swapped token.

## Osmosis Swap Test (Osmosis Testnet)
In order to perform the swap test through the squid contract on Osmosis testnet, follow the below instructions:

1. Setup and run the Fairyring chain as previously explained

2. Create a client node through running the bellow command:
```bash
curl -sL https://get.osmosis.zone/install > i.py && python3 i.py
```
Next, create a new key:
```bash
osmosisd keys add wallet
```
Copy the mnemonic into the `testutil/osmosis-testnet/mnemonic-osmosis.txt`. 
Using the osmosis official faucet, deposit osmos to the generated address.

3. Start the IBC relayer using the provided script in `fairyring/testutil/osmosis-testnet/relayer.sh`.

4. In order to use one of the current pools on osmosis tesnet, transfer some osmos to the fairyring:
```bash
osmosisd tx ibc-transfer transfer transfer ${channel-id} fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c 10000uosmo --from wallet --fees 416uosmo --gas auto --gas-adjustment 1.5 -b block
```

5. Replace the `channel` parameter in the MEMO in `testutil/osmosis-testnet/test-swap.sh` script with the current channel id on the osmosis side, and the ibc bridged token sent in the transfer command with the denom of the briged osmo on fairyring.
Then, run the script to perform the swap. The result of the swap can be checked through noticing the new ibc bridged token on the user's balance on fairyring.

## Osmosis Conditional Encryption

In order to test the swap functionality through the conditional encryption using local osmosis chain, follow the below steps:

1. Setup and run the Fairyring chain using the provided script in `fairyring/testutil/conditionalenc/start-fairy.sh`.
When running this script, it asks for a number `i` to set the chain id as `fairytest-i`.

2. Setup and run a local version of Osmosis chain using the provided script in `fairyring/testutil/conditionalenc/start-osmo.sh`.

3. Start the IBC relayers using the provided script in `fairyring/testutil/conditionalenc/relayer.sh`.
Input the same value for `i` as in step 2.

4. Perform the initial transfer, create the pool and the contract by running the script in `fairyring/testutil/conditionalenc/setup-pool.sh`.

5. Send the encrypted tx and submit pk and shares using the script in `fairyring/testutil/conditionalenc/send-tx.sh`. The message for the encrypted tx is hardcoded in `fairyring/testutil/conditionalenc/encrypter/main.go`. Also, it requires the `DistributedIBE` to be present in the same directory as fairyring. When running, it asks for the id you want to use for the encryption. The chain by default only checks for the ETH prices. So you can wait for a specific price to be reached and it will be shown in the logs like this ` =======================> {[1ETH1887399056900] } `. The `1ETH1887399056900` can be used as the id for encryption.
The hardcoded message is the following message converted to []byte:
```
coin := am.keeper.MinGasPrice(ctx)
coin.Amount = sdk.NewIntFromUint64(500)

cosmWasmPacketData := transfertypes.MsgTransfer{
		SourcePort: "transfer",
		SourceChannel: "channel-1",
		Token: coin,
		Sender: "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c",
		Receiver: "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9",
		TimeoutTimestamp: uint64(ctx.BlockTime().UnixNano()+int64(180000*time.Minute)),
		TimeoutHeight: types1.NewHeight(10000000000,100000000000),
		Memo: `{"wasm":{"contract":"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9", "msg":{"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"1","token_out_denom":"uosmo"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-0"}},"local_fallback_address":"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj"}}}}`,
	}
```

After the following steps, as it can be seen in the logs, the tx will be decrypted and sent to osmosis. The provided example performs a swap and the result tokens will be sent to fairyring. The new token can be seen throguh running:

```bash
../../fairyringd query bank balances fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c --node tcp://127.0.0.1:26659
```