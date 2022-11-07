package simulation

import (
	"math/rand"

	"fairyring/x/fairyring/keeper"
	"fairyring/x/fairyring/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
)

func SimulateMsgRegisterValidator(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		simAccount, _ := simtypes.RandomAcc(r, accs)
		msg := &types.MsgRegisterValidator{
			Creator: simAccount.Address.String(),
		}

		// TODO: Handling the RegisterValidator simulation

		return simtypes.NoOpMsg(types.ModuleName, msg.Type(), "RegisterValidator simulation not implemented"), nil, nil
	}
}
