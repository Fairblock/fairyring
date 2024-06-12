package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateAggregatedKeyShare = "create_aggregated_key_share"
)

var _ sdk.Msg = &MsgCreateAggregatedKeyShare{}

func NewMsgCreateAggregatedKeyShare(
	creator string,
	height uint64,
	data string,
) *MsgCreateAggregatedKeyShare {
	return &MsgCreateAggregatedKeyShare{
		Creator: creator,
		Height:  height,
		Data:    data,
	}
}

func (msg *MsgCreateAggregatedKeyShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
