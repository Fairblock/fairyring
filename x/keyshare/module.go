package keyshare

import (
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strconv"

	commontypes "github.com/Fairblock/fairyring/x/common/types"

	"github.com/cosmos/cosmos-sdk/telemetry"

	// this line is used by starport scaffolding # 1

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/spf13/cobra"

	"github.com/Fairblock/fairyring/x/keyshare/client/cli"
	"github.com/Fairblock/fairyring/x/keyshare/keeper"
	"github.com/Fairblock/fairyring/x/keyshare/types"

	abci "github.com/cometbft/cometbft/abci/types"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
)

var (
	_ module.AppModule      = AppModule{}
	_ module.AppModuleBasic = AppModuleBasic{}
)

// ----------------------------------------------------------------------------
// AppModuleBasic
// ----------------------------------------------------------------------------

// AppModuleBasic implements the AppModuleBasic interface that defines the independent methods a Cosmos SDK module needs to implement.
type AppModuleBasic struct {
	cdc codec.BinaryCodec
}

func NewAppModuleBasic(cdc codec.BinaryCodec) AppModuleBasic {
	return AppModuleBasic{cdc: cdc}
}

// Name returns the name of the module as a string
func (AppModuleBasic) Name() string {
	return types.ModuleName
}

// RegisterLegacyAminoCodec registers the amino codec for the module, which is used to marshal and unmarshal structs to/from []byte in order to persist them in the module's KVStore
func (AppModuleBasic) RegisterLegacyAminoCodec(cdc *codec.LegacyAmino) {
	types.RegisterCodec(cdc)
}

// RegisterInterfaces registers a module's interface types and their concrete implementations as proto.Message
func (a AppModuleBasic) RegisterInterfaces(reg cdctypes.InterfaceRegistry) {
	types.RegisterInterfaces(reg)
}

// DefaultGenesis returns a default GenesisState for the module, marshalled to json.RawMessage. The default GenesisState need to be defined by the module developer and is primarily used for testing
func (AppModuleBasic) DefaultGenesis(cdc codec.JSONCodec) json.RawMessage {
	return cdc.MustMarshalJSON(types.DefaultGenesis())
}

// ValidateGenesis used to validate the GenesisState, given in its json.RawMessage form
func (AppModuleBasic) ValidateGenesis(cdc codec.JSONCodec, config client.TxEncodingConfig, bz json.RawMessage) error {
	var genState types.GenesisState
	if err := cdc.UnmarshalJSON(bz, &genState); err != nil {
		return fmt.Errorf("failed to unmarshal %s genesis state: %w", types.ModuleName, err)
	}
	return genState.Validate()
}

// RegisterGRPCGatewayRoutes registers the gRPC Gateway routes for the module
func (AppModuleBasic) RegisterGRPCGatewayRoutes(clientCtx client.Context, mux *runtime.ServeMux) {
	_ = types.RegisterQueryHandlerClient(context.Background(), mux, types.NewQueryClient(clientCtx))
}

// GetTxCmd returns the root Tx command for the module. The subcommands of this root command are used by end-users to generate new transactions containing messages defined in the module
func (a AppModuleBasic) GetTxCmd() *cobra.Command {
	return cli.GetTxCmd()
}

// GetQueryCmd returns the root query command for the module. The subcommands of this root command are used by end-users to generate new queries to the subset of the state defined by the module
func (AppModuleBasic) GetQueryCmd() *cobra.Command {
	return cli.GetQueryCmd(types.StoreKey)
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
}

func NewAppModule(
	cdc codec.Codec,
	keeper keeper.Keeper,
	accountKeeper types.AccountKeeper,
	bankKeeper types.BankKeeper,
	pk types.PepKeeper,
) AppModule {
	return AppModule{
		AppModuleBasic: NewAppModuleBasic(cdc),
		keeper:         keeper,
		accountKeeper:  accountKeeper,
		bankKeeper:     bankKeeper,
		pepKeeper:      pk,
	}
}

// RegisterServices registers a gRPC query service to respond to the module-specific gRPC queries
func (am AppModule) RegisterServices(cfg module.Configurator) {
	types.RegisterMsgServer(cfg.MsgServer(), keeper.NewMsgServerImpl(am.keeper))
	types.RegisterQueryServer(cfg.QueryServer(), am.keeper)
}

// RegisterInvariants registers the invariants of the module. If an invariant deviates from its predicted value, the InvariantRegistry triggers appropriate logic (most often the chain will be halted)
func (am AppModule) RegisterInvariants(_ sdk.InvariantRegistry) {}

// InitGenesis performs the module's genesis initialization. It returns no validator updates.
func (am AppModule) InitGenesis(ctx sdk.Context, cdc codec.JSONCodec, gs json.RawMessage) []abci.ValidatorUpdate {
	var genState types.GenesisState
	// Initialize global index to index in genesis state
	cdc.MustUnmarshalJSON(gs, &genState)

	InitGenesis(ctx, am.keeper, genState)

	return []abci.ValidatorUpdate{}
}

// ExportGenesis returns the module's exported genesis state as raw JSON bytes.
func (am AppModule) ExportGenesis(ctx sdk.Context, cdc codec.JSONCodec) json.RawMessage {
	genState := ExportGenesis(ctx, am.keeper)
	return cdc.MustMarshalJSON(genState)
}

