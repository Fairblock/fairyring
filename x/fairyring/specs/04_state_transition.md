# KeyShare State Transitions

## AggregatedKeyShare

This state is modified when the required number of keyshares have been submitted by validators to form the decryption key.
Currently, at least 2/3rd of the registered validators must submit their keyshares.

The aggregated keyShares are stored by height and once set, they can never be modified.

Ref:

```go
func (k msgServer) SendKeyshare(goCtx context.Context, msg *types.MsgSendKeyshare) (*types.MsgSendKeyshareResponse, error)
```

---

## AggregatedKeyShareLength

TODO: @martin

---

## ActivePubKey

The active public key is only modified from the end block of the KeyShare module.

It is modified in the following 2 scenarios:

- No active pubkey exists, but there is a queued pubkey. In this case, the queued pubkey becomes active.
- Active pubkey expires. In this case, if a queued pubkey exists, it replaces the active pubkey.

Ref:

```go
func (am AppModule) EndBlock(ctx sdk.Context, _ abci.RequestEndBlock) []abci.ValidatorUpdate
```

---

## QueuedPubKey

The queued public key is modified by a successful execution of the `MsgCreateLatestPubKey` message. It can also be modified in the end block of the KeyShare module.

- `MsgCreateLatestPubKey` message: If there does not exist a queued pubkey, a new one can be added via this message
- End Block: If the active public key is not found or expires, the queued pubkey replaces it and is deleted.

Ref:

```go
func (k msgServer) CreateLatestPubKey(goCtx context.Context, msg *types.MsgCreateLatestPubKey) (*types.MsgCreateLatestPubKeyResponse, error)

func (am AppModule) EndBlock(ctx sdk.Context, _ abci.RequestEndBlock) []abci.ValidatorUpdate
```

---

## ValidatorSet

The validator set is modified by a successful execution of the `MsgRegisterValidator` message. It can add a new validator who will then be eligible for submitting keyshares.

Ref:

```go
func (k msgServer) RegisterValidator(goCtx context.Context, msg *types.MsgRegisterValidator) (*types.MsgRegisterValidatorResponse, error)
```
