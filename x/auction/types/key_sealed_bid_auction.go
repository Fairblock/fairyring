package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	AuctionDetailListKeyPrefix = "AuctionDetailList/value/"
	BidderKeyPrefix            = "RegisteredBidder/Value"
)

const (
	InvalidAuctionBidEventType = "auction-invalid-bid"
	InvalidAuctionIdentity     = "identity"
	InvalidAuctionBidder       = "bidder"
)

const (
	AuctionResolvedEventType  = "auction-resolved"
	AuctionResolvedIdentity   = "identity"
	AuctionResolvedWinner     = "winner-address"
	AuctionResolvedWinningBid = "winning-bid"
)

const (
	AuctionFailedEventType = "auction-failed"
	AuctionFailedIdentity  = "identity"
	AuctionFailedReason    = "reason"
)

func AuctionDetailsFromHeightKey(
	targetHeight uint64,
) []byte {
	var key []byte

	targetHeightBytes := make([]byte, 8)
	binary.BigEndian.PutUint64(targetHeightBytes, targetHeight)
	key = append(key, targetHeightBytes...)
	key = append(key, []byte("/")...)

	return key
}

func RegisteredBidderKey(
	target string,
) []byte {
	var key []byte

	targetBytes := []byte(target)
	key = append(key, targetBytes...)
	key = append(key, []byte("/")...)

	return key
}
