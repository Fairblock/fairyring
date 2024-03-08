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
	numberOfValidators uint64,
	encryptedKeyShares []*EncryptedKeyShare,
) *MsgCreateLatestPubKey {
	return &MsgCreateLatestPubKey{
		Creator:            creator,
		PublicKey:          publicKey,
		Commitments:        commitments,
		NumberOfValidators: numberOfValidators,
		EncryptedKeyShares: encryptedKeyShares,
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
	if len(msg.Commitments) == 0 {
		return ErrEmptyCommitments
	}
	if msg.NumberOfValidators == 0 {
		return ErrInvalidNumberOfValidators.Wrapf("expected at least 1 validator, got: %d", msg.NumberOfValidators)
	}
	if msg.NumberOfValidators != uint64(len(msg.Commitments)) {
		return ErrNotMatchNumOfCommits.Wrapf("expected number of validators: %d, match number of commitments: %d", msg.NumberOfValidators, len(msg.Commitments))
	}
	if len(msg.EncryptedKeyShares) != len(msg.Commitments) {
		return ErrNotMatchNumOfEncryptedKeyShares.Wrapf("expected number of encrypted key shares: %d, match number of commitments: %d", len(msg.EncryptedKeyShares), len(msg.Commitments))
	}

	for _, c := range msg.Commitments {
		if len(c) != CommitmentHexLength {
			return ErrInvalidCommitmentLength.Wrapf("expected hex encoding commitment to be length: %d", CommitmentHexLength)
		}
		if _, err = hex.DecodeString(c); err != nil {
			return ErrInvalidCommitment.Wrapf("expected hex encoded commitment, got: %s", c)
		}
	}

	for i, v := range msg.EncryptedKeyShares {
		if v == nil {
			return ErrEmptyEncryptedShares
		}

		_, err := sdk.AccAddressFromBech32(v.Validator)
		if err != nil {
			return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid validator address in encrypted key share array index: [%d], Error: (%s)", i, err)
		}

		if len(v.Data) == 0 {
			return ErrInvalidEncryptedShareData.Wrapf("encrypted share data is empty")
		}

		if _, err = hex.DecodeString(v.Data); err != nil {
			return ErrInvalidEncryptedShareData.Wrapf("expected hex encoded encrypted key shares, got: %s", v.Data)
		}
	}
	return nil
}
