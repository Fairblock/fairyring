package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateLatestPubKeyID = "create_latest_pub_key"
)

var _ sdk.Msg = &MsgCreateLatestPubKey{}

func NewMsgCreateLatestPubKey(
	creator string,
	publicKey string,
) *MsgCreateLatestPubKey {
	return &MsgCreateLatestPubKey{
		Creator:   creator,
		PublicKey: publicKey,
	}
}

func (msg *MsgCreateLatestPubKey) Route() string {
	return RouterKey
}

func (msg *MsgCreateLatestPubKey) Type() string {
	return TypeMsgCreateLatestPubKeyID
}

func (msg *MsgCreateLatestPubKey) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateLatestPubKey) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreateLatestPubKey) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
