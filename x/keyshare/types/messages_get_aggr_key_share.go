package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgGetAggrKeyshare = "get_aggr_key_share"
)

var _ sdk.Msg = &MsgGetAggrKeyshare{}

func NewMsgGetAggrKeyshare(
	Identity string,
	Creator string,
	

) *MsgGetAggrKeyshare {
	return &MsgGetAggrKeyshare{
		Identity: Identity,
		Creator: Creator,
	}
}

func (msg *MsgGetAggrKeyshare) Route() string {
	return RouterKey
}

func (msg *MsgGetAggrKeyshare) Type() string {
	return TypeMsgGetAggrKeyshare
}


func (msg *MsgGetAggrKeyshare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgGetAggrKeyshare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgGetAggrKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}