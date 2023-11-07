package conditionalenc

import (
	"bytes"
	"context"
	"encoding/hex"
	"encoding/json"
	"fmt"
	//"time"

	//"strings"
	_ "time"

	//	"time"

	//"time"

	cosmosmath "cosmossdk.io/math"

	"math"
	math_bits "math/bits"
	"strconv"

	enc "github.com/FairBlock/DistributedIBE/encryption"
	//types1 "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	"github.com/sirupsen/logrus"

	//"strings"

	"github.com/cosmos/cosmos-sdk/baseapp"
	"github.com/cosmos/cosmos-sdk/x/auth/ante"

	//	authsigning "github.com/cosmos/cosmos-sdk/x/auth/signing"
	bls "github.com/drand/kyber-bls12381"

	// this line is used by starport scaffolding # 1

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/spf13/cobra"

	abci "github.com/cometbft/cometbft/abci/types"

	//"fairyring/testutil/nullify"
	"fairyring/x/conditionalenc/client/cli"
	"fairyring/x/conditionalenc/keeper"
	"fairyring/x/conditionalenc/types"
	pricefeedtypes "fairyring/x/pricefeed/keeper"

	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/codec"
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	transfertypes "github.com/cosmos/ibc-go/v7/modules/apps/transfer/types"
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

	keeper           keeper.Keeper
	accountKeeper    types.AccountKeeper
	bankKeeper       types.BankKeeper
	pricefeedKeeper  types.PricefeedKeeper
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
	pk pricefeedtypes.Keeper,
	simCheck func(txEncoder sdk.TxEncoder, tx sdk.Tx) (sdk.GasInfo, *sdk.Result, error),
) AppModule {
	return AppModule{
		AppModuleBasic:   AppModuleBasic{cdc: cdc, cdcJson: cdc},
		keeper:           keeper,
		accountKeeper:    accountKeeper,
		bankKeeper:       bankKeeper,
		msgServiceRouter: msgServiceRouter,
		txConfig:         txConfig,
		simCheck:         simCheck,
		pricefeedKeeper:  pk,
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

func (am AppModule) handleGasConsumption(ctx sdk.Context, recipient sdk.AccAddress, gasUsed cosmosmath.Int, gasCharged *sdk.Coin) {
	creatorAccount := am.accountKeeper.GetAccount(ctx, recipient)

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
			am.keeper.Logger(ctx).Error("deduct failed tx fee error")
			am.keeper.Logger(ctx).Error(deductFeeErr.Error())
		} else {
			am.keeper.Logger(ctx).Info("failed tx fee deducted without error")
		}
	} else {
		amount := gasCharged.Amount.Sub(gasUsed)
		if amount.IsZero() {
			am.keeper.Logger(ctx).Info("refund failed tx fee amount is zero, no need to refund...")
			return
		}
		refundFeeErr := am.bankKeeper.SendCoinsFromModuleToAccount(
			ctx,
			types.ModuleName,
			recipient,
			sdk.NewCoins(sdk.NewCoin(gasCharged.Denom, amount)),
		)
		if refundFeeErr != nil {
			am.keeper.Logger(ctx).Error("refund failed tx fee error")
			am.keeper.Logger(ctx).Error(refundFeeErr.Error())
		} else {
			am.keeper.Logger(ctx).Info("failed tx fee refunded without error")
		}
	}
}

