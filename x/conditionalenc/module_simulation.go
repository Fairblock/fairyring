package conditionalenc

import (
	"math/rand"

	"fairyring/testutil/sample"
	conditionalencsimulation "fairyring/x/conditionalenc/simulation"
	"fairyring/x/conditionalenc/types"

	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
)

// avoid unused import issue
var (
	_ = sample.AccAddress
	_ = conditionalencsimulation.FindAccount
	_ = simulation.MsgEntryKind
	_ = baseapp.Paramspace
)

const (
	opWeightMsgSubmitEncryptedTx          = "op_weight_msg_submit_encrypted_tx"
	defaultWeightMsgSubmitEncryptedTx int = 100

	opWeightMsgCreateAggregatedConditionalKeyShare          = "op_weight_msg_aggregated_key_share"
	defaultWeightMsgCreateAggregatedConditionalKeyShare int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	conditionalencGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		AggregatedConditionalKeyShareList: []types.AggregatedConditionalKeyShare{
			{
				Creator: sample.AccAddress(),
				Condition:  "0",
			},
			{
				Creator: sample.AccAddress(),
				Condition:  "1",
			},
		},
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&conditionalencGenesis)
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

	var weightMsgSubmitEncryptedTx int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgSubmitEncryptedTx, &weightMsgSubmitEncryptedTx, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitEncryptedTx = defaultWeightMsgSubmitEncryptedTx
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitEncryptedTx,
		conditionalencsimulation.SimulateMsgSubmitEncryptedTx(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgCreateAggregatedConditionalKeyShare int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgCreateAggregatedConditionalKeyShare, &weightMsgCreateAggregatedConditionalKeyShare, nil,
		func(_ *rand.Rand) {
			weightMsgCreateAggregatedConditionalKeyShare = defaultWeightMsgCreateAggregatedConditionalKeyShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgCreateAggregatedConditionalKeyShare,
		conditionalencsimulation.SimulateMsgCreateAggregatedConditionalKeyShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}
