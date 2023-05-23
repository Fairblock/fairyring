# Integrating FairyPort

To resolve the issue of fetching aggregated keyshares from FairyRing to the Destination chain, we introduce an ad-hoc relayer like solution woith FairyPort

## Working Principle

The FairyPort is a simple service that can be set up to listen for Aggregated Keyshare Generation Events on the FairyRing via Websocket. As soon as such an event occurs, it immediately makes a `CreateAggregatedKeyShare` Tx to the destination chain with the Aggregated KeyShare data.

## Why it Works

Contrary to the ICS standards, in the operation of FairyPort, there is no verification of the data involved. This can open up avenues for malicious users making fake `CreateAggregatedKeyShare` transactions. However, it is not a problem in our case because of the nature of the data in the Tx.

The Aggregated Keyshare value can be easily checked on-chain in the destination chain. One simply needs to encrypt some dummy data using the pubkey in FairyRing and then try to decrypt it with the key from the submitted aggregated keyshare tx. If the decryption is successful, only then the aggregated keyshare is valid. All other txs can be simply rejected.

However, for this to work, the Destination chain must have a copy of the pubkey against which the aggregated keyshare was generated. But, since PubKeys will last for a long duration (about a 100 blocks, but subject to change via governance on the FairyRing chain), it can be easily fetched via normal IBC (following the ICS standards), i.e., we do not have the one-block time limitation on this. Moreover, to make sure that the destination chains do not fall behind when the pubkey expires on the FairyRing chain, the source has a pair of pubkeys, an `Active Key` and a `Queued Key`.

>NOTE: The destination chains do not have to mandatorily run the FairyPort service. They can use their own ad-hoc service for this. The important thing is to be able to fetch the aggregated keyshares from FairyRing in a one-block time.
