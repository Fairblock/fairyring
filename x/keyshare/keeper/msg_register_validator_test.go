package keeper_test

import (
	"testing"

	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
)

func TestRegisterValidatorMsgServer(t *testing.T) {
	k, ctx, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)
	creator := sample.AccAddress()
	//newValAddr := keeper2.RandomAccountAddress(t)

	k.SetValidatorSet(wctx, types.ValidatorSet{
		Index:     creator,
		Validator: creator,
		ConsAddr:  "",
		IsActive:  true,
	})

	for _, tc := range []struct {
		desc    string
		request *types.MsgRegisterValidator
		err     error
	}{
		{
			desc: "ValidatorAlreadyRegistered",
			request: &types.MsgRegisterValidator{
				Creator: creator,
			},
			err: types.ErrValidatorAlreadyRegistered,
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {

			_, err := srv.RegisterValidator(wctx, tc.request)

			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}
