package keeper_test

import (
	"bytes"
	"encoding/hex"
	"strconv"
	"testing"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/shares"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	bls "github.com/drand/kyber-bls12381"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/nullify"
	"github.com/Fairblock/fairyring/x/pep/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestDecryptDataQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.PepKeeper(t)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, err := random.GeneratePubKeyAndShares(1)
	require.NoError(t, err)

	creator := out.GeneratedShare[0].ValidatorAddress

	encryptID := "testingID"
	plainTextData := "TestingData"

	derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, encryptID)
	require.NoError(t, err)

	suite := bls.NewBLS12381Suite()
	publicKeyByte, err := hex.DecodeString(out.MasterPublicKey)
	require.NoError(t, err)

	publicKeyPoint := suite.G1().Point()
	err = publicKeyPoint.UnmarshalBinary(publicKeyByte)
	require.NoError(t, err)

	var destCipherData bytes.Buffer
	var plainTextBuffer bytes.Buffer
	_, err = plainTextBuffer.WriteString(plainTextData)
	require.NoError(t, err)

	err = enc.Encrypt(publicKeyPoint, []byte(encryptID), &destCipherData, &plainTextBuffer)
	require.NoError(t, err)

	for _, tc := range []struct {
		desc     string
		request  *types.QueryDecryptDataRequest
		response *types.QueryDecryptDataResponse
		err      error
		errMsg   string
	}{
		{
			desc: "WithPubkey",
			request: &types.QueryDecryptDataRequest{
				Pubkey:        out.MasterPublicKey,
				DecryptionKey: derived,
				EncryptedData: hex.EncodeToString(destCipherData.Bytes()),
			},
			response: &types.QueryDecryptDataResponse{
				DecryptedData: plainTextData,
			},
		},
		{
			desc: "WithoutPubkeyAndNoPubkeyOnChain",
			request: &types.QueryDecryptDataRequest{
				DecryptionKey: derived,
				EncryptedData: hex.EncodeToString(destCipherData.Bytes()),
			},
			errMsg: "pubkey not found",
		},
		{
			desc: "InvalidPubkey",
			request: &types.QueryDecryptDataRequest{
				Pubkey:        random.RandHex(8),
				DecryptionKey: derived,
				EncryptedData: hex.EncodeToString(destCipherData.Bytes()),
			},
			errMsg: "input string length must be equal to 48 bytes",
		},
		{
			desc: "InvalidDecryptionKey",
			request: &types.QueryDecryptDataRequest{
				Pubkey:        out.MasterPublicKey,
				DecryptionKey: random.RandHex(8),
				EncryptedData: hex.EncodeToString(destCipherData.Bytes()),
			},
			errMsg: "input string length must be equal to 96 bytes",
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.DecryptData(wctx, tc.request)
			if len(tc.errMsg) > 0 {
				require.Equal(t,
					nullify.Fill(err.Error()),
					nullify.Fill(tc.errMsg))
			} else if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}

			if tc.desc == "WithoutPubkeyAndNoPubkeyOnChain" {
				keeper.SetActivePubkey(wctx, commontypes.ActivePublicKey{
					PublicKey: out.MasterPublicKey,
					Creator:   creator,
					Expiry:    12346788888,
				})
			}
		})
	}
}
