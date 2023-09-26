# `x/pricefeed`

> Pre-requisite Readings
> - cosmos-sdk
>   - [building-modules](https://docs.cosmos.network/main/building-modules/intro)
>   - [ibc-app-packets](https://tutorials.cosmos.network/hands-on-exercise/5-ibc-adv/7-ibc-app-packets.html)
> - BandChain
>   - [data-source](https://docs.bandchain.org/custom-script/data-source/introduction.html)
>   - [oracle-script](https://docs.bandchain.org/custom-script/oracle-script/introduction.html)


### Abstract

This document specifies the pricefeed module that implement for the Cosmos SDK applications.

The pricefeed module obtains price data from BandChain through IBC and stores the most recent prices on your Cosmos SDK applications.

An example of the usage of this module is provided on the [OracleConsumerChain](https://github.com/bandprotocol/oracle-consumer).

### Contents

* [Workflow](#workflow)
* [Params](#params)
* [Proposal](#proposal)
* [Query Service](#query-service)
* [Begin Block](#begin-block)
* [On Receive Packet](#on-receive-packet)
* [Client](#client)
    * [CLI](#cli)
    * [Query](#query)
* [gRPC](#grpc)

### Workflow

The `SymbolRequest` data is utilized by the pricefeed module to initiate the request logic during the begin block. The aim of creating an open proposal is to configure the pricefeed module to request price data from BandChain at a `block_interval` specified in the proposal.

1. submit the `UpdateSymbolRequestProposal` with `SymbolRequests`. If the proposal is approved, the data will be saved in the state of your Cosmos SDK app.
    > proto/consumer/pricefeed/pricefeed.proto
    ```protobuf
    message SymbolRequest {
      string symbol = 1;
      uint64 oracle_script_id = 2;
      uint64 block_interval = 3;
    }
    ```
3. At the start of each block, query all `SymbolRequest` and determine which symbols need to be requested from BandChain.
4. Once the pricefeed module sends a data request to BandChain via ibc, it will receive an OnRecvPacket event from BandChain, which will then be extracted and stored in the state of your Cosmos SDK application.

### Params

The pricefeed module stores its params in state, it can be updated with governance or the address with authority. The information contained in these parameters is utilized to request data from BandChain.

> proto/consumer/pricefeed/params.proto
```protobuf
message Params {
  option (gogoproto.goproto_stringer) = false;

  uint64 ask_count = 1;
  uint64 min_count = 2;
  uint64 min_ds_count = 3;
  uint64 prepare_gas_base = 4;
  uint64 prepare_gas_each = 5;
  uint64 execute_gas_base = 6;
  uint64 execute_gas_each = 7;
  string source_channel = 8;
  repeated cosmos.base.v1beta1.Coin fee_limit = 9 [
    (gogoproto.nullable) = false,
    (gogoproto.castrepeated) = "github.com/cosmos/cosmos-sdk/types.Coins"
  ];
}
```

### Proposal

The pricefeed module includes the `UpdateSymbolRequestProposal` for updating symbols that request prices from BandChain on a block-by-block basis based on `block_interval` configuration by submit the proposal on your Cosmos SDK application.

> proto/consumer/pricefeed/pricefeed.proto
```protobuf
message UpdateSymbolRequestProposal {
  option (gogoproto.goproto_getters) = false;

  string title = 1;
  string description = 2;

  repeated SymbolRequest symbol_requests = 3 [ (gogoproto.nullable) = false ];
}

message SymbolRequest {
  string symbol = 1;
  uint64 oracle_script_id = 2;
  uint64 block_interval = 3;
}
```

The example of submit and vote the proposal is demonstrated in the CLI section.

### Query Service

#### Query/Params

Params can query with the `QueryParamsRequest` that will query all the parameters of this module.

> proto/consumer/pricefeed/query.proto
```protobuf
// QueryParamsRequest is request type for the Query/Params RPC method.
message QueryParamsRequest {}

// QueryParamsResponse is response type for the Query/Params RPC method.
message QueryParamsResponse {
  // params holds all the parameters of this module.
  Params params = 1 [ (gogoproto.nullable) = false ];
}
```

#### Query/SymbolRequest

A `SymbolRequest` can be queried using the `QuerySymbolRequest`. This data, which is stored in the Cosmos SDK app state, can be set by opening an `UpdateSymbolRequestProposal` proposal.

> proto/pricefeed/query.proto
```protobuf
message QuerySymbolRequests {}

message QuerySymbolRequestsResponse {
  repeated SymbolRequest symbol_requests = 1;
}
```

#### Query/SymbolRequests

A `SymbolRequest` is similar to the previous description, but `QuerySymbolRequests` will retrieve every `SymbolRequest` that is stored in the Cosmos SDK app.

> proto/pricefeed/query.proto
```protobuf
message QuerySymbolRequests {}

message QuerySymbolRequestsResponse {
  repeated SymbolRequest symbol_requests = 1;
}
```

#### Query/Price

A `Price` can be obtained by querying with `QueryPrice`. This information, which is saved in the Cosmos SDK app state, represents the latest price consumed by the app from BandChain through IBC.

> proto/pricefeed/query.proto
```protobuf
message QueryPrice { string symbol = 1; }

message QueryPriceResponse {
  Price price = 1;
}
```

> proto/pricefeed/pricefeed.proto
```protobuf
message Price {
  string symbol = 1;
  uint64 price = 2;
  int64 resolve_time = 3;
}
```

### Begin Block

The pricefeed Module implements a process at the begin block to get all `SymbolRequest` and determine which symbols need to request their prices from BandChain. This is determined based on the `BlockInterval` specified in each `SymbolRequest`.

### On Receive Packet

Once the pricefeed Module has requested price data from BandChain, BandChain will send a response packet back. The results will be extracted and used to update the latest price for each symbol in the state of your Cosmos SDK app.

### Client

#### CLI

A user can query and interact with the pricefeed module using the CLI.

##### Query

The query commands allow users to query pricefeed state.

```
oracle-consumerd query pricefeed --help
```

##### params

The `params` command allows users to query parameters of the module.

```
oracle-consumerd query pricefeed params
```

##### symbol-request

The `symbol-request` command allows users to query symbol request by symbol.

```
oracle-consumerd query pricefeed symbol-request [symbol]
```

Example:

```
oracle-consumerd query pricefeed symbol-request BTC
```

Example Output:

```
symbol_request:
  block_interval: "40"
  oracle_script_id: "396"
  symbol: BTC
```

##### symbol-requests 

The `symbol-requests` command enables users to retrieve information about all symbol requests that are save in this Cosmos SDK application.

```
oracle-consumerd query pricefeed symbol-requests
```

##### price

The `price` command allows users to query price data by symbol.

```
oracle-consumerd query pricefeed price [symbol]
```

Example:

```
oracle-consumerd query pricefeed price BTC
```

Example Output:

```
price:
  price: "22702955000000"
  resolve_time: "1675935544"
  symbol: BTC
```

#### Proposal

The `tx gov submit-legacy-proposal` commands allow users to submit proposal on your cosmos sdk app.

```
oracle-consumerd tx gov submit-legacy-proposal -h
```

##### source channel params change

In order to acquire BandChain data through the IBC, it is imperative to update the `source-channel` parameter by submitting a proposal for the change that reflects your own source channel.

```
oracle-consumerd tx gov submit-legacy-proposal param-change [proposal-file]
```

Example:

1. create json file
    > proposal.json
    ```json
    {
      "title": "Param change for SourceChannel",
      "description": "Proposal for change SourceChannel param in pricefeed module",
      "changes": [
        {
          "subspace": "pricefeed",
          "key": "SourceChannel",
          "value": "channel-0"
        }
      ],
      "deposit": "10000000stake"
    }
    ```
2. submit the proposal
    ```
    oracle-consumerd tx gov submit-legacy-proposal param-change proposal.json --from alice
    ```

##### update symbol request

The `update-symbol-request` proposal allows users to update symbol request to specify which symbols they desire to obtain price data from BandChain.

```
oracle-consumerd tx gov submit-legacy-proposal update-symbol-request [proposal-file]
```

Example:

1. create proposal.json file
    > Note: You can delete symbol request by set `"block_interval": "0"` on this proposal.
    
    ```json
    {
        "title": "Update Symbol requests",
        "description": "Update symbol that request price from BandChain",
        "symbol_requests": [
            {
                "symbol": "BTC",
                "oracle_script_id": "396",
                "block_interval": "40"
            },
            {
                "symbol": "ETH",
                "oracle_script_id": "396",
                "block_interval": "40"
            }
        ],
        "deposit": "10000000stake"
    }
    ```

2. submit the proposal
    ```
    oracle-consumerd tx gov submit-legacy-proposal update-symbol-request proposal.json --from alice
    ```


### gRPC

A user can query the bank module using gRPC endpoints.

#### Params

The `Params` endpoint allows users to query parameters of the module.

```
consumer.pricefeed.Query/Params
```

Example
```
grpcurl -plaintext \
    0.0.0.0:9090 \
    consumer.pricefeed.Query/Params
```

Example Output:
```
{
  "params": {
    "ask_count": "16",
    "min_count": "10",
    "min_ds_count": "3",
    "prepare_gas_base": "100000",
    "prepare_gas_each": "1",
    "execute_gas_base": "750000",
    "execute_gas_each": "1",
    "source_channel": "channel-0",
    "fee_limit": [
      {
        "denom": "uband",
        "amount": "1000000"
      }
    ]
  }
}
```

#### SymbolRequest

The `SymbolRequest` endpoint allows users to query symbol request by symbol.

```
consumer.pricefeed.Query/SymbolRequest
```

Example:
```
grpcurl -plaintext \
    -d '{"symbol":"BTC"}' \
    localhost:9090 \
    consumer.pricefeed.Query/SymbolRequest
```

Example Output:
```
{
  "symbol_request": {
    "symbol": "BTC",
    "oracle_script_id": "396",
    "block_interval": "40"
  }
}
```

#### SymbolRequests

The `SymbolRequests` endpoint enables users to retrieve information about all symbol requests that are saved in this Cosmos SDK application.

```
consumer.pricefeed.Query/SymbolRequests
```

Example:
```
grpcurl -plaintext \
    localhost:9090 \
    consumer.pricefeed.Query/SymbolRequests
```

Example Output:
```
{
  "symbol_requests": [
    {
      "symbol": "ETH",
      "oracle_script_id": "396",
      "block_interval": "40"
    },
    {
      "symbol": "ETH",
      "oracle_script_id": "396",
      "block_interval": "40"
    }
  ]
}
```

#### Price

The `Price` endpoint allows users to query price data by symbol.

```
consumer.pricefeed.Query/Price
```

Example:
```
grpcurl -plaintext \
    -d '{"symbol":"BTC"}' \
    localhost:9090 \
    consumer.pricefeed.Query/Price
```

Example Output:
```
{
  "price": {
    "symbol": "BTC",
    "price": "22722848586291",
    "resolve_time": "1675938238"
  }
}
```
