package keyshare

import (
	"context"
	"cosmossdk.io/core/appmodule"
	"encoding/hex"
	"encoding/json"
	"fmt"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/telemetry"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	porttypes "github.com/cosmos/ibc-go/v8/modules/core/05-port/types"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/spf13/cobra"
	"strconv"
	// this line is used by starport scaffolding # 1

	"github.com/Fairblock/fairyring/x/keyshare/client/cli"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"
)

var (
	_ module.AppModuleBasic      = (*AppModule)(nil)
	_ module.HasGenesis          = (*AppModule)(nil)
	_ module.HasInvariants       = (*AppModule)(nil)
	_ module.HasConsensusVersion = (*AppModule)(nil)

	_ appmodule.AppModule       = (*AppModule)(nil)
	_ appmodule.HasBeginBlocker = (*AppModule)(nil)
	_ appmodule.HasEndBlocker   = (*AppModule)(nil)
	_ porttypes.IBCModule       = IBCModule{}
)

// ConsensusVersion defines the current x/keyshare module consensus version.
const ConsensusVersion = 2

// ----------------------------------------------------------------------------
// AppModuleBasic
// ----------------------------------------------------------------------------

// AppModuleBasic implements the AppModuleBasic interface that defines the
// independent methods a Cosmos SDK module needs to implement.
type AppModuleBasic struct {
	cdc codec.BinaryCodec
}

func NewAppModuleBasic(cdc codec.BinaryCodec) AppModuleBasic {
	return AppModuleBasic{cdc: cdc}
}

// Name returns the name of the module as a string.
func (AppModuleBasic) Name() string {
	return types.ModuleName
}

// RegisterLegacyAminoCodec registers the amino codec for the module, which is used
// to marshal and unmarshal structs to/from []byte in order to persist them in the module's KVStore.
func (AppModuleBasic) RegisterLegacyAminoCodec(cdc *codec.LegacyAmino) {}

// RegisterInterfaces registers a module's interface types and their concrete implementations as proto.Message.
func (a AppModuleBasic) RegisterInterfaces(reg cdctypes.InterfaceRegistry) {
	types.RegisterInterfaces(reg)
}

// DefaultGenesis returns a default GenesisState for the module, marshalled to json.RawMessage.
// The default GenesisState need to be defined by the module developer and is primarily used for testing.
func (AppModuleBasic) DefaultGenesis(cdc codec.JSONCodec) json.RawMessage {
	return cdc.MustMarshalJSON(types.DefaultGenesis())
}

// ValidateGenesis used to validate the GenesisState, given in its json.RawMessage form.
func (AppModuleBasic) ValidateGenesis(cdc codec.JSONCodec, config client.TxEncodingConfig, bz json.RawMessage) error {
	var genState types.GenesisState
	if err := cdc.UnmarshalJSON(bz, &genState); err != nil {
		return fmt.Errorf("failed to unmarshal %s genesis state: %w", types.ModuleName, err)
	}
	return genState.Validate()
}

// RegisterGRPCGatewayRoutes registers the gRPC Gateway routes for the module.
func (AppModuleBasic) RegisterGRPCGatewayRoutes(clientCtx client.Context, mux *runtime.ServeMux) {
	if err := types.RegisterQueryHandlerClient(context.Background(), mux, types.NewQueryClient(clientCtx)); err != nil {
		panic(err)
	}
}

// GetTxCmd returns the root Tx command for the module.
// These commands enrich the AutoCLI tx commands.
func (a AppModuleBasic) GetTxCmd() *cobra.Command {
	return cli.GetTxCmd()
}

// ----------------------------------------------------------------------------
// AppModule
// ----------------------------------------------------------------------------

// AppModule implements the AppModule interface that defines the inter-dependent methods that modules need to implement
type AppModule struct {
	AppModuleBasic

	keeper        keeper.Keeper
	accountKeeper types.AccountKeeper
	bankKeeper    types.BankKeeper
	pepKeeper     types.PepKeeper
	stakingKeeper types.StakingKeeper
}

