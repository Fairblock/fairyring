# Public Keys

As Mentioned previously, public keys are used by users of both FairyRing chain as well as all other destination chains to encrypt transactions that will be decrypted and executed at a particular target height.

There are two main reasons for having not only an active PubKey, but a queued Pubkey as well:

1. Having a queued key ensures that when a pubkey expires, there will not be a situation where the chain lacks any pubkeys, and hence keyshares cannot be submitted by validators.
2. Destination chains relying on FairyRing chain to receive aggregated keyshares for decrypting their corresponding transactions have to fetch the pubkeys from FairyRing chain using IBC. However, IBC can be pretty slow, often taking up 3-7 blocks to get the response back. This may lead to a situation where the active key expires and although a new active key has been registered on the FairyRing Chain, the same has not yet reflected on the destination chain. This opens up avenues for frontrunning in the destination chain. Having a queued key automatically take its place as the active key prevents such a scenario.

---

## PubKeys Expiry

Both Active and Queued Pubkeys come with an expiry height. They expire and are automatically replaced at their expiry height. When an Active pubkey expires, the queued pubkey, if present, takes its place. If there is no active pubkey registered to the FairyRing chain, keyshares cannot be submitted by validators, and by extension, any encrypted transaction supposed to be executed during such a period will get rejected due to lack of decryption key.

The default expiry duration is decided by the `KeyExpiry` param of the `KeyShare` module.

---

## Adding a New PubKey

The procedure for adding new Public Keys is different for the FairyRing chain and the destination chains. Whereas for the FairyRing chain, new keys are added via transations from verified addresses to the chain, the addition of pubkeys to destination chains is purely dependent on any change in pubkeys in the FairyRing chain and this information is fetched via IBC.

### Adding Keys to Destination Chains

Destination chains can only recieve pubkeys from the FairyRing chain via IBC. The PEP module, which is implemented by both FairyRing chain and destination chain, is an IBC enabled module. The Destination chain's PEP module becomes the A-end while the PEP module of the FairyRing chain becomes the B-end. At the end of every block, the PEP module of the A-end makes a call to the B-end to get the latest pubkeys.

Note the following:

- ONLY the queued key in the destination can be updated via IBC
- If an Active-Queued KeyPair already exists, no update is done
- The Active Key is expired automatically at its expiry height and the Queued key takes its place.
- Only when there is no existing Queued key, can a new one be registered

> Note: Currently, the PEP module makes an IBC call at the end of every block to fetch info on the latest keys in the FairyRing Chain. This may later be replaced with a periodic call since IBC calls are expensive.

### Adding PubKeys to FairyRing Chain

The FairyRing chain currently gets its PubKeys via transactions from trusted addresses. The KeyShare module maintains a list of trusted addresses in its state. Only transactions from these addresses are deemed to be valid. The list of trusted addresses must be provided at genesis.

In the FairyRing chain, PubKeys are redundantly stored in the state of both the KeySahre and the PEP module. This is done to prevent malicious or accidental overwrite of keys in the FairyRing chain itself.

Both the FairyRing chainand the destination chains must include the Pep Module. The Pep module has the aability to fetch pubkeys from the FairyRing chain via IBC. However, this may cause corruption of PubKeys in the FairyRing chain itself since someone may setup a relayer where the FairyRing chain becomes the destination chain and a malicious source chain. This can change the Pubkeys of the PEP module of the FairyRing chain.

To prevent this, the KeyShare module forcibly overwrites the keys in the state of the PEP module at the beginning of every block. We make sure that the begin block of the KeyShare Module executes before the begin block of the PEP module to ensure that the correct keys are in use.

However, the logic for adding new keys is similar to that of the PEP module:

- Only a queued key can be registered via tx
- If an Active-Queued KeyPair already exists, no update is done
- The Active Key is expired automatically at its expiry height and the Queued key takes its place.
- Only when there is no existing Queued key, can a new one be registered

To register a new Queued key on the FairyRing chain, a `CreateLatestPubKey` tx has to be made from a verified address to the `KeyShare Module`.

![ ](https://github.com/FairBlock/fairyring/blob/audit/docs/PubKey_Update_Fairy.png?raw=true)
