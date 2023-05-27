# PEP End Block

The Pep module maintains a copy of the active and queued public keys for the purpose of verifying the submitted aggregated keyshares. In the FairyRing chain, this value is automatically updated by the Keyshare module. Destination chains, however have to rely on IBC to fetch the values from the FairyRing chain. This is done in the end block of the PEP module. Furthermore, the logic for expiring active keys and replacing them with queued keys is also replicated here since it is required by the destination chain.

## Fetching Latest Keys via IBC

```go
err := am.keeper.QueryFairyringCurrentKeys(ctx)
if err != nil {
    am.keeper.Logger(ctx).Error("Beginblocker get keys err", err)
    am.keeper.Logger(ctx).Error(err.Error())
}
```

---

## Updating Active Key

In case the active key has expired, it is replaced by the Queued key, if present.

```go
strHeight := am.keeper.GetLatestHeight(ctx)
height, _ := strconv.ParseUint(strHeight, 10, 64)

ak, found := am.keeper.GetActivePubKey(ctx)
if found {
    if ak.Expiry <= height {
        am.keeper.DeleteActivePubKey(ctx)
    } else {
        return []abci.ValidatorUpdate{}
    }
}

qk, found := am.keeper.GetQueuedPubKey(ctx)
if found {
    if qk.Expiry > height {
        newActiveKey := types.ActivePubKey(qk)
        am.keeper.SetActivePubKey(ctx, newActiveKey)
    }
    am.keeper.DeleteQueuedPubKey(ctx)
}
```