func NewAppModule(
	cdc codec.Codec,
	keeper keeper.Keeper,
	accountKeeper types.AccountKeeper,
	bankKeeper types.BankKeeper,
	pk types.PepKeeper,
	sk types.StakingKeeper,
) AppModule {
	return AppModule{
		AppModuleBasic: NewAppModuleBasic(cdc),
		keeper:         keeper,
		accountKeeper:  accountKeeper,
		bankKeeper:     bankKeeper,
		pepKeeper:      pk,
		stakingKeeper:  sk,
	}
}

// RegisterServices registers a gRPC query service to respond to the module-specific gRPC queries
func (am AppModule) RegisterServices(cfg module.Configurator) {
	types.RegisterMsgServer(cfg.MsgServer(), keeper.NewMsgServerImpl(am.keeper))
	types.RegisterQueryServer(cfg.QueryServer(), am.keeper)
	m := keeper.NewMigrator(am.keeper)
	if err := cfg.RegisterMigration(types.ModuleName, 1, m.Migrate1to2); err != nil {
		panic(fmt.Errorf("failed to migrate x/%s from version 1 to 2: %w", types.ModuleName, err))
	}
}

// RegisterInvariants registers the invariants of the module. If an invariant deviates from its predicted value, the InvariantRegistry triggers appropriate logic (most often the chain will be halted)
func (am AppModule) RegisterInvariants(_ sdk.InvariantRegistry) {}

// InitGenesis performs the module's genesis initialization. It returns no validator updates.
func (am AppModule) InitGenesis(ctx sdk.Context, cdc codec.JSONCodec, gs json.RawMessage) {
	var genState types.GenesisState
	// Initialize global index to index in genesis state
	cdc.MustUnmarshalJSON(gs, &genState)

	InitGenesis(ctx, am.keeper, genState)
}

// ExportGenesis returns the module's exported genesis state as raw JSON bytes.
func (am AppModule) ExportGenesis(ctx sdk.Context, cdc codec.JSONCodec) json.RawMessage {
	genState := ExportGenesis(ctx, am.keeper)
	return cdc.MustMarshalJSON(genState)
}

// ConsensusVersion is a sequence number for state-breaking change of the module.
// It should be incremented on each consensus-breaking change introduced by the module.
// To avoid wrong/empty versions, the initial version should be set to 1.
func (AppModule) ConsensusVersion() uint64 { return ConsensusVersion }

