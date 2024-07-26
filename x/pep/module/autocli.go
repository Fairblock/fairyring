package pep

import (
	autocliv1 "cosmossdk.io/api/cosmos/autocli/v1"

	modulev1 "github.com/Fairblock/fairyring/api/fairyring/pep"
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
					RpcMethod: "EncryptedTxAll",
					Use:       "list-encrypted-tx",
					Short:     "list all pending encrypted transactions from all future blocks",
				},
				{
					RpcMethod:      "EncryptedTxAllFromHeight",
					Use:            "list-encrypted-tx-from-block [target-height]",
					Short:          "list all encrypted transactions for a particular target height",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "targetHeight"}},
				},
				{
					RpcMethod:      "EncryptedTx",
					Use:            "show-encrypted-tx [target-height] [index]",
					Short:          "shows a particular encrypted transaction at a given target height and index",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "targetHeight"}, {ProtoField: "index"}},
				},
				{
					RpcMethod: "LatestHeight",
					Use:       "latest-height",
					Short:     "Query the latest recorded height of the Fairyring chain on the destination chain",
				},
				{
					RpcMethod: "PepNonceAll",
					Use:       "list-pep-nonce",
					Short:     "list all PepNonce of all addresses",
				},
				{
					RpcMethod:      "PepNonce",
					Use:            "show-pep-nonce [address]",
					Short:          "shows a PepNonce for a particular address",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "address"}},
				},
				{
					RpcMethod: "PubKey",
					Use:       "show-active-pub-key",
					Short:     "Show the active and queued public key",
				},
				{
					RpcMethod:      "KeyshareReq",
					Use:            "show-keyshare-req [req-id]",
					Short:          "show a particular pending keyshare request by request-id",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "req_id"}},
				},
				{
					RpcMethod: "KeyshareReqAll",
					Use:       "list-keyshare-req",
					Short:     "list all pending keyshare requests",
				},
				// this line is used by ignite scaffolding # autocli/query
			},
		},
		//Tx: &autocliv1.ServiceCommandDescriptor{
		//	Service:              modulev1.Msg_ServiceDesc.ServiceName,
		//	EnhanceCustomCommand: true, // only required if you want to use the custom command
		//	RpcCommandOptions: []*autocliv1.RpcCommandOptions{
		//		{
		//			RpcMethod: "UpdateParams",
		//			Skip:      true, // skipped because authority gated
		//		},
		//		{
		//			RpcMethod:      "SubmitEncryptedTx",
		//			Use:            "submit-encrypted-tx [data] [target-block-height]",
		//			Short:          "Submit an encrypted transaction along with its execution height (execution height refers to the height in the FairyRing chain)",
		//			PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "data"}, {ProtoField: "targetBlockHeight"}},
		//		},
		//		{
		//			RpcMethod:      "SubmitGeneralEncryptedTx",
		//			Use:            "submit-general-encrypted-tx [data] [req-id]",
		//			Short:          "Submit an encrypted transaction along with its req-id",
		//			PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "data"}, {ProtoField: "req_id"}},
		//		},
		//		{
		//			RpcMethod:      "CreateAggregatedKeyShare",
		//			Use:            "create-aggregated-key-share [height] [data]",
		//			Short:          "Submit a new aggregated keyshare into a destination chain",
		//			PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "height"}, {ProtoField: "data"}},
		//		},
		//		{
		//			RpcMethod: "RequestGeneralKeyshare",
		//			Use:       "request-general-keyshare",
		//			Short:     "Broadcast message request-general-keyshare",
		//		},
		//		{
		//			RpcMethod:      "GetGeneralKeyshare",
		//			Use:            "get-general-keyshare [req-id]",
		//			Short:          "Broadcast message get-general-keyshare",
		//			PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "req_id"}},
		//		},
		//		// this line is used by ignite scaffolding # autocli/tx
		//	},
		//},
	}
}
