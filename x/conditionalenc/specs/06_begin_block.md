# PEP Begin Block

The begin Block of the PEP module constitutes of multiple tasks:

1. Checks for transactions in the mempool and looks for `MsgCreateAggregatedKeyShare` messages
2. If such a message is found it adds the aggregated keyshare directly to the PEP store.
3. Then it checks for encrypted transactions in its store, the decryption key for which are available
4. If one or more such encrypted transactions are found, they are decrypted and executed

## Check for transactions in the MemPool

It is necessary to execute any `CreateAggregatedKeyShare` Tx before executing Mempool transactions. This is because the block proposer has the right to order the Mempool transactions in any way he desires. Even if a `CreateAggregatedKeyShare` Transaction is made, the block proposer can act maliciously and include his front-running transactions before the Aggregated Keyshare is registered. To prevent this, the PEP begin block looks for any transaction in the mempool with the `MsgCreateAggregatedKeyShare` message. If found, it is directly executed in the begin block first.

```go
utxs, err := tmcore.UnconfirmedTxs(nil, nil)

if err != nil {
    am.keeper.Logger(ctx).Error("Error on getting unconfirmed txs")
    am.keeper.Logger(ctx).Error(err.Error())
}

if utxs != nil {
    if err := am.keeper.ProcessUnconfirmedTxs(ctx, utxs); err != nil {
        am.keeper.Logger(ctx).Error("Process unconfirmed txs error")
        am.keeper.Logger(ctx).Error(err.Error())
    }
}
```

---

## Decrypting Encryted Transactions

The Pep Begin block fetches the last target height that it executed and the latest height for which aggregated keyshares are available. It then fetches all encrypted transactions in this range, decrypt them one by one and execute them. For example, if the last executed height was 100 and the latest aggregated keyshare has a height of 105, it feches all encrypted transactions that have a target height of 100-105.

In the previous example, it may be possible that the aggregated keyshares for some intermediate heights are unavilable. For example, the Aggregated Keyshare for height 103 may not have been registered. In such a scenario, the encrypted transactions, if any, which had a target height of 103 will fail to be decrypted and hence cannot be executed. It is also important to note that once aggregated keyshares for a higher target height is registered, lower target height transactions are immediately removed and never executed.

For example, lets say the chain has successfully executed encrypted transactions upto target height 100. Then it receives aggregated keyshares for heights 102,103 and 105 in the mempool (refer to the previous section). In such a scenario, the module will attempt to fetch, decrypt and execute transactions with target heights from 101 to 105 in the order of their target heights. During this, all transactions for height 101 and 104 will fail to be decrypted since the corresponding aggregated keyshares were not received. In such a scenario, these transactions will be removed from the state of the PEP module and there will not be further attempts to execute them. This means, even if the aggregated keyshares for height 101 and 105 are submitted to the chain at a later time, they will not be registered. This is an intentional design since if a later target height is already available, it means that the transactions can be decrypted off-chain by MEV bots and frontrun when the mempool transactions for the current block is executed.

---

## Executing Decrypted transactions

As soon as an encrypted transaction is decrypted successfully, the transaction goes through rigorous checks. If all the checks pass, the transaction is executed similar to any other transaction.

```go
handler := am.msgServiceRouter.Handler(txMsgs[0])

_, err = handler(ctx, txMsgs[0])
if err != nil {
    am.keeper.Logger(ctx).Error("Handle Tx Msg Error")
    am.keeper.Logger(ctx).Error(err.Error())
    ctx.EventManager().EmitEvent(
        sdk.NewEvent(types.EncryptedTxRevertedEventType,
            sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
            sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.targetCondition, 10)),
            sdk.NewAttribute(types.EncryptedTxRevertedEventReason, err.Error()),
            sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
        ),
    )
    continue
}

am.keeper.Logger(ctx).Info("!Executed successfully!")
```
