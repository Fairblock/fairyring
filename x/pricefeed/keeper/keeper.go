package keeper

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"unicode"

	//"unicode"

	"strconv"
	"time"

	log "github.com/cometbft/cometbft/libs/log"
	"github.com/cosmos/cosmos-sdk/codec"
	storetypes "github.com/cosmos/cosmos-sdk/store/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	capabilitykeeper "github.com/cosmos/cosmos-sdk/x/capability/keeper"
	capabilitytypes "github.com/cosmos/cosmos-sdk/x/capability/types"
	paramtypes "github.com/cosmos/cosmos-sdk/x/params/types"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v7/modules/core/24-host"
	"github.com/sirupsen/logrus"

	//"github.com/sirupsen/logrus"
	//"github.com/tendermint/tendermint/libs/log"

	bandtypes "fairyring/types/band"
	"fairyring/x/pricefeed/types"
)

type Keeper struct {
	storeKey   storetypes.StoreKey
	cdc        codec.BinaryCodec
	paramSpace paramtypes.Subspace

	ics4Wrapper   types.ICS4Wrapper
	channelKeeper types.ChannelKeeper
	portKeeper    types.PortKeeper
	scopedKeeper  capabilitykeeper.ScopedKeeper
	mu sync.Mutex
}

func NewKeeper(
	cdc codec.BinaryCodec, key storetypes.StoreKey, paramSpace paramtypes.Subspace,
	ics4Wrapper types.ICS4Wrapper, channelKeeper types.ChannelKeeper, portKeeper types.PortKeeper,
	scopedKeeper capabilitykeeper.ScopedKeeper,
) *Keeper {
	// set KeyTable if it has not already been set
	if !paramSpace.HasKeyTable() {
		paramSpace = paramSpace.WithKeyTable(types.ParamKeyTable())
	}

	return &Keeper{
		cdc:           cdc,
		storeKey:      key,
		paramSpace:    paramSpace,
		ics4Wrapper:   ics4Wrapper,
		channelKeeper: channelKeeper,
		portKeeper:    portKeeper,
		scopedKeeper:  scopedKeeper,
	}
}

