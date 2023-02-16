package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateAggregatedKeyShare = "create_aggregated_key_share"
)

var _ sdk.Msg = &MsgCreateAggregatedKeyShare{}

func NewMsgCreateAggregatedKeyShare(
	creator string,
	height uint64,
	data string,
	publicKey string,
) *MsgCreateAggregatedKeyShare {
	return &MsgCreateAggregatedKeyShare{
		Creator:   creator,
		Height:    height,
		Data:      data,
		PublicKey: publicKey,
	}
}

func (msg *MsgCreateAggregatedKeyShare) Route() string {
	return RouterKey
}

func (msg *MsgCreateAggregatedKeyShare) Type() string {
	return TypeMsgCreateAggregatedKeyShare
}

func (msg *MsgCreateAggregatedKeyShare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateAggregatedKeyShare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreateAggregatedKeyShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
