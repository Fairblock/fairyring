package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgSendKeyshare = "send_keyshare"

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
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
