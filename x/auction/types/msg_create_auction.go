package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

var _ sdk.Msg = &MsgCreateAuction{}

// ValidateBasic does a sanity check on the provided data.
func (m *MsgCreateAuction) ValidateBasic() error {
	if _, err := sdk.AccAddressFromBech32(m.Creator); err != nil {
		return errorsmod.Wrap(err, "invalid creator address")
	}

	return nil
}
