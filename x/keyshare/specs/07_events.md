# KeyShare Events

The KeyShare module emits the following events:

## RegisteredValidatorEventType

This event is emitted when a new validator is registered and becomes eligible to submit keyshares.

### Registered Validator Attributes

- RegisteredValidatorEventCreator : The address of the sender of the Register Validator message.

---

## SendKeyshareEventType

This event is emitted when a validator successfully submits a keyshare for a block.

### Send Keyshare Attributes

- SendKeyshareEventValidator : Validator address
- SendKeyshareEventKeyshareBlockHeight : Keyshare Block Height
- SendKeyshareEventReceivedBlockHeight : Block height when keyshare is received
- SendKeyshareEventMessage : The submitted keyshare encoded in hex
- SendKeyshareEventCommitment : The submitted commitment encoded in hex
- SendKeyshareEventIndex: The index of the submitted keyshare

---

## KeyShareAggregatedEventType

This even is emitted when the aggregation of keyshares is complete

### KeyShare Aggregated Attributes

- KeyShareAggregatedEventBlockHeight : Block height for the aggregated keyshare
- KeyShareAggregatedEventData : The value of the aggregated keyshare
- KeyShareAggregatedEventPubKey : The public key against which the aggregated keyshare was generated
