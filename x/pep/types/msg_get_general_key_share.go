package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRequestGeneralDecryptionKey = "request_general_decryption_key"

var _ sdk.Msg = &MsgRequestGeneralDecryptionKey{}

func NewMsgRequestGeneralDecryptionKey(creator string, identity string) *MsgRequestGeneralDecryptionKey {
	return &MsgRequestGeneralDecryptionKey{
		Creator:  creator,
		Identity: identity,
	}
}

func (msg *MsgRequestGeneralDecryptionKey) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