func (am AppModule) processFailedEncryptedTx(ctx sdk.Context, tx types.EncryptedTx, failReason string, startConsumedGas uint64) {
	am.keeper.Logger(ctx).Error(fmt.Sprintf("failed to process encrypted tx: %s", failReason))
	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.EncryptedTxRevertedEventType,
			sdk.NewAttribute(types.EncryptedTxRevertedEventCreator, tx.Creator),
			sdk.NewAttribute(types.EncryptedTxRevertedEventCondition, tx.TargetCondition),
			sdk.NewAttribute(types.EncryptedTxRevertedEventReason, failReason),
			sdk.NewAttribute(types.EncryptedTxRevertedEventIndex, strconv.FormatUint(tx.Index, 10)),
		),
	)

	creatorAddr, err := sdk.AccAddressFromBech32(tx.Creator)
	if err != nil {
		am.keeper.Logger(ctx).Error("error while trying to parse tx creator address when processing failed encrypted tx")
		am.keeper.Logger(ctx).Error(err.Error())
		return
	}

	var actualGasConsumed uint64 = 0
	if ctx.GasMeter().GasConsumed() > startConsumedGas {
		actualGasConsumed = ctx.GasMeter().GasConsumed() - startConsumedGas
	}

	am.handleGasConsumption(ctx, creatorAddr, cosmosmath.NewIntFromUint64(actualGasConsumed), tx.ChargedGas)
}
type FungibleTokenPacketData struct {
	// the token denomination to be transferred
	Denom string `protobuf:"bytes,1,opt,name=denom,proto3" json:"denom,omitempty"`
	// the token amount to be transferred
	Amount string `protobuf:"bytes,2,opt,name=amount,proto3" json:"amount,omitempty"`
	// the sender address
	Sender string `protobuf:"bytes,3,opt,name=sender,proto3" json:"sender,omitempty"`
	// the recipient address on the destination chain
	Receiver string `protobuf:"bytes,4,opt,name=receiver,proto3" json:"receiver,omitempty"`
	// optional memo
	Memo string `protobuf:"bytes,5,opt,name=memo,proto3" json:"memo,omitempty"`
}
func (m *FungibleTokenPacketData) Marshal() (dAtA []byte, err error) {
	size := m.Size()
	dAtA = make([]byte, size)
	n, err := m.MarshalToSizedBuffer(dAtA[:size])
	if err != nil {
		return nil, err
	}
	return dAtA[:n], nil
}
func (m *FungibleTokenPacketData) Size() (n int) {
	if m == nil {
		return 0
	}
	var l int
	_ = l
	l = len(m.Denom)
	if l > 0 {
		n += 1 + l + sovPacket(uint64(l))
	}
	l = len(m.Amount)
	if l > 0 {
		n += 1 + l + sovPacket(uint64(l))
	}
	l = len(m.Sender)
	if l > 0 {
		n += 1 + l + sovPacket(uint64(l))
	}
	l = len(m.Receiver)
	if l > 0 {
		n += 1 + l + sovPacket(uint64(l))
	}
	l = len(m.Memo)
	if l > 0 {
		n += 1 + l + sovPacket(uint64(l))
	}
	return n
}

