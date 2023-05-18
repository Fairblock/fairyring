# Tx Decryption and Execution

At the target height, all encrypted transaction are fetched from the state of the PEP module. These transactions are then decrypted and executed one by one. The order of execution of these transactions is the same as the order of insertion in the state. If a particular target height does not have an associated aggregated-keyshare available, all encrypted transactions for that height are rejected.

---

TODO:
@Martin kindly add the details on NONCES
