package types

import (
	"errors"

	errorsmod "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgSubmitEncryptedKeyshare{}

func NewMsgSubmitEncryptedKeyshare(
	creator string,
	identity string,
	requester string,
	encryptedKeyshare string,
	keyshareIndex uint64,
) *MsgSubmitEncryptedKeyshare {
	return &MsgSubmitEncryptedKeyshare{
		Creator:           creator,
		Identity:          identity,
		EncryptedKeyshare: encryptedKeyshare,
		KeyshareIndex:     keyshareIndex,
		Requester:         requester,
	}
}

func (msg *MsgSubmitEncryptedKeyshare) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}

	if msg.Identity == "" || msg.EncryptedKeyshare == "" || msg.Requester == "" {
		return errors.New("identity, encryptedKeyshares and requester cannot be blank")
	}

	return nil
}
