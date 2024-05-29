package keyshare

import (
	autocliv1 "cosmossdk.io/api/cosmos/autocli/v1"

	modulev1 "github.com/Fairblock/fairyring/api/fairyring/keyshare"
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
					RpcMethod: "ValidatorSetAll",
					Use:       "list-validator-set",
					Short:     "Show the list of all registered validators for all blocks",
				},
				{
					RpcMethod:      "ValidatorSet",
					Use:            "show-validator-set [address]",
					Short:          "Shows a ValidatorSet for a particular validator address",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "index"}},
				},
				{
					RpcMethod: "KeyShareAll",
					Use:       "list-key-share",
					Short:     "List all key shares of all validators",
				},
				{
					RpcMethod:      "KeyShare",
					Use:            "show-key-share [validator] [block-height]",
					Short:          "Show the key share of a particular validator for a particular block height",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "validator"}, {ProtoField: "blockHeight"}},
				},
				{
					RpcMethod: "AggregatedKeyShareAll",
					Use:       "list-aggregated-key-share",
					Short:     "List all aggregated key shares for all blocks",
				},
				{
					RpcMethod:      "AggregatedKeyShare",
					Use:            "show-aggregated-key-share [height]",
					Short:          "Shows a aggregated key share for a particular block",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "height"}},
				},
				{
					RpcMethod: "PubKey",
					Use:       "show-active-pub-key",
					Short:     "Show the active and queued public key",
				},
				{
					RpcMethod: "AuthorizedAddressAll",
					Use:       "list-authorized-address",
					Short:     "List all authorizedAddress",
				},
				{
					RpcMethod:      "AuthorizedAddress",
					Use:            "show-authorized-address [target]",
					Short:          "Shows a authorizedAddress",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "target"}},
				},
				{
					RpcMethod: "GeneralKeyShareAll",
					Use:       "list-general-key-share",
					Short:     "List all GeneralKeyShare",
				},
				{
					RpcMethod:      "GeneralKeyShare",
					Use:            "show-general-key-share [validator] [id-type] [id-value]",
					Short:          "Shows a General Key Share",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "validator"}, {ProtoField: "idType"}, {ProtoField: "idValue"}},
				},
				{
					RpcMethod: "Commitments",
					Use:       "show-commitments",
					Short:     "Show the active & queued commitments",
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
					RpcMethod: "RegisterValidator",
					Use:       "register-validator",
					Short:     "Register a validator for being eligible to send key shares",
				},
				{
					RpcMethod: "DeRegisterValidator",
					Use:       "deregister-validator",
					Short:     "Deregister a validator for being eligible to send key shares",
				},
				{
					RpcMethod:      "SendKeyshare",
					Use:            "send-keyshare [message] [keyshare-index] [block-height]",
					Short:          "Submit the key share for specific block height",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "message"}, {ProtoField: "keyshareIndex"}, {ProtoField: "blockHeight"}},
				},
				{
					RpcMethod:      "CreateLatestPubKey",
					Use:            "create-latest-pub-key [public-key] [commitments] [number-of-validators] [encrypted-key-shares]",
					Short:          "Submit the latest public key",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "publicKey"}, {ProtoField: "commitments"}, {ProtoField: "numberOfValidators"}, {ProtoField: "encryptedKeyShares"}},
				},
				{
					RpcMethod:      "CreateAuthorizedAddress",
					Use:            "create-authorized-address [target]",
					Short:          "Authorized the target address to submit key share for you",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "target"}},
				},
				{
					RpcMethod:      "UpdateAuthorizedAddress",
					Use:            "update-authorized-address [target] [is-authorized]",
					Short:          "Update an authorized address isAuthorized status",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "target"}, {ProtoField: "isAuthorized"}},
				},
				{
					RpcMethod:      "DeleteAuthorizedAddress",
					Use:            "delete-authorized-address [target]",
					Short:          "Delete an Authorized Address",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "target"}},
				},
				{
					RpcMethod:      "CreateGeneralKeyShare",
					Use:            "create-general-key-share [id-type] [id-value] [key-share] [key-share-index]",
					Short:          "Create a new General Key Share",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "idType"}, {ProtoField: "idValue"}, {ProtoField: "keyShare"}, {ProtoField: "keyShareIndex"}},
				},
				{
					RpcMethod:      "OverrideLatestPubKey",
					Use:            "override-latest-pub-key [public-key] [commitments] [number-of-validators] [encrypted-key-shares]",
					Short:          "Override the latest public key",
					PositionalArgs: []*autocliv1.PositionalArgDescriptor{{ProtoField: "publicKey"}, {ProtoField: "commitments"}, {ProtoField: "numberOfValidators"}, {ProtoField: "encryptedKeyShares"}},
				},
				// this line is used by ignite scaffolding # autocli/tx
			},
		},
	}
}
