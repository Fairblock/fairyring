package types

import (
	errorsmod "cosmossdk.io/errors"
	"encoding/hex"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ sdk.Msg = &MsgPlaceBid{}

// ValidateBasic does a sanity check on the provided data.
func (m *MsgPlaceBid) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(m.Creator); err != nil {
		return errorsmod.Wrap(err, "invalid creator address")
	}
	if _, err := hex.DecodeString(m.SealedBid); err != nil {
		return errorsmod.Wrap(err, "invalid sealed bid, expecting hex encoded ciphertext")
	}
	if _, _, err := DecodeAuctionIdentity(m.AuctionIdentity); err != nil {
		return errorsmod.Wrap(err, "invalid auction identity")
	}
	return nil
}
