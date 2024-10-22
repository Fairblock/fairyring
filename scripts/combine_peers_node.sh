#!/bin/bash

# Define the target directory
directory="networks/testnets/fairyring-testnet-3/peers/"

# Check if the target is not a directory
if [ ! -d "$directory" ]; then
  exit 1
fi

OUT_ARR=()
# Loop through files in the target directory
for file in "$directory"/*; do
  if [ -f "$file" ]; then
    NODE_ID=$(cat "$file" | jq -r '.node_id')
    PUBLIC_IP=$(cat "$file" | jq -r '.public_ip')
    PORT=$(cat "$file" | jq -r '.port')
    OUT_ARR+=("$NODE_ID@$PUBLIC_IP:$PORT")
  fi
done

echo "Got Total: ${#OUT_ARR[@]} peers info"
echo ""
printf -v JOINED_ARR '%s,' "${OUT_ARR[@]}"
echo "${JOINED_ARR%,}"