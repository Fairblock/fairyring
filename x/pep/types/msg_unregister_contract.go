package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgUnregisterContract = "unregister_contract"

var _ sdk.Msg = &MsgRegisterContract{}

func NewMsgUnregisterContract(creator string, contractAddr string, identity string) *MsgUnregisterContract {
	return &MsgUnregisterContract{
		Creator:         creator,
		ContractAddress: contractAddr,
		Identity:        identity,
	}
}

func (msg *MsgUnregisterContract) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}

	_, err = sdk.AccAddressFromBech32(msg.ContractAddress)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid contract address (%s)", err)
	}

	return nil
}
