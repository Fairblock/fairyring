package zkp

import (
	autocliv1 "cosmossdk.io/api/cosmos/autocli/v1"

	modulev1 "github.com/Fairblock/fairyring/api/fairyring/zkp"
)

// AutoCLIOptions implements the autocli.HasAutoCLIConfig interface.
//
// Only Params and TrustedContracts are exposed as public CLI queries.
// The proof verification RPCs stay intentionally hidden from the CLI
// because they are meant to be called only through the CosmWasm trusted-contract query path.
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
					RpcMethod: "TrustedContracts",
					Use:       "trusted-contracts",
					Short:     "List trusted CosmWasm contracts allowed to use ZKP verification queries",
				},
				{
					RpcMethod: "VerifyWithdrawRangeProof",
					Skip:      true,
				},
				{
					RpcMethod: "VerifyTransferRangeProof",
					Skip:      true,
				},
				{
					RpcMethod: "VerifyValidityProof",
					Skip:      true,
				},
				{
					RpcMethod: "VerifyEqualityProof",
					Skip:      true,
				},
				{
					RpcMethod: "VerifyTransferProofs",
					Skip:      true,
				},
				{
					RpcMethod: "VerifyWithdrawProofs",
					Skip:      true,
				},
			},
		},
	}
}
