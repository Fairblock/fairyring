# PEP States

## KVStore

State in PEP module is defined by its KVStore. This KVStore has five prefixes:

- AggregatedKeyShareKeyPrefix
- AggregatedKeyShareLengthPrefix
- ActivePubKeyPrefix
- QueuedPubKeyPrefix
- ValidatorSetKeyPrefix

---

### AggregatedKeyShare

This state maintains the Aggregated key share for every block height.

```go
type AggregatedKeyShare struct {
    Height uint64 `protobuf:"varint,1,opt,name=height,proto3" json:"height,omitempty"`
    Data   string `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
}
```

---

### AggregatedKeyShareLength

TODO: @Martin (not sure what this state does)

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

### ValidatorSet

This state contains the list of validators who will be submitting keyshares for aggregation

```go
type ValidatorSet struct {
    Index     string `protobuf:"bytes,1,opt,name=index,proto3" json:"index,omitempty"`
    Validator string `protobuf:"bytes,2,opt,name=validator,proto3" json:"validator,omitempty"`
    IsActive  bool   `protobuf:"varint,3,opt,name=isActive,proto3" json:"isActive,omitempty"`
}

---
