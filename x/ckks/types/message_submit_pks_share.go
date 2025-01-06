package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitPksShare{}

func NewMsgSubmitPksShare(creator string, shareData string) *MsgSubmitPksShare {
	return &MsgSubmitPksShare{
		Creator:   creator,
		ShareData: shareData,
	}
}

func (msg *MsgSubmitPksShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
