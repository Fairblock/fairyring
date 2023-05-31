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

1. Make sure you have the executable of [ShareGenerator](https://github.com/FairBlock/ShareGenerator) and [Encrypter](https://github.com/FairBlock/encrypter) installed, that you were able to call them in terminal

To make sure you have them in the $PATH and is able to run in terminal

```bash
> where ShareGenerator
/Your_HOME/go/bin/ShareGenerator

where encrypter
/Your_HOME/go/bin/encrypter
```

2. Make sure you have [Hermes Relayer](https://hermes.informal.systems/) installed, here is the [installation guide](https://hermes.informal.systems/quick-start/installation.html) of Hermes Relayer

3. Make sure you have `fairyringd` executable in your PATH, type `where fairyringd` in terminal to check

```bash
> where fairyringd
/Your_HOME/go/bin/fairyringd
```

If it show `faiyringd not found`, make sure you already run the following command in fairyring directory:
```bash
make build
make install
```

## Start testing

```
make integration-test-all
```