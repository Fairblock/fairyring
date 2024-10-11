package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRegisterContract = "register_contract"

var _ sdk.Msg = &MsgRegisterContract{}

func NewMsgRegisterContract(creator string, contractAddr string, identity string) *MsgRegisterContract {
	return &MsgRegisterContract{
		Creator:         creator,
		ContractAddress: contractAddr,
		Identity:        identity,
	}
}

func (msg *MsgRegisterContract) ValidateBasic() error {
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
