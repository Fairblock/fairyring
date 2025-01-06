package keeper

import (
	"fmt"

	"cosmossdk.io/core/store"
	"cosmossdk.io/log"
	"cosmossdk.io/store/prefix"
	"github.com/cosmos/cosmos-sdk/codec"
	"github.com/cosmos/cosmos-sdk/runtime"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/tuneinsight/lattigo/v6/core/rlwe"
	"github.com/tuneinsight/lattigo/v6/multiparty"
	"github.com/tuneinsight/lattigo/v6/ring"
	"github.com/tuneinsight/lattigo/v6/utils/sampling"

	"github.com/Fairblock/fairyring/x/ckks/types"
	"github.com/tuneinsight/lattigo/v6/schemes/ckks"
)

type (
	Keeper struct {
		cdc          codec.BinaryCodec
		storeService store.KVStoreService
		logger       log.Logger

		// the address capable of executing a MsgUpdateParams message. Typically, this
		// should be the x/gov module account.
		authority string

		crs    *sampling.KeyedPRNG
		params ckks.Parameters
	}
)

func NewKeeper(
	cdc codec.BinaryCodec,
	storeService store.KVStoreService,
	logger log.Logger,
	authority string,

) Keeper {
	if _, err := sdk.AccAddressFromBech32(authority); err != nil {
		panic(fmt.Sprintf("invalid authority address: %s", authority))
	}
	crs, _ := sampling.NewKeyedPRNG([]byte{'l', 'a', 't', 't', 'i', 'g', 'o'})
	LogN := 12

	// Q modulus Q
	Q := []uint64{0x800004001, 0x40002001} // 65.0000116961637 bits

	// P modulus P
	P := []uint64{0x4000026001} // 38.00000081692261 bits

	// Lattigo CKKS params
	params, _ := ckks.NewParametersFromLiteral(ckks.ParametersLiteral{
		LogN:            LogN,
		Q:               Q,
		P:               P,
		LogDefaultScale: 32,
	})
	return Keeper{
		cdc:          cdc,
		storeService: storeService,
		authority:    authority,
		logger:       logger,
		crs:          crs,
		params:       params,
	}

}

// GetAuthority returns the module's authority.
func (k Keeper) GetAuthority() string {
	return k.authority
}

// Logger returns a module-specific logger.
func (k Keeper) Logger() log.Logger {
	return k.logger.With("module", fmt.Sprintf("x/%s", types.ModuleName))
}

//////////////////////////
/////// PKG //////////////
//////////////////////////

func (k Keeper) StorePKGShare(ctx sdk.Context, creator string, share []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("PKG:%s", creator))
	store.Set(key, share)
}

func (k Keeper) GetPKGShare(ctx sdk.Context, creator string) []byte {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("PKG:%s", creator))
	return store.Get(key)
}

func (k Keeper) AggregatePKGShares(ctx sdk.Context) ([]byte, error) {
	// Retrieve and aggregate PKG shares
	shares := k.GetShares(ctx, "PKG:")

	ckg := multiparty.NewPublicKeyGenProtocol(k.params)
	ckgCombined := ckg.AllocateShare()
	pk := rlwe.NewPublicKey(k.params)

	for _, ckgShare := range shares {
		var share multiparty.PublicKeyGenShare
		err := share.UnmarshalBinary(ckgShare)
		if err != nil {
			return []byte{}, err
		}
		ckg.AggregateShares(share, ckgCombined, &ckgCombined)
	}
	crp := ckg.SampleCRP(k.crs)
	ckg.GenPublicKey(ckgCombined, crp, pk)
	pk_value, _ := pk.MarshalBinary()
	k.SetAggregatedPKGKey(ctx, pk_value)
	return pk_value, nil
}

func (k Keeper) SetAggregatedPKGKey(ctx sdk.Context, key []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set([]byte("aggregated_pk"), key)
}

//////////////////////////
/////// RKG-R1 ///////////
//////////////////////////

