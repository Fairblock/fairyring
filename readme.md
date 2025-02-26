
# 🍄 Fairblock: Building Basic Apps Using Simple Encrypted Transactions

_**‼️ All code within this tutorial is purely educational, and it is up to the readers discretion to build their applications following industry standards, practices, and applicable regulations.**_

This tutorial will guide you through using private decryption with general conditions. It builds off of the concept of [preparing, encrypting, decrypting, and executing simple transactions](https://docs.fairblock.network/docs/build/fairyring/fairyring_encrypted_msg) natively within the Fairblock blockchain, FairyRing. The repo can be found [here](https://github.com/Fairblock/fairyring/tree/contracts).

> Instead of a bash script being used to interact directly with the FairyRing network, this tutorial uses a bash script that interacts with **a newly deployed rust smart contract to prepare transactions, generates unique tIBE-related ids for them with FairyRing, and carries out the typical encryption process.** This is all happening within the FairyRing chain. **Decryption is carried out such that the keyshares from the FairyRing validators are encrypted with a specific public key associated to a user's wallet.**

## What cApps can be Made With Private Decryption and General Conditions?

There really is an endless design space for cApps using Private Decription and General Conditions with FairyRing. Some prime examples could include:

1. **Private Data Marketplaces for AI Models (user-owned data for AI models)** - AI models need data, insitutions and users do not want to give data without certain conditions (payment, ethtical integrity of the AI model or company, etc.). Private decryption and general conditions provides the tools to create market places where data sets can be encrypted and given conditions before it can be decrypted and used within an AI model.
2. **Content Behind Conditions and/or Paywalls - Example Idea: FairyFans:** cApps where subscribers can pay and/or carry out certain conditions in order to decrypt access to content or the content itself. Imagine all your favorite crypto twitter content creators providing end to end encrypted access to their content, all using decentralized, onchain, tech.
3. **Trusted Solvers for Intent Systems** - cApps that leverage intent systems but require that the solvers used follow specific conditions based on the prepared intent-based transaction. We already see intent apps provide the option to specify to use certain solvers, but that is all anchored in centralized systems. Private decryption and general conditions with fairblock unlocks this feature in a decentralized way.

For more cApp ideas make sure to check out our [Ecosystem page](https://docs.fairblock.network/docs/ecosystem/).

## Key Lessons from this Demo

<!-- recall - we do want to just have one docs page where it links to two repos but outlines the difference between public encryption and private decryption. OK. So the repo READMEs won't really touch on it. Only briefly.  -->

**1. Understood the high level difference between cApp design using "General Conditions" with:**
   - Public Decryption (a future tutorial)
   - Private Decryption (this tutorial)
**2. Walked through an example cApp (smart contract) going through a common payment-gate pattern where the UX flow includes:**
   - cApp providing a service, such as generating loot boxes, that are encrypted using FairyRing, and more specifically "FairyRing private decryption," where the contract sends encrypted keyshares (ultimately the decryption key) to users that pay the required service fee.
   - User pays fee, and is able to request the transaction to be decrypted.
   - Encrypted keyshares are sent to the user, where the user's wallet private key is used to encrypt the keyshares. The user then takes the encrypted keyshares, locally decrypts them using their wallet private key, and aggregates them, resulting in the decryption key needed to decrypt the unique passwords offered by the cApp to get through the payment gate. 

Essentially within step 2, developers will walk through the motions of using a rust smart contract within a FairyRing cApp and leverage dynamic confidential computing.

> The common payment-gate pattern is just one example for conditional decryption features. This is really up to you as the cApp developer!

## Demo Quick Start

Imagine that you're building a FairyRing cApp that provides gamers unique loot boxes. These loot boxes are of course unknown until certain conditions are hit, players finally get 100 mushrooms in a side quest, etc. you know how it is.

<!-- TODO: add Zelda / Link with sunglasses meme -->

Once the condition is hit and the FairyRing validators are notified, the keyshares are generated for the respective loot box. Since each loot box is unique, having a cApp design that uses private decryption makes sense. The gamer who earns the loot box will provide their public address, and that will be used to encrypt the newly generated keyshares. This way those keyshares won't be used to create the aggregated keyshare and thus the decryption key unless it is the appropriate gamer with the public-private key pairing for said wallet.

**This is a powerful smart contract lego piece that pushes cApps into even more exciting territory.**

To run this demo, simply download this repo, and switch to this specific feature branch, `contracts`.

```bash
git clone https://github.com/Fairblock/fairyring.git
gco contracts
```

Now, simply run the following and you will have effectively carried out the tutorial. Below we'll discuss what is happening.

```bash
make devnet-up
./privateEncryptionFairyRingTutorial.sh
```

`make devnet-up` spins up a local FairyRing chain on your machine using docker. The same devnet wallets are spun up everytime. As well, the rust smart contract `contract.rs` is deployed on your local devnet, also at the same address everytime in these tests. That is the smart contract we will be interacting with, we'll call it the `lootbox` contract. 

Upon running the `./privateEncryptionFairyRingTutorial.sh` script, you will see transactions carried out on your devnet in the CLI. It is basically walking through the transaction flow for a lootbox creator encrypting the message containing details about the lootbox, and then a gamer coming along and decrypting it after passing some set of conditions (in this case, a payment). 

> It is important to check out the `contract.rs` file and the comments provided. It acts as a temporary reference for those interested in creating their own cApp using this design pattern.

The steps of the cApp are as follows:

_All function calls outlined below are internal to the smart contract, and are done through the public function `execute()`._

1. The smart contract function `execute_request_identity()` is called.
2. FairyRing is queried to obtain the identities associated to the LootBox contract.
3. The CLI will prompt you for the newly generated `pubkey` that will be used to encrypt the LootBox details. In this example, we simply represent it as a string. 
<!-- TODO: I am pretty sure I can just have the pubkey extracted and used further in the respective txs following. -->
4. The script then encrypts the transaction using FairyRing. This is an offchain event and it is usually carried out by a front end. The encrypted result will then be output to the CLI.
5. The encrypted tx will then be input to the LootBox function `store_encrypted_data()`.
6. Now a user comes along who has earned the LootBox, and thus can call the LootBox contract function `execute_request_keyshare()`. In order to do this, the unique id for the respective lootbox needs to be known. You are asked for the pubkey to encrypt the keyshares with, and that will be the public address of your wallet. Simply pick a wallet from the fairyring wallet opsion spun up within your devnet.
7. The encrypted keyshares will be obtained.
8. These keyshares are then locally decrypted using your respective wallet's private key, and then aggregated to obtain the LootBox decryption key.
9. Now the script will call the contract function `decrypt()` which ultimately interacts with FairyRing to decrypt the transaction.

Assumptions:

1. The actual details of how this LootBox would work, and the actual exchanging of tokens to the LootBox smart contract are not in scope for this tutorial. That is for the app developer, but we're happy to discuss ideas!

The details of each of the key steps carried out in the bash script are discussed in the next section.

## Typical Transactions Carried Out by a Smart Contract Using this Pattern

Digging further into the underlying code within this tutorial, let's go over the general functions within this tutorial and how they can be used in a general sense for your own cApp.

### Step 1: Generate Unique IDs for Each Transaction

Within this tutorial, the rust contract creates a unique ID for each transaction each time the function `execute_request_identity()` is called.

Unique IDs are generated by creating whatever nomenclature you would like for your specific smart contract transaction, and then communicating with the `pep` module within FairyRing to obtain further name appendices to ensure it is unique in FairyRing.

Unique IDs can be generated as needed, or they can be generated ahead of time. This is a design decision for the cApp developer.

> **KEY LESSON FOR DEVS: cApp contracts will need a function that communicates with the `pep` module to generate unique IDs for encrypted contract transactions.**

The command that was ran to interact with this example's `request_identity()` function is shown below:

Place holder values for education purposes:

```bash
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"request_identity": {"price": {"denom": "ufairy", "amount": "1000"}}}' --from $ACCOUNT_NAME --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd tx wasm execute fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"request_identity": {"price": {"denom": "ufairy", "amount": "1000"}}}' --from wallet1 --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet/ --keyring-backend test
```

### Step 2: Query Contract for the Identity Supplied and Register the Contract Against the Identity

Now that private IDs can be generated from the smart contract, the next portion of the design flow for a developer is to obtain the public address. This is more-so done by the front end team likely. They would query the chain for the respective ids generated from the smart contract.

Place holder values for education purposes:

```bash
fairyringd q wasm contract-state smart $CONTRACT_ADDRESS '{"get_all_identity": {}}'
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd q wasm contract-state smart fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"get_all_identity": {}}'
```

3. Register the contract against the identity

Place holder values for education purposes:

```bash
fairyringd tx pep register-contract $CONTRACT_ADDRESS $UNIQUE_ID --from $ACCOUNT_NAME --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd tx pep register-contract fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1 --from wallet1 --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

### Step 3: Local Step: Encrypt Data with Pubkey and Identity

Typically handled by the Front End team, once the transaction details are prepared for said cApp. Imagine the UX consisting of a user interacting with a cApp via metamask, and simply submitting their details, this next step would happen during this time. The transaction details would be encrypted against the master public key, obtained from communicating with the FairyRing chain, to encrypt the transaction.

In this tutorial, we simply carry out the transaction in bash commands. 

Place holder values for education purposes:

```bash
fairyringd encrypt $private_id $PUBLIC_KEY $MESSAGE
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd encrypt fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1 95fedf802d88dd66532f4a0552c3b6c51d9ef80c63a891e5c749178b49e77efaf55c56d5d90196afc237f9f3b8dea22d yoyoyo
```

A return value is obtained, and will output similar to below in the CLI if this command is ran manually. This output is the encrypted tx data, otherwise referred to as the ciphertext.

```bash
6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a6f473439336e4470727177786a6947486e454b7a346e75564e6f674733703447797857676d5839446d68414d5132506165772f307a5278486c51706a636f44480a494a4d6f3745584d336562744b424a47364f4a334238543970586972364d696b32324347393439734a744947436666737a6c41424b7359524f513576624247640a7667336844517a6434337350757732464e78444342410a2d2d2d207548594b3943454a7952784b7538574a794a6c644875754673657a6f472b354d564350434f5978326c306b0a14e947c62b5f18ec3fa8821f85b9235131f143df0905dacdbeb8136d651c4e907114270d31d5
```

### Step 4: Upload Encrypted Data to Contract:

Recall that in this example, we are imagining a LootBox detail, perhaps the link to its metadata, is encrypted and requires a payment to the contract before a user can access it. 

> KEY DEVELOPER STEP: Now that the ciphertext is obtained, it can finally be uploaded to the contract to await a condition for it to be decrypted.

We proceed with the bash commands used to interact with the contract.

Place holder values for education purposes:

```bash
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"store_encrypted_data": {"identity": "$CONTRACT_ADDRESS/req-private-id", "data": "ciphertext"}}' --from wallet1 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd tx wasm execute fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"store_encrypted_data": {"identity": "fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1", "data": "6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a6f473439336e4470727177786a6947486e454b7a346e75564e6f674733703447797857676d5839446d68414d5132506165772f307a5278486c51706a636f44480a494a4d6f3745584d336562744b424a47364f4a334238543970586972364d696b32324347393439734a744947436666737a6c41424b7359524f513576624247640a7667336844517a6434337350757732464e78444342410a2d2d2d207548594b3943454a7952784b7538574a794a6c644875754673657a6f472b354d564350434f5978326c306b0a14e947c62b5f18ec3fa8821f85b9235131f143df0905dacdbeb8136d651c4e907114270d31d5"}}' --from wallet1 --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

### Step 5: A Gamer Comes Along and Wants to Purchase the LootBox and Therefore the Specific Encrypted Transaction's Decryption Key

At this point, we have an encrypted transaction stored within our smart contract and registered properly with FairyRing. Now the condition is simply that a payment is needed to the smart contract. Of course any conditions are up to the smart contract designer.

> KEY DEVELOPER POINT: Throughout the smart contract design, it is up to the developer to create conditions and the true custom implementations for their own cApp. This is where the fun happens! Once said condition is hit, then the key steps highlighted in this function are to request the private keyshare.

> Since we are working with private IDs, the concept is that users who successfully pass the conditions of said smart contract and can request the Decryption Key, do so in a way where the keyshares that make up the aggregate Decryption Key, are encrypted using said user's wallet public key.

If you are doing this manually, you can obtain the `secp_pubkey` from devnet FairyRing directly.

```bash
fairyringd keys list
```

or

```bash
fairyringd keys list --home ./devnet_data/fairyring_devnet --keyring-backend test
```

With the `secp_pubkey` and all other details of the transaction we have been working with up to this point, you can run the below manual bash commands to interact with the smart contract. Really though, the key again here is that the private keyshares are obtained within a rust function for the user. Within said function, there are key calls to FairyRing to obtain the keyshares in an encrypted manner.

Place holder values for education purposes:

```bash
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"request_private_keyshare": {"identity": "$CONTRACT_ADDRESS/req-private-id", "secp_pubkey": "$SOME_HEX_KEY"}}' --from $ACCOUNT_NAME --gas 9000000 --chain-id fairyring_devnet --home ./devnet_data/fairyring_devnet --keyring-backend test
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd tx wasm execute fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"request_private_keyshare": {"identity": "fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v/req-fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq-1", "secp_pubkey": "Ak9iJuH5l5/XdmS6U+ojbutXnGzBnQf++HVOfKanVEc+"}}' --amount 400000ufairy --from wallet1 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test
```

#### Manually Query Contract to See Encrypted KeyShare Details

You can use the below CLI command to query for the encrypted keyshare details.

Place holder values for education purposes:

```bash
fairyringd q wasm contract-state smart $CONTRACT_ADDRESS '{"get_all_identity": {}}'
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd q wasm contract-state smart fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v '{"get_all_identity": {}}'
```

### Step 6: Decrypt Encrypted Keyshares with Your Private Key and Aggregate Them to Create Decryption Key

Now that the user finally has the encrypted keyshares, they can locally user their wallet's private key, decrypt the keyshares and aggregate them using FairyRing. This would be another feature that the cApp would provide to the user likely through their front end.

Place holder values for education purposes:

```bash
fairyringd aggregate-keyshares [keyshare-list] [identity] [req-address] [priv-key-hex] 
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd aggregate-keyshares '[ { "encrypted_keyshare_value": "e40d13ee893326cf5f55dff94e1c2bb102ca0020b4cc5752775008c05f55a463d483beeec023ff6beba561e25cc19b4f1fd2f7b2002088b3128c0de15ead9bbc01f247ea814d1f44e5e5c8edfeea35ddc767b4eb5624c96888d2cfcaf62b13d3d3842e53dd957c60763c3b6b412366d17456d8ecb7591a169fa71884ec329b2aeda3b9a35eb134d58551ae6805e9b61834e9f09e677f3728356ded2b48d0c02d86f8b3e19cc6ecfb30fb226c1c055d00eb015053022bb95e5e60f03dcfe1e62434d5fe4b2a3833ba2b16276be614b5672530bd883200ffc4d43218a24735877e0b3ba4ebaed164b4fe0a74a5902c954a375ad20c6b5ef2759db602ea13257ccb955f204006ce914f6846168a39c509c99f04224f84102be31cdc84c6b26dabd41357f344d5e8f5d0d702ec01e6053f79162bcca6de71396cd58985163586ca878c8121d884e5", "encrypted_keyshare_index": 1 } ]' "" fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq ef1450bdc18396f2254f52d8c525c0d933a8f146ec2a681eaf319f5899f2f60d
```

### Step 7: Finally Decrypt the Encrypted Data with Decryption Key from Step 6

Again, this would likely be something offered by the front end for the user. At this point, the user has obtained the decryption key specific to their unique encrypted transaction they have paid for. They now just need to decrypt it, which would simply work with FairyRing behind the scenes.

Place holder values for education purposes:

```bash
fairyringd query pep decrypt-data $PUB_KEY $DEC_KEY $CIPHER 
```

Actual values in the `privateEncryptionFairyRingTutorial.sh` bash script:

```bash
fairyringd query pep decrypt-data 95fedf802d88dd66532f4a0552c3b6c51d9ef80c63a891e5c749178b49e77efaf55c56d5d90196afc237f9f3b8dea22d 927631e00c368784af0649d57a3eb9e3d55e836772df30c0cdfc19ed0745625415fe5c5f6d89c110457dd56c7bf78b5b10d5e307e8a19aab1f92f3711e16ab4402e0f4551ea972d89b5bfb3e9252e9cceafad554ca3330dee721604ed152eb45 6167652d656e6372797074696f6e2e6f72672f76310a2d3e20646973744942450a6f473439336e4470727177786a6947486e454b7a346e75564e6f674733703447797857676d5839446d68414d5132506165772f307a5278486c51706a636f44480a494a4d6f3745584d336562744b424a47364f4a334238543970586972364d696b32324347393439734a744947436666737a6c41424b7359524f513576624247640a7667336844517a6434337350757732464e78444342410a2d2d2d207548594b3943454a7952784b7538574a794a6c644875754673657a6f472b354d564350434f5978326c306b0a14e947c62b5f18ec3fa8821f85b9235131f143df0905dacdbeb8136d651c4e907114270d31d5 
```

## Next Steps

Congratulations! You have now seen an example of using a smart contract to encrypt transactions with general conditions and private decryption (private IDs). 

There are several next steps you can take now.

1. Check out our other quick starts to see how to build with other networks integrating into FairyRing in our [docs](https://docs.fairblock.network/docs/welcome/quickstart/).
2. Join our [discord](https://discord.gg/jhNBCCAMPK) and discuss new build ideas! We host frequent developer hours to encourage more novel ideas with confidential computation.