package types

import (
	sdkioerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgRemoveTrustedContract = "remove_trusted_contract"

var _ sdk.Msg = &MsgRemoveTrustedContract{}

func NewMsgRemoveTrustedContract(authority string, contractAddr string) *MsgRemoveTrustedContract {
	return &MsgRemoveTrustedContract{
		Authority:       authority,
		ContractAddress: contractAddr,
	}
}

func (msg *MsgRemoveTrustedContract) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Authority)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid authority address (%s)", err)
	}

	_, err = sdk.AccAddressFromBech32(msg.ContractAddress)
	if err != nil {
		return sdkioerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid contract address (%s)", err)
	}

	return nil
}