func (k Keeper) StoreRKGShareRound1(ctx sdk.Context, creator string, share []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("RKG-R1:%s", creator))
	store.Set(key, share)
}

func (k Keeper) AggregateRKGSharesRound1(ctx sdk.Context) ([]byte, error) {
	// Retrieve and aggregate PKG shares
	shares := k.GetShares(ctx, "RKG-R1:")

	rkg := multiparty.NewRelinearizationKeyGenProtocol(k.params)

	_, rkgCombined1, _ := rkg.AllocateShare()
	for _, rkgShare := range shares {
		var share multiparty.RelinearizationKeyGenShare
		err := share.UnmarshalBinary(rkgShare)
		if err != nil {
			return []byte{}, err
		}
		rkg.AggregateShares(share, rkgCombined1, &rkgCombined1)
	}
	rk_r1_value, _ := rkgCombined1.MarshalBinary()
	k.SetAggregatedRKGR1Key(ctx, rk_r1_value)
	return rk_r1_value, nil
}

func (k Keeper) SetAggregatedRKGR1Key(ctx sdk.Context, key []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set([]byte("aggregated_rk_r1"), key)
}
func (k Keeper) GetAggregatedRKGR1Key(ctx sdk.Context) ([]byte, bool) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := store.Get([]byte("aggregated_rk_r1"))
	if key == nil {
		return nil, false
	}
	return key, true
}

//////////////////////////
/////// RKG-R2 ///////////
//////////////////////////

func (k Keeper) StoreRKGShareRound2(ctx sdk.Context, creator string, share []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("RKG-R2:%s", creator))
	store.Set(key, share)
}

func (k Keeper) AggregateRKGSharesRound2(ctx sdk.Context) ([]byte, error) {
	// Retrieve and aggregate RKG shares
	shares := k.GetShares(ctx, "RKG-R2:")

	rkg := multiparty.NewRelinearizationKeyGenProtocol(k.params)

	_, rkgCombined1, rkgCombined2 := rkg.AllocateShare()
	for _, rkgShare := range shares {
		var share multiparty.RelinearizationKeyGenShare
		err := share.UnmarshalBinary(rkgShare)
		if err != nil {
			return []byte{}, err
		}
		rkg.AggregateShares(share, rkgCombined2, &rkgCombined2)
	}
	combined1, _ := k.GetAggregatedRKGR1Key(ctx)
	rkgCombined1.UnmarshalBinary(combined1)

	rlk := rlwe.NewRelinearizationKey(k.params)
	rkg.GenRelinearizationKey(rkgCombined1, rkgCombined2, rlk)
	rk, _ := rlk.MarshalBinary()
	k.SetAggregatedRKGKey(ctx, rk)
	return rk, nil
}

func (k Keeper) SetAggregatedRKGKey(ctx sdk.Context, key []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set([]byte("aggregated_rk"), key)
}

//////////////////////////
/////// GKG //////////////
//////////////////////////

func (k Keeper) StoreGKGShare(ctx sdk.Context, creator string, share []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("GKG:%s", creator))
	store.Set(key, share)
}

func (k Keeper) AggregateGKGShares(ctx sdk.Context) ([]byte, error) {
	// Retrieve and aggregate GKG shares
	shares := k.GetShares(ctx, "GKG:")
	gkg := make([]multiparty.GaloisKeyGenProtocol, k.GetN(ctx))
	for i := range gkg {
		if i == 0 {
			gkg[i] = multiparty.NewGaloisKeyGenProtocol(k.params)
		} else {
			gkg[i] = gkg[0].ShallowCopy()
		}
	}
	crp_g := gkg[0].SampleCRP(k.crs)
	sharesList := make([]multiparty.GaloisKeyGenShare, k.GetN(ctx))
	for i, gkgShare := range shares {

		var share multiparty.GaloisKeyGenShare
		err := share.UnmarshalBinary(gkgShare)
		if err != nil {
			return []byte{}, err
		}
		sharesList[i] = share
		// gkg[0].AggregateShares(gkg_aggr, share, &gkg_aggr)

	}
	for i := 1; i < k.GetThreshold(ctx, "GKG"); i++ {
		gkg[0].AggregateShares(sharesList[0], sharesList[i], &sharesList[0])
	}
	galoisKey := rlwe.NewGaloisKey(k.params)

	gkg[0].GenGaloisKey(sharesList[0], crp_g, galoisKey)

	gk_value, _ := galoisKey.MarshalBinary()
	k.SetAggregatedGKGKey(ctx, gk_value)
	return gk_value, nil
}

