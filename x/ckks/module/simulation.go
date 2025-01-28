package ckks

import (
	"math/rand"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"

	"github.com/Fairblock/fairyring/testutil/sample"
	ckkssimulation "github.com/Fairblock/fairyring/x/ckks/simulation"
	"github.com/Fairblock/fairyring/x/ckks/types"
)

// avoid unused import issue
var (
	_ = ckkssimulation.FindAccount
	_ = rand.Rand{}
	_ = sample.AccAddress
	_ = sdk.AccAddress{}
	_ = simulation.MsgEntryKind
)

const (
	opWeightMsgSubmitPkgShare = "op_weight_msg_submit_pkg_share"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitPkgShare int = 100

	opWeightMsgSubmitRkgShareRound1 = "op_weight_msg_submit_rkg_share_round_1"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitRkgShareRound1 int = 100

	opWeightMsgSubmitRkgShareRound2 = "op_weight_msg_submit_rkg_share_round_2"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitRkgShareRound2 int = 100

	opWeightMsgSubmitGkgShare = "op_weight_msg_submit_gkg_share"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitGkgShare int = 100

	opWeightMsgSubmitShamirShare = "op_weight_msg_submit_shamir_share"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitShamirShare int = 100

	opWeightMsgKeySwitchRequest = "op_weight_msg_key_switch_request"
	// TODO: Determine the simulation weight value
	defaultWeightMsgKeySwitchRequest int = 100

	opWeightMsgSubmitPksShare = "op_weight_msg_submit_pks_share"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitPksShare int = 100

	opWeightMsgDecryptionRequest = "op_weight_msg_decryption_request"
	// TODO: Determine the simulation weight value
	defaultWeightMsgDecryptionRequest int = 100

	opWeightMsgSubmitDecShare = "op_weight_msg_submit_dec_share"
	// TODO: Determine the simulation weight value
	defaultWeightMsgSubmitDecShare int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module.
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	ckksGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&ckksGenesis)
}

// RegisterStoreDecoder registers a decoder.
func (am AppModule) RegisterStoreDecoder(_ simtypes.StoreDecoderRegistry) {}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgSubmitPkgShare int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitPkgShare, &weightMsgSubmitPkgShare, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitPkgShare = defaultWeightMsgSubmitPkgShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitPkgShare,
		ckkssimulation.SimulateMsgSubmitPkgShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSubmitRkgShareRound1 int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitRkgShareRound1, &weightMsgSubmitRkgShareRound1, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitRkgShareRound1 = defaultWeightMsgSubmitRkgShareRound1
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitRkgShareRound1,
		ckkssimulation.SimulateMsgSubmitRkgShareRound1(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSubmitRkgShareRound2 int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitRkgShareRound2, &weightMsgSubmitRkgShareRound2, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitRkgShareRound2 = defaultWeightMsgSubmitRkgShareRound2
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitRkgShareRound2,
		ckkssimulation.SimulateMsgSubmitRkgShareRound2(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSubmitGkgShare int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitGkgShare, &weightMsgSubmitGkgShare, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitGkgShare = defaultWeightMsgSubmitGkgShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitGkgShare,
		ckkssimulation.SimulateMsgSubmitGkgShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSubmitShamirShare int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitShamirShare, &weightMsgSubmitShamirShare, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitShamirShare = defaultWeightMsgSubmitShamirShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitShamirShare,
		ckkssimulation.SimulateMsgSubmitShamirShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgKeySwitchRequest int
	simState.AppParams.GetOrGenerate(opWeightMsgKeySwitchRequest, &weightMsgKeySwitchRequest, nil,
		func(_ *rand.Rand) {
			weightMsgKeySwitchRequest = defaultWeightMsgKeySwitchRequest
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgKeySwitchRequest,
		ckkssimulation.SimulateMsgKeySwitchRequest(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSubmitPksShare int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitPksShare, &weightMsgSubmitPksShare, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitPksShare = defaultWeightMsgSubmitPksShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitPksShare,
		ckkssimulation.SimulateMsgSubmitPksShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgDecryptionRequest int
	simState.AppParams.GetOrGenerate(opWeightMsgDecryptionRequest, &weightMsgDecryptionRequest, nil,
		func(_ *rand.Rand) {
			weightMsgDecryptionRequest = defaultWeightMsgDecryptionRequest
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgDecryptionRequest,
		ckkssimulation.SimulateMsgDecryptionRequest(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	var weightMsgSubmitDecShare int
	simState.AppParams.GetOrGenerate(opWeightMsgSubmitDecShare, &weightMsgSubmitDecShare, nil,
		func(_ *rand.Rand) {
			weightMsgSubmitDecShare = defaultWeightMsgSubmitDecShare
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgSubmitDecShare,
		ckkssimulation.SimulateMsgSubmitDecShare(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (am AppModule) ProposalMsgs(simState module.SimulationState) []simtypes.WeightedProposalMsg {
	return []simtypes.WeightedProposalMsg{
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitPkgShare,
			defaultWeightMsgSubmitPkgShare,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitPkgShare(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitRkgShareRound1,
			defaultWeightMsgSubmitRkgShareRound1,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitRkgShareRound1(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitRkgShareRound2,
			defaultWeightMsgSubmitRkgShareRound2,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitRkgShareRound2(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitGkgShare,
			defaultWeightMsgSubmitGkgShare,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitGkgShare(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitShamirShare,
			defaultWeightMsgSubmitShamirShare,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitShamirShare(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgKeySwitchRequest,
			defaultWeightMsgKeySwitchRequest,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgKeySwitchRequest(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitPksShare,
			defaultWeightMsgSubmitPksShare,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitPksShare(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgDecryptionRequest,
			defaultWeightMsgDecryptionRequest,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgDecryptionRequest(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		simulation.NewWeightedProposalMsg(
			opWeightMsgSubmitDecShare,
			defaultWeightMsgSubmitDecShare,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				ckkssimulation.SimulateMsgSubmitDecShare(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		// this line is used by starport scaffolding # simapp/module/OpMsg
	}
}
