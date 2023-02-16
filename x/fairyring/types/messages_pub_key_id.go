package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreatePubKeyID = "create_pub_key_id"
)

var _ sdk.Msg = &MsgCreatePubKeyID{}

func NewMsgCreatePubKeyID(
	creator string,
	height uint64,
	publicKey string,
	ibeID string,

) *MsgCreatePubKeyID {
	return &MsgCreatePubKeyID{
		Creator:   creator,
		Height:    height,
		PublicKey: publicKey,
		IbeID:     ibeID,
	}
}

func (msg *MsgCreatePubKeyID) Route() string {
	return RouterKey
}

func (msg *MsgCreatePubKeyID) Type() string {
	return TypeMsgCreatePubKeyID
}

func (msg *MsgCreatePubKeyID) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreatePubKeyID) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreatePubKeyID) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
