
1. create a private identity using contract function `request_identity()`

Place holder values for education purposes:

```bash
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"request_identity": {"price": {"denom": "ufairy", "amount": "1000"}}}' --from $ACCOUNT_NAME --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test
```

Actual values in command:

```bash
fairyringd tx wasm execute fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"request_identity": {"price": {"denom": "ufairy", "amount": "1000"}}}' --from wallet1 --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet/ --keyring-backend test
```

2. query contract to get the identity supplied

Place holder values for education purposes:

```bash
fairyringd q wasm contract-state smart $CONTRACT_ADDRESS '{"get_all_identity": {}}'
```

Actual values in command:

```bash
fairyringd q wasm contract-state smart fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"get_all_identity": {}}'
```

3. Register the contract against the identity

```bash
fairyringd tx pep register-contract fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1 --from wallet1 --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

4. (local step) encrypt data with pubkey and identity. Recall that public address is derived from pubkey.

Place holder values for education purposes:

```bash
fairyringd encrypt $private_id $PUBLIC_KEY $MESSAGE
```

Actual values in command:

```bash
fairyringd encrypt fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1 95fedf802d88dd66532f4a0552c3b6c51d9ef80c63a891e5c749178b49e77efaf55c56d5d90196afc237f9f3b8dea22d yoyoyo
```

Output will be in a format like

```bash
6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a6f473439336e4470727177786a6947486e454b7a346e75564e6f674733703447797857676d5839446d68414d5132506165772f307a5278486c51706a636f44480a494a4d6f3745584d336562744b424a47364f4a334238543970586972364d696b32324347393439734a744947436666737a6c41424b7359524f513576624247640a7667336844517a6434337350757732464e78444342410a2d2d2d207548594b3943454a7952784b7538574a794a6c644875754673657a6f472b354d564350434f5978326c306b0a14e947c62b5f18ec3fa8821f85b9235131f143df0905dacdbeb8136d651c4e907114270d31d5
```

5. upload encrypted data to contract:

Place holder values for education purposes:

```bash
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"store_encrypted_data": {"identity": "$CONTRACT_ADDRESS/req-private-id", "data": "ciphertext"}}' --from wallet1 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test
```

TODO: CHECK THE FOLLOWING - NOTE `$CONTRACT_ADDRESS/req-private-id` for the "identity" var has "req" in the middle as per how the ids are recognized I believe.

Actual values in command:

```bash
fairyringd tx wasm execute fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"store_encrypted_data": {"identity": "fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1", "data": "6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a6f473439336e4470727177786a6947486e454b7a346e75564e6f674733703447797857676d5839446d68414d5132506165772f307a5278486c51706a636f44480a494a4d6f3745584d336562744b424a47364f4a334238543970586972364d696b32324347393439734a744947436666737a6c41424b7359524f513576624247640a7667336844517a6434337350757732464e78444342410a2d2d2d207548594b3943454a7952784b7538574a794a6c644875754673657a6f472b354d564350434f5978326c306b0a14e947c62b5f18ec3fa8821f85b9235131f143df0905dacdbeb8136d651c4e907114270d31d5"}}' --from wallet1 --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

6. user2 wants decryption key

- Use the following command to interact with FairyRing to get the current list of pubkeys such as the scep pubkey:

```bash
fairyringd keys list
```

```bash
fairyringd keys list --home ./devnet_data/fairyring_devnet --keyring-backend test
```

Place holder values for education purposes:

- Elliptic Curve 

```bash
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"request_private_keyshare": {"identity": "$CONTRACT_ADDRESS/req-private-id", "secp_pubkey": "$SOME_HEX_KEY"}}' --from $ACCOUNT_NAME --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

Actual values in command:

```bash
fairyringd tx wasm execute fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"request_private_keyshare": {"identity": "fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1", "secp_pubkey": "Ak9iJuH5l5/XdmS6U+ojbutXnGzBnQf++HVOfKanVEc+"}}' --amount 400000ufairy --from wallet1 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test
```

7. wait and query contract

Place holder values for education purposes:

```bash
fairyringd q wasm contract-state smart $CONTRACT_ADDRESS '{"get_all_identity": {}}'
```

Actual values in command:

```bash
fairyringd q wasm contract-state smart fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"get_all_identity": {}}'
```

from step 6, you get a list of encrypted keyshares 

> Locally done from here on

7. decrypt enc. keyshares with your private key and aggregate them to create decryption key

Place holder values for education purposes:

```bash
fairyringd aggregate-keyshares [keyshare-list] [identity] [req-address] [priv-key-hex] 
```

Actual values in command:

```bash
fairyringd aggregate-keyshares '[ { "encrypted_keyshare_value": "e40d13ee893326cf5f55dff94e1c2bb102ca0020b4cc5752775008c05f55a463d483beeec023ff6beba561e25cc19b4f1fd2f7b2002088b3128c0de15ead9bbc01f247ea814d1f44e5e5c8edfeea35ddc767b4eb5624c96888d2cfcaf62b13d3d3842e53dd957c60763c3b6b412366d17456d8ecb7591a169fa71884ec329b2aeda3b9a35eb134d58551ae6805e9b61834e9f09e677f3728356ded2b48d0c02d86f8b3e19cc6ecfb30fb226c1c055d00eb015053022bb95e5e60f03dcfe1e62434d5fe4b2a3833ba2b16276be614b5672530bd883200ffc4d43218a24735877e0b3ba4ebaed164b4fe0a74a5902c954a375ad20c6b5ef2759db602ea13257ccb955f204006ce914f6846168a39c509c99f04224f84102be31cdc84c6b26dabd41357f344d5e8f5d0d702ec01e6053f79162bcca6de71396cd58985163586ca878c8121d884e5", "encrypted_keyshare_index": 1 } ]' "" fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq ef1450bdc18396f2254f52d8c525c0d933a8f146ec2a681eaf319f5899f2f60d
```

8. decrypt the encrypted data with dec. key from step 7

```bash
fairyringd query pep decrypt-data $PUB_KEY $DEC_KEY $CIPHER 
```

Actual Values

```bash
fairyringd query pep decrypt-data 95fedf802d88dd66532f4a0552c3b6c51d9ef80c63a891e5c749178b49e77efaf55c56d5d90196afc237f9f3b8dea22d 927631e00c368784af0649d57a3eb9e3d55e836772df30c0cdfc19ed0745625415fe5c5f6d89c110457dd56c7bf78b5b10d5e307e8a19aab1f92f3711e16ab4402e0f4551ea972d89b5bfb3e9252e9cceafad554ca3330dee721604ed152eb45 6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a6f473439336e4470727177786a6947486e454b7a346e75564e6f674733703447797857676d5839446d68414d5132506165772f307a5278486c51706a636f44480a494a4d6f3745584d336562744b424a47364f4a334238543970586972364d696b32324347393439734a744947436666737a6c41424b7359524f513576624247640a7667336844517a6434337350757732464e78444342410a2d2d2d207548594b3943454a7952784b7538574a794a6c644875754673657a6f472b354d564350434f5978326c306b0a14e947c62b5f18ec3fa8821f85b9235131f143df0905dacdbeb8136d651c4e907114270d31d5 
```