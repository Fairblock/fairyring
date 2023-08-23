package keyshare

import (
	"math/rand"

	"fairyring/testutil/sample"
	keysharesimulation "fairyring/x/keyshare/simulation"
	"fairyring/x/keyshare/types"

	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
)

// avoid unused import issue
var (
	_ = sample.AccAddress
	_ = keysharesimulation.FindAccount
	_ = simulation.MsgEntryKind
	_ = baseapp.Paramspace
)

const (
	opWeightMsgRegisterValidator          = "op_weight_msg_register_validator"
	defaultWeightMsgRegisterValidator int = 100

	opWeightMsgSendKeyshare          = "op_weight_msg_send_keyshare"
	defaultWeightMsgSendKeyshare int = 100

	opWeightMsgCreateLatestPubKey          = "op_weight_msg_latest_pub_key"
	defaultWeightMsgCreateLatestPubKey int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	keyshareGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&keyshareGenesis)
}

// ProposalContents doesn't return any content functions for governance proposals
func (AppModule) ProposalContents(_ module.SimulationState) []simtypes.WeightedProposalContent {
	return nil
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
		keysharesimulation.SimulateMsgRegisterValidator(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSendKeyshare int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgSendKeyshare, &weightMsgSendKeyshare, nil,
		func(_ *rand.Rand) {
			weightMsgSendKeyshare = defaultWeightMsgSendKeyshare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSendKeyshare,
		keysharesimulation.SimulateMsgSendKeyshare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgCreateLatestPubKey int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgCreateLatestPubKey, &weightMsgCreateLatestPubKey, nil,
		func(_ *rand.Rand) {
			weightMsgCreateLatestPubKey = defaultWeightMsgCreateLatestPubKey
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgCreateLatestPubKey,
		keysharesimulation.SimulateMsgCreateLatestPubKey(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}
