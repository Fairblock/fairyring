package fairblock

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/cosmos/cosmos-sdk/types/tx"
	"strconv"

	// this line is used by starport scaffolding # 1

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/spf13/cobra"

	abci "github.com/tendermint/tendermint/abci/types"

	"fairyring/x/fairblock/client/cli"
	"fairyring/x/fairblock/keeper"
	"fairyring/x/fairblock/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	porttypes "github.com/cosmos/ibc-go/v5/modules/core/05-port/types"
)

var (
	_ module.AppModule      = AppModule{}
	_ module.AppModuleBasic = AppModuleBasic{}
	_ porttypes.IBCModule   = IBCModule{}
)

// ----------------------------------------------------------------------------
// AppModuleBasic
// ----------------------------------------------------------------------------

// AppModuleBasic implements the AppModuleBasic interface that defines the independent methods a Cosmos SDK module needs to implement.
type AppModuleBasic struct {
	cdc     codec.BinaryCodec
	cdcJson codec.JSONCodec
}

//func NewAppModuleBasic(cdc codec.BinaryCodec) AppModuleBasic {
//	return AppModuleBasic{cdc: cdc}
//}

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
	types.RegisterQueryHandlerClient(context.Background(), mux, types.NewQueryClient(clientCtx))
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

type deliverTxFn func(abci.RequestDeliverTx) abci.ResponseDeliverTx
type checkTxFn func(abci.RequestCheckTx) abci.ResponseCheckTx

// AppModule implements the AppModule interface that defines the inter-dependent methods that modules need to implement
type AppModule struct {
	AppModuleBasic

	keeper        keeper.Keeper
	accountKeeper types.AccountKeeper
	bankKeeper    types.BankKeeper

	deliverTx deliverTxFn
	checkTx   checkTxFn
}

func NewAppModule(
	cdc codec.Codec,
	keeper keeper.Keeper,
	accountKeeper types.AccountKeeper,
	bankKeeper types.BankKeeper,
	deliverTx deliverTxFn,
	checkTx checkTxFn,
) AppModule {
	return AppModule{
		AppModuleBasic: AppModuleBasic{cdc: cdc, cdcJson: cdc},
		keeper:         keeper,
		accountKeeper:  accountKeeper,
		bankKeeper:     bankKeeper,
		deliverTx:      deliverTx,
		checkTx:        checkTx,
	}
}

// Deprecated: use RegisterServices
func (am AppModule) Route() sdk.Route { return sdk.Route{} }

// Deprecated: use RegisterServices
func (AppModule) QuerierRoute() string { return types.RouterKey }

