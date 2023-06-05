package keeper

import (
	"github.com/FairBlock/fairyring/x/pep/types"
)

var _ types.QueryServer = Keeper{}
