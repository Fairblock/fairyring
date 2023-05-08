# KeyShare Concepts

The KeyShare module achieves this using Identity Based Encryption (IBE)

## Background

IBE is an encryption scheme that allows a user to encrypt and decrypt messages using an `id` (e.g. email, name, IP address).
Traditionally, a trusted third-party called the Private Key Generator (PKG) generates private keys for each user based on their chosen identity. 
The user's public key is derived from the identity and is made available. 
When a user wants to send a message to a specific counterparty, they can encrypt the message using the public key specific to the counterparty.

## Encrypting transactions

We are leveraging IBE by using the block height as the `id`. By doing so, we can encrypt transactions that will be executed at a particular block height.
Additionally, instead of relying on a PKG, we use a decentralized approach. A set of validators can cooperate together to generate the private key without knowing anything about the underlying secret key nor the block key before a particular height.

We first generate a pair of public and secret keys `(pk, msk)` such that each validator will own a part of `msk`. 
That is, validator `i` will own a specific keyshare `sk_i`. 
In each block, each validator will use `sk_i` to generate a block key share `bk_i`. 

```
bk_{h,i} = Exract(h, sk_i)

bk_h = Aggregate(bk_{h,1}, ..., bk_{h,t})
```

Once a threshold of keys are collected, the block key `bk` can be computed.
Notice that `bk_i` reveals no information about `sk_i` and `msk`. Thus, we are able to continue to use `sk_i` for future blocks. This prevents the need for frequent key rotation.

Encryption of a transaction utilizes the public key `pk` and the target block height `h`. 

```
EncTx = Encrypt(tx, h, pk, public_params)
```

Decryption of an encrypted transaction utilizes the block key `bk`.

```
Tx = Decrypt(bk_h, EncTx)
```

## KeyShare generation

We currently use a Verifiable Secret Sharing (VSS) scheme to generate `sk_i`. 
Validators can request a keyshare from our server as well as verify that there is a well defined secret key corresponding to their share.

However, this solution is far from ideal. 
We are implementing a Distributed Key Generation (DKG) scheme based on the [ETHDKG paper](https://eprint.iacr.org/2019/985) which utilizes non-interactive ZK proofs and is secure against the adaptive adversary model.
This would allow the share generation to be fully on-chain and permissionless.



TODO: @peyman @bowen [add info on the cryptography portion]
