package simulation

import (
	"github.com/cosmos/cosmos-sdk/types/module/testutil"
	"math/rand"
	"strconv"

	"fairyring/x/keyshare/keeper"
	"fairyring/x/keyshare/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func SimulateMsgCreateAuthorizedAddress(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		simAccount, _ := simtypes.RandomAcc(r, accs)

		i := r.Int()
		msg := &types.MsgCreateAuthorizedAddress{
			Creator: simAccount.Address.String(),
			Target:  strconv.Itoa(i),
		}

		_, found := k.GetAuthorizedAddress(ctx, msg.Target)
		if found {
			return simtypes.NoOpMsg(types.ModuleName, msg.Type(), "AuthorizedAddress already exist"), nil, nil
		}

		txCtx := simulation.OperationInput{
			R:               r,
			App:             app,
			TxGen:           testutil.MakeTestTxConfig(),
			Cdc:             nil,
			Msg:             msg,
			MsgType:         msg.Type(),
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

func SimulateMsgUpdateAuthorizedAddress(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		var (
			simAccount           = simtypes.Account{}
			authorizedAddress    = types.AuthorizedAddress{}
			msg                  = &types.MsgUpdateAuthorizedAddress{}
			allAuthorizedAddress = k.GetAllAuthorizedAddress(ctx)
			found                = false
		)
		for _, obj := range allAuthorizedAddress {
			simAccount, found = FindAccount(accs, obj.Target)
			if found {
				authorizedAddress = obj
				break
			}
		}
		if !found {
			return simtypes.NoOpMsg(types.ModuleName, msg.Type(), "authorizedAddress creator not found"), nil, nil
		}
		msg.Creator = simAccount.Address.String()

		msg.Target = authorizedAddress.Target

		txCtx := simulation.OperationInput{
			R:               r,
			App:             app,
			TxGen:           testutil.MakeTestTxConfig(),
			Cdc:             nil,
			Msg:             msg,
			MsgType:         msg.Type(),
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

func SimulateMsgDeleteAuthorizedAddress(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		var (
			simAccount           = simtypes.Account{}
			authorizedAddress    = types.AuthorizedAddress{}
			msg                  = &types.MsgUpdateAuthorizedAddress{}
			allAuthorizedAddress = k.GetAllAuthorizedAddress(ctx)
			found                = false
		)
		for _, obj := range allAuthorizedAddress {
			simAccount, found = FindAccount(accs, obj.Target)
			if found {
				authorizedAddress = obj
				break
			}
		}
		if !found {
			return simtypes.NoOpMsg(types.ModuleName, msg.Type(), "authorizedAddress creator not found"), nil, nil
		}
		msg.Creator = simAccount.Address.String()

		msg.Target = authorizedAddress.Target

		txCtx := simulation.OperationInput{
			R:               r,
			App:             app,
			TxGen:           testutil.MakeTestTxConfig(),
			Cdc:             nil,
			Msg:             msg,
			MsgType:         msg.Type(),
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
