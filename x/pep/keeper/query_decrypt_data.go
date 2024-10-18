package keeper

import (
	"bytes"
	"context"
	"encoding/hex"
	"errors"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"github.com/drand/kyber/pairing"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) DecryptData(goCtx context.Context, req *types.QueryDecryptDataRequest) (*types.QueryDecryptDataResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	if req.Pubkey == "" {
		pk, found := k.GetActivePubkey(ctx)
		if !found {
			return &types.QueryDecryptDataResponse{}, errors.New("pubkey not found")
		}
		req.Pubkey = pk.PublicKey
	}

	suite := bls.NewBLS12381Suite()
	publicKeyPoint, err := k.GetPubkeyPoint(req.Pubkey, suite)
	if err != nil {
		return &types.QueryDecryptDataResponse{}, err
	}

	skPoint, err := k.GetSKPoint(req.DecryptionKey, suite)
	if err != nil {
		return &types.QueryDecryptDataResponse{}, err
	}

	dataBytes, err := hex.DecodeString(req.EncryptedData)
	if err != nil {
		return &types.QueryDecryptDataResponse{}, err
	}

	var decryptedData bytes.Buffer
	var dataBuffer bytes.Buffer
	_, err = dataBuffer.Write(dataBytes)
	if err != nil {
		return &types.QueryDecryptDataResponse{}, err
	}

	err = enc.Decrypt(publicKeyPoint, skPoint, &decryptedData, &dataBuffer)
	if err != nil {
		return &types.QueryDecryptDataResponse{}, err
	}

	decodedDataString := decryptedData.String()
	return &types.QueryDecryptDataResponse{
		DecryptedData: decodedDataString,
	}, nil
}

func (k Keeper) GetSKPoint(
	key string,
	suite pairing.Suite) (kyber.Point, error) {
	keyByte, err := hex.DecodeString(key)
	if err != nil {
		k.Logger().Error("Error decoding aggregated key")
		k.Logger().Error(err.Error())
		return nil, err
	}

	skPoint := suite.G2().Point()
	err = skPoint.UnmarshalBinary(keyByte)
	if err != nil {
		k.Logger().Error("Error unmarshalling aggregated key")
		k.Logger().Error(err.Error())
		return nil, err
	}

	k.Logger().Info("Unmarshal decryption key successfully")
	k.Logger().Info(skPoint.String())

	return skPoint, nil
}

func (k Keeper) GetPubkeyPoint(
	pubkey string,
	suite pairing.Suite,
) (kyber.Point, error) {

	publicKeyByte, err := hex.DecodeString(pubkey)
	if err != nil {
		k.Logger().Error("Error decoding active public key")
		k.Logger().Error(err.Error())
		return nil, err
	}

	publicKeyPoint := suite.G1().Point()
	err = publicKeyPoint.UnmarshalBinary(publicKeyByte)
	if err != nil {
		k.Logger().Error("Error unmarshalling public key")
		k.Logger().Error(err.Error())
		return nil, err
	}

	k.Logger().Info("Unmarshal public key successfully")
	k.Logger().Info(publicKeyPoint.String())

	return publicKeyPoint, nil
}
