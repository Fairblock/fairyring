package ante

import (
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// KeyshareLane is an interface that defines the methods required to interact with the keyshare lane.
type KeyShareLane interface {
	GetKeyShareInfo(tx sdk.Tx) (*peptypes.AggregatedKeyShare, error)
}

// // AuctionKeeper is an interface that defines the methods required to interact with the
// // auction keeper.
// type AuctionKeeper interface {
// 	ValidateBidInfo(ctx sdk.Context, highestBid sdk.Coin, bidInfo *types.BidInfo) error
// }
