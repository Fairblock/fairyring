package keeper

import (
	"errors"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k Keeper) ProcessPepRequestQueue(ctx sdk.Context) error {
	activePubKey, found := k.GetActivePubKey(ctx)
	if !found {
		return errors.New("active public key not found")
	}

	reqs := k.pepKeeper.GetAllGenEncTxReqQueueEntry(ctx)
	for _, req := range reqs {
		reqCountString := k.GetRequestCount(ctx)
		reqCount, _ := strconv.ParseUint(reqCountString, 10, 64)
		reqCount = reqCount + 1

		id := types.IdentityFromRequestCount(reqCount)

		var keyshareRequest types.KeyShareRequest

		keyshareRequest.Identity = id
		keyshareRequest.Pubkey = activePubKey.PublicKey

		keyshareRequest.AggrKeyshare = ""
		keyshareRequest.RequestId = req.RequestId

		k.SetKeyShareRequest(ctx, keyshareRequest)
		k.SetRequestCount(ctx, reqCount)

		req.Identity = id
		req.Pubkey = activePubKey.PublicKey

		k.pepKeeper.SetEntry(ctx, req)
		k.pepKeeper.RemoveReqQueueEntry(ctx, req.RequestId)
	}
	return nil
}

func (k Keeper) ProcessPepSignalQueue(ctx sdk.Context) error {
	reqs := k.pepKeeper.GetAllGenEncTxSignalQueueEntry(ctx)
	for _, req := range reqs {
		if req.Identity != "" && req.Pubkey != "" {
			keyshareReq, found := k.GetKeyShareRequest(ctx, req.Identity)
			if !found {
				k.pepKeeper.RemoveSignalQueueEntry(ctx, req.RequestId)
				continue
			}

			if keyshareReq.AggrKeyshare == "" {
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.StartSendGeneralKeyShareEventType,
						sdk.NewAttribute(types.StartSendGeneralKeyShareEventIdentity, req.Identity),
					),
				)
			}
		}
		k.pepKeeper.RemoveSignalQueueEntry(ctx, req.RequestId)
	}
	return nil
}
