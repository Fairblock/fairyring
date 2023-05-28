# KeyShare Aggregation

Once at least 2/3rd of the validators have submitted their keyshares, the aggregated Keyshare is automatically generated from these. The Aggregated Keyshare is esentially the decryption key for transactions of that target block. See [here](/x/keyshare/specs/02_concepts.md) for more information.

## Destination Chains

While the Aggregated Keyshare is available to be used directly on the FairyRing chain, the same is not true for destination chains. The Destination chain must fetch the aggregated keyshare from the FairyRing chain to decrypt and execute its encrypted transactions.

However, as mentioned previously, IBC is too slow and leaves open avenues for encrypted transactions to be frontrun. To address this, a new relaying mechanism can be implemented.

The main reason of IBC being slow is vector commitments. Essentially, by the ICS standards, both chains must submit and verify proofs of commitment of the other chain. However, we can skip this steps entirely in our case. Since the destination chain already retains a copy of the Active Pubkey, we can automatically verify if a fetched aggregated keyshare is valid by using a dummy data on-chain.

We have leveraged this property by simple setting up an off-chain relayer-like process, called FairyPort. This service simply makes a transaction to the destination chain with the newly generated aggregated keyshare, as soon as it is available. The FairyPort does this by making a `CreateAggregatedKeyShare` transaction to the PEP module of the destination chain.

It is, however, not enough. Since there is no ordering for execution of transactions from the mempool, malicious validators can still forcefully execute frontrunning transactions before executing the `CreateAggregatedKeyShare` transaction. To get over this problem, we directly look for any `CreateAggregatedKeyShare` Tx in the mempool during the execution of the begin block of the Pep module. If such a tx is found, we manually execute it directly in the begin block, leaving no opportunity for front-running.

![ ](docs/images/Aggr_KS_Gen_Success.png)

![ ](docs/images/Aggr_KS_Gen_Fail.png)
