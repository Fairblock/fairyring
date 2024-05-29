package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateGeneralKeyShare = "create_general_key_share"
)

var _ sdk.Msg = &MsgCreateGeneralKeyShare{}

func NewMsgCreateGeneralKeyShare(
	creator string,
	idType string,
	idValue string,
	keyShare string,
	keyShareIndex uint64,

) *MsgCreateGeneralKeyShare {
	return &MsgCreateGeneralKeyShare{
		Creator:       creator,
		IdType:        idType,
		IdValue:       idValue,
		KeyShare:      keyShare,
		KeyShareIndex: keyShareIndex,
	}
}

func (msg *MsgCreateGeneralKeyShare) Route() string {
	return RouterKey
}

func (msg *MsgCreateGeneralKeyShare) Type() string {
	return TypeMsgCreateGeneralKeyShare
}

func (msg *MsgCreateGeneralKeyShare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateGeneralKeyShare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreateGeneralKeyShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
