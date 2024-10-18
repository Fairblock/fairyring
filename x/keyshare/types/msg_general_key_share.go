package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitGeneralKeyshare{}

func NewMsgSubmitGeneralKeyshare(
	creator string,
	idType string,
	idValue string,
	keyshare string,
	keyshareIndex uint64,
) *MsgSubmitGeneralKeyshare {
	return &MsgSubmitGeneralKeyshare{
		Creator:       creator,
		IdType:        idType,
		IdValue:       idValue,
		Keyshare:      keyshare,
		KeyshareIndex: keyshareIndex,
	}
}

func (msg *MsgSubmitGeneralKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
