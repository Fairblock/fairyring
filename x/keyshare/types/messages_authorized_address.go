package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateAuthorizedAddress = "create_authorized_address"
	TypeMsgUpdateAuthorizedAddress = "update_authorized_address"
	TypeMsgDeleteAuthorizedAddress = "delete_authorized_address"
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

func (msg *MsgCreateAuthorizedAddress) Route() string {
	return RouterKey
}

func (msg *MsgCreateAuthorizedAddress) Type() string {
	return TypeMsgCreateAuthorizedAddress
}

func (msg *MsgCreateAuthorizedAddress) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateAuthorizedAddress) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
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

func (msg *MsgUpdateAuthorizedAddress) Route() string {
	return RouterKey
}

func (msg *MsgUpdateAuthorizedAddress) Type() string {
	return TypeMsgUpdateAuthorizedAddress
}

func (msg *MsgUpdateAuthorizedAddress) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgUpdateAuthorizedAddress) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
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
func (msg *MsgDeleteAuthorizedAddress) Route() string {
	return RouterKey
}

func (msg *MsgDeleteAuthorizedAddress) Type() string {
	return TypeMsgDeleteAuthorizedAddress
}

func (msg *MsgDeleteAuthorizedAddress) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgDeleteAuthorizedAddress) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgDeleteAuthorizedAddress) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
