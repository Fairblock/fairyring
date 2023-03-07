#!/bin/bash

ignite relayer configure -a \
  --source-rpc "http://0.0.0.0:26657" \
  --source-faucet "http://0.0.0.0:4500" \
  --source-port "fairblock" \
  --source-version "fairblock-1" \
  --source-gasprice "0.0000025stake" \
  --source-prefix "cosmos" \
  --source-gaslimit 300000 \
  --target-rpc "http://0.0.0.0:26659" \
  --target-faucet "http://0.0.0.0:4501" \
  --target-port "fairblock" \
  --target-version "fairblock-1" \
  --target-gasprice "0.0000025stake" \
  --target-prefix "auction" \
  --target-gaslimit 300000

ignite relayer connect