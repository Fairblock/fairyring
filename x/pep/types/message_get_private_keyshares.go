package types

import (
	"encoding/base64"

	errorsmod "cosmossdk.io/errors"
	"github.com/btcsuite/btcd/btcec/v2"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgRequestPrivateDecryptionKey{}

func NewMsgRequestPrivateDecryptionKey(
	creator string,
	identity string,
	pubkey string,
) *MsgRequestPrivateDecryptionKey {
	return &MsgRequestPrivateDecryptionKey{
		Creator:    creator,
		Identity:   identity,
		SecpPubkey: pubkey,
	}
}

func (msg *MsgRequestPrivateDecryptionKey) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}

	err = isValidSecp256k1Pubkey(msg.SecpPubkey)
	if err != nil {
		return err
	}

	return nil
}

// Function to validate the secp256k1 public key
func isValidSecp256k1Pubkey(pubkeyBase64 string) error {
	// Decode the base64 public key
	pubkeyBytes, err := base64.StdEncoding.DecodeString(pubkeyBase64)
	if err != nil {
		return err
	}

	// Try to parse the public key
	_, err = btcec.ParsePubKey(pubkeyBytes)
	if err != nil {
		return err
	}

	// If no error, the public key is valid
	return nil
}
