# Tx Encryption

Users can encrypt their transactions to be executed at a target height using the registered pubkeys. To encrypt transactions, the user first creates a transaction offline and signs it. Then the signed data is encrypted using the pubkey. Then the user makes an online transation `SubmitEncryptedTx` to the Pep module. The encrypted signed data becomes the data for this new transaction. When the `SubmitEncryptedTx` is executed successfully, the encrypted data is stored in the state of the Pep module against its target height.

---

## Pep Nonce

Pep nonce is designed to make it easier and more flexible for users sending encrypted transactions. Since the underlying encrypted tx will be executed after the `SubmitEncryptedTx` tx, user would need to sign the underlying tx with N + 1 nonce, and the `SubmitEncryptedTx` with nonce N. Also, the underlying tx will be reverted if user sends another tx after submitting the encrypted tx and user's address will be temporary unusable if they don't want their underly tx to get reverted.

Therefore, we implemented Pep Nonce, for easier and more flexible to submit encrypted tx. User signs the underly encrypted tx with their current Pep nonce, and the `SubmitEncryptedTx` with the original cosmos nonce, After submitting, the Pep nonce will not be increased immedately, it will be increased when the underly tx being processed. User don't need to sign the underlying Tx with N + 1 nonce, and they can still sends other tx without making the submitted tx get reverted. Just need to make sure to increase the Pep nonce if user want to submit another encrypted tx and the submitted one is not being processed.
