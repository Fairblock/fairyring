package fairyring

import (
	"math"
	"math/rand"

	"fairyring/testutil/sample"
	fairyringsimulation "fairyring/x/fairyring/simulation"
	"fairyring/x/fairyring/types"

	"github.com/cosmos/cosmos-sdk/baseapp"
	simappparams "github.com/cosmos/cosmos-sdk/simapp/params"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
)

// avoid unused import issue
var (
	_ = sample.AccAddress
	_ = fairyringsimulation.FindAccount
	_ = simappparams.StakePerAccount
	_ = simulation.MsgEntryKind
	_ = baseapp.Paramspace
)

const (
	opWeightMsgRegisterValidator = "op_weight_msg_register_validator"
	// TODO: Determine the simulation weight value
	defaultWeightMsgRegisterValidator int = 100

	opWeightMsgSendKeyshare = "op_weight_msg_send_keyshare"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSendKeyshare int = 100

	opWeightMsgCreateLatestPubKey = "op_weight_msg_latest_pub_key"
	// TODO: Determine the simulation weight value
	defaultWeightMsgCreateLatestPubKey int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	fairyringGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		ActivePubKey: types.ActivePubKey{
			"public_key",
			sample.AccAddress(),
			math.MaxUint64,
		},
		QueuedPubKey: types.QueuedPubKey{
			"public_key",
			sample.AccAddress(),
			math.MaxUint64,
		},
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&fairyringGenesis)
}

// ProposalContents doesn't return any content functions for governance proposals
func (AppModule) ProposalContents(_ module.SimulationState) []simtypes.WeightedProposalContent {
	return nil
}

// RandomizedParams creates randomized  param changes for the simulator
func (am AppModule) RandomizedParams(_ *rand.Rand) []simtypes.ParamChange {

	return []simtypes.ParamChange{}
}

// RegisterStoreDecoder registers a decoder
func (am AppModule) RegisterStoreDecoder(_ sdk.StoreDecoderRegistry) {}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgRegisterValidator int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgRegisterValidator, &weightMsgRegisterValidator, nil,
		func(_ *rand.Rand) {
			weightMsgRegisterValidator = defaultWeightMsgRegisterValidator
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgRegisterValidator,
		fairyringsimulation.SimulateMsgRegisterValidator(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSendKeyshare int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgSendKeyshare, &weightMsgSendKeyshare, nil,
		func(_ *rand.Rand) {
			weightMsgSendKeyshare = defaultWeightMsgSendKeyshare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSendKeyshare,
		fairyringsimulation.SimulateMsgSendKeyshare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgCreateLatestPubKey int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgCreateLatestPubKey, &weightMsgCreateLatestPubKey, nil,
		func(_ *rand.Rand) {
			weightMsgCreateLatestPubKey = defaultWeightMsgCreateLatestPubKey
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgCreateLatestPubKey,
		fairyringsimulation.SimulateMsgCreateLatestPubKey(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}
