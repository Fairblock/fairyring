#!/usr/bin/env bash

set -e pipefail

protoc_gen_gocosmos() {
  # if ! grep "github.com/gogo/protobuf => github.com/regen-network/protobuf" go.mod &>/dev/null ; then
  #   echo -e "\tPlease run this command from somewhere inside the gaia folder."
  #   return 1
  # fi

  go get github.com/regen-network/cosmos-proto/protoc-gen-gocosmos@latest 2>/dev/null
}

protoc_gen_gocosmos

cd proto
proto_dirs=$(find ./fairyring -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
for dir in $proto_dirs; do
  for file in $(find "${dir}" -maxdepth 1 -name '*.proto'); do
    if grep go_package $file &>/dev/null; then
      buf generate --template buf.gen.gogo.yaml $file
    fi
  done
done

cd ..

# move proto files to the right places
cp -r proto/github.com/Fairblock/fairyring/x/* x/
rm -rf proto/github.com
find proto/ -type f -name "*.pb.go" -exec rm -f {} +