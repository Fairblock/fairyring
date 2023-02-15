package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/stretchr/testify/require"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestAggregatedKeyShareMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.FairblockKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreateAggregatedKeyShare{Creator: creator,
			Height: uint64(i),
		}
		_, err := srv.CreateAggregatedKeyShare(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetAggregatedKeyShare(ctx,
			expected.Height,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Creator)
	}
}

func TestAggregatedKeyShareMsgServerUpdate(t *testing.T) {
	creator := "A"

	for _, tc := range []struct {
		desc    string
		request *types.MsgUpdateAggregatedKeyShare
		err     error
	}{
		{
			desc: "Completed",
			request: &types.MsgUpdateAggregatedKeyShare{Creator: creator,
				Height: 0,
			},
		},
		{
			desc: "Unauthorized",
			request: &types.MsgUpdateAggregatedKeyShare{Creator: "B",
				Height: 0,
			},
			err: sdkerrors.ErrUnauthorized,
		},
		{
			desc: "KeyNotFound",
			request: &types.MsgUpdateAggregatedKeyShare{Creator: creator,
				Height: 100000,
			},
			err: sdkerrors.ErrKeyNotFound,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			k, ctx := keepertest.FairblockKeeper(t)
			srv := keeper.NewMsgServerImpl(*k)
			wctx := sdk.WrapSDKContext(ctx)
			expected := &types.MsgCreateAggregatedKeyShare{Creator: creator,
				Height: 0,
			}
			_, err := srv.CreateAggregatedKeyShare(wctx, expected)
			require.NoError(t, err)

			_, err = srv.UpdateAggregatedKeyShare(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				rst, found := k.GetAggregatedKeyShare(ctx,
					expected.Height,
				)
				require.True(t, found)
				require.Equal(t, expected.Creator, rst.Creator)
			}
		})
	}
}

func TestAggregatedKeyShareMsgServerDelete(t *testing.T) {
	creator := "A"

	for _, tc := range []struct {
		desc    string
		request *types.MsgDeleteAggregatedKeyShare
		err     error
	}{
		{
			desc: "Completed",
			request: &types.MsgDeleteAggregatedKeyShare{Creator: creator,
				Height: 0,
			},
		},
		{
			desc: "Unauthorized",
			request: &types.MsgDeleteAggregatedKeyShare{Creator: "B",
				Height: 0,
			},
			err: sdkerrors.ErrUnauthorized,
		},
		{
			desc: "KeyNotFound",
			request: &types.MsgDeleteAggregatedKeyShare{Creator: creator,
				Height: 100000,
			},
			err: sdkerrors.ErrKeyNotFound,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			k, ctx := keepertest.FairblockKeeper(t)
			srv := keeper.NewMsgServerImpl(*k)
			wctx := sdk.WrapSDKContext(ctx)

			_, err := srv.CreateAggregatedKeyShare(wctx, &types.MsgCreateAggregatedKeyShare{Creator: creator,
				Height: 0,
			})
			require.NoError(t, err)
			_, err = srv.DeleteAggregatedKeyShare(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				_, found := k.GetAggregatedKeyShare(ctx,
					tc.request.Height,
				)
				require.False(t, found)
			}
		})
	}
}
