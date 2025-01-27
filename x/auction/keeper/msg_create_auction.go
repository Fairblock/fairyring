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

	params := k.pepKeeper.GetParams(ctx)

	height := uint64(ctx.BlockHeight())

	if !params.IsSourceChain {
		strHeight := k.pepKeeper.GetLatestHeight(ctx)
		latestHeight, err := strconv.ParseUint(strHeight, 10, 64)

		if err == nil {
			height = latestHeight
		}
	}

	if msg.ResolveAt <= height {
		return nil, types.ErrInvalidAuctionResolveBlockNumber
	}

	var maxHeight uint64
	var pubKeyToUse string
	queuedKey, found := k.pepKeeper.GetQueuedPubkey(ctx)
	if !found || (queuedKey.Expiry == 0 && len(queuedKey.PublicKey) == 0) {
		activeKey, foundActiveKey := k.pepKeeper.GetActivePubkey(ctx)
		if !foundActiveKey {
			return nil, types.ErrActivePubKeyNotFound
		}
		maxHeight = activeKey.Expiry
		pubKeyToUse = activeKey.PublicKey
	} else {
		maxHeight = queuedKey.Expiry
		pubKeyToUse = queuedKey.PublicKey
	}

	if msg.ResolveAt > maxHeight {
		return nil, types.ErrInvalidTargetResolveBlockHeight
	}

	auction := common.AuctionDetail{
		Creator:   msg.Creator,
		Pubkey:    pubKeyToUse,
		ResolveAt: msg.ResolveAt,
		IsTimed:   msg.IsTimed,
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
