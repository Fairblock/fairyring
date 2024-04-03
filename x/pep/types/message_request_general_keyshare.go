package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRequestGeneralKeyshare = "request_general_keyshare"

var _ sdk.Msg = &MsgRequestGeneralKeyshare{}

func NewMsgRequestGeneralKeyshare(creator string, requestId string) *MsgRequestGeneralKeyshare {
	return &MsgRequestGeneralKeyshare{
		Creator:   creator,
		RequestId: requestId,
	}
}

func (msg *MsgRequestGeneralKeyshare) Route() string {
	return RouterKey
}

func (msg *MsgRequestGeneralKeyshare) Type() string {
	return TypeMsgRequestGeneralKeyshare
}

func (msg *MsgRequestGeneralKeyshare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgRequestGeneralKeyshare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRequestGeneralKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if len(msg.RequestId) == 0 {
		return sdkerrors.Wrapf(ErrInvalidRequestID, "empty request id")
	}
	return nil
}
