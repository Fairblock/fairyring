package types

import (
	"testing"

	"github.com/Fairblock/fairyring/testutil/sample"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/stretchr/testify/require"
)

func TestMsgSubmitEncryptedKeyshare_ValidateBasic(t *testing.T) {
	tests := []struct {
		name string
		msg  MsgSubmitEncryptedKeyshare
		err  error
	}{
		{
			name: "invalid address",
			msg: MsgSubmitEncryptedKeyshare{
				Creator: "invalid_address",
			},
			err: sdkerrors.ErrInvalidAddress,
		}, {
			name: "valid message",
			msg: MsgSubmitEncryptedKeyshare{
				Creator:           sample.AccAddress(),
				Identity:          "test_identity",
				Requester:         sample.AccAddress(),
				SecpPubkey:        "test_secp_pubkey",
				EncryptedKeyshare: "test_encrypted_keyshare",
				KeyshareIndex:     1,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.msg.ValidateBasic()
			if tt.err != nil {
				require.ErrorIs(t, err, tt.err)
				return
			}
			require.NoError(t, err)
		})
	}
}