// ConsensusVersion is a sequence number for state-breaking change of the module. It should be incremented on each consensus-breaking change introduced by the module. To avoid wrong/empty versions, the initial version should be set to 1
func (AppModule) ConsensusVersion() uint64 { return 1 }

// BeginBlock contains the logic that is automatically triggered at the beginning of each block
func (am AppModule) BeginBlock(ctx sdk.Context, _ abci.RequestBeginBlock) {
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
		bondedVal, found := am.keeper.StakingKeeper().GetValidator(ctx, sdk.ValAddress(accAddr))
		if !found {
			am.keeper.RemoveValidatorSet(ctx, eachValidator.Validator)
			continue
		}
		if !bondedVal.IsBonded() {
			am.keeper.RemoveValidatorSet(ctx, eachValidator.Validator)
		}
	}

	am.keeper.ProcessPepRequestQueue(ctx)
	am.keeper.ProcessPepSignalQueue(ctx)
	am.keeper.ProcessGovRequestQueue(ctx)
	am.keeper.ProcessGovSignalQueue(ctx)

	height := uint64(ctx.BlockHeight())

	ak, foundAk := am.keeper.GetActivePubKey(ctx)
	qk, foundQk := am.keeper.GetQueuedPubKey(ctx)
	qc, foundQc := am.keeper.GetQueuedCommitments(ctx)

	if foundAk {
		am.keeper.SetActivePubKey(ctx, ak)
		am.pepKeeper.SetActivePubKey(ctx, commontypes.ActivePublicKey{
			PublicKey: ak.PublicKey,
			Creator:   ak.Creator,
			Expiry:    ak.Expiry,
		})

		if ak.Expiry <= height {
			am.keeper.DeleteActivePubKey(ctx)
			am.pepKeeper.DeleteActivePubKey(ctx)
			am.keeper.DeleteActiveCommitments(ctx)
		} else {
			if foundQk {
				am.keeper.SetQueuedPubKey(ctx, qk)
				am.pepKeeper.SetQueuedPubKey(ctx, commontypes.QueuedPublicKey{
					PublicKey: qk.PublicKey,
					Creator:   qk.Creator,
					Expiry:    qk.Expiry,
				})
			}
			return
		}
	}

	if foundQk {
		if qk.Expiry > height {
			am.keeper.SetActivePubKey(ctx, types.ActivePubKey(qk))
			am.pepKeeper.SetActivePubKey(ctx, commontypes.ActivePublicKey{
				PublicKey: qk.PublicKey,
				Creator:   qk.Creator,
				Expiry:    qk.Expiry,
			})
			if foundQc {
				am.keeper.SetActiveCommitments(ctx, qc)
			}
		}
		am.keeper.DeleteQueuedPubKey(ctx)
		am.pepKeeper.DeleteQueuedPubKey(ctx)
		if foundQc {
			am.keeper.DeleteQueuedCommitments(ctx)
		}
	}
}

// EndBlock contains the logic that is automatically triggered at the end of each block
func (am AppModule) EndBlock(ctx sdk.Context, _ abci.RequestEndBlock) []abci.ValidatorUpdate {
	validators := am.keeper.GetAllValidatorSet(ctx)
	params := am.keeper.GetParams(ctx)

	for _, eachValidator := range validators {
		lastSubmittedHeight := am.keeper.GetLastSubmittedHeight(ctx, eachValidator.Validator)
		am.keeper.Logger(ctx).Info(fmt.Sprintf("Last submitted: %s: %d", eachValidator.Validator, lastSubmittedHeight))
		// Validator will be slashed if their last submitted height is N block ago
		// Lets say N is 10, and last submitted height is 0, current height is 10
		// then he/she will be slashed
		if lastSubmittedHeight+params.GetMaxIdledBlock() > uint64(ctx.BlockHeight()) {
			continue
		}

		savedConsAddrByte, err := hex.DecodeString(eachValidator.ConsAddr)
		if err != nil {
			am.keeper.Logger(ctx).Error(fmt.Sprintf("Error while decoding validator %s cons addr: %s", eachValidator.Validator, err.Error()))
			continue
		}

		var consAddr sdk.ConsAddress
		err = consAddr.Unmarshal(savedConsAddrByte)
		if err != nil {
			am.keeper.Logger(ctx).Error(fmt.Sprintf("Error while unmarshaling validator %s cons addr: %s", eachValidator.Validator, err.Error()))
			continue
		}

		if val, found := am.keeper.GetActivePubKey(ctx); !found || len(val.PublicKey) == 0 {
			// Not slashing validator if there is no active public key
			am.keeper.SetLastSubmittedHeight(ctx, eachValidator.Validator, strconv.FormatInt(ctx.BlockHeight(), 10))
			continue
		}

		am.keeper.StakingKeeper().Slash(
			ctx,
			consAddr,
			ctx.BlockHeight()-1,
			types.SlashPower,
			params.SlashFractionNoKeyshare,
		)

		// After being slashed, his/her last submitted height will be set to the current block
		// So he/she won't be slashed in the next block instead he/she will be slashed if he didn't submit for N block again.
		am.keeper.SetLastSubmittedHeight(ctx, eachValidator.Validator, strconv.FormatInt(ctx.BlockHeight(), 10))
		telemetry.IncrCounter(1, types.KeyTotalIdleValSlashed)
	}

	return []abci.ValidatorUpdate{}
}
