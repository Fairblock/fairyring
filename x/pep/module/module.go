package pep

import (
	"bytes"
	"context"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"

	"cosmossdk.io/core/appmodule"
	cosmosmath "cosmossdk.io/math"
	txsigning "cosmossdk.io/x/tx/signing"
	enc "github.com/FairBlock/DistributedIBE/encryption"
	commontypes "github.com/Fairblock/fairyring/x/common/types"
	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/telemetry"
	"github.com/cosmos/cosmos-sdk/x/auth/ante"
	authsigning "github.com/cosmos/cosmos-sdk/x/auth/signing"
	porttypes "github.com/cosmos/ibc-go/v8/modules/core/05-port/types"
	"github.com/drand/kyber"
	bls "github.com/drand/kyber-bls12381"
	"google.golang.org/protobuf/types/known/anypb"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/spf13/cobra"

	// this line is used by starport scaffolding # 1

	"github.com/Fairblock/fairyring/x/pep/client/cli"
	"github.com/Fairblock/fairyring/x/pep/keeper"
	"github.com/Fairblock/fairyring/x/pep/types"
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

// ConsensusVersion defines the current x/pep module consensus version.
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

	msgServiceRouter *baseapp.MsgServiceRouter
	txConfig         client.TxConfig
	simCheck         func(txEncoder sdk.TxEncoder, tx sdk.Tx) (sdk.GasInfo, *sdk.Result, error)
}

