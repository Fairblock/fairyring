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

func TestRegisterValidatorMsgServer(t *testing.T) {
	k, ctx, _, _ := keepertest.KeyshareKeeper(t)
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
		{
			desc: "ValidatorNotStaking",
			request: &types.MsgRegisterValidator{
				Creator: sample.AccAddress(),
			},
			err: types.ErrAccountNotStaking,
		},
		//{
		//	desc: "SuccessfullyRegisteredAsValidator",
		//	request: &types.MsgRegisterValidator{
		//		Creator: newValAddr.String(),
		//	},
		//},
	} {
		t.Run(tc.desc, func(t *testing.T) {

			_, err := srv.RegisterValidator(wctx, tc.request)

			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
			}

			//if tc.desc == "ValidatorNotStaking" {
			//	valAddr := sdk.ValAddress(keepertest.PKs[0].Address().Bytes())
			//	val := stakingtestutil.NewValidator(t, valAddr, keepertest.PKs[0])
			//	val.AddTokensFromDel(math.NewIntFromUint64(k.MinimumBonded(wctx) * 2))
			//	val.Status = stakingtypes.Bonded
			//
			//	err = stakingKeeper.SetValidator(wctx, val)
			//	require.NoError(t, err)
			//	out, err := stakingKeeper.GetValidator(wctx, valAddr)
			//	require.NoError(t, err)
			//	require.Equal(t, out.OperatorAddress, valAddr)
			//}
		})
	}
}
