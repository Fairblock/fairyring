package keeper

import (
	"context"
	"github.com/Fairblock/fairyring/x/auction/types"
	common "github.com/Fairblock/fairyring/x/common/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"
)

func (k msgServer) PlaceBid(goCtx context.Context, msg *types.MsgPlaceBid) (*types.MsgPlaceBidResponse, error) {

	ctx := sdk.UnwrapSDKContext(goCtx)

	auctionResolveHeight, id, err := types.DecodeAuctionIdentity(msg.AuctionIdentity)
	if err != nil {
		return nil, err
	}

	auction, found := k.GetAuctionDetail(ctx, auctionResolveHeight, id)
	if !found {
		return nil, types.ErrAuctionNotFound
	}

	b, found := k.GetRegisteredBidder(ctx, msg.Creator)
	if !found || !b.Active {
		return nil, types.ErrBidCreatorNotRegistered
	}

	params := k.pepKeeper.GetParams(ctx)

	height := uint64(ctx.BlockHeight())

	if !params.IsSourceChain {
		strHeight := k.pepKeeper.GetLatestHeight(ctx)
		latestHeight, err := strconv.ParseUint(strHeight, 10, 64)

		if err == nil {
			height = latestHeight
		}
	}

	// Do not allow to bids on resolved auction
	if height >= auction.ResolveAt || auction.IsResolved {
		return nil, types.ErrAuctionResolved
	}

	k.AppendBidToAuction(ctx, auctionResolveHeight, id, common.Bid{
		Bidder:    msg.Creator,
		SealedBid: msg.SealedBid,
	})

	newAuction, _ := k.GetAuctionDetail(ctx, auctionResolveHeight, id)

	if auction.IsTimed {
		if err := k.pepKeeper.SetAuctionQueueEntry(ctx, newAuction); err != nil {
			return nil, err
		}
	}

	return &types.MsgPlaceBidResponse{
		Creator:         msg.Creator,
		SealedBid:       msg.SealedBid,
		AuctionIdentity: msg.AuctionIdentity,
	}, nil
}
