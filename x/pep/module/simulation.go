package pep

import (
	pepsimulation "github.com/Fairblock/fairyring/x/pep/simulation"
	"math/rand"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"

	"github.com/Fairblock/fairyring/testutil/sample"
	"github.com/Fairblock/fairyring/x/keyshare/types"
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
	opWeightMsgSubmitEncryptedTx          = "op_weight_msg_submit_encrypted_tx"
	defaultWeightMsgSubmitEncryptedTx int = 100

	opWeightMsgCreateAggregatedKeyShare          = "op_weight_msg_aggregated_key_share"
	defaultWeightMsgCreateAggregatedKeyShare int = 100

	opWeightMsgRequestGeneralKeyshare          = "op_weight_msg_request_general_keyshare"
	defaultWeightMsgRequestGeneralKeyshare int = 100

	opWeightMsgGetGeneralKeyshare          = "op_weight_msg_get_general_keyshare"
	defaultWeightMsgGetGeneralKeyshare int = 100
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
		AggregatedKeyShareList: []types.AggregatedKeyShare{
			{
				Data:   "0x1234",
				Height: 0,
			},
			{
				Data:   "0x1234",
				Height: 1,
			},
		},
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&pepGenesis)
}

// RegisterStoreDecoder registers a decoder.
func (am AppModule) RegisterStoreDecoder(_ simtypes.StoreDecoderRegistry) {}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgSubmitEncryptedTx int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitEncryptedTx, &weightMsgSubmitEncryptedTx, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitEncryptedTx = defaultWeightMsgSubmitEncryptedTx
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitEncryptedTx,
		pepsimulation.SimulateMsgSubmitEncryptedTx(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgCreateAggregatedKeyShare int
	simState.AppParams.GetOrGenerate(opWeightMsgCreateAggregatedKeyShare, &weightMsgCreateAggregatedKeyShare, nil,
		func(_ *rand.Rand) {
			weightMsgCreateAggregatedKeyShare = defaultWeightMsgCreateAggregatedKeyShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgCreateAggregatedKeyShare,
		pepsimulation.SimulateMsgCreateAggregatedKeyShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgRequestGeneralKeyshare int
	simState.AppParams.GetOrGenerate(opWeightMsgRequestGeneralKeyshare, &weightMsgRequestGeneralKeyshare, nil,
		func(_ *rand.Rand) {
			weightMsgRequestGeneralKeyshare = defaultWeightMsgRequestGeneralKeyshare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgRequestGeneralKeyshare,
		pepsimulation.SimulateMsgRequestGeneralKeyshare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgGetGeneralKeyshare int
	simState.AppParams.GetOrGenerate(opWeightMsgGetGeneralKeyshare, &weightMsgGetGeneralKeyshare, nil,
		func(_ *rand.Rand) {
			weightMsgGetGeneralKeyshare = defaultWeightMsgGetGeneralKeyshare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgGetGeneralKeyshare,
		pepsimulation.SimulateMsgGetGeneralKeyshare(am.accountKeeper, am.bankKeeper, am.keeper),
	))
	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (am AppModule) ProposalMsgs(simState module.SimulationState) []simtypes.WeightedProposalMsg {
	return []simtypes.WeightedProposalMsg{
		// this line is used by starport scaffolding # simapp/module/OpMsg
	}
}
