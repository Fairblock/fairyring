package keeper

import (
	"context"
	"crypto/sha256"
	"encoding/hex"

	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) VerifiableRandomness(
	goCtx context.Context,
	req *types.QueryVerifiableRandomnessRequest,
) (*types.QueryVerifiableRandomnessResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	decryptionKeys := k.GetAllDecryptionKeys(ctx)

	if len(decryptionKeys) == 0 {
		return nil, status.Error(codes.Internal, "decryption key not found")
	}

	decryptionKey := decryptionKeys[len(decryptionKeys)-1]
	decryptionKeyBytes, err := hex.DecodeString(decryptionKey.Data)
	if err != nil {
		return nil, status.Error(codes.Internal, "unable to decode decryption key")
	}

	hash := sha256.New()
	hash.Write(decryptionKeyBytes)
	hashedDecryptionKey := hash.Sum(nil)

	return &types.QueryVerifiableRandomnessResponse{
		Randomness: hex.EncodeToString(hashedDecryptionKey),
		Round:      decryptionKey.Height,
	}, nil
}
