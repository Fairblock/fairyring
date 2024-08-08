#!/bin/bash

FROM_PR_NO=164
TO_PR_NO=177

git checkout main

for i in $(seq $FROM_PR_NO $TO_PR_NO); do
  echo "fetching PR #$i"
  git fetch origin pull/$i/head:$i-pr-gentx
  git checkout $i-pr-gentx
  echo "copying PR #$i gentxs & peers info"
  cp -a networks/testnets/fairyring-testnet-2/gentxs/. ~/.fairyring/config/gentx/
  cp -a networks/testnets/fairyring-testnet-2/peers/. ~/.fairyring/config/peers/
done

echo "Done"