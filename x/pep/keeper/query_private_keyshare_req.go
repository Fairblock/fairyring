package keeper

import (
	"context"
	"errors"

	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) ShowPrivateKeyshareReq(goCtx context.Context, req *types.QueryShowPrivateKeyshareReqRequest) (*types.QueryShowPrivateKeyshareReqResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetPrivateRequest(ctx, req.ReqId)
	if !found {
		return nil, errors.New("entry not found")
	}

	return &types.QueryShowPrivateKeyshareReqResponse{
		Creator:            val.Creator,
		ReqId:              val.ReqId,
		Pubkey:             val.Pubkey,
		EncryptedKeyshares: val.EncryptedKeyshares,
	}, nil
}
