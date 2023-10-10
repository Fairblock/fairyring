package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateAggregatedConditionalKeyShare = "create_aggregated_key_share"
)

var _ sdk.Msg = &MsgCreateAggregatedConditionalKeyShare{}

func NewMsgCreateAggregatedConditionalKeyShare(
	creator string,
	condition string,
	data string,
) *MsgCreateAggregatedConditionalKeyShare {
	return &MsgCreateAggregatedConditionalKeyShare{
		Creator: creator,
		Condition:  condition,
		Data:    data,
	}
}

func (msg *MsgCreateAggregatedConditionalKeyShare) Route() string {
	return RouterKey
}

func (msg *MsgCreateAggregatedConditionalKeyShare) Type() string {
	return TypeMsgCreateAggregatedConditionalKeyShare
}

func (msg *MsgCreateAggregatedConditionalKeyShare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateAggregatedConditionalKeyShare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreateAggregatedConditionalKeyShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
