package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitGeneralKeyShare{}

func NewMsgSubmitGeneralKeyShare(
	creator string,
	idType string,
	idValue string,
	keyShare string,
	keyShareIndex uint64,
) *MsgSubmitGeneralKeyShare {
	return &MsgSubmitGeneralKeyShare{
		Creator:       creator,
		IdType:        idType,
		IdValue:       idValue,
		KeyShare:      keyShare,
		KeyShareIndex: keyShareIndex,
	}
}

func (msg *MsgSubmitGeneralKeyShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