func NewAppModule(
	cdc codec.Codec,
	keeper keeper.Keeper,
	accountKeeper types.AccountKeeper,
	bankKeeper types.BankKeeper,
	msgServiceRouter *baseapp.MsgServiceRouter,
	txConfig client.TxConfig,
	simCheck func(txEncoder sdk.TxEncoder, tx sdk.Tx) (sdk.GasInfo, *sdk.Result, error),
) AppModule {
	return AppModule{
		AppModuleBasic:   NewAppModuleBasic(cdc),
		keeper:           keeper,
		accountKeeper:    accountKeeper,
		bankKeeper:       bankKeeper,
		msgServiceRouter: msgServiceRouter,
		txConfig:         txConfig,
		simCheck:         simCheck,
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
	strLastExecutedHeight := am.keeper.GetLastExecutedHeight(ctx)
	lastExecutedHeight, err := strconv.ParseUint(strLastExecutedHeight, 10, 64)

	if err != nil {
		am.keeper.Logger().Error("Last executed height not exists")
		lastExecutedHeight = 0
	}

	strHeight := am.keeper.GetLatestHeight(ctx)
	height, err := strconv.ParseUint(strHeight, 10, 64)

	if err != nil {
		am.keeper.Logger().Error("Latest height does not exists")
		height = 0
	}

	am.keeper.Logger().Info(fmt.Sprintf("Last executed Height: %d", lastExecutedHeight))
	am.keeper.Logger().Info(fmt.Sprintf("Latest height from fairyring: %s", strHeight))

	activePubkey, found := am.keeper.GetActivePubKey(ctx)
	if !found {
		am.keeper.Logger().Error("Active public key does not exists")
		return nil
	}

	if len(activePubkey.Creator) == 0 && len(activePubkey.PublicKey) == 0 {
		am.keeper.Logger().Error("Active public key does not exists")
		return nil
	}

	suite := bls.NewBLS12381Suite()

	publicKeyPoint, err := am.keeper.GetPubKeyPoint(activePubkey.PublicKey, suite)
	if err != nil {
		am.keeper.Logger().Error("Unabe to get Pubkey Point with suite")
		return nil
	}

	// loop over all encrypted Txs from the last executed height to the current height
	for h := lastExecutedHeight + 1; h <= height; h++ {
		arr := am.keeper.GetEncryptedTxAllFromHeight(ctx, h)
		am.keeper.SetLastExecutedHeight(ctx, strconv.FormatUint(h, 10))

		key, found := am.keeper.GetAggregatedKeyShare(ctx, h)
		if !found {
			am.keeper.Logger().Error(fmt.Sprintf("Decryption key not found for block height: %d, Removing all the encrypted txs...", h))
			encryptedTxs := am.keeper.GetEncryptedTxAllFromHeight(ctx, h)
			if len(encryptedTxs.EncryptedTx) > 0 {
				am.keeper.SetAllEncryptedTxExpired(ctx, h)
				am.keeper.Logger().Info(fmt.Sprintf("Updated total %d encrypted txs at block %d to expired", len(encryptedTxs.EncryptedTx), h))
				indexes := make([]string, len(encryptedTxs.EncryptedTx))
				for _, v := range encryptedTxs.EncryptedTx {
					indexes = append(indexes, strconv.FormatUint(v.Index, 10))
				}
				ctx.EventManager().EmitEvent(
					sdk.NewEvent(types.EncryptedTxDiscardedEventType,
						sdk.NewAttribute(types.EncryptedTxDiscardedEventTxIDs, strings.Join(indexes, ",")),
						sdk.NewAttribute(types.EncryptedTxDiscardedEventHeight, strconv.FormatUint(h, 10)),
					),
				)
			} else {
				am.keeper.Logger().Info(fmt.Sprintf("No encrypted tx found at block %d", h))
			}
			continue
		}

		skPoint, err := am.keeper.GetSKPoint(key.Data, suite)
		if err != nil {
			continue
		}

		for _, eachTx := range arr.EncryptedTx {
			startConsumedGas := ctx.GasMeter().GasConsumed()
			am.keeper.SetEncryptedTxProcessedHeight(ctx, eachTx.TargetHeight, eachTx.Index, uint64(ctx.BlockHeight()))
			tx := convertEncTxToDecryptionTx(eachTx)
			err := am.decryptAndExecuteTx(ctx, tx, startConsumedGas, publicKeyPoint, skPoint)
			if err != nil {
				continue
			}
			telemetry.IncrCounter(1, types.KeyTotalSuccessEncryptedTx)
		}
	}

	// loop over all entries in the general enc tx queue
	entries := am.keeper.GetAllGenEncTxExecutionQueueEntry(ctx)
	for _, entry := range entries {
		if entry.AggrKeyshare == "" {
			am.keeper.Logger().Error("aggregated keyshare not found in entry with req-id: ", entry.RequestId)
			am.keeper.RemoveExecutionQueueEntry(ctx, entry.Identity)
			continue
		}

		// execute registered contracts
		contracts, found := am.keeper.GetContractEntriesByID(ctx, entry.Identity)
		if found && len(contracts.Contracts) != 0 {
			for _, contract := range contracts.Contracts {
				am.keeper.ExecuteContract(
					ctx,
					contract.ContractAddress,
					types.ExecuteContractMsg{
						Identity:     entry.Identity,
						Pubkey:       entry.Pubkey,
						AggrKeyshare: entry.AggrKeyshare,
					},
				)
			}
		}

		if found {
			am.keeper.RemoveContractEntry(ctx, entry.Identity)
		}

		if entry.TxList == nil {
			am.keeper.Logger().Info("No encrypted txs found for entry with req-id: ", entry.RequestId)
			am.keeper.RemoveExecutionQueueEntry(ctx, entry.Identity)
			continue
		}

		skPoint, err := am.keeper.GetSKPoint(entry.AggrKeyshare, suite)
		if err != nil {
			continue
		}

		// loop over all txs in the entry
		for _, eachTx := range entry.TxList.EncryptedTx {
			startConsumedGas := ctx.GasMeter().GasConsumed()

			tx := convertGenEncTxToDecryptionTx(eachTx)
			err := am.decryptAndExecuteTx(ctx, tx, startConsumedGas, publicKeyPoint, skPoint)
			if err != nil {
				continue
			}

			telemetry.IncrCounter(1, types.KeyTotalSuccessEncryptedTx)
		}

		am.keeper.Logger().Info("executed txs for entry with req-id: ", entry.RequestId)
		am.keeper.RemoveExecutionQueueEntry(ctx, entry.RequestId)
	}
	return nil
}

// EndBlock contains the logic that is automatically triggered at the end of each block.
// The end block implementation is optional.
func (am AppModule) EndBlock(cctx context.Context) error {
	ctx := sdk.UnwrapSDKContext(cctx)
	params := am.keeper.GetParams(ctx)
	if !params.IsSourceChain {
		err := am.keeper.QueryFairyringCurrentKeys(ctx)
		if err != nil {
			am.keeper.Logger().Error("Endblocker get keys err", err)
			am.keeper.Logger().Error(err.Error())
		}
	}
	strHeight := am.keeper.GetLatestHeight(ctx)
	height, err := strconv.ParseUint(strHeight, 10, 64)
	if err != nil {
		am.keeper.Logger().Error("Latest height does not exists in EndBlock")
		return nil
	}

	ak, found := am.keeper.GetActivePubKey(ctx)
	if found {
		if ak.Expiry <= height {
			am.keeper.DeleteActivePubKey(ctx)
		} else {
			return nil
		}
	}

	qk, found := am.keeper.GetQueuedPubKey(ctx)
	if found {
		if qk.Expiry > height {
			newActiveKey := commontypes.ActivePublicKey(qk)

			am.keeper.SetActivePubKey(ctx, newActiveKey)
		}
		am.keeper.DeleteQueuedPubKey(ctx)
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
//	AccountKeeper types.AccountKeeper
//	BankKeeper    types.BankKeeper
//
//	IBCKeeperFn        func() *ibckeeper.Keeper                   `optional:"true"`
//	CapabilityScopedFn func(string) capabilitykeeper.ScopedKeeper `optional:"true"`
//
//	MsgServiceRouter *baseapp.MsgServiceRouter
//	TxConfig         client.TxConfig
//	// imCheck         func(txEncoder sdk.TxEncoder, tx sdk.Tx) (sdk.GasInfo, *sdk.Result, error)
//}
//
//type ModuleOutputs struct {
//	depinject.Out
//
//	PepKeeper keeper.Keeper
//	Module    appmodule.AppModule
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
//	)
//	m := NewAppModule(
//		in.Cdc,
//		k,
//		in.AccountKeeper,
//		in.BankKeeper,
//		in.MsgServiceRouter,
//		in.TxConfig,
//		// in.simCheck,
//	)
//
//	return ModuleOutputs{PepKeeper: k, Module: m}
//}

// --------------------------------------------------------------
//	Functions for decrypting, parsing and handling encrypted tx
// --------------------------------------------------------------

type DecryptionTx struct {
	Identity               string
	Index                  uint64
	Data                   string
	Creator                string
	ChargedGas             *sdk.Coin
	ProcessedAtChainHeight uint64
	Expired                bool
}

func convertEncTxToDecryptionTx(tx types.EncryptedTx) DecryptionTx {
	dtx := DecryptionTx{
		Identity:               strconv.FormatUint(tx.TargetHeight, 10),
		Index:                  tx.Index,
		Data:                   tx.Data,
		Creator:                tx.Creator,
		ChargedGas:             tx.ChargedGas,
		ProcessedAtChainHeight: tx.ProcessedAtChainHeight,
		Expired:                tx.Expired,
	}
	return dtx
}

func convertGenEncTxToDecryptionTx(tx types.GeneralEncryptedTx) DecryptionTx {
	dtx := DecryptionTx{
		Identity:   tx.Identity,
		Index:      tx.Index,
		Data:       tx.Data,
		Creator:    tx.Creator,
		ChargedGas: tx.ChargedGas,
	}
	return dtx
}

func (am AppModule) handleGasConsumption(ctx sdk.Context, recipient sdk.AccAddress, gasUsed cosmosmath.Int, gasCharged *sdk.Coin) {
	creatorAccount := am.accountKeeper.GetAccount(ctx, recipient)

	if gasCharged == nil {
		gasCharged = &sdk.Coin{}
	}

	if gasUsed.GT(gasCharged.Amount) {
		deductFeeErr := ante.DeductFees(
			am.bankKeeper,
			ctx,
			creatorAccount,
			sdk.NewCoins(
				sdk.NewCoin(
					gasCharged.Denom,
					gasUsed.Sub(gasCharged.Amount)),
			),
		)
		if deductFeeErr != nil {
			am.keeper.Logger().Error("deduct failed tx fee error")
			am.keeper.Logger().Error(deductFeeErr.Error())
		} else {
			am.keeper.Logger().Info("failed tx fee deducted without error")
		}
	} else {
		amount := gasCharged.Amount.Sub(gasUsed)
		if amount.IsZero() {
			am.keeper.Logger().Info("refund failed tx fee amount is zero, no need to refund...")
			return
		}
		refundFeeErr := am.bankKeeper.SendCoinsFromModuleToAccount(
			ctx,
			types.ModuleName,
			recipient,
			sdk.NewCoins(sdk.NewCoin(gasCharged.Denom, amount)),
		)
		if refundFeeErr != nil {
			am.keeper.Logger().Error("refund failed tx fee error")
			am.keeper.Logger().Error(refundFeeErr.Error())
		} else {
			am.keeper.Logger().Info("failed tx fee refunded without error")
		}
	}
}

type UnderlyingTxEvent struct {
	Type       string           `json:"type"`
	Attributes []EventAttribute `json:"attributes"`
}

type EventAttribute struct {
	Key   string `json:"key"`
	Value string `json:"value"`
	Index bool   `json:"index"`
}

func (am AppModule) processFailedEncryptedTx(
	ctx sdk.Context,
	tx DecryptionTx,
	failReason string,
	startConsumedGas uint64,
) {
	am.keeper.Logger().Error(fmt.Sprintf("failed to process encrypted tx: %s", failReason))
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.EncryptedTxRevertedEventType,
			sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, tx.Creator),
			sdk.NewAttribute(types.EncryptedTxRevertedEventIdentity, tx.Identity),
			sdk.NewAttribute(types.EncryptedTxRevertedEventReason, failReason),
			sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(tx.Index, 10)),
		),
	)

	creatorAddr, err := sdk.AccAddressFromBech32(tx.Creator)
	if err != nil {
		am.keeper.Logger().Error("error while trying to parse tx creator address when processing failed encrypted tx")
		am.keeper.Logger().Error(err.Error())
		return
	}

	var actualGasConsumed uint64 = 0
	if ctx.GasMeter().GasConsumed() > startConsumedGas {
		actualGasConsumed = ctx.GasMeter().GasConsumed() - startConsumedGas
	}
	defer telemetry.IncrCounter(1, types.KeyTotalFailedEncryptedTx)
	am.handleGasConsumption(ctx, creatorAddr, cosmosmath.NewIntFromUint64(actualGasConsumed), tx.ChargedGas)
}

