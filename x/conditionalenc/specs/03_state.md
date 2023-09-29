# PEP States

## KVStore

State in PEP module is defined by its KVStore. This KVStore has six prefixes:

- EncryptedTxKeyPrefix
- PepExecutedNonceKeyPrefix
- ConditionalencNonceKeyPrefix
- ActivePubKeyPrefix
- QueuedPubKeyPrefix
- AggregatedKeyShareKeyPrefix

---

### EncryptedTx

This state stores all the encrypted transactions indexed by the target execution height.

```go
type EncryptedTx struct {
    TargetHeight uint64 `protobuf:"varint,1,opt,name=targetCondition,proto3" json:"targetCondition,omitempty"`
    Index        uint64 `protobuf:"varint,2,opt,name=index,proto3" json:"index,omitempty"`
    Data         string `protobuf:"bytes,3,opt,name=data,proto3" json:"data,omitempty"`
    Creator      string `protobuf:"bytes,4,opt,name=creator,proto3" json:"creator,omitempty"`
}
```

---

### ConditionalencNonce

This state stores all user's pep nonce which is for users signing the underlying encrypted transaction

```go
type ConditionalencNonce struct {
    Address string `protobuf:"bytes,1,opt,name=address,proto3" json:"address,omitempty"`
    Nonce   uint64 `protobuf:"varint,2,opt,name=nonce,proto3" json:"nonce,omitempty"`
}
```

---

### ActivePubKey

This state contains the current public key against which keyshares are being submitted by validators.

```go
type ActivePubKey struct {
    PublicKey string `protobuf:"bytes,1,opt,name=publicKey,proto3" json:"publicKey,omitempty"`
    Creator   string `protobuf:"bytes,2,opt,name=creator,proto3" json:"creator,omitempty"`
    Expiry    uint64 `protobuf:"varint,3,opt,name=expiry,proto3" json:"expiry,omitempty"`
}
```

---

### QueuedPubKey

This state contains the public key that will be used when the current active key expires.

```go
type QueuedPubKey struct {
    PublicKey string `protobuf:"bytes,1,opt,name=publicKey,proto3" json:"publicKey,omitempty"`
    Creator   string `protobuf:"bytes,2,opt,name=creator,proto3" json:"creator,omitempty"`
    Expiry    uint64 `protobuf:"varint,3,opt,name=expiry,proto3" json:"expiry,omitempty"`
}
```

---

### AggregatedKeyShare

This state contains the aggregated keyshare received from the FairyRing chain.

```go
type AggregatedKeyShare struct {
    Height    uint64 `protobuf:"varint,1,opt,name=height,proto3" json:"height,omitempty"`
    Data      string `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
    PublicKey string `protobuf:"bytes,3,opt,name=publicKey,proto3" json:"publicKey,omitempty"`
    Creator   string `protobuf:"bytes,4,opt,name=creator,proto3" json:"creator,omitempty"`
}
```
