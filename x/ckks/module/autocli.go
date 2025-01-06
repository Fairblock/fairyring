package ckks

import (
	autocliv1 "cosmossdk.io/api/cosmos/autocli/v1"

	modulev1 "github.com/Fairblock/fairyring/api/fairyring/ckks"
)

// AutoCLIOptions implements the autocli.HasAutoCLIConfig interface.
func (am AppModule) AutoCLIOptions() *autocliv1.ModuleOptions {
	return &autocliv1.ModuleOptions{
		Query: &autocliv1.ServiceCommandDescriptor{
			Service: modulev1.Query_ServiceDesc.ServiceName,
			RpcCommandOptions: []*autocliv1.RpcCommandOptions{
				{
					RpcMethod: "Params",
					Use:       "params",
					Short:     "Shows the parameters of the module",
				},
				{
					RpcMethod:      "AggregatedRkgr1",
					Use:            "aggregated-rkgr-1",
					Short:          "Query aggregatedRkgr1",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{},
				},

				// this line is used by ignite scaffolding # autocli/query
			},
		},
		Tx: &autocliv1.ServiceCommandDescriptor{
			Service:              modulev1.Msg_ServiceDesc.ServiceName,
			EnhanceCustomCommand: true, // only required if you want to use the custom command
			RpcCommandOptions: []*autocliv1.RpcCommandOptions{
				{
					RpcMethod: "UpdateParams",
					Skip:      true, // skipped because authority gated
				},
				{
					RpcMethod:      "SubmitPkgShare",
					Use:            "submit-pkg-share [share-data]",
					Short:          "Send a submit-pkg-share tx",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "shareData"}},
				},
				{
					RpcMethod:      "SubmitRkgShareRound1",
					Use:            "submit-rkg-share-round-1 [share-data]",
					Short:          "Send a submit-rkg-share-round1 tx",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "shareData"}},
				},
				{
					RpcMethod:      "SubmitRkgShareRound2",
					Use:            "submit-rkg-share-round-2 [share-data]",
					Short:          "Send a submit-rkg-share-round2 tx",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "shareData"}},
				},
				{
					RpcMethod:      "SubmitGkgShare",
					Use:            "submit-gkg-share [share-data]",
					Short:          "Send a submit-gkg-share tx",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "shareData"}},
				},
				{
					RpcMethod:      "SubmitShamirShare",
					Use:            "submit-shamir-share [share-list]",
					Short:          "Send a submit-shamir-share tx",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "shareList"}},
				},
				// this line is used by ignite scaffolding # autocli/tx
			},
		},
	}
}
