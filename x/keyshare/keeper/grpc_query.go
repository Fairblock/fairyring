package keeper

import (
	"github.com/FairBlock/fairyring/x/keyshare/types"
)

var _ types.QueryServer = Keeper{}
