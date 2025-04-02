package types

import (
	"fmt"
	"github.com/Fairblock/fairyring/x/common/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

// this line is used by starport scaffolding # genesis/types/import

// DefaultIndex is the default global index
const DefaultIndex uint64 = 1

// DefaultGenesis returns the default genesis state
func DefaultGenesis() *GenesisState {
	return &GenesisState{
		// this line is used by starport scaffolding # genesis/types/default
		Params:            DefaultParams(),
		AuctionDetailList: []types.AuctionDetailList{},
		RegisteredBidders: []types.Bidder{},
	}
}

// Validate performs basic genesis state validation returning an error upon any
// failure.
func (gs GenesisState) Validate() error {

	auctionDetailIndexMap := make(map[string]struct{})
	for height, elem := range gs.AuctionDetailList {
		for index, item := range elem.AuctionDetail {
			if item.AuctionId != uint64(index) {
				return fmt.Errorf("auction id does not match the index")
			}

			if item.ResolveAt != uint64(height) {
				return fmt.Errorf("auction resolve height does not match")
			}

			if _, err := sdk.AccAddressFromBech32(item.Creator); err != nil {
				return err
			}

			for _, db := range item.DecryptedBids {
				if err := db.Bid.Validate(); err != nil {
					return err
				}
				if _, err := sdk.AccAddressFromBech32(db.Bidder); err != nil {
					return err
				}
			}

			for _, b := range item.Bids {
				if _, err := sdk.AccAddressFromBech32(b.Bidder); err != nil {
					return err
				}
			}

			if err := item.WinningBid.Bid.Validate(); err != nil {
				return err
			}
			if _, err := sdk.AccAddressFromBech32(item.WinningBid.Bidder); err != nil {
				return err
			}

		}
		index := string(AuctionDetailsFromHeightKey(uint64(height)))
		if _, ok := auctionDetailIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for encryptedTxArr")
		}
		auctionDetailIndexMap[index] = struct{}{}
	}

	registeredBiddersIndexMap := make(map[string]struct{})

	for _, elem := range gs.RegisteredBidders {
		_, err := sdk.AccAddressFromBech32(elem.Address)
		if err != nil {
			return err
		}
		if err = elem.Delegated.Validate(); err != nil {
			return err
		}
		index := string(RegisteredBidderKey(elem.Address))
		if _, ok := registeredBiddersIndexMap[index]; ok {
			return fmt.Errorf("duplicated index for registered bidder key")
		}
		registeredBiddersIndexMap[index] = struct{}{}
	}

	return gs.Params.Validate()
}
