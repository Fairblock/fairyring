package types

import (
	"time"

	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRequestGeneralIdentity = "request_general_identity"

var _ sdk.Msg = &MsgRequestGeneralIdentity{}

func NewMsgRequestGeneralIdentity(
	creator string,
	estimatedDelay time.Duration,
	reqID string,
	registerContract bool,
) *MsgRequestGeneralIdentity {
	return &MsgRequestGeneralIdentity{
		Creator:          creator,
		EstimatedDelay:   &estimatedDelay,
		ReqId:            reqID,
		RegisterContract: registerContract,
	}
}

func (msg *MsgRequestGeneralIdentity) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
