# Key Concepts

The Fairyring chain pivots around the use of IBE (Identity Based Encryption) to allow users to encrypt transactions using a public key, which is then decrypted and excecuted automatically at the target height. For this to work, the private key required to decrypt the transactions must be created on a per-block basis to leave no room for front-running. Also, once the decryption key is available, the encrypted transactions must be executed before any other transactions from the mempool. This is the crux of the operation of the FairyRing chain.

---

## Public Keys

The users need to encrypt their transaction using a public key and the private keys for decrypting the transactions must be generated on a per block basis. To this end, the FairyRing chain maintains 2 public keys at most at any given time, An Active PubKey and a Queued PubKey. Pubkeys, both active and queued, come with their expiry heights. The Active Key is the one currently being used against which keyshares are being submitted by validators to form the decryption key for every block. The queued key, as the name suggests, is a pubkey that will be used as the Active key once the current active key expires.

---

## KeyShares

Key shares are submitted by validators against the active pubkey to generate decryption keys per block.

Every validator needs their own client to submit their keys share. The client gets their part of key share from an API, derives the actual key share using the target block height and finally submits a transaction to fairyring. Malicious validators that send incorrect keyshares will be slashed.

Our initial release will be similar to the Proof of Authority (PoA) approach used by [Noble](https://github.com/strangelove-ventures/noble).
We have some basic slashing logic implemented for now, but this may change.

---

## KeyShare Aggregation

Once enough validators have submited keyshares for a particular block, the key shares are aggregated to generate the decryption key for that block. The decryption key can then be used to decrypt the previously encrypted transactions and execute them. To create the aggregated keyshare, it is not required for every validator to submit their individual keyshares. The aggregation can be performed as long as a threshold number of keyshares are submitted. Currently, at least 2/3 + 1 of the validators have to submit keyshares to create the aggregated keyshare.

---

## Tx Encryption

Unlike normal transactions, encrypted transactions work a bit differently. Users can encrypt any transaction with the current active public key. The user must also mention the target height at which the transaction is to be executed. The submitted encrypted transaction then resides in the state of the chain.

---

## Tx Decryption and Execution

On reaching the target height, the transaction is automatically decrypted using the aggregated keyshare of that height and executed before any of the mempool transactions for that block can be processed. Note the following two things:

- encrypted transactions are stored in the state of their corresponding chains. They are not transferred over IBC to the FairyRing chain. They are also executed in their corresponding chains.
- The target height for the execution of an encrypted transaction is the height of the FairyRing chain.

---
