package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"

	keepertest "fairyring/testutil/keeper"
	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestGeneralKeyShareMsgServerCreate(t *testing.T) {
	k, ctx := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(*k)
	wctx := sdk.WrapSDKContext(ctx)
	creator := "A"
	for i := 0; i < 5; i++ {
		expected := &types.MsgCreateGeneralKeyShare{Creator: creator,
			IdType:  strconv.Itoa(i),
			IdValue: strconv.Itoa(i),
		}
		_, err := srv.CreateGeneralKeyShare(wctx, expected)
		require.NoError(t, err)
		rst, found := k.GetGeneralKeyShare(ctx,
			expected.Creator,
			expected.IdType,
			expected.IdValue,
		)
		require.True(t, found)
		require.Equal(t, expected.Creator, rst.Validator)
	}
}
