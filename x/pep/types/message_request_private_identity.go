package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgRequestPrivateIdentity{}

// NewMsgRequestPrivateIdentity creates a new instance of MsgRequestPrivateIdentity.
// It initializes the message with the provided parameters.
//
// Parameters:
//   - creator: The address or identifier of the entity creating the message.
//   - reqId: A unique identifier for the request.
//   - viaContract: A boolean indicating whether the request was created via a contract.
//   - registerContract: A boolean indicating whether the request involves registering a contract.
//
// Returns:
//
//	A pointer to a newly created MsgRequestPrivateIdentity instance.
func NewMsgRequestPrivateIdentity(
	creator string,
	reqId string,
	viaContract bool,
	registerContract bool,
) *MsgRequestPrivateIdentity {
	return &MsgRequestPrivateIdentity{
		Creator:            creator,
		ReqId:              reqId,
		CreatedViaContract: viaContract,
		RegisterContract:   registerContract,
	}
}

// ValidateBasic performs basic validation on the MsgRequestPrivateIdentity message.
// It checks if the Creator field contains a valid Bech32-encoded address.
// Returns an error if the address is invalid, otherwise returns nil.
func (msg *MsgRequestPrivateIdentity) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
