# Tests

This folder contains the test scripts for keyshare & pep modules

---

## List of included tests

### Key Share Module

1. Submitting valid & invalid key share from a registered validator account & a non-registered address

2. Registering as a validator with a staking & non staking account

3. Submitting public key from a trusted & non-trusted account

### Pep Module

1. Testing the encrypted tx verification, decryption and execution

2. Submitting a valid & invalid aggregated key

3. Submitting a valid & invalid encrypted tx

4. Testing the pep nonce increment when an encrypted tx is being processed

---

## Requirement

1. Make sure you have the executable of [ShareGenerator](https://github.com/FairBlock/ShareGenerator) and [Encrypter](https://github.com/FairBlock/encrypter) ready in the `fairyring` directory. (Same directory as where the `Makefile` is located at)

2. Rename them to `ShareGenerator` and `encrypter` or you can update the name in scripts.

3. Make sure you have `fairyringd` executable in your PATH, type `where fairyringd` in terminal to check

## Start testing

```
make integration-test-all
```