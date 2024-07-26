package types

import (
	sdkerrors "cosmossdk.io/errors"
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

func (msg *MsgSubmitEncryptedTx) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
