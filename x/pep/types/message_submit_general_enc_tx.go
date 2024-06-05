package types

import (
	sdkerrors "cosmossdk.io/errors"
	sdk "github.com/cosmos/cosmos-sdk/types"
	cosmoserror "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgSubmitGeneralEncryptedData = "submit_general_encrypted_data"

var _ sdk.Msg = &MsgSubmitGeneralEncryptedData{}

func NewMsgSubmitGeneralEncryptedData(creator string, data string, reqID string, dataType EncrytedDataType) *MsgSubmitGeneralEncryptedData {
	return &MsgSubmitGeneralEncryptedData{
		Creator:  creator,
		Data:     data,
		ReqId:    reqID,
		DataType: dataType,
	}
}

func (msg *MsgSubmitGeneralEncryptedData) Route() string {
	return RouterKey
}

func (msg *MsgSubmitGeneralEncryptedData) Type() string {
	return TypeMsgSubmitGeneralEncryptedData
}

func (msg *MsgSubmitGeneralEncryptedData) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgSubmitGeneralEncryptedData) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgSubmitGeneralEncryptedData) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(cosmoserror.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
