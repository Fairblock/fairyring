# Tests

This folder contains the test scripts for keyshare & pep modules

---

## List of included tests

### Key Share Module

1. Submitting valid & invalid key share from a registered validator account & a non registered address

2. Registering as a validator with a staking & non staking account

3. Submitting public key from a trusted & non trusted account

### Pep Module

1. Testing the encrypted tx verification, decryption and execution

2. Submitting a valid & invalid aggregated key

3. Submitting a valid & invalid encrypted tx

4. Testing the pep nonce increment when an encrypted tx is being processed

---

## Start testing

1. Run `./start.sh` script to have local testnet running in background for testing

2. Run `./keyshare.sh` script to test the key share module

3. Run `./pep.sh` script to test the pep module

4. Run `./stop.sh` to stop the local testnet