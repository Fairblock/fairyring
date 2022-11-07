package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRegisterValidator = "register_validator"

var _ sdk.Msg = &MsgRegisterValidator{}

func NewMsgRegisterValidator(creator string) *MsgRegisterValidator {
	return &MsgRegisterValidator{
		Creator: creator,
	}
}

func (msg *MsgRegisterValidator) Route() string {
	return RouterKey
}

func (msg *MsgRegisterValidator) Type() string {
	return TypeMsgRegisterValidator
}

func (msg *MsgRegisterValidator) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgRegisterValidator) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRegisterValidator) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
