package types

import (
	"encoding/hex"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	KeyshareHexLen = 192
)

var _ sdk.Msg = &MsgSendKeyshare{}

func NewMsgSendKeyshare(creator string, message string, keyShareIndex uint64, blockHeight uint64) *MsgSendKeyshare {
	return &MsgSendKeyshare{
		Creator:       creator,
		Message:       message,
		KeyshareIndex: keyShareIndex,
		BlockHeight:   blockHeight,
	}
}

func (msg *MsgSendKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if len(msg.Message) != KeyshareHexLen {
		return ErrInvalidKeyshareLength.Wrapf("expected hex encoded key share length to be %d", KeyshareHexLen)
	}
	if _, err = hex.DecodeString(msg.Message); err != nil {
		return ErrInvalidShare.Wrapf("expected hex encoded key share, got: %s", msg.Message)
	}
	if msg.KeyshareIndex < 1 {
		return ErrInvalidShare.Wrapf("expected key share index to be at least 1, got: %d", msg.KeyshareIndex)
	}
	return nil
}
