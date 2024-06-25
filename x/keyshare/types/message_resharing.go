package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)
const TypeMsgResharing = "resharing"
var _ sdk.Msg = &MsgResharing{}

func NewMsgResharing(creator string, oldGroup *Group, newGroup *Group, timeout string) *MsgResharing {
  return &MsgResharing{
		Creator: creator,
    OldGroup: oldGroup,
    NewGroup: newGroup,
    Timeout: timeout,
	}
}

func (msg *MsgResharing) ValidateBasic() error {
  _, err := sdk.AccAddressFromBech32(msg.Creator)
  	if err != nil {
  		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
  	}
  return nil
}
func (msg *MsgResharing) Route() string {
	return RouterKey
}

func (msg *MsgResharing) Type() string {
	return TypeMsgResharing
}

func (msg *MsgResharing) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgResharing) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}



