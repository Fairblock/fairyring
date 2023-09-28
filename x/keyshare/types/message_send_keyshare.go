package types

import (
	sdkerrors "cosmossdk.io/errors"
	"encoding/hex"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgSendKeyshare = "send_keyshare"
	KeyShareHexLen      = 192
)

var _ sdk.Msg = &MsgSendKeyshare{}

func NewMsgSendKeyshare(creator string, message string, keyShareIndex uint64, blockHeight uint64) *MsgSendKeyshare {
	return &MsgSendKeyshare{
		Creator:       creator,
		Message:       message,
		KeyShareIndex: keyShareIndex,
		BlockHeight:   blockHeight,
	}
}

func (msg *MsgSendKeyshare) Route() string {
	return RouterKey
}

func (msg *MsgSendKeyshare) Type() string {
	return TypeMsgSendKeyshare
}

func (msg *MsgSendKeyshare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgSendKeyshare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgSendKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if len(msg.Message) != KeyShareHexLen {
		return ErrInvalidKeyShareLength.Wrapf("expected hex encoded key share length to be %d", KeyShareHexLen)
	}
	if _, err = hex.DecodeString(msg.Message); err != nil {
		return ErrInvalidShare.Wrapf("expected hex encoded key share, got: %s", msg.Message)
	}
	if msg.KeyShareIndex < 1 {
		return ErrInvalidShare.Wrapf("expected key share index to be at least 1, got: %d", msg.KeyShareIndex)
	}
	return nil
}
