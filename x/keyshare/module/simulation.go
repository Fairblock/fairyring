package keyshare

import (
	"math/rand"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"

	"github.com/Fairblock/fairyring/testutil/sample"
	keysharesimulation "github.com/Fairblock/fairyring/x/keyshare/simulation"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

// avoid unused import issue
var (
	_ = keysharesimulation.FindAccount
	_ = rand.Rand{}
	_ = sample.AccAddress
	_ = sdk.AccAddress{}
	_ = simulation.MsgEntryKind
)

const (
opWeightMsgSubmitEncryptedKeyshare = "op_weight_msg_submit_encrypted_keyshare"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitEncryptedKeyshare int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module.
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	keyshareGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		PortId: types.PortID,
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&keyshareGenesis)
}

// RegisterStoreDecoder registers a decoder.
func (am AppModule) RegisterStoreDecoder(_ simtypes.StoreDecoderRegistry) {}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgSubmitEncryptedKeyshare int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitEncryptedKeyshare, &weightMsgSubmitEncryptedKeyshare, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitEncryptedKeyshare = defaultWeightMsgSubmitEncryptedKeyshare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitEncryptedKeyshare,
		keysharesimulation.SimulateMsgSubmitEncryptedKeyshare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (am AppModule) ProposalMsgs(simState module.SimulationState) []simtypes.WeightedProposalMsg {
	return []simtypes.WeightedProposalMsg{
		simulation.NewWeightedProposalMsg(
	opWeightMsgSubmitEncryptedKeyshare,
	defaultWeightMsgSubmitEncryptedKeyshare,
	func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
		keysharesimulation.SimulateMsgSubmitEncryptedKeyshare(am.accountKeeper, am.bankKeeper, am.keeper)
		return nil
	},
),
// this line is used by starport scaffolding # simapp/module/OpMsg
	}
}
