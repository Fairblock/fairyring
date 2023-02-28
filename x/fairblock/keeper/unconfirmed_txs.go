package keeper

import (
	"fairyring/x/fairblock/types"
	"fmt"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmostxTypes "github.com/cosmos/cosmos-sdk/types/tx"
	coretypes "github.com/tendermint/tendermint/rpc/core/types"
)

func (k Keeper) ProcessUnconfirmedTxs(ctx sdk.Context, utxs *coretypes.ResultUnconfirmedTxs) error {
	for _, utx := range utxs.Txs {
		var decodedTx cosmostxTypes.Tx
		err := decodedTx.Unmarshal(utx)
		if err != nil {
			k.Logger(ctx).Error("[ProcessUnconfirmedTxs] Error Parsing Unconfirmed Tx")
			k.Logger(ctx).Error(err.Error())
			continue
		}

		for _, message := range decodedTx.Body.Messages {
			if message.TypeUrl == "/fairyring.fairblock.MsgCreateAggregatedKeyShare" {
				var msg types.MsgCreateAggregatedKeyShare
				err := msg.Unmarshal(message.Value)
				if err != nil {
					k.Logger(ctx).Error("[ProcessUnconfirmedTxs] Error Parsing Message")
					k.Logger(ctx).Error(err.Error())
					continue
				}

				k.processMessage(ctx, msg)
			}
		}
	}
	return nil
}

func (k Keeper) processMessage(ctx sdk.Context, msg types.MsgCreateAggregatedKeyShare) {
	// TODO: Add a dummy Tx check to validate KeyShares
	k.SetAggregatedKeyShare(ctx, types.AggregatedKeyShare{
		Height:  msg.Height,
		Data:    msg.Data,
		Creator: msg.Creator,
	})

	latestHeight, err := strconv.ParseUint(k.GetLatestHeight(ctx), 10, 64)
	if err != nil { // latest height is empty, set it to 0
		latestHeight = 0
	}

	if latestHeight < msg.Height {
		k.SetLatestHeight(ctx, strconv.FormatUint(msg.Height, 10))
	}

	k.Logger(ctx).Info(fmt.Sprintf("[ProcessUnconfirmedTxs] Aggregated Key Added, height: %d", msg.Height))
}
