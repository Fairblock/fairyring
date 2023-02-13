package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRegisterHeight = "register_height"

var _ sdk.Msg = &MsgRegisterHeight{}

func NewMsgRegisterHeight(creator string, height string) *MsgRegisterHeight {
	return &MsgRegisterHeight{
		Creator: creator,
		Height:  height,
	}
}

func (msg *MsgRegisterHeight) Route() string {
	return RouterKey
}

func (msg *MsgRegisterHeight) Type() string {
	return TypeMsgRegisterHeight
}

func (msg *MsgRegisterHeight) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgRegisterHeight) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRegisterHeight) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
