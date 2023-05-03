# KeyShare Messages

## RegisterValidator

This message registers a new validator to the list of eligible validators who can submit keyshares.

```go
type MsgRegisterValidator struct {
    Creator string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
}
```

---

## SendKeyshare

This message is used by a registered validator to submit keyshares.

```go
type MsgSendKeyshare struct {
    Creator       string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
    Message       string `protobuf:"bytes,2,opt,name=message,proto3" json:"message,omitempty"`
    Commitment    string `protobuf:"bytes,3,opt,name=commitment,proto3" json:"commitment,omitempty"`
    KeyShareIndex uint64 `protobuf:"varint,4,opt,name=keyShareIndex,proto3" json:"keyShareIndex,omitempty"`
    BlockHeight   uint64 `protobuf:"varint,5,opt,name=blockHeight,proto3" json:"blockHeight,omitempty"`
}
```

```go
type MsgSendKeyshareResponse struct {
    Creator             string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
    Keyshare            string `protobuf:"bytes,2,opt,name=keyshare,proto3" json:"keyshare,omitempty"`
    Commitment          string `protobuf:"bytes,3,opt,name=commitment,proto3" json:"commitment,omitempty"`
    KeyshareIndex       uint64 `protobuf:"varint,4,opt,name=keyshareIndex,proto3" json:"keyshareIndex,omitempty"`
    BlockHeight         uint64 `protobuf:"varint,5,opt,name=blockHeight,proto3" json:"blockHeight,omitempty"`
    ReceivedBlockHeight uint64 `protobuf:"varint,6,opt,name=receivedBlockHeight,proto3" json:"receivedBlockHeight,omitempty"`
}
```

---

## CreateLatestPubKey

This message adds a new queued key.

```go
type MsgCreateLatestPubKey struct {
    Creator   string `protobuf:"bytes,1,opt,name=creator,proto3" json:"creator,omitempty"`
    PublicKey string `protobuf:"bytes,2,opt,name=publicKey,proto3" json:"publicKey,omitempty"`
}
```
