# Generating and Submitting KeyShares

Validitors on FairyRing have two main purposes:

- Participate in consensus to generate blocks. This functionality is the same as with any other chain on Cosmos.
- Submit Keyshares at every block

This second functionality is the crux of the FairyRing chain.

> NOTE: It is not mandatory for all validators to submit keyshares. They can opt in for this functionality.

Every validator need their own client to submit their keys share. The client gets their part of key share from API, derive the actual key share by the target block height and finally submit to the fairyring. A malicious validators will be slashed.

## Registering the Validator

To be able to successfully send keyshares to the FairyRing chain, the validator must be separately registered in the Keyshare module. Unless a validator is registered, they won't be able to submit their keyshares. To register the validator, a `RegisterValidator` Tx must be sent. Once successfully registered, validators can start submitting keyshares.

## Submitting Keyshares

Once generated, the Validators can submit their corresponding Keyshares by making the `SendKeyshare` transaction. Keyshares, once verified, are saved in the state of the KeyShare module.
