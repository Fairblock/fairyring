package keeper

import (
	"github.com/Fairblock/fairyring/x/auction/types"
)

var _ types.QueryServer = Keeper{}
