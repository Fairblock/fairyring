package types

import (
	sdkerrors "cosmossdk.io/errors"
	"encoding/hex"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgSubmitEncryptedTx = "submit_encrypted_tx"

var _ sdk.Msg = &MsgSubmitEncryptedTx{}

func NewMsgSubmitEncryptedTx(creator string, data string, targetBlockHeight uint64) *MsgSubmitEncryptedTx {
	return &MsgSubmitEncryptedTx{
		Creator:           creator,
		Data:              data,
		TargetBlockHeight: targetBlockHeight,
	}
}

func (msg *MsgSubmitEncryptedTx) Route() string {
	return RouterKey
}

func (msg *MsgSubmitEncryptedTx) Type() string {
	return TypeMsgSubmitEncryptedTx
}

func (msg *MsgSubmitEncryptedTx) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgSubmitEncryptedTx) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgSubmitEncryptedTx) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if _, err = hex.DecodeString(msg.Data); err != nil {
		return sdkerrors.Wrapf(ErrInvalidEncryptedTxData, "expected hex encoded data, got: %s", msg.Data)
	}
	return nil
}
