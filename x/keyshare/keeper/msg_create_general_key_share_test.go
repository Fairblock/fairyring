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

func SetupTestGeneralKeyShare(t *testing.T, ctx sdk.Context, k keeper.Keeper, numberOfValidator uint32, pubkeyNumberOfValidator uint64) (*random.GenerateResult, string) {
	out, err := random.GeneratePubKeyAndShares(numberOfValidator)
	require.NoError(t, err)

	creator := out.GeneratedShare[0].ValidatorAddress

	k.SetValidatorSet(ctx, types.ValidatorSet{
		Index:     creator,
		Validator: creator,
		ConsAddr:  "",
		IsActive:  true,
	})

	k.SetActivePubKey(ctx, types.ActivePubKey{
		PublicKey:          out.MasterPublicKey,
		Creator:            creator,
		Expiry:             123456,
		NumberOfValidators: pubkeyNumberOfValidator,
		EncryptedKeyShares: out.KeyShareEncryptedKeyShares,
	})

	k.SetActiveCommitments(ctx, types.Commitments{
		Commitments: out.Commitments,
	})

	return out, creator
}

func TestGeneralKeyShareMsgServerCreateAggregated(t *testing.T) {

	k, ctx, pk, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyShare(t, wctx, k, 1, 1)

	for i := 0; i < 5; i++ {

		idVal := random.RandHex(32)

		k.SetKeyShareRequest(wctx, types.KeyShareRequest{
			Identity:     idVal,
			Pubkey:       out.MasterPublicKey,
			IbcInfo:      nil,
			Counterparty: nil,
			AggrKeyshare: "",
			ProposalId:   "",
			RequestId:    idVal,
			Sent:         false,
		})
		pk.SetEntry(wctx, types2.IdentityExecutionQueue{
			Creator:      creator,
			RequestId:    idVal,
			Identity:     idVal,
			Pubkey:       out.MasterPublicKey,
			TxList:       nil,
			AggrKeyshare: "",
		})

		derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, idVal)
		require.NoError(t, err)

		expected := &types.MsgCreateGeneralKeyShare{Creator: creator,
			IdType:        keeper.PrivateGovIdentity,
			IdValue:       idVal,
			KeyShareIndex: 1,
			KeyShare:      derived,
		}

		_, err = srv.CreateGeneralKeyShare(wctx, expected)
		require.NoError(t, err)

		rst, found := k.GetGeneralKeyShare(wctx,
			expected.Creator,
			expected.IdType,
			expected.IdValue,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Validator)

		entry, found := k.GetKeyShareRequest(ctx, idVal)
		require.True(t, found)
		require.NotEmpty(t, entry.AggrKeyshare)
	}
}

func TestGeneralKeyShareMsgServerCreateNotAggregated(t *testing.T) {

	k, ctx, pk, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyShare(t, wctx, k, 10, 10)

	for i := 0; i < 5; i++ {

		idVal := random.RandHex(32)

		k.SetKeyShareRequest(wctx, types.KeyShareRequest{
			Identity:     idVal,
			Pubkey:       out.MasterPublicKey,
			IbcInfo:      nil,
			Counterparty: nil,
			AggrKeyshare: "",
			ProposalId:   "",
			RequestId:    idVal,
			Sent:         false,
		})
		pk.SetEntry(wctx, types2.IdentityExecutionQueue{
			Creator:      creator,
			RequestId:    idVal,
			Identity:     idVal,
			Pubkey:       out.MasterPublicKey,
			TxList:       nil,
			AggrKeyshare: "",
		})

		derived, err := shares.DeriveShare(out.GeneratedShare[0].Share, 1, idVal)
		require.NoError(t, err)

		expected := &types.MsgCreateGeneralKeyShare{Creator: creator,
			IdType:        keeper.PrivateGovIdentity,
			IdValue:       idVal,
			KeyShareIndex: 1,
			KeyShare:      derived,
		}

		_, err = srv.CreateGeneralKeyShare(wctx, expected)
		require.NoError(t, err)

		rst, found := k.GetGeneralKeyShare(wctx,
			expected.Creator,
			expected.IdType,
			expected.IdValue,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Validator)

		entry, found := k.GetKeyShareRequest(ctx, idVal)
		require.True(t, found)
		require.Empty(t, entry.AggrKeyshare)
	}
}

func TestGeneralKeyShareMsgServerFailCases(t *testing.T) {
	k, ctx, pk, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)

	out, creator := SetupTestGeneralKeyShare(t, wctx, k, 1, 1)
	onlyIdVal := random.RandHex(32)

	pk.SetEntry(wctx, types2.IdentityExecutionQueue{
		Creator:      creator,
		RequestId:    onlyIdVal,
		Identity:     onlyIdVal,
		Pubkey:       out.MasterPublicKey,
		TxList:       nil,
		AggrKeyshare: "",
	})

	for _, tc := range []struct {
		desc    string
		request *types.MsgCreateGeneralKeyShare
		err     error
	}{
		{
			desc:    "Unauthorized",
			request: &types.MsgCreateGeneralKeyShare{Creator: "B"},
			err:     types.ErrAddrIsNotValidatorOrAuthorized,
		},
		{
			desc: "NotSupportedIDType",
			request: &types.MsgCreateGeneralKeyShare{
				Creator: creator,
				IdType:  "not_exists",
			},
			err: types.ErrUnsupportedIDType,
		},
		{
			desc: "KeyShareRequestNotFound",
			request: &types.MsgCreateGeneralKeyShare{
				Creator: creator,
				IdType:  keeper.PrivateGovIdentity,
				IdValue: random.RandHex(32),
			},
			err: types.ErrKeyShareRequestNotFound,
		},
		{
			desc: "InvalidKeyShareIndex",
			request: &types.MsgCreateGeneralKeyShare{
				Creator:       creator,
				IdType:        keeper.PrivateGovIdentity,
				IdValue:       onlyIdVal,
				KeyShareIndex: 10,
			},
			err: types.ErrInvalidKeyShareIndex,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {

			_, err := srv.CreateGeneralKeyShare(wctx, tc.request)

			require.ErrorIs(t, err, tc.err)

			if tc.desc == "KeyShareRequestNotFound" {
				k.SetKeyShareRequest(wctx, types.KeyShareRequest{
					Identity:     onlyIdVal,
					Pubkey:       out.MasterPublicKey,
					IbcInfo:      nil,
					Counterparty: nil,
					AggrKeyshare: "",
					ProposalId:   "",
					RequestId:    onlyIdVal,
					Sent:         false,
				})
			}
		})
	}
}
