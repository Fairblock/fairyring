# PEP Messages

## SubmitEncryptedTx

This message sets an encrypted transaction in the kv-store of the PEP module to be executed at the target height.

```go
type MsgSubmitEncryptedTx struct {
    Creator           string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
    Data              string `protobuf:"bytes,2,opt,name=data,proto3" json:"data,omitempty"`
    TargetBlockHeight uint64 `protobuf:"varint,3,opt,name=targetBlockHeight,proto3" json:"targetBlockHeight,omitempty"`
}
```

---

## CreateAggregatedKeyShare

This message is used to register an aggregated keyshare from the fairyring chain to the destination chain.

```go
type MsgCreateAggregatedKeyShare struct {
    Creator   string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
    Height    uint64 `protobuf:"varint,2,opt,name=height,proto3" json:"height,omitempty"`
    Data      string `protobuf:"bytes,3,opt,name=data,proto3" json:"data,omitempty"`
    PublicKey string `protobuf:"bytes,4,opt,name=publicKey,proto3" json:"publicKey,omitempty"`
}
```
