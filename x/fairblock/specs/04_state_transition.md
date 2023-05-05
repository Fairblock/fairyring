# PEP State Transitions

## EncryptedTx

This state is modified in the following cases:

- When an encrypted transaction is submitted by an user
- When an encrytped transaction is executed from the store in the begin block at its target height.

Ref:

```go
func (k msgServer) SubmitEncryptedTx(goCtx context.Context, msg *types.MsgSubmitEncryptedTx) (*types.MsgSubmitEncryptedTxResponse, error)

func (am AppModule) BeginBlock(ctx sdk.Context, _ abci.RequestBeginBlock)
```

---

## FairblockExecutedNonce

This state is modified when an encrypted trnasaction is abaout to be executed in the begin block at the target height.

Ref:

```go
func (am AppModule) BeginBlock(ctx sdk.Context, _ abci.RequestBeginBlock)
```

---

## FairblockNonce

This state is modified when an encrypted transaction is submitted by an user

Ref:

```go
func (k Keeper) AppendEncryptedTx(ctx sdk.Context, encryptedTx types.EncryptedTx) uint64
```

---

## ActivePubKey

The active public key is only modified from the end block of the PEP module.

It is modified in the following 2 scenarios:

- No active pubkey exists, but there is a queued pubkey. In this case, the queued pubkey becomes active.
- Active pubkey expires. In this case, if a queued pubkey exists, it replaces the active pubkey.

Ref:

```go
func (am AppModule) EndBlock(ctx sdk.Context, _ abci.RequestEndBlock) []abci.ValidatorUpdate
```

---

## QueuedPubKey

The queued public key is modified by receiveing an acknowledgement IBC packet. It can also be modified in the end block of the PEP module.

- On receiving acknowledgement to the `CurrentKeysPacketData` IBC packet
- End Block: If the active public key is not found or expires, the queued pubkey replaces it and is deleted.

Ref:

```go
func (k Keeper) OnAcknowledgementCurrentHeightPacket(ctx sdk.Context, packet channeltypes.Packet, data types.CurrentKeysPacketData, ack channeltypes.Acknowledgement)

func (am AppModule) EndBlock(ctx sdk.Context, _ abci.RequestEndBlock) []abci.ValidatorUpdate
```

---

## AggregatedKeyShare

This state is modified when a transaction is made (normally by the Fairyport service) to register a new aggregated keyshare generated in the FairyRing chain. Unlike other transactions, this transaction is not normally executed. Instead, at the beign block of the PEP module, transactions with message type `MsgCreateAggregatedKeyShare` are searched for in the mempool. If found, these messages are then automatically executed.

Ref:

```go
func (k Keeper) ProcessUnconfirmedTxs(ctx sdk.Context, utxs *coretypes.ResultUnconfirmedTxs) error
```

---
