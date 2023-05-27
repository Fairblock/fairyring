# KeyShare Begin Block

The Begin block of KeyShare module does the following three things:

1. Checks if the validators are still bonded. If not, they are removed from the registered validators list
2. Check if the active Key has expired and replace it with the Queued key
3. Forcibly write the active and quued key configuration to the store of PEP module to prevent accidental/malicious overwrite.

---

## Update Registered Validator Set

Validators who are not bonded (due to missing blocks, starting unbonding or being tombstoned) are not eligible for submitting keyshares to the module. The will be removed in the begining of the block and cannot submit their keyshares anymore.

```go
for _, eachValidator := range validators {
    if !eachValidator.IsBonded() {
        valAddr, _ := sdk.ValAddressFromBech32(eachValidator.OperatorAddress)
        valAccAddr := sdk.AccAddress(valAddr)
        am.keeper.RemoveValidatorSet(ctx, valAccAddr.String())
    }
}
```

---

## Active Key Expiry

The status of the Active PubKey is checked at the begining of every block. If the Key is found to be expired, it is replaced by the queued key. In case there is no queued key, the active key is simply removed. No Keyshares can be submitted till a new Active Key is assigned.

```go
ak, foundAk := am.keeper.GetActivePubKey(ctx)

if ak.Expiry <= height {
    am.keeper.DeleteActivePubKey(ctx)
    am.pepKeeper.DeleteActivePubKey(ctx)
}
```

---

## Update Keys in PEP store

The Keyshare module is considered the source of truth as far as PubKeys are concerned. The PEP module also keeps a copy of them for the purpose of verifying aggregated keyshares. To prevent the copy of keys in the PEP store from being corrupted, the Keyshare module forcibly overwrites the keys in the PEP module to maintain their integrety.

```go
ak, foundAk := am.keeper.GetActivePubKey(ctx)
qk, foundQk := am.keeper.GetQueuedPubKey(ctx)

am.pepKeeper.SetActivePubKey(ctx, peptypes.ActivePubKey{
    PublicKey: ak.PublicKey,
    Creator:   ak.Creator,
    Expiry:    ak.Expiry,
})

am.pepKeeper.SetQueuedPubKey(ctx, peptypes.QueuedPubKey{
    PublicKey: qk.PublicKey,
    Creator:   qk.Creator,
    Expiry:    qk.Expiry,
})
```

---

>NOTE: The begin block of Keyshare module must be run before the begin block of PEP module to ensure integrety of the PubKeys
