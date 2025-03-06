#!/bin/bash

find ./api -type f -name "*.go" -exec sed -i '' 's#cosmossdk\.io/api/fairyring/common#github\.com/Fairblock/fairyring/api/fairyring/common#g' {} +