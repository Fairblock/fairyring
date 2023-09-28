package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/stretchr/testify/require"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestAuthorizedAddressMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreateAuthorizedAddress{Creator: creator,
			Target: strconv.Itoa(i),
		}
		_, err := srv.CreateAuthorizedAddress(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetAuthorizedAddress(ctx,
			expected.Target,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.AuthorizedBy)
	}
}

func TestAuthorizedAddressMsgServerUpdate(t *testing.T) {
	creator := "A"

	for _, tc := range []struct {
		desc    string
		request *types.MsgUpdateAuthorizedAddress
		err     error
	}{
		{
			desc: "Completed",
			request: &types.MsgUpdateAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(0),
			},
		},
		{
			desc: "Unauthorized",
			request: &types.MsgUpdateAuthorizedAddress{Creator: "B",
				Target: strconv.Itoa(0),
			},
			err: sdkerrors.ErrUnauthorized,
		},
		{
			desc: "KeyNotFound",
			request: &types.MsgUpdateAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(100000),
			},
			err: sdkerrors.ErrKeyNotFound,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			k, ctx := keepertest.KeyshareKeeper(t)
			srv := keeper.NewMsgServerImpl(*k)
			wctx := sdk.WrapSDKContext(ctx)
			expected := &types.MsgCreateAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(0),
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
	creator := "A"

	for _, tc := range []struct {
		desc    string
		request *types.MsgDeleteAuthorizedAddress
		err     error
	}{
		{
			desc: "Completed",
			request: &types.MsgDeleteAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(0),
			},
		},
		{
			desc: "Unauthorized",
			request: &types.MsgDeleteAuthorizedAddress{Creator: "B",
				Target: strconv.Itoa(0),
			},
			err: sdkerrors.ErrUnauthorized,
		},
		{
			desc: "KeyNotFound",
			request: &types.MsgDeleteAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(100000),
			},
			err: sdkerrors.ErrKeyNotFound,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {
			k, ctx := keepertest.KeyshareKeeper(t)
			srv := keeper.NewMsgServerImpl(*k)
			wctx := sdk.WrapSDKContext(ctx)

			_, err := srv.CreateAuthorizedAddress(wctx, &types.MsgCreateAuthorizedAddress{Creator: creator,
				Target: strconv.Itoa(0),
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
