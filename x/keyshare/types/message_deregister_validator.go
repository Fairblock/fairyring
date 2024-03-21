package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgDeRegisterValidator = "deregister_validator"

var _ sdk.Msg = &MsgRegisterValidator{}

func NewMsgDeRegisterValidator(creator string) *MsgDeRegisterValidator {
	return &MsgDeRegisterValidator{
		Creator: creator,
	}
}

func (msg *MsgDeRegisterValidator) Route() string {
	return RouterKey
}

func (msg *MsgDeRegisterValidator) Type() string {
	return TypeMsgDeRegisterValidator
}

func (msg *MsgDeRegisterValidator) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgDeRegisterValidator) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgDeRegisterValidator) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
