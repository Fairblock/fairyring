package simulation

import (
	"github.com/cosmos/cosmos-sdk/types/module/testutil"
	"math/rand"
	"strconv"

	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func SimulateMsgCreateGeneralKeyShare(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		simAccount, _ := simtypes.RandomAcc(r, accs)

		i := r.Int()
		msg := &types.MsgCreateGeneralKeyShare{
			Creator: simAccount.Address.String(),
			IdType:  strconv.Itoa(i),
			IdValue: strconv.Itoa(i),
		}

		_, found := k.GetGeneralKeyShare(ctx, msg.Creator, msg.IdType, msg.IdValue)
		if found {
			return simtypes.NoOpMsg(types.ModuleName, msg.Type(), "GeneralKeyShare already exist"), nil, nil
		}

		txCtx := simulation.OperationInput{
			R:     r,
			App:   app,
			TxGen: testutil.MakeTestTxConfig(),
			Cdc:   nil,
			Msg:   msg,
			//MsgType:         msg.Type(),
			Context:         ctx,
			SimAccount:      simAccount,
			ModuleName:      types.ModuleName,
			CoinsSpentInMsg: sdk.NewCoins(),
			AccountKeeper:   ak,
			Bankkeeper:      bk,
		}
		return simulation.GenAndDeliverTxWithRandFees(txCtx)
	}
}
