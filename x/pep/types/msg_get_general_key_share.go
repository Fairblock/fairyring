package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgGetGeneralKeyshare = "get_general_keyshare"

var _ sdk.Msg = &MsgGetGeneralKeyshare{}

func NewMsgGetGeneralKeyshare(creator string, reqID string) *MsgGetGeneralKeyshare {
	return &MsgGetGeneralKeyshare{
		Creator: creator,
		ReqId:   reqID,
	}
}

func (msg *MsgGetGeneralKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
