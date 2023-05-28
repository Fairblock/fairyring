# Destination Chain Requirements

To integrate with the FairyRing chain, destination chains must meet the requirements of fetching aggregated keyshares from FairyRing chain as soon as they are generated and storing and executing encrypted transactions at their respective target heights.

## Fetching Aggregated Keyshares

It is very important to note that the aggregated keyshares generated on FairyRing MUST be fetched with one-block time of the destination chain. This is necessary to prevent any kind of front-running opportunity of encrypted transactions. For fetching interchain data, the IBC protocol seems to be the best way. However, the ICS standards specify that during IBC, light clients must verify the the proof of the data in the form of vector commitments. From our observations, we have found that a typical IBC call takes anywhere between 3 to 5 blocks to fetch the result. This clearly does not meet our requirement of fetching the aggregated keyshare in one-block time.

## Queuing and Executing Encrypted Transactions

Assuming that the destination chain is able to fetch the aggregated keyshares in one-block time, the next step requirement is to use these aggregated keyshares to decrypt encrypted transactions and execute them. So the Destination chain must implement a module which allows its users to submit encrypted transactions and keep them in the state, indexed by their target execution height.

As soon as the aggregated keyshare for a particular height is received, the module should automatically retrieve the encrypted transactions for that height from the store, decrypt them, and execute them. It is very important to note that the decryption and subsequent execution of these encrypted transactions MUST happen before any of the mempool transactions are executed, otherwise it opens up avenues for frontrunning the encrypted transactions. This makes executing encrypted transactions in the begin block the best candidate.
