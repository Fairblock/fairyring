# Tx Encryption

Users can encrypt their transactions to be executed at a target height using the registered pubkeys. To encrypt transactions, the user first creates a transaction offline and signs it. Then the signed data is encrypted using the pubkey. Then the user makes an online transation `SubmitEncryptedTx` to the Pep module. The encrypted signed data becomes the data for this new transaction. When the `SubmitEncryptedTx` is executed successfully, the encrypted data is stored in the state of the Pep module against its target height.

---

TODO:
@Martin kindly add the details on NONCES
