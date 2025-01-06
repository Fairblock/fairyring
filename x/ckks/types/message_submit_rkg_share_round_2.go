package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitRkgShareRound2{}

func NewMsgSubmitRkgShareRound2(creator string, shareData string) *MsgSubmitRkgShareRound2 {
	return &MsgSubmitRkgShareRound2{
		Creator:   creator,
		ShareData: shareData,
	}
}

func (msg *MsgSubmitRkgShareRound2) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
