package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgSubmitGeneralEncryptedTx = "submit_general_encrypted_tx"

var _ sdk.Msg = &MsgSubmitGeneralEncryptedTx{}

func NewMsgSubmitGeneralEncryptedTx(creator string, data string, identity string) *MsgSubmitGeneralEncryptedTx {
	return &MsgSubmitGeneralEncryptedTx{
		Creator:  creator,
		Data:     data,
		Identity: identity,
	}
}

func (msg *MsgSubmitGeneralEncryptedTx) Route() string {
	return RouterKey
}

func (msg *MsgSubmitGeneralEncryptedTx) Type() string {
	return TypeMsgSubmitGeneralEncryptedTx
}

func (msg *MsgSubmitGeneralEncryptedTx) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgSubmitGeneralEncryptedTx) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgSubmitGeneralEncryptedTx) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
