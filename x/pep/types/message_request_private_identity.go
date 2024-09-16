package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgRequestPrivateIdentity{}

func NewMsgRequestPrivateIdentity(creator string, reqId string) *MsgRequestPrivateIdentity {
	return &MsgRequestPrivateIdentity{
		Creator: creator,
		ReqId:   reqId,
	}
}

func (msg *MsgRequestPrivateIdentity) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
