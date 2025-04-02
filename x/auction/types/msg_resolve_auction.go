package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ sdk.Msg = &MsgResolveAuction{}

// ValidateBasic does a sanity check on the provided data.
func (m *MsgResolveAuction) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(m.Creator); err != nil {
		return errorsmod.Wrap(err, "invalid creator address")
	}
	if _, _, err := DecodeAuctionIdentity(m.Identity); err != nil {
		return errorsmod.Wrap(err, "invalid auction identity")
	}
	return nil
}
