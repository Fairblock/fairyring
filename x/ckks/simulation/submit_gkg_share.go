package simulation

import (
	"math/rand"

	"github.com/Fairblock/fairyring/x/ckks/keeper"
	"github.com/Fairblock/fairyring/x/ckks/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
)

func SimulateMsgSubmitGkgShare(
	ak types.AccountKeeper,
	bk types.BankKeeper,
	k keeper.Keeper,
) simtypes.Operation {
	return func(r *rand.Rand, app *baseapp.BaseApp, ctx sdk.Context, accs []simtypes.Account, chainID string,
	) (simtypes.OperationMsg, []simtypes.FutureOperation, error) {
		simAccount, _ := simtypes.RandomAcc(r, accs)
		msg := &types.MsgSubmitGkgShare{
			Creator: simAccount.Address.String(),
		}

		// TODO: Handling the SubmitGkgShare simulation

		return simtypes.NoOpMsg(types.ModuleName, sdk.MsgTypeURL(msg), "SubmitGkgShare simulation not implemented"), nil, nil
	}
}
