# KeyShare Events

The KeyShare module emits the following events:

## RegisteredValidatorEventType

This event is emitted when a new validator is registered and becomes eligible to submit keyshares.

### Attributes

- RegisteredValidatorEventCreator : The address of the sender of the Register Validator message.

---

## SendKeyshareEventType

This event is emitted when a validator successfully submits a keyshare for a block.

### Attributes

- SendKeyshareEventValidator : Validator address
- SendKeyshareEventKeyshareBlockHeight : Keyshare Block Height
- SendKeyshareEventReceivedBlockHeight : Block height when keyshare is received
- SendKeyshareEventMessage : 
- SendKeyshareEventCommitment : @martin kindly fill in these 3
- SendKeyshareEventIndex: 

---

## KeyShareAggregatedEventType

This even is emitted when the aggregation of keyshares is complete

### Attributes

- KeyShareAggregatedEventBlockHeight : Block height for the aggregated keyshare
- KeyShareAggregatedEventData : The value of the aggregated keyshare
- KeyShareAggregatedEventPubKey : The public key against which the aggregated keyshare was generated
