package keeper_test

import (
	"github.com/Fairblock/fairyring/testutil/sample"
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestAuthorizedAddressMsgServerCreate(t *testing.T) {
	k, ctx, _, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)
	creator := sample.AccAddress()
	anotherAddr := sample.AccAddress()

	k.SetValidatorSet(ctx, types.ValidatorSet{
		Index:     creator,
		Validator: creator,
		ConsAddr:  "",
		IsActive:  true,
	})

	expected := &types.MsgCreateAuthorizedAddress{Creator: creator,
		Target: anotherAddr,
	}
	_, err := srv.CreateAuthorizedAddress(wctx, expected)
	require.NoError(t, err)
	rst, found := k.GetAuthorizedAddress(ctx,
		expected.Target,
	)
	require.True(t, found)
	require.Equal(t, expected.Creator, rst.AuthorizedBy)
}

func TestAuthorizedAddressMsgServerUpdate(t *testing.T) {
	creator := sample.AccAddress()
	target := sample.AccAddress()

	for _, tc := range []struct {
		desc    string
		request *types.MsgUpdateAuthorizedAddress
		err     error
	}{
		{
			desc: "Completed",
			request: &types.MsgUpdateAuthorizedAddress{Creator: creator,
				Target: target,
			},
		},
		{
			desc: "Unauthorized",
			request: &types.MsgUpdateAuthorizedAddress{Creator: "B",
				Target: target,
			},
			err: types.ErrNotAuthorizedAddrCreator,
		},
		{
			desc: "KeyNotFound",
			request: &types.MsgUpdateAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(100000),
			},
			err: types.ErrAuthorizedAddrNotFound,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			k, ctx, _, _ := keepertest.KeyshareKeeper(t)
			srv := keeper.NewMsgServerImpl(k)
			wctx := sdk.UnwrapSDKContext(ctx)

			k.SetValidatorSet(ctx, types.ValidatorSet{
				Index:     creator,
				Validator: creator,
				ConsAddr:  "",
				IsActive:  true,
			})

			expected := &types.MsgCreateAuthorizedAddress{Creator: creator,
				Target: target,
			}
			_, err := srv.CreateAuthorizedAddress(wctx, expected)
			require.NoError(t, err)

			_, err = srv.UpdateAuthorizedAddress(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				rst, found := k.GetAuthorizedAddress(ctx,
					expected.Target,
				)
				require.True(t, found)
				require.Equal(t, expected.Creator, rst.AuthorizedBy)
			}
		})
	}
}

func TestAuthorizedAddressMsgServerDelete(t *testing.T) {
	creator := sample.AccAddress()
	target := sample.AccAddress()

	for _, tc := range []struct {
		desc    string
		request *types.MsgDeleteAuthorizedAddress
		err     error
	}{
		{
			desc: "Completed",
			request: &types.MsgDeleteAuthorizedAddress{Creator: creator,
				Target: target,
			},
		},
		{
			desc: "RemovedByTarget",
			request: &types.MsgDeleteAuthorizedAddress{Creator: target,
				Target: target,
			},
		},
		{
			desc: "KeyNotFound",
			request: &types.MsgDeleteAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(100000),
			},
			err: types.ErrAuthorizedAddrNotFound,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			k, ctx, _, _ := keepertest.KeyshareKeeper(t)
			srv := keeper.NewMsgServerImpl(k)
			wctx := sdk.UnwrapSDKContext(ctx)

			k.SetValidatorSet(ctx, types.ValidatorSet{
				Index:     creator,
				Validator: creator,
				ConsAddr:  "",
				IsActive:  true,
			})

			_, err := srv.CreateAuthorizedAddress(wctx, &types.MsgCreateAuthorizedAddress{Creator: creator,
				Target: target,
			})
			require.NoError(t, err)
			_, err = srv.DeleteAuthorizedAddress(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				_, found := k.GetAuthorizedAddress(ctx,
					tc.request.Target,
				)
				require.False(t, found)
			}
		})
	}
}