// BeginBlock contains the logic that is automatically triggered at the beginning of each block.
// The begin block implementation is optional.
func (am AppModule) BeginBlock(cctx context.Context) error {
	ctx := sdk.UnwrapSDKContext(cctx)
	validatorSet := am.keeper.GetAllValidatorSet(ctx)
	for _, eachValidator := range validatorSet {
		accAddr, err := sdk.AccAddressFromBech32(eachValidator.Validator)
		if err != nil {
			ctx.Logger().Error(
				fmt.Sprintf(
					"Error on converting validator addr: %s to AccAddr: %s",
					eachValidator.Validator,
					err.Error(),
				),
			)
			continue
		}
		bondedVal, err := am.stakingKeeper.GetValidator(ctx, sdk.ValAddress(accAddr))
		if err != nil || !bondedVal.IsBonded() {
			am.keeper.RemoveValidatorSet(ctx, eachValidator.Validator)
			for _, v := range am.keeper.GetAllAuthorizedAddress(ctx) {
				if v.AuthorizedBy == eachValidator.Validator {
					am.keeper.RemoveAuthorizedAddress(ctx, v.Target)
					am.keeper.DecreaseAuthorizedCount(ctx, eachValidator.Validator)
					break
				}
			}
		}
	}

	am.keeper.ProcessPepRequestQueue(ctx)
	am.keeper.ProcessPepSignalQueue(ctx)
	am.keeper.ProcessPrivateRequestQueue(ctx)
	am.keeper.ProcessPrivateSignalQueue(ctx)
	am.keeper.ProcessGovRequestQueue(ctx)
	am.keeper.ProcessGovSignalQueue(ctx)

	height := uint64(ctx.BlockHeight())

	ak, foundAk := am.keeper.GetActivePubkey(ctx)
	qk, foundQk := am.keeper.GetQueuedPubkey(ctx)
	qc, foundQc := am.keeper.GetQueuedCommitments(ctx)

	if foundAk {
		am.pepKeeper.SetActivePubkey(ctx, commontypes.ActivePublicKey{
			PublicKey: ak.PublicKey,
			Creator:   ak.Creator,
			Expiry:    ak.Expiry,
		})

		if ak.Expiry <= height {
			am.keeper.DeleteActivePubkey(ctx)
			am.pepKeeper.DeleteActivePubkey(ctx)
			am.keeper.DeleteActiveCommitments(ctx)
		} else {
			if foundQk {
				am.pepKeeper.SetQueuedPubkey(ctx, commontypes.QueuedPublicKey{
					PublicKey: qk.PublicKey,
					Creator:   qk.Creator,
					Expiry:    qk.Expiry,
				})
			}
			return nil
		}
	}

	if foundQk {
		if qk.Expiry > height {
			am.keeper.SetActivePubkey(ctx, types.ActivePubkey(qk))
			am.pepKeeper.SetActivePubkey(ctx, commontypes.ActivePublicKey{
				PublicKey: qk.PublicKey,
				Creator:   qk.Creator,
				Expiry:    qk.Expiry,
			})
			if foundQc {
				am.keeper.SetActiveCommitments(ctx, qc)
			}
			// When switching the active public key,
			// Reset all validators last submitted height,
			// So they won't get slashed if they miss the first block of the new active pubkey keyshare.
			for _, v := range qk.EncryptedKeyshares {
				am.keeper.SetLastSubmittedHeight(ctx, v.Validator, strconv.FormatInt(ctx.BlockHeight(), 10))
			}

			// We don't need to remove the validators that not in the new round from the set
			// They won't be slashed because of the new slashing idle validators logic
		}
		am.keeper.DeleteQueuedPubkey(ctx)
		am.pepKeeper.DeleteQueuedPubkey(ctx)
		if foundQc {
			am.keeper.DeleteQueuedCommitments(ctx)
		}
	}
	return nil
}

