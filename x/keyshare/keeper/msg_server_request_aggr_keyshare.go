package keeper

import (
	"context"
	"errors"
	"fairyring/x/keyshare/types"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/sirupsen/logrus"
)

func (k msgServer) RequestAggrKeyshare(goCtx context.Context, msg *types.MsgRequestAggrKeyshare) (*types.MsgRequestAggrKeyshareResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	logrus.Info("------------------------------------------------------------**** ", msg.ReqId);
	var rsp types.MsgRequestAggrKeyshareResponse

	reqCountString := k.GetRequestCount(ctx)
	reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
	reqCount = reqCount + 1

	id := types.IdentityFromRequestCount(reqCount)
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return &rsp, errors.New("no active pubkey")
	}

	var keyshareRequest = types.KeyShareRequest{
		Identity:     id,
		Pubkey:       activePubKey.PublicKey,
		AggrKeyshare: "",
		ProposalId:   msg.ReqId,
	}

	k.SetKeyShareRequest(ctx, keyshareRequest)

	k.SetRequestCount(ctx, reqCount)

	rsp.Identity = id
	rsp.Pubkey = activePubKey.PublicKey

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
			sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, id),
		),
	)

	return &rsp, nil
}
