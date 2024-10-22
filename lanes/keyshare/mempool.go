package keyshare

import (
	"context"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"

	"github.com/skip-mev/block-sdk/v2/block/base"
)

// TxPriority returns a TxPriority over Keyshare transactions only. It
// is to be used in the Keyshare index only.
func TxPriority(config Factory) base.TxPriority[string] {
	return base.TxPriority[string]{
		GetTxPriority: func(goCtx context.Context, tx sdk.Tx) string {
			ksInfo, err := config.GetDecryptionKeyInfo(tx)
			if err != nil {
				panic(err)
			}

			return strconv.FormatUint(ksInfo.Height, 10)
		},
		Compare: func(a, b string) int {
			aUint, _ := strconv.ParseUint(a, 10, 64)
			bUint, _ := strconv.ParseUint(b, 10, 64)

			switch {
			case aUint < bUint:
				return 1
			case aUint > bUint:
				return -1
			default:
				return 0
			}
		},
		MinValue: "",
	}
}
