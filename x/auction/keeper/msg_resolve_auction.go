package keeper

import (
	"context"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"

	"github.com/Fairblock/fairyring/x/auction/types"
)

func (k msgServer) ResolveAuction(goCtx context.Context, msg *types.MsgResolveAuction) (*types.MsgResolveAuctionResponse, error) {

	ctx := sdk.UnwrapSDKContext(goCtx)

	auctionResolveHeight, id, err := types.DecodeAuctionIdentity(msg.Identity)
	if err != nil {
		return nil, err
	}

	auction, found := k.GetAuctionDetail(ctx, auctionResolveHeight, id)
	if !found {
		return nil, types.ErrAuctionNotFound
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

	if auction.IsResolved {
		return nil, types.ErrAuctionResolved
	}

	if height < auction.ResolveAt {
		return nil, types.ErrEarlyResolveAuction
	}

	if err := k.pepKeeper.SetAuctionQueueEntry(ctx, auction); err != nil {
		return nil, err
	}

	return &types.MsgResolveAuctionResponse{}, nil
}
