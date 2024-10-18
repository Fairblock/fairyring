package types

import (
	"encoding/base64"
	"encoding/hex"

	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

var _ sdk.Msg = &MsgOverrideLatestPubKey{}

func NewMsgOverrideLatestPubKey(
	creator string,
	publicKey string,
	commitments []string,
	numberOfValidators uint64,
	encryptedKeyshares []*EncryptedKeyshare,
) *MsgOverrideLatestPubKey {
	return &MsgOverrideLatestPubKey{
		Creator:            creator,
		PublicKey:          publicKey,
		Commitments:        commitments,
		NumberOfValidators: numberOfValidators,
		EncryptedKeyshares: encryptedKeyshares,
	}
}

func (msg *MsgOverrideLatestPubKey) ValidateBasic() error {
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
	if len(msg.EncryptedKeyshares) != len(msg.Commitments) {
		return ErrNotMatchNumOfEncryptedKeyShares.Wrapf("expected number of encrypted key shares: %d, match number of commitments: %d", len(msg.EncryptedKeyshares), len(msg.Commitments))
	}

	for _, c := range msg.Commitments {
		if len(c) != CommitmentHexLength {
			return ErrInvalidCommitmentLength.Wrapf("expected hex encoding commitment to be length: %d", CommitmentHexLength)
		}
		if _, err = hex.DecodeString(c); err != nil {
			return ErrInvalidCommitment.Wrapf("expected hex encoded commitment, got: %s", c)
		}
	}

	for i, v := range msg.EncryptedKeyshares {
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

		if _, err = base64.StdEncoding.DecodeString(v.Data); err != nil {
			return ErrInvalidEncryptedShareData.Wrapf("expected base64 encoded encrypted key shares, got: %s", v.Data)
		}
	}
	return nil
}
