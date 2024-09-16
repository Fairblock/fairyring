package types

import (
	errorsmod "cosmossdk.io/errors"
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
	return nil
}