func (am AppModule) decryptAndExecuteTx(
	ctx sdk.Context,
	eachTx DecryptionTx,
	startConsumedGas uint64,
	publicKeyPoint kyber.Point,
	skPoint kyber.Point,
) error {
	if currentNonce, found := am.keeper.GetPepNonce(ctx, eachTx.Creator); found && currentNonce.Nonce == math.MaxUint64 {
		am.processFailedEncryptedTx(ctx, eachTx, "invalid pep nonce", startConsumedGas)
		return errors.New("invalid pep nonce")
	}

	newExecutedNonce := am.keeper.IncreasePepNonce(ctx, eachTx.Creator)

	creatorAddr, err := sdk.AccAddressFromBech32(eachTx.Creator)
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error parsing creator address: %s", err.Error()), startConsumedGas)
		return err
	}

	creatorAccount := am.accountKeeper.GetAccount(ctx, creatorAddr)

	txBytes, err := hex.DecodeString(eachTx.Data)
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error decoding tx data to bytes: %s", err.Error()), startConsumedGas)
		return err
	}

	var decryptedTx bytes.Buffer
	var txBuffer bytes.Buffer
	_, err = txBuffer.Write(txBytes)
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error while writing bytes to tx buffer: %s", err.Error()), startConsumedGas)
		return err
	}

	err = enc.Decrypt(publicKeyPoint, skPoint, &decryptedTx, &txBuffer)
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error decrypting tx data: %s", err.Error()), startConsumedGas)
		return err
	}

	am.keeper.Logger().Info(fmt.Sprintf("Decrypt TX Successfully: %s", decryptedTx.String()))

	txDecoderTx, err := am.txConfig.TxDecoder()(decryptedTx.Bytes())

	if err != nil {
		am.keeper.Logger().Error("Decoding Tx error in BeginBlock... Trying JSON Decoder")
		am.keeper.Logger().Error(err.Error())

		txDecoderTx, err = am.txConfig.TxJSONDecoder()(decryptedTx.Bytes())
		if err != nil {
			am.keeper.Logger().Error("JSON Decoding Tx error in BeginBlock")
			am.keeper.Logger().Error(err.Error())
			ctx.EventManager().EmitEvent(
				sdk.NewEvent(types.EncryptedTxRevertedEventType,
					sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, eachTx.Creator),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIdentity, eachTx.Identity),
					sdk.NewAttribute(types.EncryptedTxRevertedEventReason, "Unable to decode tx data to Cosmos Tx"),
					sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
				),
			)

			am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error trying to json decoding tx: %s", err.Error()), startConsumedGas)
			return err
		} else {
			am.keeper.Logger().Error("TX Successfully Decode with JSON Decoder")
		}
	}

	wrappedTx, err := am.txConfig.WrapTxBuilder(txDecoderTx)
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error when trying to wrap decoded tx to tx builder: %s", err.Error()), startConsumedGas)
		return err
	}

	sigs, err := wrappedTx.GetTx().GetSignaturesV2()
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error getting decoded tx signatures: %s", err.Error()), startConsumedGas)
		return err
	}

	if len(sigs) != 1 {
		am.processFailedEncryptedTx(ctx, eachTx, "number of provided signatures is more than one", startConsumedGas)
		return err
	}

	signers, err := wrappedTx.GetTx().GetSigners()
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, "not able to get signature signers", startConsumedGas)
		return err
	}

	if len(sigs) != len(signers) {
		am.processFailedEncryptedTx(ctx, eachTx, "number of signature not equals to number of signers", startConsumedGas)
		return err
	}

	txMsgs := wrappedTx.GetTx().GetMsgs()

	if len(sigs) != len(txMsgs) {
		am.processFailedEncryptedTx(ctx, eachTx, "number of provided signatures is not equals to number of tx messages", startConsumedGas)
		return err
	}

	if !sigs[0].PubKey.Equals(creatorAccount.GetPubKey()) {
		am.processFailedEncryptedTx(ctx, eachTx, "tx signer is not tx sender", startConsumedGas)
		return err
	}

	expectingNonce := newExecutedNonce - 1

	if sigs[0].Sequence < expectingNonce {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("Incorrect Nonce sequence, Provided: %d, Expecting: %d", sigs[0].Sequence, expectingNonce), startConsumedGas)
		return err
	}

	if sigs[0].Sequence > expectingNonce {
		am.keeper.SetPepNonce(ctx, types.PepNonce{
			Address: eachTx.Creator,
			Nonce:   sigs[0].Sequence,
		})
	}

	verifiableTx, ok := wrappedTx.GetTx().(authsigning.V2AdaptableTx)
	if !ok {
		am.processFailedEncryptedTx(ctx, eachTx, "Unable to parse tx to V2AdaptableTx", startConsumedGas)
		return err
	}

	anyPk, err := cdctypes.NewAnyWithValue(sigs[0].PubKey)
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, "Unable to parse signature public key to anypb.Any", startConsumedGas)
		return err
	}

	signingData := txsigning.SignerData{
		Address:       creatorAddr.String(),
		ChainID:       ctx.ChainID(),
		AccountNumber: creatorAccount.GetAccountNumber(),
		Sequence:      sigs[0].Sequence,
		PubKey: &anypb.Any{
			TypeUrl: anyPk.TypeUrl,
			Value:   anyPk.Value,
		},
	}

	err = authsigning.VerifySignature(
		ctx,
		creatorAccount.GetPubKey(),
		signingData,
		sigs[0].Data,
		am.txConfig.SignModeHandler(),
		verifiableTx.GetSigningTxData(),
	)

	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error when verifying signature: invalid signature: %s", err.Error()), startConsumedGas)
		return err
	}

	decryptionConsumed := ctx.GasMeter().GasConsumed() - startConsumedGas
	simCheckGas, _, err := am.simCheck(am.txConfig.TxEncoder(), txDecoderTx)
	// We are using SimCheck() to only estimate gas for the underlying transaction
	// Since user is supposed to sign the underlying transaction with Pep Nonce,
	// is expected that we gets 'account sequence mismatch' error
	// however, the underlying tx is not expected to get other errors
	// such as insufficient fee, out of gas etc...
	if err != nil && !strings.Contains(err.Error(), "account sequence mismatch") {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error while performing check tx: %s", err.Error()), startConsumedGas)
		return err
	}

	txFee := wrappedTx.GetTx().GetFee()

	// If it passes the CheckTx but Tx Fee is empty,
	// that means the minimum-gas-prices for the validator is 0
	// therefore, we are not charging for the tx execution
	if !txFee.Empty() {
		gasProvided := cosmosmath.NewIntFromUint64(wrappedTx.GetTx().GetGas())
		// Underlying tx consumed gas + gas consumed on decrypting & decoding tx
		am.keeper.Logger().Info(fmt.Sprintf("Underlying tx consumed: %d, decryption consumed: %d", simCheckGas.GasUsed, decryptionConsumed))
		gasUsedInBig := cosmosmath.NewIntFromUint64(simCheckGas.GasUsed).Add(cosmosmath.NewIntFromUint64(decryptionConsumed))
		newCoins := make([]sdk.Coin, len(txFee))
		refundDenom := txFee[0].Denom
		refundAmount := cosmosmath.NewIntFromUint64(0)

		usedGasFee := sdk.NewCoin(
			txFee[0].Denom,
			// Tx Fee Amount Divide Provide Gas => provided gas price
			// Provided Gas Price * Gas Used => Amount to deduct as gas fee
			txFee[0].Amount.Quo(gasProvided).Mul(gasUsedInBig),
		)

		if eachTx.ChargedGas == nil {
			eachTx.ChargedGas = &sdk.Coin{}
		}

		if usedGasFee.Denom != eachTx.ChargedGas.Denom {
			am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("underlying tx gas denom does not match charged gas denom, got: %s, expect: %s", usedGasFee.Denom, eachTx.ChargedGas.Denom), startConsumedGas)
			return errors.New("underlying tx gas denom does not match charged gas denom")
		}

		if usedGasFee.Amount.GT(eachTx.ChargedGas.Amount) {
			usedGasFee.Amount = usedGasFee.Amount.Sub(eachTx.ChargedGas.Amount)
		} else { // less than or equals to
			refundAmount = eachTx.ChargedGas.Amount.Sub(usedGasFee.Amount)
			usedGasFee.Amount = cosmosmath.NewIntFromUint64(0)
		}

		am.keeper.Logger().Info(fmt.Sprintf("Deduct fee amount: %v | Refund amount: %v", newCoins, refundAmount))

		if refundAmount.IsZero() {
			deductFeeErr := ante.DeductFees(am.bankKeeper, ctx, creatorAccount, sdk.NewCoins(usedGasFee))
			if deductFeeErr != nil {
				am.keeper.Logger().Error("Deduct fee Err")
				am.keeper.Logger().Error(deductFeeErr.Error())
			} else {
				am.keeper.Logger().Info("Fee deducted without error")
			}
		} else {
			refundFeeErr := am.bankKeeper.SendCoinsFromModuleToAccount(
				ctx,
				types.ModuleName,
				creatorAddr,
				sdk.NewCoins(sdk.NewCoin(refundDenom, refundAmount)),
			)
			if refundFeeErr != nil {
				am.keeper.Logger().Error("Refund fee Err")
				am.keeper.Logger().Error(refundFeeErr.Error())
			} else {
				am.keeper.Logger().Info("Fee refunded without error")
			}
		}
	}

	handler := am.msgServiceRouter.Handler(txMsgs[0])
	handlerResult, err := handler(ctx, txMsgs[0])
	if err != nil {
		am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error when handling tx message: %s", err.Error()), startConsumedGas)
		return err
	}

	underlyingTxEvents := make([]UnderlyingTxEvent, 0)

	for _, e := range handlerResult.Events {
		eventAttributes := make([]EventAttribute, 0)
		for _, ea := range e.Attributes {
			eventAttributes = append(eventAttributes, EventAttribute{
				Key:   ea.Key,
				Value: ea.Value,
				Index: ea.Index,
			})
		}
		underlyingTxEvents = append(underlyingTxEvents, UnderlyingTxEvent{
			Type:       e.Type,
			Attributes: eventAttributes,
		})
	}

	eventStrArrJson, _ := json.Marshal(underlyingTxEvents)

	am.keeper.Logger().Info("! Encrypted Tx Decrypted & Decoded & Executed successfully !")

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.EncryptedTxExecutedEventType,
			sdk.NewAttribute(types.EncryptedTxExecutedEventCreator, eachTx.Creator),
			sdk.NewAttribute(types.EncryptedTxExecutedEventIdentity, eachTx.Identity),
			sdk.NewAttribute(types.EncryptedTxExecutedEventData, eachTx.Data),
			sdk.NewAttribute(types.EncryptedTxExecutedEventIndex, strconv.FormatUint(eachTx.Index, 10)),
			sdk.NewAttribute(types.EncryptedTxExecutedEventMemo, wrappedTx.GetTx().GetMemo()),
			sdk.NewAttribute(types.EncryptedTxExecutedEventUnderlyingEvents, string(eventStrArrJson)),
		),
	)
	return nil
}
