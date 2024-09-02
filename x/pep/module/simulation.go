package pep

import (
	"math/rand"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"

	"github.com/Fairblock/fairyring/testutil/sample"
	pepsimulation "github.com/Fairblock/fairyring/x/pep/simulation"
	"github.com/Fairblock/fairyring/x/pep/types"
)

// avoid unused import issue
var (
	_ = pepsimulation.FindAccount
	_ = rand.Rand{}
	_ = sample.AccAddress
	_ = sdk.AccAddress{}
	_ = simulation.MsgEntryKind
)

const (
	opWeightMsgRequestPrivateIdentity = "op_weight_msg_request_private_identity"
	// TODO: Determine the simulation weight value
	defaultWeightMsgRequestPrivateIdentity int = 100

	opWeightMsgGetPrivateKeyshares = "op_weight_msg_get_private_keyshares"
	// TODO: Determine the simulation weight value
	defaultWeightMsgGetPrivateKeyshares int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module.
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	pepGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		PortId: types.PortID,
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&pepGenesis)
}

// RegisterStoreDecoder registers a decoder.
func (am AppModule) RegisterStoreDecoder(_ simtypes.StoreDecoderRegistry) {}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgRequestPrivateIdentity int
	simState.AppParams.GetOrGenerate(opWeightMsgRequestPrivateIdentity, &weightMsgRequestPrivateIdentity, nil,
		func(_ *rand.Rand) {
			weightMsgRequestPrivateIdentity = defaultWeightMsgRequestPrivateIdentity
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgRequestPrivateIdentity,
		pepsimulation.SimulateMsgRequestPrivateIdentity(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgGetPrivateKeyshares int
	simState.AppParams.GetOrGenerate(opWeightMsgGetPrivateKeyshares, &weightMsgGetPrivateKeyshares, nil,
		func(_ *rand.Rand) {
			weightMsgGetPrivateKeyshares = defaultWeightMsgGetPrivateKeyshares
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgGetPrivateKeyshares,
		pepsimulation.SimulateMsgGetPrivateKeyshares(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (am AppModule) ProposalMsgs(simState module.SimulationState) []simtypes.WeightedProposalMsg {
	return []simtypes.WeightedProposalMsg{
		simulation.NewWeightedProposalMsg(
			opWeightMsgRequestPrivateIdentity,
			defaultWeightMsgRequestPrivateIdentity,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				pepsimulation.SimulateMsgRequestPrivateIdentity(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgGetPrivateKeyshares,
			defaultWeightMsgGetPrivateKeyshares,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				pepsimulation.SimulateMsgGetPrivateKeyshares(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		// this line is used by starport scaffolding # simapp/module/OpMsg
	}
}