// Deprecated: use RegisterServices
func (am AppModule) LegacyQuerierHandler(_ *codec.LegacyAmino) sdk.Querier {
	return nil
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

	//err := am.keeper.QueryFairyringCurrentHeight(ctx)
	//if err != nil {
	//	am.keeper.Logger(ctx).Info("Beginblocker get height err", err)
	//	am.keeper.Logger(ctx).Info(err.Error())
	//	return
	//}

	// height := am.keeper.GetLatestHeight(ctx)
	//strHeight := am.keeper.GetLatestHeight(ctx)
	//height, err := strconv.ParseUint(strHeight, 10, 64)
	//
	//if err != nil {
	//	am.keeper.Logger(ctx).Info("Beginblocker error parse height")
	//	am.keeper.Logger(ctx).Info(err.Error())
	//	am.keeper.Logger(ctx).Info(strHeight)
	//	return
	//}

	// Use current chain block height for test & development
	height := uint64(ctx.BlockHeight())

	arr := am.keeper.GetEncryptedTxAllFromHeight(ctx, height)

	for _, eachTx := range arr.EncryptedTx {
		// TODO: What to do to all the txs in previous height ?

		// It returns a updated executedNonce, which can be used for verification later
		newExecutedNonce := am.keeper.IncreaseFairblockExecutedNonce(ctx, eachTx.Creator)

		am.keeper.RemoveEncryptedTx(ctx, eachTx.TargetHeight, eachTx.Index)

		// 1. Assume eachTx.Data already Decrypted with decryption key from fairyring

		creatorAddr, err := sdk.AccAddressFromBech32(eachTx.Creator)
		if err != nil {
			am.keeper.Logger(ctx).Error("Parse creator address error in BeginBlock")
			am.keeper.Logger(ctx).Error(err.Error())
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, err.Error()),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)
			return
		}

		am.keeper.Logger(ctx).Info("Got Creator Address: ")
		am.keeper.Logger(ctx).Info(creatorAddr.String())

		// Parse the decrypted raw json string to FairblockTx type first
		var toFairblockTx types.FairblockTx
		err = am.cdcJson.UnmarshalJSON([]byte(eachTx.Data), &toFairblockTx)

		if err != nil {
			am.keeper.Logger(ctx).Error("UnmarshalJson to FairblockTx Error in BeginBlock")
			am.keeper.Logger(ctx).Error(err.Error())
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Unable to unmarshal data to FairblockTx"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)
			return
		}

		// Validate the nonce, -1 because
		// the nonce is increased at the beginning of this block
		if toFairblockTx.Nonce != newExecutedNonce-1 {
			am.keeper.Logger(ctx).Error("Invalid Nonce Tx in BeginBlock")
			am.keeper.Logger(ctx).Error(err.Error())
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Invalid nonce"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)
			return
		}

		// Actual signature validating
		createAccount := am.accountKeeper.GetAccount(ctx, creatorAddr)
		//TODO: Update chain-id to get the actual chain id
		unsignedMsg := fmt.Sprintf(`{"sequence": %d, "chain-id": "%s", "data": "%s"}`, toFairblockTx.Nonce, "destination", toFairblockTx.Data)

		am.keeper.Logger(ctx).Info("Unsigned: ")
		am.keeper.Logger(ctx).Info(unsignedMsg)

		sigValid := createAccount.GetPubKey().VerifySignature(
			[]byte(unsignedMsg),
			[]byte(toFairblockTx.GetSigned()),
		)

		if !sigValid {
			am.keeper.Logger(ctx).Error("Invalid Signature in BeginBlock")
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Invalid signature"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)
			return
		}

		// Then parse the raw json unsigned tx to cosmos Tx type
		var toData tx.Tx
		err = am.cdcJson.UnmarshalJSON([]byte(toFairblockTx.Data), &toData)

		// Probably emit some log in unmarshal / marshal error
		if err != nil {
			// Tx probably invalid format
			am.keeper.Logger(ctx).Error("UnmarshalJson Error in BeginBlock")
			am.keeper.Logger(ctx).Error(err.Error())
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Invalid Tx format"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)
			return
		}

		// After parsing the data to a Tx type, try to find the keeper function of the data
		// TODO: Finds the keeper function from unsigned Tx data

		txByte, err := toData.Marshal()
		if err != nil {
			am.keeper.Logger(ctx).Error("Marshal Tx to []byte Error")
			am.keeper.Logger(ctx).Error(err.Error())
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Unable to marshal tx"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)
			return
		}

		resp := am.deliverTx(abci.RequestDeliverTx{
			Tx: txByte,
		})
		am.keeper.Logger(ctx).Info("TX Deliver Result in BeginBlock Result:")
		am.keeper.Logger(ctx).Info(resp.GetLog())

		/// For now, after removal, the encrypted tx will become an empty array
		/// Or Remove the entire tx array of current height
		/// instead removing it one by one ?

		// Emit event for tx execution
		ctx.EventManager().EmitEvent(
			sdk.NewEvent(types.EncryptedTxExecutedEventType,
				sdk.NewAttribute(types.EncryptedTxExecutedEventCreator, eachTx.Creator),
				sdk.NewAttribute(types.EncryptedTxExecutedEventHeight, strconv.FormatUint(eachTx.TargetHeight, 10)),
				sdk.NewAttribute(types.EncryptedTxExecutedEventData, eachTx.Data),
				sdk.NewAttribute(types.EncryptedTxExecutedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
			),
		)
	}
}

// EndBlock contains the logic that is automatically triggered at the end of each block
func (am AppModule) EndBlock(_ sdk.Context, _ abci.RequestEndBlock) []abci.ValidatorUpdate {
	return []abci.ValidatorUpdate{}
}