func (k Keeper) Logger(ctx sdk.Context) log.Logger {
	return ctx.Logger().With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

// IsBound checks if the pricefeed module is already bound to the desired port
func (k Keeper) IsBound(ctx sdk.Context, portID string) bool {
	_, ok := k.scopedKeeper.GetCapability(ctx, host.PortPath(portID))
	return ok
}

// BindPort defines a wrapper function for the ort Keeper's function in
// order to expose it to module's InitGenesis function
func (k Keeper) BindPort(ctx sdk.Context, portID string) error {
	cap := k.portKeeper.BindPort(ctx, portID)
	return k.ClaimCapability(ctx, cap, host.PortPath(portID))
}

// GetPort returns the portID for the pricefeed module. Used in ExportGenesis
func (k Keeper) GetPort(ctx sdk.Context) string {
	store := ctx.KVStore(k.storeKey)
	return string(store.Get(types.PortKey))
}

// SetPort sets the portID for the pricefeed module. Used in InitGenesis
func (k Keeper) SetPort(ctx sdk.Context, portID string) {
	store := ctx.KVStore(k.storeKey)
	store.Set(types.PortKey, []byte(portID))
}

func (k Keeper) SetSymbolRequest(ctx sdk.Context, symbolRequest types.SymbolRequest) {
	ctx.KVStore(k.storeKey).Set(types.SymbolRequestStoreKey(symbolRequest.Symbol), k.cdc.MustMarshal(&symbolRequest))
}

func (k Keeper) GetSymbolRequest(ctx sdk.Context, symbol string) (types.SymbolRequest, error) {
	bz := ctx.KVStore(k.storeKey).Get(types.SymbolRequestStoreKey(symbol))
	if bz == nil {
		return types.SymbolRequest{}, sdkerrors.Wrapf(types.ErrSymbolRequestNotFound, "symbol: %s", symbol)
	}
	var sr types.SymbolRequest
	k.cdc.MustUnmarshal(bz, &sr)
	return sr, nil
}

func (k Keeper) DeleteSymbolRequest(ctx sdk.Context, symbol string) {
	ctx.KVStore(k.storeKey).Delete(types.SymbolRequestStoreKey(symbol))
}

func (k Keeper) HandleSymbolRequests(ctx sdk.Context, symbolRequests []types.SymbolRequest) {
	for _, sr := range symbolRequests {
		// delete when block interval is equal to zero
		if sr.BlockInterval == 0 {
			k.DeleteSymbolRequest(ctx, sr.Symbol)
		} else {
			k.SetSymbolRequest(ctx, sr)
		}
	}
}

func (k Keeper) GetAllSymbolRequests(ctx sdk.Context) []types.SymbolRequest {
	store := ctx.KVStore(k.storeKey)

	iterator := storetypes.KVStorePrefixIterator(store, types.SymbolRequestStoreKeyPrefix)
	defer iterator.Close()
	var srs []types.SymbolRequest
	for ; iterator.Valid(); iterator.Next() {
		var sr types.SymbolRequest
		k.cdc.MustUnmarshal(iterator.Value(), &sr)
		srs = append(srs, sr)
	}
	return srs
}
func (k Keeper) GetPriceStep(ctx sdk.Context, symbol string) uint64 {
	symbolRequests := k.GetAllSymbolRequests(ctx)
	for _, request := range symbolRequests {
		if request.Symbol == symbol {
			return request.PriceStep
		}
	}
	return 0
}

func (k Keeper) UpdateRepeatedPrice(ctx sdk.Context, price types.Price) uint64 {
	thisPrice, f := k.GetPrice(ctx, price.Symbol+strconv.Itoa(int(price.Price)))
	if f {
		price.Nonce = thisPrice.Nonce + 1
		k.setRepeatedPrice(ctx, price)
		return price.Nonce
	}
	price.Nonce = 1
	k.setRepeatedPrice(ctx, price)
	return 1

}
func (k Keeper) GetRepeatedPrice(ctx sdk.Context, price types.Price) uint64 {
	thisPrice, f := k.GetPrice(ctx, price.Symbol+strconv.Itoa(int(price.Price)))
	if f {
		price.Nonce = thisPrice.Nonce + 1
		
		return price.Nonce
	}
	price.Nonce = 1

	return 1

}
func (k Keeper) UpdatePrice(ctx sdk.Context, price types.Price) (bool, int64, int64) {
	old, found := k.GetPrice(ctx, price.Symbol)

	if !found || old.ResolveTime < price.ResolveTime {

		k.setPrice(ctx, price)
		if found {
			return true, int64(old.Price), int64(price.Price)
		}
		return true, int64(price.Price), int64(price.Price)
	}
	return false, int64(old.Price), int64(old.Price)
}

func (k Keeper) setPrice(ctx sdk.Context, price types.Price) {
	ctx.KVStore(k.storeKey).Set(types.PriceStoreKey(price.Symbol), k.cdc.MustMarshal(&price))
}

func (k Keeper) setRepeatedPrice(ctx sdk.Context, price types.Price) {
	ctx.KVStore(k.storeKey).Set(types.PriceStoreKey(price.Symbol+strconv.Itoa(int(price.Price))), k.cdc.MustMarshal(&price))
}

func (k Keeper) GetPrice(ctx sdk.Context, symbol string) (types.Price, bool) {
	bz := ctx.KVStore(k.storeKey).Get(types.PriceStoreKey(symbol))
	if bz == nil {
		return types.Price{}, false
	}

	var pf types.Price
	k.cdc.MustUnmarshal(bz, &pf)

	return pf, true
}

func (k Keeper) RequestBandChainDataBySymbolRequests(ctx sdk.Context) {
	blockHeight := ctx.BlockHeight()

	params := k.GetParams(ctx)

	// Verify that SourceChannel params is set by open params proposal already
	if params.SourceChannel == types.NotSet {
		return
	}

	symbols := k.GetAllSymbolRequests(ctx)
	logrus.Info("-----------------------------> ", symbols)
	// Map symbols that need to request on this block by oracle script ID and symbol block interval
	tasks := types.ComputeOracleTasks(symbols, blockHeight)

	for _, task := range tasks {
		calldataByte, err := bandtypes.EncodeCalldata(task.Symbols, uint8(params.MinDsCount))
		if err != nil {
			// This error don't expect to happen, so just log in case unexpected bug
			ctx.Logger().Error(fmt.Sprintf("Unable to encode calldata: %s", err))
			continue
		}

		// Calculate the prepareGas and executeGas for the oracle request packet based on the module's parameters and
		// the number of symbols to be requested
		prepareGas := types.CalculateGas(params.PrepareGasBase, params.PrepareGasEach, uint64(len(symbols)))
		executeGas := types.CalculateGas(params.ExecuteGasBase, params.ExecuteGasEach, uint64(len(symbols)))

		oracleRequestPacket := bandtypes.NewOracleRequestPacketData(
			types.ModuleName,
			task.OracleScriptID,
			calldataByte,
			params.AskCount,
			params.MinCount,
			params.FeeLimit,
			prepareGas,
			executeGas,
		)

		// Send the oracle request packet to the Band Chain using the RequestBandChainData function from the keeper
		err = k.RequestBandChainData(ctx, params.SourceChannel, oracleRequestPacket)
		// In the normal case, this module should able to create new packet, so just log error to debug should be ok
		if err != nil {
			ctx.Logger().Error(fmt.Sprintf("Unable to send oracle request: %s", err))
		}
	}
}

// RequestBandChainData is a function that sends an OracleRequestPacketData to BandChain via IBC.
func (k Keeper) RequestBandChainData(
	ctx sdk.Context,
	sourceChannel string,
	oracleRequestPacket bandtypes.OracleRequestPacketData,
) error {
	portID := k.GetPort(ctx)
	channel, found := k.channelKeeper.GetChannel(ctx, portID, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(
			channeltypes.ErrChannelNotFound,
			"port ID (%s) channel ID (%s)",
			portID,
			sourceChannel,
		)
	}

	destinationPort := channel.GetCounterparty().GetPortID()
	destinationChannel := channel.GetCounterparty().GetChannelID()

	// Get the capability associated with the given channel.
	channelCap, ok := k.scopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(portID, sourceChannel))
	if !ok {
		return sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	// Get the next sequence number for the given channel and port.
	sequence, found := k.channelKeeper.GetNextSequenceSend(
		ctx, portID, sourceChannel,
	)
	if !found {
		return sdkerrors.Wrapf(
			sdkerrors.ErrUnknownRequest,
			"unknown sequence number for channel %s port %s",
			sourceChannel,
			portID,
		)
	}

	// Create a new packet with the oracle request packet data and the sequence number.
	packet := channeltypes.NewPacket(
		oracleRequestPacket.GetBytes(),
		sequence,
		portID,
		sourceChannel,
		destinationPort,
		destinationChannel,
		clienttypes.ZeroHeight(),
		uint64(ctx.BlockTime().UnixNano()+int64(20*time.Minute)),
	)
	_ = packet
	// Send the packet via the channel and capability associated with the given channel.
	if _, err := k.channelKeeper.SendPacket(ctx, channelCap, portID,
		sourceChannel, clienttypes.ZeroHeight(), uint64(ctx.BlockTime().UnixNano()+int64(20*time.Minute)), oracleRequestPacket.GetBytes()); err != nil {
		return err
	}

	return nil
}

type WaitingList struct {
	List []string `json:"list"`
	LatestMetCondition string `json:"latest_met_condition"`
}

// MustMarshalJSON is a helper for JSON marshaling that panics on an error
func MustMarshalJSON(o interface{}) []byte {
	bytes, err := json.Marshal(o)
	if err != nil {
		panic(err)
	}
	return bytes
}

// MustUnmarshalJSON is a helper for JSON unmarshaling that panics on an error
func MustUnmarshalJSON(bytes []byte, o interface{}) {
	if err := json.Unmarshal(bytes, o); err != nil {
		panic(err)
	}
}

// AppendToList appends a string to the waiting list
func (k Keeper) AppendToList(ctx sdk.Context, item string, symbol string) {
	store := ctx.KVStore(k.storeKey)
	// Load current list
	var waitingList WaitingList
	bz := store.Get([]byte(symbol+"waitingList"))
	if bz != nil {
		MustUnmarshalJSON(bz, &waitingList)
	}
	// Append
	waitingList.List = append(waitingList.List, item)
	// Save
	store.Set([]byte(symbol+"waitingList"), MustMarshalJSON(waitingList))
}

// AppendListToList appends a list of strings to the waiting list
func (k Keeper) AppendListToList(ctx sdk.Context, items []string, symbol string) {
	store := ctx.KVStore(k.storeKey)
	// Load current list
	var waitingList WaitingList
	bz := store.Get([]byte(symbol+"waitingList"))
	if bz == nil {
		waitingList = WaitingList{}
	}
	if bz != nil {
		MustUnmarshalJSON(bz, &waitingList)
	}
	// Append list to existing list
	waitingList.List = append(waitingList.List, items...)
	// Save
	store.Set([]byte(symbol+"waitingList"), MustMarshalJSON(waitingList))
}

func (k Keeper) AddLatestCondition(ctx sdk.Context, item string, symbol string) {
	store := ctx.KVStore(k.storeKey)
	// Load current list
	var waitingList WaitingList
	bz := store.Get([]byte(symbol+"waitingList"))
	if bz == nil {
		waitingList = WaitingList{}
	}
	if bz != nil {
		MustUnmarshalJSON(bz, &waitingList)
	}
	// Append list to existing list
	waitingList.LatestMetCondition = item
	// Save
	store.Set([]byte(symbol+"waitingList"), MustMarshalJSON(waitingList))
}

func (k Keeper) GetList(ctx sdk.Context) WaitingList {
	//logrus.Info("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1")
	all := k.GetAllSymbolRequests(ctx)
	var waitingListAll WaitingList
	for _,symbol := range all {
	store := ctx.KVStore(k.storeKey)
	var waitingList WaitingList
	bz := store.Get([]byte(symbol.Symbol+"waitingList"))
	if bz != nil {
		MustUnmarshalJSON(bz, &waitingList)
	}
	waitingListAll.List = append(waitingListAll.List,waitingList.List...)
}
	//logrus.Info("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2")
	return waitingListAll
}

func (k Keeper) GetLatestCondition(ctx sdk.Context, symbol string) string {
	//logrus.Info("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee1")
	store := ctx.KVStore(k.storeKey)
	var waitingList WaitingList
	bz := store.Get([]byte(symbol+"waitingList"))
	if bz != nil {
		MustUnmarshalJSON(bz, &waitingList)
	}
	//logrus.Info("hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee2")
	return waitingList.LatestMetCondition
}
// RemoveFromList removes an item from the waiting list
func (k Keeper) RemoveFromList(ctx sdk.Context, item string) {
	symbol := extractPrefix(item)
	store := ctx.KVStore(k.storeKey)
	// Load current list
	var waitingList WaitingList
	bz := store.Get([]byte(symbol+"waitingList"))
	if bz != nil {
		MustUnmarshalJSON(bz, &waitingList)
	}
	// Remove
	for i, v := range waitingList.List {
		if v == item {
			waitingList.List = append(waitingList.List[:i], waitingList.List[i+1:]...)
			break
		}
	}
	// Save
	store.Set([]byte(symbol+"waitingList"), MustMarshalJSON(waitingList))
}
func extractPrefix(s string) string {
	// Get slice of runes from the string
	runes := []rune(s)

	// Iterate through runes until we hit a digit
	for i, r := range runes {
		if unicode.IsDigit(r) {
			return string(runes[:i])
		}
	}

	// If there are no digits, return the entire string
	return s
}
func extractNumber(s, symbol string) (int, error) {
	parts := strings.Split(s, symbol)
	if len(parts) < 2 {
		return 0, fmt.Errorf("invalid input string or symbol not found")
	}
	// Trim spaces and convert to integer
	return strconv.Atoi(strings.TrimSpace(parts[1]))
}
// StoreOracleResponsePacket is a function that receives an OracleResponsePacketData from BandChain.
func (k Keeper) StoreOracleResponsePacket(ctx sdk.Context, res bandtypes.OracleResponsePacketData) error {
	// Decode the result from the response packet.
	k.mu.Lock()


	result, err := bandtypes.DecodeResult(res.Result)
	if err != nil {
		k.mu.Unlock()
		return err
	}
//	logrus.Info("enemy---------------------------------------------------------------------")
	// Loop through the result and set the price in the state for each symbol.
	for _, r := range result {
		if r.ResponseCode == 0 {
			changed, old, new := k.UpdatePrice(ctx, types.Price{
				Symbol:      r.Symbol,
				Price:       r.Rate,
				ResolveTime: res.ResolveTime,
			})
			//logrus.Info("here---------------------------------------------------------------------")
			if changed {
				//logrus.Info("changed---------------------------------------------------------------------")
				step := k.GetPriceStep(ctx, r.Symbol)
				previous := k.GetLatestCondition(ctx, r.Symbol)
				// Iterate through values with 0.05 difference
				var prev int
				
				if previous == ""{
					prev = int(old) - int(step)
				}
				if previous != ""{
				prev, _ = extractNumber(previous,r.Symbol)}
				logrus.Info("ok---------------------------------------------------------------------:", prev, new)
				waitingList := []string{}
				 if prev < int(new) {
				for i := int64(prev) + int64(step); i <= new; i += int64(step) {
					nonce := k.UpdateRepeatedPrice(ctx, types.Price{Symbol: r.Symbol, Price: uint64(i), ResolveTime: res.ResolveTime})
					ctx.EventManager().EmitEvent(
						sdk.NewEvent(
							types.EventTypePriceUpdate,
							sdk.NewAttribute(types.AttributeKeySymbol, r.Symbol),
							sdk.NewAttribute(types.AttributeKeyPrice, fmt.Sprintf("%d", i)),
							sdk.NewAttribute(types.AttributeKeySymbol, strconv.FormatUint(nonce, 10)),
							sdk.NewAttribute(types.AttributeKeyTimestamp, res.ResolveStatus.String()),
						),
					)
					waitingList = append(waitingList, strconv.FormatUint(nonce, 10)+r.Symbol+strconv.Itoa(int(i)))
				}}
				if prev > int(new) {
					for i := int64(prev) - int64(step); i >= new; i -= int64(step) {
						nonce := k.UpdateRepeatedPrice(ctx, types.Price{Symbol: r.Symbol, Price: uint64(i), ResolveTime: res.ResolveTime})
						ctx.EventManager().EmitEvent(
							sdk.NewEvent(
								types.EventTypePriceUpdate,
								sdk.NewAttribute(types.AttributeKeySymbol, r.Symbol),
								sdk.NewAttribute(types.AttributeKeyPrice, fmt.Sprintf("%d", i)),
								sdk.NewAttribute(types.AttributeKeySymbol, strconv.FormatUint(nonce, 10)),
								sdk.NewAttribute(types.AttributeKeyTimestamp, res.ResolveStatus.String()),
							),
						)
						waitingList = append(waitingList, strconv.FormatUint(nonce, 10)+r.Symbol+strconv.Itoa(int(i)))
					}
				}
				if len(waitingList) > 0 {
				k.AppendListToList(ctx, waitingList, r.Symbol)
				k.AddLatestCondition(ctx,waitingList[len(waitingList)-1],r.Symbol)}
			}
		//	logrus.Info("sure---------------------------------------------------------------------")
		}
		// TODO: allow to write logic to handle failed symbol now just ignore and skip update
	}
	k.mu.Unlock()
	return nil
}

// ClaimCapability attempts to claim a given Capability. The provided name and
// the scoped module's name tuple are treated as the owner. It will attempt
// to add the owner to the persistent set of capability owners for the capability
// index. If the owner already exists, it will return an error. Otherwise, it will
// also set a forward and reverse index for the capability and capability name.
func (k Keeper) ClaimCapability(ctx sdk.Context, cap *capabilitytypes.Capability, name string) error {
	return k.scopedKeeper.ClaimCapability(ctx, cap, name)
}
