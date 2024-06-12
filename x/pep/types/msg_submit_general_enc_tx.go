package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgSubmitGeneralEncryptedTx = "submit_general_encrypted_tx"

var _ sdk.Msg = &MsgSubmitGeneralEncryptedTx{}

func NewMsgSubmitGeneralEncryptedTx(creator string, data string, reqID string) *MsgSubmitGeneralEncryptedTx {
	return &MsgSubmitGeneralEncryptedTx{
		Creator: creator,
		Data:    data,
		ReqId:   reqID,
	}
}

func (msg *MsgSubmitGeneralEncryptedTx) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
