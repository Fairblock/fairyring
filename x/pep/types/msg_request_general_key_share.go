package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRequestGeneralKeyshare = "request_general_keyshare"

var _ sdk.Msg = &MsgRequestGeneralKeyshare{}

func NewMsgRequestGeneralKeyshare(creator string) *MsgRequestGeneralKeyshare {
	return &MsgRequestGeneralKeyshare{
		Creator: creator,
	}
}

func (msg *MsgRequestGeneralKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
