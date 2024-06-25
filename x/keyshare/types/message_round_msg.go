package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)
const TypeMsgRoundMsg = "round_msg"
var _ sdk.Msg = &MsgRoundMsg{}

func NewMsgRoundMsg(creator string, innerMessage string, round string, dealer string) *MsgRoundMsg {
	return &MsgRoundMsg{
		Creator:      creator,
		InnerMessage: innerMessage,
		Round: round,
		DealerIndex: dealer,
	}
}

func (msg *MsgRoundMsg) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}

func (msg *MsgRoundMsg) Route() string {
	return RouterKey
}

func (msg *MsgRoundMsg) Type() string {
	return TypeMsgRoundMsg
}

func (msg *MsgRoundMsg) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgRoundMsg) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}


