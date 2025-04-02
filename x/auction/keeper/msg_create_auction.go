package keeper

import (
	"context"
	"github.com/Fairblock/fairyring/x/auction/types"
	common "github.com/Fairblock/fairyring/x/common/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"strconv"
)

func (k msgServer) CreateAuction(goCtx context.Context, msg *types.MsgCreateAuction) (*types.MsgCreateAuctionResponse, error) {

	ctx := sdk.UnwrapSDKContext(goCtx)

	// params := k.pepKeeper.GetParams(ctx)

	height := uint64(ctx.BlockHeight())

	// if !params.IsSourceChain {
	if latestHeight, err := strconv.ParseUint(k.pepKeeper.GetLatestHeight(ctx), 10, 64); err == nil {
		height = latestHeight
	}
	// }

	if msg.ResolveAt < height+1 {
		return nil, types.ErrInvalidAuctionResolveBlockNumber
	}

	if err := sdk.ValidateDenom(msg.BidDenom); err != nil {
		return nil, types.ErrInvalidDenom
	}

	var pubKeyToUse string
	queuedKey, found := k.pepKeeper.GetQueuedPubkey(ctx)
	activeKey, foundActiveKey := k.pepKeeper.GetActivePubkey(ctx)
	if !found && !foundActiveKey {
		return nil, types.ErrActivePubKeyNotFound
	}

	if found && msg.ResolveAt > max(activeKey.Expiry, queuedKey.Expiry) {
		return nil, types.ErrInvalidTargetResolveBlockHeight
	}

	if foundActiveKey && activeKey.Expiry >= msg.ResolveAt {
		pubKeyToUse = activeKey.PublicKey
	} else if found && activeKey.Expiry < msg.ResolveAt && queuedKey.Expiry >= msg.ResolveAt {
		pubKeyToUse = queuedKey.PublicKey
	}

	if len(pubKeyToUse) == 0 {
		return nil, types.ErrActivePubKeyNotFound
	}

	auction := common.AuctionDetail{
		Creator:   msg.Creator,
		Pubkey:    pubKeyToUse,
		ResolveAt: msg.ResolveAt,
		IsTimed:   msg.IsTimed,
		BidDenom:  msg.BidDenom,
	}

	newAuction := k.AppendAuctionDetail(ctx, auction)

	if msg.IsTimed {
		if err := k.pepKeeper.SetAuctionQueueEntry(ctx, newAuction); err != nil {
			return nil, err
		}
	}

	return &types.MsgCreateAuctionResponse{
		Identity:  newAuction.Identity,
		AuctionId: newAuction.AuctionId,
		Pubkey:    newAuction.Pubkey,
		ResolveAt: msg.ResolveAt,
	}, nil
}
