# 🍄 Fairblock: Building Basic Apps Using Simple Encrypted Transactions

Fairblock offers various MPC schemes for fun and novel dynamic confidential computation. One MPC scheme it offers is tIBE, where the Fairyring network is used to generate public keys for encryption and their respective decryption keys, based on a specific id, otherwise referred to as a "condition."

> Conditions can take the shape of anything, be it price of an asset, interest rates, etc. By default, apps developed on Fairyring can use Fairyring block height as the specific condition at which the respective decryption key will be generated to decrypt and trigger execution for a encrypted transaction.

This tutorial will guide you through using a simple Bash script to encrypt and send transactions in Fairblock with execution conditions based on a specific block height. These are referred to, for lack of better term, as a "bank msg" where one sends tokens and a memo, all of which are encrypted. 

By the end, you'll understand how to:

1. Send encrypted messages and token transfers using FairyRing and its inherit functionalities leveraging aspects such as `x/pep` module. More specifically:
    - Create and sign transactions on Fairblock
    - Encrypt transactions for deferred execution
    - Retrieve transaction status and results
2. Extract specific information from basic "building block" of sending and decrypting encrypted messages within FairyRing. This information can be useful for creating your own specific apps leveraging this small sample of confidential computation possibiliities.

## Demo Quick Start

To run this demo, simply download this repo, and switch to this specific feature branch, `feat-auction`.

```bash
git clone https://github.com/Fairblock/fairyring.git
gco feat-auction
```

Now, simply run:

```bash
make devnet-up
./bankMsgWithMemoAndDecryption.sh
```

Upon running the `./bankMsgWithMemoAndDecryption.sh` script, you will be prompted for the following basic inputs required to:

1. Specify the recipient of said bank message,
2. Encrypt the message with a target block height,
3. Submit the encrypted transaction to the blockchain,
4. Monitor the network for transaction processing, and show the decrypted result

## Demo Details

The provided bash script, `bankMsgWithMemoAndDecryption.sh`, does the following:

**1. Takes User Input**
- Asks for a FairyRing recipient address, the amount of uFairy to transfer, the wallet account name sending funds and the message, and a note for the transaction that acts as the message to be encrypted.

**2. Gets Required Info**
- Fetches your public key, account address, account number, and sequence number from the list of devwallets available for the demo dev net.

**3. Creates a Transaction**
- Generates an unsigned transaction with the specified details details.

**4. Signs the Transaction**
- Uses the specified account's dev net credentials to sign it securely.

**5. Uses `x/pep` Module to Encrypt the Transaction**
- Uses the standard convention of encrypting a message.

**6. Submits the Encrypted Transaction**
- Sends it to the local devnet.

**7. Waits for Confirmation**
- Watches the local FairyRing devnet blockchain height and checks when your transaction is included.

**8. Lists Decrypted Transactions**
- Once confirmed, it retrieves and displays the decrypted transaction.

> Developers are encouraged to parse the encrypted message for whatever data they may need for their own app design. This is where the true creative freedom comes into play!

Through using the FairyRing network, the following perks for said transaction are achieved:

- Transaction details private using encryption.
- Ensures proper signing so transactions are valid.
- The script making it easy to interact with the FairyRing blockchain while keeping your transactions private!

## Frequently Used CLI Commands 

The following are CLI commands one can use within their own scripts to work with encrypted transactions at a rudiemental level. Expand the toggle to see its details.

<details>
<summary>Commonly Used CLI Commands Shown in This Tutorial</summary>

### Fetch the Public Key for Encryption
- Use this in your app if you need to encrypt messages or transactions.

```bash
fairyringd query pep show-active-pub-key -o json | jq -r '.active_pubkey.public_key'
```

### Getting a FairyRing Account Address
- Essential if you're writing a wallet integration.

```bash
fairyringd keys show $ACCOUNT_NAME -a --keyring-backend test --home devnet_data/fairyring_devnet
```

### Create an Unsigned Transaction
- Builds a raw transaction JSON to be signed afterwards.

```bash
fairyringd tx bank send $ACC_ADDR $RECIPIENT $AMOUNT --generate-only -o json
```

### Get Account Number (for offline signing)
- Your application might need this if it manually constructs and signs transactions.

```bash
fairyringd query auth account $ACC_ADDR -o json | jq -r '.account.value.account_number'
```

### Get Sequence Number (Nonce)
- Obtaining the nonce is helpful when signing to prevent replay attacks.

```bash
fairyringd query pep show-pep-nonce $ACC_ADDR -o json | jq -r '.pep_nonce.nonce'
```

### Signs the Transaction Locally
- This allows offline signing, useful for hardware wallets or remote signing services.

If your app needs to handle user signing, it can call:

```bash
fairyringd tx sign unsigned.json --from $ACCOUNT_NAME --offline --account-number $ACC_NUM --sequence $ACC_SEQ
```

### Encrypting the Signed Transaction

Use the following to actually encrypt the transaction where one has to specify the target height, respective public key, and signed transaction.

```bash
fairyringd encrypt $TARGET_HEIGHT $PUBKEY "$SIGNED"
```

### Submitting the Encrypted Transaction:

Use the below command to submit the encrypted transaction with a specified target height for decryption.

```bash
fairyringd tx pep submit-encrypted-tx $ENCRYPTED $TARGET_HEIGHT
```

### Extracting the Transaction Hash (For Tracking)
Use the below command to extract the transaction hash that can be used to monitor the transaction status.

```bash
echo "$TX_SUBMISSION_OUTPUT" | grep -oE "txhash: [A-Fa-f0-9]+" | awk '{print $2}'
```

### Wait for Confirmation & Retrieves the Decrypted Transaction

This command monitors block height until the transaction is executed, and fetches decrypted transactions for further processing:

- This can be used to display decrypted transaction details in your app.

```bash
fairyringd list-decrypted-txs $TARGET_HEIGHT --output json | jq
```

## How You Can Use These Commands in Your Own App

1. Build your own app that uses the rudimentary encrypted transaction functionality with FairyRing.
2. Automate transaction workflows → Utilize contract call-back, and thus feth and process decrypted transactions once confirmed automatically.
3. Build a transaction explorer → Extract TX hashes and track status.

</details>

For more specific questions, please reach out either on [Discord](https://discord.gg/jhNBCCAMPK) or our [open issues repo](TODO-GET-LINK).