// EndBlock contains the logic that is automatically triggered at the end of each block.
// The end block implementation is optional.
func (am AppModule) EndBlock(cctx context.Context) error {
	ctx := sdk.UnwrapSDKContext(cctx)

	validators := am.keeper.GetAllValidatorSet(ctx)
	params := am.keeper.GetParams(ctx)

	pubKey, found := am.keeper.GetActivePubkey(ctx)
	// If no active public key / no validator in the current public key
	// Then no Idling check needed
	if !found || len(pubKey.PublicKey) == 0 || len(pubKey.EncryptedKeyshares) == 0 {
		return nil
	}

	for _, eachValidator := range validators {
		lastSubmittedHeight := am.keeper.GetLastSubmittedHeight(ctx, eachValidator.Validator)
		am.keeper.Logger().Info(fmt.Sprintf("Last submitted: %s: %d", eachValidator.Validator, lastSubmittedHeight))
		// Validator will be slashed if their last submitted height is N block ago
		// Lets say N is 10, and last submitted height is 0, current height is 10
		// then he/she will be slashed
		if lastSubmittedHeight+params.GetMaxIdledBlock() > uint64(ctx.BlockHeight()) {
			continue
		}

		savedConsAddrByte, err := hex.DecodeString(eachValidator.ConsAddr)
		if err != nil {
			am.keeper.Logger().Error(fmt.Sprintf("Error while decoding validator %s cons addr: %s", eachValidator.Validator, err.Error()))
			continue
		}

		var consAddr sdk.ConsAddress
		err = consAddr.Unmarshal(savedConsAddrByte)
		if err != nil {
			am.keeper.Logger().Error(fmt.Sprintf("Error while unmarshaling validator %s cons addr: %s", eachValidator.Validator, err.Error()))
			continue
		}

		inCurrentEpoch := false

		for _, k := range pubKey.EncryptedKeyshares {
			if k.Validator == eachValidator.Validator {
				inCurrentEpoch = true
				break
			}
		}

		if !inCurrentEpoch {
			am.keeper.Logger().Info(fmt.Sprintf("Validator: %s not in the current epoch, updating last submitted height to current block height.", eachValidator.Validator))
			am.keeper.SetLastSubmittedHeight(ctx, eachValidator.Validator, strconv.FormatInt(ctx.BlockHeight(), 10))
			return nil
		}

		am.keeper.SlashingKeeper().Slash(
			ctx,
			consAddr,
			params.SlashFractionNoKeyshare,
			types.SlashPower,
			ctx.BlockHeight()-1,
		)

		// After being slashed, his/her last submitted height will be set to the current block
		// So he/she won't be slashed in the next block instead he/she will be slashed if he didn't submit for N block again.
		am.keeper.SetLastSubmittedHeight(ctx, eachValidator.Validator, strconv.FormatInt(ctx.BlockHeight(), 10))
		telemetry.IncrCounter(1, types.KeyTotalIdleValSlashed)
	}

	return nil
}

// IsOnePerModuleType implements the depinject.OnePerModuleType interface.
func (am AppModule) IsOnePerModuleType() {}

// IsAppModule implements the appmodule.AppModule interface.
func (am AppModule) IsAppModule() {}

// ----------------------------------------------------------------------------
// App Wiring Setup
// ----------------------------------------------------------------------------
//
//func init() {
//	appmodule.Register(
//		&modulev1.Module{},
//		appmodule.Provide(ProvideModule),
//	)
//}
//
//type ModuleInputs struct {
//	depinject.In
//
//	StoreService store.KVStoreService
//	Cdc          codec.Codec
//	Config       *modulev1.Module
//	Logger       log.Logger
//
//	AccountKeeper  types.AccountKeeper
//	BankKeeper     types.BankKeeper
//	PepKeeper      types.PepKeeper
//	SlashingKeeper types.SlashingKeeper
//	StakingKeeper  types.StakingKeeper
//	GovKeeper      types.GovKeeper
//
//	IBCKeeperFn        func() *ibckeeper.Keeper                   `optional:"true"`
//	CapabilityScopedFn func(string) capabilitykeeper.ScopedKeeper `optional:"true"`
//}
//
//type ModuleOutputs struct {
//	depinject.Out
//
//	KeyshareKeeper keeper.Keeper
//	Module         appmodule.AppModule
//}
//
//func ProvideModule(in ModuleInputs) ModuleOutputs {
//	// default to governance authority if not provided
//	authority := authtypes.NewModuleAddress(govtypes.ModuleName)
//	if in.Config.Authority != "" {
//		authority = authtypes.NewModuleAddressOrBech32Address(in.Config.Authority)
//	}
//	k := keeper.NewKeeper(
//		in.Cdc,
//		in.StoreService,
//		in.Logger,
//		authority.String(),
//		in.IBCKeeperFn,
//		in.CapabilityScopedFn,
//		in.AccountKeeper,
//		in.BankKeeper,
//		in.PepKeeper,
//		in.SlashingKeeper,
//		in.StakingKeeper,
//		in.GovKeeper,
//	)
//	m := NewAppModule(
//		in.Cdc,
//		k,
//		in.AccountKeeper,
//		in.BankKeeper,
//		in.PepKeeper,
//		in.StakingKeeper,
//	)
//
//	return ModuleOutputs{KeyshareKeeper: k, Module: m}
//}
