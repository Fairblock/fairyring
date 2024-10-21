package keeper_test

import (
	keepertest "github.com/Fairblock/fairyring/testutil/keeper"
	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestDeRegisterValidatorMsgServer(t *testing.T) {
	k, ctx, _ := keepertest.KeyshareKeeper(t)
	srv := keeper.NewMsgServerImpl(k)
	wctx := sdk.UnwrapSDKContext(ctx)
	creator := sample.AccAddress()

	k.SetValidatorSet(wctx, types.ValidatorSet{
		Index:     creator,
		Validator: creator,
		ConsAddr:  "",
		IsActive:  true,
	})

	for _, tc := range []struct {
		desc    string
		request *types.MsgDeRegisterValidator
		err     error
	}{
		{
			desc: "ValidatorNotRegistered",
			request: &types.MsgDeRegisterValidator{
				Creator: sample.AccAddress(),
			},
			err: types.ErrValidatorNotRegistered,
		},
		{
			desc: "SuccessfullyDeRegisterValidator",
			request: &types.MsgDeRegisterValidator{
				Creator: creator,
			},
		},
	} {
		t.Run(tc.desc, func(t *testing.T) {

			_, err := srv.DeRegisterValidator(wctx, tc.request)

			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}
		})
	}
}
