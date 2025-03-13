
# 🍄 Sealed Bid Auctions

_**All code within this tutorial is purely educational, and it is up to the readers discretion to build their applications following industry standards, practices, and applicable regulations.**_

Fairblock offers various MPC schemes for fun and novel dynamic confidential computation. For more background on what Fairblock is and how it works, check out our [docs](https://docs.fairblock.network/docs/welcome/Vision). This tutorial will guide you through using a simple Bash script to create and interact with a timed sealed-bid auctions in Fairblock. 

Sealed-Bid Auctions are a powerful tool, and with Fairblock, they are carried out in a decentralized, highly-performant manner new to the blockchain space. Many application types can be built using this feature including, but not limited to:

1. Dynamic Pricing for Intent Mechanimsms: a decentralized protocol in which no single actor controls price discovery. Bids are encrypted and revealed only after the bidding period ends, preventing frontrunning, shilling, and censorship. All used within multiple facets of an intents protocol.
2. Fixed-Rate Lending with Leaderless-Auctions: Innovating lending markets using sealed-bid auctions.

For more detailed examples and use cases, check out our [Ecosystem Page](https://docs.fairblock.network/docs/ecosystem/) in our docs!

> **The auction functionality covered here revolves around working with the `x/auction` module. If you are looking to make more advanced auction-based cApps, check out the [`fairblock-design-patterns` repo](https://github.com/hashedtitan/fairblock-design-patterns) that will soon be updated with boiler plate smart contract ideas.** 

There are two types of auctions currently available with FairyRing. More to come soon.
   - Timed auctions (covered in this tutorial): the auction is automatically resolved at a defined block height
   - General auctions (to be covered in the future): the auction is closed by an auctioneer sending a final transaction. This can be a EOA or a smart contract.

By the end, you'll understand how to do the following revolving around auctions:

1. Create an auction
2. Query the state (auction status, balance of bidders and auctioneer, etc.), and register bidders
3. Encrypt bids (locally), and place sealed bids

A quick walk through of this demo is show in the video below. Feel free to watch it and follow along with the rest of this page. Please note that this page goes through the high level details of the demo, check out the [code within the bash script and repo for more details](./test_sealed_bid_auction.sh).

<div style={{ textAlign: "center" }}>
  <iframe
    width="100%"
    height="315"
    src="https://www.youtube.com/embed/t6yobak8PMo?si=SxOTXca34GQgESRJ"
    title="FairyRing Demo - Auctions"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerPolicy="strict-origin-when-cross-origin"
    allowFullScreen
    style={{ maxWidth: "560px" }}
  ></iframe>
</div>

## Demo Quick Start

To run this demo, simply download this repo, and switch to this specific feature branch, `auction`.

```bash
git clone https://github.com/Fairblock/fairyring.git
gco auction
```

Now, simply run:

```bash
make devnet-up
./test_sealed_bid_auction.sh
```

That's it! You've ran the sealed bid auction using FairyRing's native functionality with the `x/auction` module. Of course, there's more to it. Let's go over some main points.

## Demo Details

Upon running the `./test_sealed_bid_auction.sh` script, you will see within your terminal:

1. The creation of an auction.
2. The attempted registration of a bidder with insufficient funds required.
3. The successful registration of a bidder with sufficient funds, and the display of the updated state with bidder's details.
4. Quick tests and resultant echo statements for testing the deregistration of the bidder.
5. Testing timed auction with no bid, where it resolves automatically.
6. Testing time aduction with single bid: showcasing the encrypted.transaction, and its decrypted details after the auction ends, and the resultant winner.
7. Testing non-registered bidder trying to bid and being rejected.
8. Testing bid with invalid bid amount (where bid placed is greater than bidder's actual balance) and it failing.

When working with the `x/auction` module there are some important facts to keep in mind:

1. To bid on an auction, a user must be a registered bidder. This is to prevent spamming of the chain with faulty bids.
2. To register as a bidder, an user needs to make a transaction and stake some tokens. If the bidder submits a faulty bid, the staked amount is forfeit and the user is removed from the list of registered bidders.
   - A faulty bid comprises of a bid amount that the user cannot pay.
3. A bidder, once registered, can bid all they want in any auction.
4. A bidder can choose to manually de-register themselves, at which point their staked tokens are returned to them and they are removed from the registered bidders list.
5. In case of timed auctions, when the target height is reached, the sealed bids are automatically decrypted and the winner is the person with the highest bid.
   - The bid amount is then automatically deducted from the bidder's account and credited to the auctioneer.
6. In case of manual auctions, the same thing happens, but has to be triggered by a tx from the auctioneer to mark the end of the bidding period.

We've outlined what is being shown within the terminal as a result of going through a typical transaction flow with auctions using the `x/auction` module. The details cover time-based auctions. Off-the-shelf, FairyRing with the `x/auction` module enable auctions to be held where an auctioneer ends them, versus a specific block height being passed. These auctions, referred to as auctioneer-led auctions, do not require smart contracts, and have an additional command or two to carry out. This will be appended onto this tutorial at a later date.

Now that demo details have been touched upon, it is important to go over the actual functions and messages being used within the `test_sealed_bid_auction.sh` script though. This will provide you with a more comprehensive understanding of the core interactive commands to use when building your own cApp with sealed bid auctions, without smart contracts.

## Interactions with `x/auction` Module

Here are some details for the steps used when working with this module to create and interact with auctions. They are kept generic to help illustrate the input vars and more. It is recommended to go to the actual files to further explore on your own.

### Creating an Auction

#### Create a Simple Auction

```bash
out=$(fairyringd tx auction create-auction $target_height true ufairy --from wallet2 --keyring-backend test --yes --chain-id $CHAIN_ID --node $CHAIN_NODE -o json)
```

- `$target_height`: Target block height when the auction resolves
- `true`: Enables sealed bids
- `ufairy`: Auction currency
- `$CHAIN_ID`: The chain ID of the Fairyring network
- `$CHAIN_NODE`: The node endpoint to connect to the network

<details>
  <summary>Related Transaction Processing</summary>

  - **Module:** `x/auction`
  - **Transaction Message Processed:** `MsgCreateAuction` (defined in `x/auction/types/tx.pb.go`)
  - **Processed in MsgServer:** `CreateAuction` function in `keeper/msg_create_auction.go`
  - **What happens:**
    - The transaction is submitted with auction details.
    - `MsgServer` processes `MsgCreateAuction` and calls `CreateAuction`.
    - The auction details are validated and stored on-chain.
    - An event is emitted to notify the auction was created.

</details>

#### Query Auction List

```bash
fairyringd q auction list-auction --chain-id $CHAIN_ID --node $CHAIN_NODE -o json | jq
```

<details>
  <summary>Related Query Processing</summary>
  
  - **Query Sent:** `QueryAuctionAllRequest`
  - **Processed in QueryServer:** `AuctionAll` function in `keeper/query_auction.go`
  - **What happens:**
    - Fetches all stored auctions.
    - Formats the response as a query output.

</details>

---

### Registering as a Bidder

```bash
fairyringd tx auction register-bidder --from wallet1 --chain-id $CHAIN_ID --node $CHAIN_NODE --keyring-backend test --yes -o json
```

<details>
  <summary>Related Transaction Processing</summary>

  - **Module:** `x/auction`
  - **Transaction Message Processed:** `MsgRegisterBidder` (defined in `x/auction/types/tx.pb.go`)
  - **Processed in MsgServer:** `RegisterBidder` function in `keeper/msg_register_bidder.go`
  - **What happens:**
    - Adds the bidder to the auction system.
    - Ensures the bidder meets registration criteria.
    - Emits an event to confirm registration.

</details>

Verify Registration:

```bash
fairyringd q auction registered-bidders --chain-id $CHAIN_ID --node $CHAIN_NODE -o json | jq
```

---

### Placing a Sealed Bid

#### Encrypt Your Bid

```bash
bid=$(fairyringd encrypt-bid $target_height $pubkey_1 "1ufairy")
```

- `$target_height`: The target block height of the auction
- `$pubkey_1`: The public key of the bidder
- `1ufairy`: The bid amount in `ufairy` tokens

#### Submit the Sealed Bid

```bash
fairyringd tx auction place-bid $auction_id $bid --from wallet1 --keyring-backend test --gas 300000 --chain-id $CHAIN_ID --node $CHAIN_NODE -o json
```

- `$auction_id`: The ID of the auction being bid on
- `$bid`: The encrypted bid

<details>
  <summary>Related Transaction Processing</summary>

  - **Module:** `x/auction`
  - **Transaction Message Processed:** `MsgPlaceBid` (defined in `x/auction/types/tx.pb.go`)
  - **Processed in MsgServer:** `PlaceBid` function in `keeper/msg_place_bid.go`
  - **What happens:**
    - Validates bid amount and auction status.
    - Stores the encrypted bid securely.
    - Emits an event to track the bid placement.

</details>

---

### Resolving the Auction & Checking Results

#### Wait for Auction to Resolve

The auction will resolve at block height **$target_height**.

#### Query Auction Status

```bash
fairyringd q auction list-auction --chain-id $CHAIN_ID --node $CHAIN_NODE -o json | jq
```

<details>
  <summary>Related Query Processing</summary>

  - **Query Sent:** `QueryAuctionAllRequest`
  - **Processed in QueryServer:** `AuctionAll` function in `keeper/query_auction.go`
  - **What happens:**
    - Retrieves the auction's current status.
    - Checks if the auction has concluded.
    - Provides the list of winning bids (if applicable).
    
</details>
