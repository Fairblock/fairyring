package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgRequestAggrKeyshare = "request_aggr_key_share"
)

var _ sdk.Msg = &MsgRequestAggrKeyshare{}

func NewMsgRequestAggrKeyshare(
	ReqId string,
	Creator string,


) *MsgRequestAggrKeyshare {
	return &MsgRequestAggrKeyshare{
		ReqId:ReqId,
		Creator: Creator,
	}
}

func (msg *MsgRequestAggrKeyshare) Route() string {
	return RouterKey
}

func (msg *MsgRequestAggrKeyshare) Type() string {
	return TypeMsgRequestAggrKeyshare
}

func (msg *MsgRequestAggrKeyshare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgRequestAggrKeyshare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgRequestAggrKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
