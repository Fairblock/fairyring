package v2

import (
	"cosmossdk.io/core/store"
	"github.com/Fairblock/fairyring/x/pep/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// MigrateStore migrates the x/pep module state from the consensus version 1 to version 2.
func MigrateStore(ctx sdk.Context, storeService store.KVStoreService, cdc codec.BinaryCodec) error {
	currParams := types.NewParams(
		[]string{"fairy1yhpqdugfmfuhlvekkurnkstf2vl82063ajmfe5", "fairy1r6q07ne3deq64ezcjwkedcfe6669f0ewpwnxy9"},
		[]*types.TrustedCounterParty{
			{
				ClientId:     "07-tendermint-0",
				ConnectionId: "connection-0",
				ChannelId:    "channel-1",
			},
		},
		types.DefaultKeyshareChannelID,
		&types.DefaultMinGasPrice,
		true,
		&types.DefaultKeysharePrice,
	)

	bz, err := cdc.Marshal(&currParams)
	if err != nil {
		return err
	}

	store := storeService.OpenKVStore(ctx)
	return store.Set(types.ParamsKey, bz)
}
