package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgRegisterValidator{}

func NewMsgDeRegisterValidator(creator string) *MsgDeRegisterValidator {
	return &MsgDeRegisterValidator{
		Creator: creator,
	}
}

func (msg *MsgDeRegisterValidator) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
