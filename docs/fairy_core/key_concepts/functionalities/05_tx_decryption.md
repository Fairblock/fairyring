# Tx Decryption and Execution

At the target height, all encrypted transaction are fetched from the state of the PEP module. These transactions are then decrypted and executed one by one. The order of execution of these transactions is the same as the order of insertion in the state. If a particular target height does not have an associated aggregated-keyshare available, all encrypted transactions for that height are rejected.

---

## Pep Nonce

When an encrypted tx is being processed, the sender's Pep Nonce will be increased by 1. After decrypted the transaction, the PEP module will verify the signature with Pep Nonce instead of the originally cosomos account nonce, to see if the tx is signing with the correct Pep nonce. The Pep nonce used for signing the tx have to be greater or equals to the correct nonce, if a larger Pep nonce is being used, user's pep nonce will be updated to the nonce used + 1.
