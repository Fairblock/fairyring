package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgCreateAuthorizedAddress{}

func NewMsgCreateAuthorizedAddress(
	creator string,
	target string,

) *MsgCreateAuthorizedAddress {
	return &MsgCreateAuthorizedAddress{
		Creator: creator,
		Target:  target,
	}
}

func (msg *MsgCreateAuthorizedAddress) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}

var _ sdk.Msg = &MsgUpdateAuthorizedAddress{}

func NewMsgUpdateAuthorizedAddress(
	creator string,
	target string,
	isAuthorized bool,
) *MsgUpdateAuthorizedAddress {
	return &MsgUpdateAuthorizedAddress{
		Creator:      creator,
		Target:       target,
		IsAuthorized: isAuthorized,
	}
}

func (msg *MsgUpdateAuthorizedAddress) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}

var _ sdk.Msg = &MsgDeleteAuthorizedAddress{}

func NewMsgDeleteAuthorizedAddress(
	creator string,
	target string,

) *MsgDeleteAuthorizedAddress {
	return &MsgDeleteAuthorizedAddress{
		Creator: creator,
		Target:  target,
	}
}

func (msg *MsgDeleteAuthorizedAddress) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
