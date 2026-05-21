package types

import (
	"testing"

	"github.com/Fairblock/fairyring/testutil/sample"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/stretchr/testify/require"
)

func TestMsgGetPrivateKeyshares_ValidateBasic(t *testing.T) {
	tests := []struct {
		name string
		msg  MsgRequestPrivateDecryptionKey
		err  error
	}{
		{
			name: "invalid address",
			msg: MsgRequestPrivateDecryptionKey{
				Creator: "invalid_address",
			},
			err: sdkerrors.ErrInvalidAddress,
		}, {
			name: "valid message",
			msg: MsgRequestPrivateDecryptionKey{
				Creator:    sample.AccAddress(),
				Identity:   "test_identity",
				SecpPubkey: "Anm+Zn753LusVaBilc6HCwcCm/zbLc4o2VnygVsW+BeY",
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
