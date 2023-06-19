#!/bin/bash

ChainID="fairytest-1"
KeyringArg="--keyring-backend"
Keyring="test"
KerRingCommand="$KeyringArg $Keyring"
GenesisFile=~/.fairyring/config/genesis.json
GentxDir=~/.fairyring/config/gentx

# Define ANSI color codes.
RED='\033[0;31m'
GREEN='\033[0;32m'
NO_COLOR='\033[0m' # No Color

# Define expected denom and amount.
expected_denom="ufairy"
expected_amount="100000000000"

# Check if a directory was provided.
if [ -z "$1" ]
then
    echo "Please provide a directory path."
    exit 1
fi

# Check if fairyringd is installed.
if ! command -v fairyringd &> /dev/null
then
    echo "The fairyringd binary is not installed. Please install it and try again."
    exit 1
fi

# Check if jq is installed.
if ! command -v jq &> /dev/null
then
    echo "The jq tool is not installed. Please install it and try again."
    exit 1
fi

# Get the directory from the command-line argument.
directory="$1"

# Function to handle termination.
function handle_termination {
    if [ ! -z "$pid" ]
    then
        kill $pid 2>/dev/null
    fi
    exit
}

# Handle SIGINT (Ctrl+C) signal.
trap handle_termination SIGINT

# Iterate over each file in the directory.
for file in $directory/gentx-*.json
do
    # Skip files that match 'gentx-example*.json'.
    if [[ $(basename $file) == gentx-example*.json ]]
    then
        continue
    fi

    # Check if the required fields exist and their values are not empty.
    if jq -e .body.messages[0].delegator_address $file >/dev/null 2>&1 &&
       jq -e .body.messages[0].validator_address $file >/dev/null 2>&1 &&
       [ "$(jq -r .body.messages[0].value.denom $file)" = "$expected_denom" ] &&
       [ "$(jq -r .body.messages[0].value.amount $file)" = "$expected_amount" ]
    then
        # Use jq to parse the JSON and retrieve the delegator_address.
        delegator_address=$(jq -r '.body.messages[0].delegator_address' "$file")

        # Print the delegator_address.
        echo "Delegator address from $(basename $file): $delegator_address"

        # Attempt to start chain with gentx
        rm -rf ~/.fairyring
        fairyringd init node1 --chain-id $ChainID > fairyringd_output.txt 2>&1
        fairyringd keys add alice $KerRingCommand > fairyringd_output.txt 2>&1
        
        sleep 1

        sed -i 's/stake/ufairy/g' $GenesisFile

        fairyringd add-genesis-account alice 50000000000000ufairy $KerRingCommand
        fairyringd add-genesis-account $delegator_address 500000000000ufairy

        fairyringd gentx alice 5000000000000ufairy --commission-max-change-rate 0.01 --commission-max-rate 0.2 --commission-rate 0.05 --min-self-delegation 1 --moniker val1 --chain-id fairytest-1 $KerRingCommand > fairyringd_output.txt 2>&1
        
        sleep 1

        cp "$file" "$GentxDir"
        
        fairyringd collect-gentxs > fairyringd_output.txt 2>&1

        # Start fairyringd in the background.
        echo "attempting to start chain"
        fairyringd start > fairyringd_output.txt 2>&1 &

        # Get the process ID of the most recent background command.
        pid=$!

        # Wait for 15 seconds.
        sleep 15

        # Check if the process is still running.
        if ps -p $pid > /dev/null
        then
            echo -e "${GREEN}$(basename $file): The gentx file is correct${NO_COLOR}"

            # Terminate the process.
            kill $pid
        else
            echo -e "${RED}$(basename $file): The gentx file is incorrect${NO_COLOR}"
        fi
    else
        echo -e "${RED}$(basename $file): The gentx file is incorrect (missing fields or invalid values)${NO_COLOR}"
    fi
done
