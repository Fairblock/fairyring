package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitEncryptedKeyshare{}

func NewMsgSubmitEncryptedKeyshare(creator string, identity string, encryptedKeyshare string, keyshareIndex string, receivedTimestamp string, receivedBlockHeight string) *MsgSubmitEncryptedKeyshare {
  return &MsgSubmitEncryptedKeyshare{
		Creator: creator,
    Identity: identity,
    EncryptedKeyshare: encryptedKeyshare,
    KeyshareIndex: keyshareIndex,
    ReceivedTimestamp: receivedTimestamp,
    ReceivedBlockHeight: receivedBlockHeight,
	}
}

func (msg *MsgSubmitEncryptedKeyshare) ValidateBasic() error {
  _, err := sdk.AccAddressFromBech32(msg.Creator)
  	if err != nil {
  		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
  	}
  return nil
}

