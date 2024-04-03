package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgGetGeneralKeyshare = "get_general_keyshare"

var _ sdk.Msg = &MsgGetGeneralKeyshare{}

func NewMsgGetGeneralKeyshare(creator string, identity string) *MsgGetGeneralKeyshare {
	return &MsgGetGeneralKeyshare{
		Creator:  creator,
		Identity: identity,
	}
}

func (msg *MsgGetGeneralKeyshare) Route() string {
	return RouterKey
}

func (msg *MsgGetGeneralKeyshare) Type() string {
	return TypeMsgGetGeneralKeyshare
}

func (msg *MsgGetGeneralKeyshare) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgGetGeneralKeyshare) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgGetGeneralKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if len(msg.Identity) == 0 {
		return sdkerrors.Wrapf(ErrInvalidIdentity, "empty identity")
	}
	return nil
}
