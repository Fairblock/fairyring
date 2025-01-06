package types

import (
	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitPkgShare{}

func NewMsgSubmitPkgShare(creator string, shareData string) *MsgSubmitPkgShare {
	return &MsgSubmitPkgShare{
		Creator:   creator,
		ShareData: shareData,
	}
}

func (msg *MsgSubmitPkgShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
