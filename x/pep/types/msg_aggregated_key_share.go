package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgSubmitDecryptionKey = "submit_decryption_key"
)

var _ sdk.Msg = &MsgSubmitDecryptionKey{}

func NewMsgSubmitDecryptionKey(
	creator string,
	height uint64,
	data string,
) *MsgSubmitDecryptionKey {
	return &MsgSubmitDecryptionKey{
		Creator: creator,
		Height:  height,
		Data:    data,
	}
}

func (msg *MsgSubmitDecryptionKey) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
