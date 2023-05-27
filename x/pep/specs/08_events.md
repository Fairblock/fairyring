# PEP Events

The PEP module emits the following events:

## SubmittedEncryptedTxEventType

This event is emitted on successful addition of an encrypted Tx to the store.

### Submitted Encrypted Tx Attributes

- SubmittedEncryptedTxEventCreator : Creator Address
- SubmittedEncryptedTxEventTargetHeight : Target height for execution of the Tx
- SubmittedEncryptedTxEventIndex : Index of the Encrypted Tx
- SubmittedEncryptedTxEventData : Encrypted messages

---

## EncryptedTxExecutedEventType

This event is executed when a stored encrypted Tx is executed successfully at the target height.

### Encrypted Tx Executed Attributes

- EncryptedTxExecutedEventCreator : Creator Address
- EncryptedTxExecutedEventHeight : Execution height of Tx
- EncryptedTxExecutedEventIndex : Execution index
- EncryptedTxExecutedEventData : Messages that were executed

---

## KeyShareVerificationType

This event is emitted when an aggregated keyshare verification fails.

### KeyShare Verification Attributes

- KeyShareVerificationCreator : Creator address
- KeyShareVerificationHeight : Height for which aggregated Keyshare was submitted
- KeyShareVerificationReason : Reason for failure

---
