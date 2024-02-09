package pep

import (
	"math/rand"

	"github.com/Fairblock/fairyring/testutil/sample"
	pepsimulation "github.com/Fairblock/fairyring/x/pep/simulation"
	"github.com/Fairblock/fairyring/x/pep/types"

	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
)

// avoid unused import issue
var (
	_ = sample.AccAddress
	_ = pepsimulation.FindAccount
	_ = simulation.MsgEntryKind
	_ = baseapp.Paramspace
)

const (
	opWeightMsgSubmitEncryptedTx          = "op_weight_msg_submit_encrypted_tx"
	defaultWeightMsgSubmitEncryptedTx int = 100

	opWeightMsgCreateAggregatedKeyShare          = "op_weight_msg_aggregated_key_share"
	defaultWeightMsgCreateAggregatedKeyShare int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	pepGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		AggregatedKeyShareList: []types.AggregatedKeyShare{
			{
				Creator: sample.AccAddress(),
				Height:  0,
			},
			{
				Creator: sample.AccAddress(),
				Height:  1,
			},
		},
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&pepGenesis)
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
		pepsimulation.SimulateMsgSubmitEncryptedTx(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgCreateAggregatedKeyShare int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgCreateAggregatedKeyShare, &weightMsgCreateAggregatedKeyShare, nil,
		func(_ *rand.Rand) {
			weightMsgCreateAggregatedKeyShare = defaultWeightMsgCreateAggregatedKeyShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgCreateAggregatedKeyShare,
		pepsimulation.SimulateMsgCreateAggregatedKeyShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}
