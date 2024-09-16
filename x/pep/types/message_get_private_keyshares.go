package types

import (
	"encoding/base64"
	"errors"

	errorsmod "cosmossdk.io/errors"
	"github.com/btcsuite/btcd/btcec/v2"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgGetPrivateKeyshares{}

func NewMsgGetPrivateKeyshares(creator string, reqId string, pubkey string) *MsgGetPrivateKeyshares {
	return &MsgGetPrivateKeyshares{
		Creator:    creator,
		ReqId:      reqId,
		SecpPubkey: pubkey,
	}
}

func (msg *MsgGetPrivateKeyshares) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return errorsmod.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}

	if !isValidSecp256k1PubKey(msg.SecpPubkey) {
		return errors.New("invalid scep256k1 pubkey")
	}

	return nil
}

// Function to validate the secp256k1 public key
func isValidSecp256k1PubKey(pubKeyBase64 string) bool {
	// Decode the base64 public key
	pubKeyBytes, err := base64.StdEncoding.DecodeString(pubKeyBase64)
	if err != nil {
		return false
	}

	// Try to parse the public key
	_, err = btcec.ParsePubKey(pubKeyBytes)
	if err != nil {
		return false
	}

	// If no error, the public key is valid
	return true
}
