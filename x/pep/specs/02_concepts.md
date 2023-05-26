# PEP Concepts

The PEP module leverages the power of IBE to decrypt transactions and process them at the desired height. Due to this, it is impossible to know the contents of a transaction before the target height is reached. On Reaching the target height, the encrypted transactions for that height are the first to be executed befor any mempool transactions. This completely removes any chance of these transactions being frontrun.

The PEP module gets an Active Public Key and a Queued Public Key from the FairyRing Chain via IBC. Hence all destination chains that wish to use the PEP module must run a realyer and connect their chain to the FairyRing chain. Users on the destination chain can then encrypt the transactions using these public keys and send them to their corresponding chains.

Encrypted Txs are not executed immediately. Instead, they are stored in the state of the PEP module indexed by their target height. When the target height is reached, and the aggregated keyshares for the target height become avaialble, these transactions are automatically decrypted and executed before all other mempool transactions.

To get the latest aggregated keyshare from the FairyRing chain, some kind of an Inter-chain Communication is required. However, the IBC which is built on the ICS standards, does not work in this specific case. This is mainly due to the vector commitment associated with IBC which may take some time. From tweaking around with relayers and block generation times of both chains, it seems like there is an average delay of 3-5 blocks between an IC request being sent and the response being received. However, this would mean that although aggregated shares are already released by the FairyRing chain, it takes 3-5 blocks for it to be registered on the destination chain. This gives malicious users a decent window to frontrun the encrypted transactions as they will not be executed till the aggregated keyshare is registered on-chain.

To solve this issue, we use FairyPort, a very simple relayer-like system, to connect the destination chain with the fairyring chain. The FairyPort gets rid of all kinds of verifications and vector commitments. Instead, it simply makes a grpc query to the FairyRing chain and posts the response of the query directly on the destination chain. It is possible to skip the verifications because the response data can be directly verified on the destination chain with a dummy encryption. This guarantees that the received data is authentic and from the correct source.

> NOTE: We can only do this because we can leverage the properties of IBE for the aggregated keyshares. The FairyPort relayer cannot be used for general IC since it does not do any kind of verification.

TODO: Add some diagrams
