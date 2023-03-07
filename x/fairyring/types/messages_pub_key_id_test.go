package types

import (
	"testing"

	"fairyring/testutil/sample"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/stretchr/testify/require"
)

func TestMsgCreatePubKeyID_ValidateBasic(t *testing.T) {
	tests := []struct {
		name string
		msg  MsgCreatePubKeyID
		err  error
	}{
		{
			name: "invalid address",
			msg: MsgCreatePubKeyID{
				Creator: "invalid_address",
			},
			err: sdkerrors.ErrInvalidAddress,
		}, {
			name: "valid address",
			msg: MsgCreatePubKeyID{
				Creator: sample.AccAddress(),
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

func TestMsgUpdatePubKeyID_ValidateBasic(t *testing.T) {
	tests := []struct {
		name string
		msg  MsgUpdatePubKeyID
		err  error
	}{
		{
			name: "invalid address",
			msg: MsgUpdatePubKeyID{
				Creator: "invalid_address",
			},
			err: sdkerrors.ErrInvalidAddress,
		}, {
			name: "valid address",
			msg: MsgUpdatePubKeyID{
				Creator: sample.AccAddress(),
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

func TestMsgDeletePubKeyID_ValidateBasic(t *testing.T) {
	tests := []struct {
		name string
		msg  MsgDeletePubKeyID
		err  error
	}{
		{
			name: "invalid address",
			msg: MsgDeletePubKeyID{
				Creator: "invalid_address",
			},
			err: sdkerrors.ErrInvalidAddress,
		}, {
			name: "valid address",
			msg: MsgDeletePubKeyID{
				Creator: sample.AccAddress(),
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
