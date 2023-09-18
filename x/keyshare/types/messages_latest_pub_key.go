package types

import (
	sdkerrors "cosmossdk.io/errors"
	"encoding/hex"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const (
	TypeMsgCreateLatestPubKeyID = "create_latest_pub_key"
	PubKeyHexLength             = 96
	CommitmentHexLength         = 96
)

var _ sdk.Msg = &MsgCreateLatestPubKey{}

func NewMsgCreateLatestPubKey(
	creator string,
	publicKey string,
	commitments []string,
) *MsgCreateLatestPubKey {
	return &MsgCreateLatestPubKey{
		Creator:     creator,
		PublicKey:   publicKey,
		Commitments: commitments,
	}
}

func (msg *MsgCreateLatestPubKey) Route() string {
	return RouterKey
}

func (msg *MsgCreateLatestPubKey) Type() string {
	return TypeMsgCreateLatestPubKeyID
}

func (msg *MsgCreateLatestPubKey) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgCreateLatestPubKey) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgCreateLatestPubKey) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if len(msg.PublicKey) != PubKeyHexLength {
		return ErrInvalidPubKeyLength.Wrapf("expected hex encoding public key to be length: %d", CommitmentHexLength)
	}
	if _, err = hex.DecodeString(msg.PublicKey); err != nil {
		return ErrInvalidPubKey.Wrapf("expected hex encoded public key, got: %s", msg.PublicKey)
	}
	for _, c := range msg.Commitments {
		if len(c) != CommitmentHexLength {
			return ErrInvalidCommitmentLength.Wrapf("expected hex encoding commitment to be length: %d", CommitmentHexLength)
		}
		if _, err = hex.DecodeString(c); err != nil {
			return ErrInvalidCommitment.Wrapf("expected hex encoded commitment, got: %s", c)
		}
	}
	return nil
}
