package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgCreateGeneralKeyShare{}

func NewMsgCreateGeneralKeyShare(
	creator string,
	idType string,
	idValue string,
	keyShare string,
	keyShareIndex uint64,
) *MsgCreateGeneralKeyShare {
	return &MsgCreateGeneralKeyShare{
		Creator:       creator,
		IdType:        idType,
		IdValue:       idValue,
		KeyShare:      keyShare,
		KeyShareIndex: keyShareIndex,
	}
}

func (msg *MsgCreateGeneralKeyShare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