func encodeVarintPacket(dAtA []byte, offset int, v uint64) int {
	offset -= sovPacket(v)
	base := offset
	for v >= 1<<7 {
		dAtA[offset] = uint8(v&0x7f | 0x80)
		v >>= 7
		offset++
	}
	dAtA[offset] = uint8(v)
	return base
}
func sovPacket(x uint64) (n int) {
	return (math_bits.Len64(x|1) + 6) / 7
}
func (m *FungibleTokenPacketData) MarshalToSizedBuffer(dAtA []byte) (int, error) {
	i := len(dAtA)
	_ = i
	var l int
	_ = l
	if len(m.Memo) > 0 {
		i -= len(m.Memo)
		copy(dAtA[i:], m.Memo)
		i = encodeVarintPacket(dAtA, i, uint64(len(m.Memo)))
		i--
		dAtA[i] = 0x2a
	}
	if len(m.Receiver) > 0 {
		i -= len(m.Receiver)
		copy(dAtA[i:], m.Receiver)
		i = encodeVarintPacket(dAtA, i, uint64(len(m.Receiver)))
		i--
		dAtA[i] = 0x22
	}
	if len(m.Sender) > 0 {
		i -= len(m.Sender)
		copy(dAtA[i:], m.Sender)
		i = encodeVarintPacket(dAtA, i, uint64(len(m.Sender)))
		i--
		dAtA[i] = 0x1a
	}
	if len(m.Amount) > 0 {
		i -= len(m.Amount)
		copy(dAtA[i:], m.Amount)
		i = encodeVarintPacket(dAtA, i, uint64(len(m.Amount)))
		i--
		dAtA[i] = 0x12
	}
	if len(m.Denom) > 0 {
		i -= len(m.Denom)
		copy(dAtA[i:], m.Denom)
		i = encodeVarintPacket(dAtA, i, uint64(len(m.Denom)))
		i--
		dAtA[i] = 0xa
	}
	return len(dAtA) - i, nil
}
type CosmWasmPacketData struct {
	ContractAddress string           `json:"contract_address"`
	Msg             json.RawMessage  `json:"msg"`
}
// BeginBlock contains the logic that is automatically triggered at the beginning of each block
func (am AppModule) BeginBlock(ctx sdk.Context, b abci.RequestBeginBlock) {
// 	if (b.Header.Height % 50) == 0 {
// params := am.keeper.GetParams(ctx)
// //	logrus.Info(params)
//  msgData := `{"wasm": {"contract": "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9", "msg": {"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"1","token_out_denom":"uosmo"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-0"}},"local_fallback_address":"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj"}}}}`
//  _ = msgData
// // msgData := `{"wasm": {"contract": "osmo1zl9ztmwe2wcdvv9std8xn06mdaqaqm789rutmazfh3z869zcax4sv0ctqw", "msg": {"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"47","token_out_denom":"uosmo"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-0"}},"local_fallback_address":"osmo1pw5aj2u5thkgumkpdms0x78y97e6ppfl6vmjpd"}}}}`
// // params := am.keeper.GetParams(ctx)
// cosmWasmPacketData := FungibleTokenPacketData{
// 	Denom: "frt",
// 	Amount: "130",
// 	Sender: "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c",
// 	Receiver: "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9",
// 	Memo: msgData,
// }
// cosmWasmPacketData := FungibleTokenPacketData{
// 	Denom: "frt",
// 	Amount: "130",
// 	Sender: "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c",
// 	Receiver: "osmo1zl9ztmwe2wcdvv9std8xn06mdaqaqm789rutmazfh3z869zcax4sv0ctqw",
// 	Memo: msgData,
// }
// // // test := CosmWasmPacketData{
// // // 	ContractAddress: "osmo1zl9ztmwe2wcdvv9std8xn06mdaqaqm789rutmazfh3z869zcax4sv0ctqw",
// // // 	Msg:             nil,
// // // }
// // // testMsg,_ := json.Marshal(test) 
//  serializedCosmWasmPacketData, _ := json.Marshal(cosmWasmPacketData)
//   logrus.Info("sending packet1.....................................................................................................................", serializedCosmWasmPacketData)
// 	err := am.keeper.SendSwapTx(ctx,params.ChannelId,serializedCosmWasmPacketData)
// 	if err != nil {
// 		am.keeper.Logger(ctx).Error("Relaying Swap Tx error")
// 		am.keeper.Logger(ctx).Error(err.Error())
// 	}
	// if (b.Header.Height % 10) == 0 {
		
	// 	// params := am.keeper.GetParams(ctx)
		// coin := am.keeper.MinGasPrice(ctx)
		// coin.Amount = sdk.NewIntFromUint64(500)

	// // s := `{"source_port": "transfer","source_channel": "channel-1","token":{"denom": "frt","amount": "500"},"sender": "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","receiver": "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9","timeout_height":{"revision_number": "10000000000","revision_height": "100000000000"},"timeout_timestamp": "1699052860444761679","memo": '{"wasm": {"contract": "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9", "msg": {"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"1","token_out_denom":"uosmo"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-0"}},"local_fallback_address":"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj"}}}}'}`
	// // var data *transfertypes.MsgTransfer
	// // 		err := data.Unmarshal([]byte(s))
	// // 		if err != nil {
	// // 			am.keeper.Logger(ctx).Error(err.Error())
	// // 		}
	// cosmWasmPacketData := transfertypes.MsgTransfer{
	// 	SourcePort: "transfer",
	// 	SourceChannel: "channel-1",
	// 	Token: coin,
		
		
	// 	Sender: "fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c",
	// 	Receiver: "osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9",
	// 	TimeoutTimestamp: uint64(ctx.BlockTime().UnixNano()+int64(20*time.Minute)),
	// 	TimeoutHeight: types1.NewHeight(10000000000,100000000000),
	// 	Memo: `{"wasm":{"contract":"osmo14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sq2r9g9", "msg":{"swap_with_action":{"swap_msg":{"token_out_min_amount":"10","path":[{"pool_id":"1","token_out_denom":"uosmo"}]},"after_swap_action":{"ibc_transfer":{"receiver":"fairy1p6ca57cu5u89qzf58krxgxaezp4wm9vu7lur3c","channel":"channel-0"}},"local_fallback_address":"osmo12smx2wdlyttvyzvzg54y2vnqwq2qjateuf7thj"}}}}`,
	
	
	// }
	// ser,_ := cosmWasmPacketData.Marshal()

	//  logrus.Info("------------------> new4 ", ser)
	// numberString := `[10 8 116 114 97 110 115 102 101 114 18 9 99 104 97 110 110 101 108 45 49 26 10 10 3 102 114 116 18 3 53 48 48 34 44 102 97 105 114 121 49 112 54 99 97 53 55 99 117 53 117 56 57 113 122 102 53 56 107 114 120 103 120 97 101 122 112 52 119 109 57 118 117 55 108 117 114 51 99 42 63 111 115 109 111 49 52 104 106 50 116 97 118 113 56 102 112 101 115 100 119 120 120 99 117 52 52 114 116 121 51 104 104 57 48 118 104 117 106 114 118 99 109 115 116 108 52 122 114 51 116 120 109 102 118 119 57 115 113 50 114 57 103 57 50 13 8 128 200 175 160 37 16 128 208 219 195 244 2 56 137 208 166 179 227 140 148 202 23 66 143 3 123 34 119 97 115 109 34 58 123 34 99 111 110 116 114 97 99 116 34 58 34 111 115 109 111 49 52 104 106 50 116 97 118 113 56 102 112 101 115 100 119 120 120 99 117 52 52 114 116 121 51 104 104 57 48 118 104 117 106 114 118 99 109 115 116 108 52 122 114 51 116 120 109 102 118 119 57 115 113 50 114 57 103 57 34 44 32 34 109 115 103 34 58 123 34 115 119 97 112 95 119 105 116 104 95 97 99 116 105 111 110 34 58 123 34 115 119 97 112 95 109 115 103 34 58 123 34 116 111 107 101 110 95 111 117 116 95 109 105 110 95 97 109 111 117 110 116 34 58 34 49 48 34 44 34 112 97 116 104 34 58 91 123 34 112 111 111 108 95 105 100 34 58 34 49 34 44 34 116 111 107 101 110 95 111 117 116 95 100 101 110 111 109 34 58 34 117 111 115 109 111 34 125 93 125 44 34 97 102 116 101 114 95 115 119 97 112 95 97 99 116 105 111 110 34 58 123 34 105 98 99 95 116 114 97 110 115 102 101 114 34 58 123 34 114 101 99 101 105 118 101 114 34 58 34 102 97 105 114 121 49 112 54 99 97 53 55 99 117 53 117 56 57 113 122 102 53 56 107 114 120 103 120 97 101 122 112 52 119 109 57 118 117 55 108 117 114 51 99 34 44 34 99 104 97 110 110 101 108 34 58 34 99 104 97 110 110 101 108 45 48 34 125 125 44 34 108 111 99 97 108 95 102 97 108 108 98 97 99 107 95 97 100 100 114 101 115 115 34 58 34 111 115 109 111 49 50 115 109 120 50 119 100 108 121 116 116 118 121 122 118 122 103 53 52 121 50 118 110 113 119 113 50 113 106 97 116 101 117 102 55 116 104 106 34 125 125 125 125]`
	// // logrus.Info("------------------> new ",ser2)
	// numberString = strings.Trim(numberString, "[]") // Remove the square brackets
	// numberStrings := strings.Fields(numberString)   // Split the string by space into a slice of strings

	// // Convert the slice of strings to a slice of bytes
	// byteSlice := make([]byte, len(numberStrings))
	// for i, s := range numberStrings {
	// 	n, err := strconv.Atoi(s)
	// 	if err != nil {
	// 		panic(err)
	// 	}
	// 	byteSlice[i] = byte(n)
	// }
	// _ = data.Unmarshal(byteSlice)
	//logrus.Info("------------------> new2 ",err)
	// test := CosmWasmPacketData{
	// 	ContractAddress: "osmo1zl9ztmwe2wcdvv9std8xn06mdaqaqm789rutmazfh3z869zcax4sv0ctqw",
	// 	Msg:             nil,
	// }
	// testMsg,_ := json.Marshal(test) 
	// serializedCosmWasmPacketData, _ := json.Marshal(cosmWasmPacketData)
	// logrus.Info("sending packet.....................................................................................................................", string(serializedCosmWasmPacketData))
	// _, err := am.keeper.TransferKeeper.Transfer(ctx,&cosmWasmPacketData)
	// // err := am.keeper.SendSwapTx(ctx,params.ChannelId,serializedCosmWasmPacketData)
	// 	if err != nil {
	// 		am.keeper.Logger(ctx).Error("Relaying Swap Tx error")
	// 		am.keeper.Logger(ctx).Error(err.Error())
	// 	}}
	waitingList := am.pricefeedKeeper.GetList(ctx)
	
	
	logrus.Info("=======================> ", waitingList)
	allAggKey := am.keeper.GetAllAggregatedConditionalKeyShare(ctx)

	am.keeper.Logger(ctx).Info(fmt.Sprintf("[Conditionalenc][AGGKEY] %v", allAggKey))

	activePubkey, found := am.keeper.GetActivePubKey(ctx)
	if !found {
		am.keeper.Logger(ctx).Error("Active public key does not exists")
		return
	}

	if len(activePubkey.Creator) == 0 && len(activePubkey.PublicKey) == 0 {
		am.keeper.Logger(ctx).Error("Active public key does not exists")
		return
	}

	// loop over all encrypted Txs from the last executed height to the current height
	for _, item := range waitingList.List {
		arr := am.keeper.GetEncryptedTxAllFromCondition(ctx, item)
		logrus.Info("enc tx : ---------------------> ", arr)
		key, found := am.keeper.GetAggregatedConditionalKeyShare(ctx, item)
		if !found {
			am.keeper.Logger(ctx).Error(fmt.Sprintf("Decryption key not found for condition: %d", item))
			continue
		}
		logrus.Info("agg key : ---------------------> ", key)
		publicKeyByte, err := hex.DecodeString(activePubkey.PublicKey)
		if err != nil {
			am.keeper.Logger(ctx).Error("Error decoding active public key")
			am.keeper.Logger(ctx).Error(err.Error())
			return
		}

		suite := bls.NewBLS12381Suite()

		publicKeyPoint := suite.G1().Point()
		err = publicKeyPoint.UnmarshalBinary(publicKeyByte)
		if err != nil {
			am.keeper.Logger(ctx).Error("Error unmarshalling public key")
			am.keeper.Logger(ctx).Error(err.Error())
			return
		}

		am.keeper.Logger(ctx).Info("Unmarshal public key successfully")
		am.keeper.Logger(ctx).Info(publicKeyPoint.String())

		keyByte, err := hex.DecodeString(key.Data)
		if err != nil {
			am.keeper.Logger(ctx).Error("Error decoding aggregated key")
			am.keeper.Logger(ctx).Error(err.Error())
			continue
		}

		skPoint := suite.G2().Point()
		err = skPoint.UnmarshalBinary(keyByte)
		if err != nil {
			am.keeper.Logger(ctx).Error("Error unmarshalling aggregated key")
			am.keeper.Logger(ctx).Error(err.Error())
			continue
		}

		am.keeper.Logger(ctx).Info("Unmarshal decryption key successfully")
		am.keeper.Logger(ctx).Info(skPoint.String())

		for _, eachTx := range arr.EncryptedTx {
			startConsumedGas := ctx.GasMeter().GasConsumed()
			if currentNonce, found := am.keeper.GetConditionalencNonce(ctx, eachTx.Creator); found && currentNonce.Nonce == math.MaxUint64 {
				am.processFailedEncryptedTx(ctx, eachTx, "invalid nonce", startConsumedGas)
				continue
			}

			newExecutedNonce := am.keeper.IncreaseConditionalencNonce(ctx, eachTx.Creator)
			_ = newExecutedNonce
			creatorAddr, err := sdk.AccAddressFromBech32(eachTx.Creator)
			if err != nil {
				am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error parsing creator address: %s", err.Error()), startConsumedGas)
				continue
			}

			creatorAccount := am.accountKeeper.GetAccount(ctx, creatorAddr)
			_ = creatorAccount
			txBytes, err := hex.DecodeString(eachTx.Data)
			if err != nil {
				am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error decoding tx data to bytes: %s", err.Error()), startConsumedGas)
				continue
			}

			var decryptedTx bytes.Buffer
			var txBuffer bytes.Buffer
			_, err = txBuffer.Write(txBytes)
			if err != nil {
				am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error while writing bytes to tx buffer: %s", err.Error()), startConsumedGas)
				continue
			}

			err = enc.Decrypt(publicKeyPoint, skPoint, &decryptedTx, &txBuffer)
			if err != nil {
				am.processFailedEncryptedTx(ctx, eachTx, fmt.Sprintf("error decrypting tx data: %s", err.Error()), startConsumedGas)
				continue
			}

			am.keeper.Logger(ctx).Info(fmt.Sprintf("Decrypt TX Successfully: %s", decryptedTx.Bytes()))
			// params := am.keeper.GetParams(ctx)
			var cosmWasmPacketData transfertypes.MsgTransfer
			err = cosmWasmPacketData.Unmarshal(decryptedTx.Bytes())
			if err != nil {
				am.keeper.Logger(ctx).Error(err.Error())
			}
			_, err = am.keeper.TransferKeeper.Transfer(ctx,&cosmWasmPacketData)
			// err = am.keeper.SendSwapTx(ctx,params.ChannelId,decryptedTx.Bytes())
			if err != nil {
				am.keeper.Logger(ctx).Error("Relaying Swap Tx error")
				am.keeper.Logger(ctx).Error(err.Error())
			}
		
		}

		am.keeper.RemoveAllEncryptedTxFromCondition(ctx, item)
		am.pricefeedKeeper.RemoveFromList(ctx, item)
	}
}

