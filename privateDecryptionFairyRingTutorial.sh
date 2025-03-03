#!/bin/bash

# === Fixed Values ===
CONTRACT_ADDRESS="fairy14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9stsyf7v"
WALLET_1="wallet1"
WALLET_2="wallet2"
ACC_ADDR_W1="fairy1m9l358xunhhwds0568za49mzhvuxx9uxdra8sq"
ACC_ADDR_W2="fairy10h9stc5v6ntgeygf5xf945njqq5h32r5lxfsqr"
PUB_KEY_64_W2="Ak9iJuH5l5/XdmS6U+ojbutXnGzBnQf++HVOfKanVEc+"
PRIV_KEY_HEX_W2="ef1450bdc18396f2254f52d8c525c0d933a8f146ec2a681eaf319f5899f2f60d"
AMOUNT="1000"
TARGET_HEIGHT=$(($(fairyringd query pep latest-height --output json | jq -r '.height') + 10))

# === Install yq if missing ===
if ! command -v yq &> /dev/null; then
    echo "🔍 yq not found! Installing..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo add-apt-repository ppa:rmescandon/yq
        sudo apt update
        sudo apt install yq -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install yq
    else
        echo "❌ Unsupported OS. Please install 'yq' manually."
        exit 1
    fi
    echo "✅ yq installed successfully!"
fi

# Fetch FairyRing active public key
FAIRYRING_PUBKEY=$(fairyringd query pep show-active-pub-key -o json | jq -r '.active_pubkey.public_key')

# Step 1: Wallet-1 requests an identity (contract auto-generates unique ID)
echo "Requesting a unique transaction identity..."
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"request_identity": {"price": {"denom": "ufairy", "amount": "'$AMOUNT'"}}}' \
    --from $WALLET_1 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test -y

# Step 2: Fetch the generated identity from the contract
echo "Retrieving generated identity..."
sleep 3  # Allow time for transaction inclusion
UNIQUE_ID=$(fairyringd q wasm contract-state smart $CONTRACT_ADDRESS '{"get_all_identity": {}}' | yq eval -o=json | jq -r '.data.records[-1].identity')

if [[ -z "$UNIQUE_ID" || "$UNIQUE_ID" == "null" ]]; then
    echo "❌ Error: Could not retrieve unique identity. Exiting..."
    exit 1
fi
echo "✅ Generated Unique ID: $UNIQUE_ID"

# Step 3: Register the contract against the generated identity
echo "Registering contract against identity..."
fairyringd tx pep register-contract $CONTRACT_ADDRESS $UNIQUE_ID --from $WALLET_1 \
    --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test -y

sleep 3

# Step 4: Encrypt transaction data
echo "Encrypting transaction data..."
ENCRYPTED_DATA=$(fairyringd encrypt $UNIQUE_ID $FAIRYRING_PUBKEY "THE ONEPIECE IS REAL.")

# Step 5: Store encrypted data in the contract
echo "Uploading encrypted data to the smart contract..."
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"store_encrypted_data": {"identity": "'$UNIQUE_ID'", "data": "'$ENCRYPTED_DATA'"}}' \
    --from $WALLET_1 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test -y

sleep 3

# Step 6: Wallet-2 requests private keyshare
echo "Wallet-2 is requesting private keyshare..."
fairyringd tx wasm execute $CONTRACT_ADDRESS '{"request_private_keyshare": {"identity": "'$UNIQUE_ID'", "secp_pubkey": "'$PUB_KEY_64_W2'"}}' \
    --amount 400000ufairy --from $WALLET_2 --gas 9000000 --home ./devnet_data/fairyring_devnet --chain-id fairyring_devnet --keyring-backend test -y

# Step 7: Wallet-2 queries contract for encrypted keyshares
echo "⏳ Waiting for encrypted keyshare value to be available..."
for i in {1..10}; do
    ENCRYPTED_KEYSHARE_VALUE=$(fairyringd q wasm contract-state smart $CONTRACT_ADDRESS '{"get_all_identity": {}}' | \
        yq eval -o=json -N | jq -r '.data.records | last | .private_keyshares["'"$ACC_ADDR_W2"'"] | if . then .[0].encrypted_keyshare_value else empty end')

    if [[ -n "$ENCRYPTED_KEYSHARE_VALUE" && "$ENCRYPTED_KEYSHARE_VALUE" != "null" ]]; then
        echo "✅ Retrieved ENCRYPTED_KEYSHARE_VALUE: $ENCRYPTED_KEYSHARE_VALUE"
        break
    fi

    echo "🔄 Waiting for keyshare availability... ($i/10)"
    sleep 3
done

# If still empty after retries, exit
if [[ -z "$ENCRYPTED_KEYSHARE_VALUE" || "$ENCRYPTED_KEYSHARE_VALUE" == "null" ]]; then
    echo "❌ Error: Could not retrieve encrypted keyshare value. Exiting..."
    exit 1
fi

# Step 8: Wallet-2 aggregates keyshares to obtain the final decryption key
echo "Aggregating keyshares to obtain decryption key..."
DECRYPTION_KEY=$(fairyringd aggregate-keyshares "[ { \"encrypted_keyshare_value\": \"$ENCRYPTED_KEYSHARE_VALUE\", \"encrypted_keyshare_index\": 1 } ]" '""' $ACC_ADDR_W2 $PRIV_KEY_HEX_W2)

if [[ -z "$DECRYPTION_KEY" || "$DECRYPTION_KEY" == "null" ]]; then
    echo "❌ Error: Could not retrieve decryption key. Exiting..."
    exit 1
fi
echo "✅ Retrieved DECRYPTION_KEY: $DECRYPTION_KEY"

# Step 9: Wallet-2 decrypts the stored data and compares with original encrypted message
echo "Decrypting final transaction data..."
DECRYPTED_MESSAGE=$(fairyringd query pep decrypt-data $FAIRYRING_PUBKEY $DECRYPTION_KEY $ENCRYPTED_DATA -o json | jq -r '.decrypted_data')

echo "🔓 Decrypted Message: $DECRYPTED_MESSAGE"

# Compare decrypted message with original plaintext
if [[ "$DECRYPTED_MESSAGE" == "THE ONEPIECE IS REAL." ]]; then
    echo "✅ SUCCESS: The decrypted message matches the original plaintext!"
else
    echo "❌ ERROR: The decrypted message does NOT match!"
    exit 1
fi

# Step 10: Monitor block height and retrieve decrypted transactions
echo "⏳ Waiting for block height to reach target ($TARGET_HEIGHT)..."
CURRENT_HEIGHT=$(fairyringd query pep latest-height --output json | jq -r '.height')

while [[ $TARGET_HEIGHT -gt $CURRENT_HEIGHT ]]; do
  CURRENT_HEIGHT=$(fairyringd query pep latest-height --output json | jq -r '.height')
  sleep 2
done

# Fetch decrypted transactions
echo "📥 Fetching decrypted transactions..."
fairyringd list-decrypted-txs $TARGET_HEIGHT --output json | jq

echo "🎉 Script execution completed successfully!"