package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitEncryptedKeyshare{}

func NewMsgSubmitEncryptedKeyshare(
	creator string,
	identity string,
	requester string,
	encryptedKeyshare string,
	keyshareIndex uint64,
	receivedTimestamp uint64,
	receivedBlockHeight uint64,
) *MsgSubmitEncryptedKeyshare {
	return &MsgSubmitEncryptedKeyshare{
		Creator:             creator,
		Identity:            identity,
		EncryptedKeyshare:   encryptedKeyshare,
		KeyShareIndex:       keyshareIndex,
		ReceivedTimestamp:   receivedTimestamp,
		ReceivedBlockHeight: receivedBlockHeight,
		Requester:           requester,
	}
}

func (msg *MsgSubmitEncryptedKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