// EndBlock contains the logic that is automatically triggered at the end of each block
func (am AppModule) EndBlock(ctx sdk.Context, endBlock abci.RequestEndBlock) []abci.ValidatorUpdate {
	// err := am.keeper.QueryFairyringCurrentKeys(ctx)
	// if err != nil {
	// 	am.keeper.Logger(ctx).Error("Endblocker get keys err", err)
	// 	am.keeper.Logger(ctx).Error(err.Error())
	// }

	// strHeight := am.keeper.GetLatestHeight(ctx)
	// height, err := strconv.ParseUint(strHeight, 10, 64)
	// if err != nil {
	// 	am.keeper.Logger(ctx).Error("Latest height does not exists in EndBlock")
	// 	return []abci.ValidatorUpdate{}
	// }
	height := uint64(endBlock.Height)
	ak, found := am.keeper.GetActivePubKey(ctx)
	if found {
		if ak.Expiry <= height {
			am.keeper.DeleteActivePubKey(ctx)
		} else {
			return []abci.ValidatorUpdate{}
		}
	}

	qk, found := am.keeper.GetQueuedPubKey(ctx)
	if found {
		if qk.Expiry > height {
			newActiveKey := types.ActivePubKey(qk)

			am.keeper.SetActivePubKey(ctx, newActiveKey)
		}
		am.keeper.DeleteQueuedPubKey(ctx)
	}

	return []abci.ValidatorUpdate{}
}
