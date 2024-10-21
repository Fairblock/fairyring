package keeper_test

import (
	"strconv"
	"testing"

	"github.com/Fairblock/fairyring/testutil/random"
	"github.com/Fairblock/fairyring/testutil/shares"
	types2 "github.com/Fairblock/fairyring/x/pep/types"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func SetupTestGeneralKeyshare(t *testing.T, ctx sdk.Context, k keeper.Keeper, numberOfValidator uint32, pubkeyNumberOfValidator uint64) (*random.GenerateResult, string) {
	out, err := random.GeneratePubKeyAndShares(numberOfValidator)
	require.NoError(t, err)

	creator := out.GeneratedShare[0].ValidatorAddress

	k.SetValidatorSet(ctx, types.ValidatorSet{
		Index:     creator,
		Validator: creator,
		ConsAddr:  "",
		IsActive:  true,
	})

	k.SetActivePubkey(ctx, types.ActivePubkey{
		PublicKey:          out.MasterPublicKey,
		Creator:            creator,
		Expiry:             123456,
		NumberOfValidators: pubkeyNumberOfValidator,
		EncryptedKeyshares: out.KeyshareEncryptedKeyshares,
	})

	k.SetActiveCommitments(ctx, types.Commitments{
		Commitments: out.Commitments,
	})

	return out, creator
}

func TestSubmitGeneralKeyshareAggregated(t *testing.T) {
	k, ctx, pk, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyshare(t, wctx, k, 1, 1)

	for i := 0; i < 5; i++ {

		idVal := random.RandHex(32)

		k.SetDecryptionKeyRequest(wctx, types.DecryptionKeyRequest{
			Identity:      idVal,
			Pubkey:        out.MasterPublicKey,
			IbcInfo:       nil,
			Counterparty:  nil,
			DecryptionKey: "",
			ProposalId:    "",
			RequestId:     idVal,
			Sent:          false,
		})
		pk.SetEntry(wctx, types2.IdentityExecutionEntry{
			Creator:       creator,
			RequestId:     idVal,
			Identity:      idVal,
			Pubkey:        out.MasterPublicKey,
			TxList:        nil,
			DecryptionKey: "",
		})

		derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, idVal)
		require.NoError(t, err)

		expected := &types.MsgSubmitGeneralKeyshare{
			Creator:       creator,
			IdType:        keeper.PrivateGovIdentity,
			IdValue:       idVal,
			KeyshareIndex: 1,
			Keyshare:      derived,
		}

		_, err = srv.SubmitGeneralKeyshare(wctx, expected)
		require.NoError(t, err)

		rst, found := k.GetGeneralKeyshare(wctx,
			expected.Creator,
			expected.IdType,
			expected.IdValue,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Validator)

		entry, found := k.GetDecryptionKeyRequest(ctx, idVal)
		require.True(t, found)
		require.NotEmpty(t, entry.DecryptionKey)
	}
}

func TestSubmitGeneralKeyshareNotAggregated(t *testing.T) {
	k, ctx, pk, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyshare(t, wctx, k, 10, 10)

	for i := 0; i < 5; i++ {

		idVal := random.RandHex(32)

		k.SetDecryptionKeyRequest(wctx, types.DecryptionKeyRequest{
			Identity:      idVal,
			Pubkey:        out.MasterPublicKey,
			IbcInfo:       nil,
			Counterparty:  nil,
			DecryptionKey: "",
			ProposalId:    "",
			RequestId:     idVal,
			Sent:          false,
		})
		pk.SetEntry(wctx, types2.IdentityExecutionEntry{
			Creator:       creator,
			RequestId:     idVal,
			Identity:      idVal,
			Pubkey:        out.MasterPublicKey,
			TxList:        nil,
			DecryptionKey: "",
		})

		derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, idVal)
		require.NoError(t, err)

		expected := &types.MsgSubmitGeneralKeyshare{
			Creator:       creator,
			IdType:        keeper.PrivateGovIdentity,
			IdValue:       idVal,
			KeyshareIndex: 1,
			Keyshare:      derived,
		}

		_, err = srv.SubmitGeneralKeyshare(wctx, expected)
		require.NoError(t, err)

		rst, found := k.GetGeneralKeyshare(wctx,
			expected.Creator,
			expected.IdType,
			expected.IdValue,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Validator)

		entry, found := k.GetDecryptionKeyRequest(ctx, idVal)
		require.True(t, found)
		require.Empty(t, entry.DecryptionKey)
	}
}

func TestGeneralKeyshareMsgServerFailCases(t *testing.T) {
	k, ctx, pk, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyshare(t, wctx, k, 1, 1)
	onlyIdVal := random.RandHex(32)

	pk.SetEntry(wctx, types2.IdentityExecutionEntry{
		Creator:       creator,
		RequestId:     onlyIdVal,
		Identity:      onlyIdVal,
		Pubkey:        out.MasterPublicKey,
		TxList:        nil,
		DecryptionKey: "",
	})

	for _, tc := range []struct {
		desc    string
		request *types.MsgSubmitGeneralKeyshare
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgSubmitGeneralKeyshare{Creator: "B"},
			err:     types.ErrAddrIsNotValidatorOrAuthorized,
		},
		{
			desc: "NotSupportedIDType",
			request: &types.MsgSubmitGeneralKeyshare{
				Creator: creator,
				IdType:  "not_exists",
			},
			err: types.ErrUnsupportedIDType,
		},
		{
			desc: "KeyshareRequestNotFound",
			request: &types.MsgSubmitGeneralKeyshare{
				Creator: creator,
				IdType:  keeper.PrivateGovIdentity,
				IdValue: random.RandHex(32),
			},
			err: types.ErrKeyshareRequestNotFound,
		},
		{
			desc: "InvalidKeyshareIndex",
			request: &types.MsgSubmitGeneralKeyshare{
				Creator:       creator,
				IdType:        keeper.PrivateGovIdentity,
				IdValue:       onlyIdVal,
				KeyshareIndex: 10,
			},
			err: types.ErrInvalidKeyshareIndex,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			_, err := srv.SubmitGeneralKeyshare(wctx, tc.request)

			require.ErrorIs(t, err, tc.err)

			if tc.desc == "KeyshareRequestNotFound" {
				k.SetDecryptionKeyRequest(wctx, types.DecryptionKeyRequest{
					Identity:      onlyIdVal,
					Pubkey:        out.MasterPublicKey,
					IbcInfo:       nil,
					Counterparty:  nil,
					DecryptionKey: "",
					ProposalId:    "",
					RequestId:     onlyIdVal,
					Sent:          false,
				})
			}
		})
	}
}