func (k Keeper) SetAggregatedGKGKey(ctx sdk.Context, key []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set([]byte("aggregated_gk"), key)
}

//////////////////////////
/////// PKS //////////////
//////////////////////////

func (k Keeper) StorePKSShare(ctx sdk.Context, creator string, share []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("PKS:%s", creator))
	store.Set(key, share)
}

func (k Keeper) GetPKSShare(ctx sdk.Context, creator string) []byte {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	key := []byte(fmt.Sprintf("PKS:%s", creator))
	return store.Get(key)
}

func (k Keeper) AggregatePKSShares(ctx sdk.Context) ([]byte, error) {
	// Retrieve and aggregate PKS shares
	shares := k.GetShares(ctx, "PKS:")

	sigmaSmudging := 8 * rlwe.DefaultNoise
	pcks := make([]multiparty.PublicKeySwitchProtocol, k.GetN(ctx))
	for i := range pcks {
		if i == 0 {
			pcks[i], _ = multiparty.NewPublicKeySwitchProtocol(k.params, ring.DiscreteGaussian{Sigma: sigmaSmudging, Bound: 6 * sigmaSmudging})

		} else {
			pcks[i] = pcks[0].ShallowCopy()
		}
	}
	shares_ks := make([]multiparty.PublicKeySwitchShare, k.GetN(ctx))
	for i, pksShare := range shares {
		
		var share multiparty.PublicKeySwitchShare
		err := share.UnmarshalBinary(pksShare)
		if err != nil {
			return []byte{}, err
		}
		shares_ks[i] = share
		
	}
	for i := 1; i < k.GetThreshold(ctx, "PKS"); i++ {
		pcks[0].AggregateShares(shares_ks[0], shares_ks[i], &shares_ks[0])
	}

	pks_value, _ := shares_ks[0].MarshalBinary()
	k.SetAggregatedPKSKey(ctx, pks_value)
	return pks_value, nil
}

func (k Keeper) SetAggregatedPKSKey(ctx sdk.Context, key []byte) {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	store.Set([]byte("aggregated_pks"), key)
}


//////////////////////////
/////// Helpers //////////
//////////////////////////

func (k Keeper) GetShares(ctx sdk.Context, pref string) [][]byte {
	storeAdapter := runtime.KVStoreAdapter(k.storeService.OpenKVStore(ctx))
	store := prefix.NewStore(storeAdapter, []byte{})
	prefixStore := prefix.NewStore(store, []byte(pref))

	iterator := prefixStore.Iterator(nil, nil)
	defer iterator.Close()

	var shares [][]byte
	for ; iterator.Valid(); iterator.Next() {
		shares = append(shares, iterator.Value())
	}
	return shares
}

func (k Keeper) IsThresholdMet(ctx sdk.Context, shareType string) bool {
	shares := k.GetShares(ctx, shareType)
	threshold := k.GetThreshold(ctx, shareType)
	return len(shares) >= threshold
}

// TODO
func (k Keeper) GetThreshold(ctx sdk.Context, shareType string) int {
	// Define thresholds for each share type
	switch shareType {
	case "CKG":
		return 2
	case "RKG1":
		return 2
	case "RKG2":
		return 2
	case "PKS":
		return 2
	case "GKG":
		return 2
	default:
		return 2
	}
}
func (k Keeper) GetN(ctx sdk.Context) int {
	return 3
}
