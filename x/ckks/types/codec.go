package types

import (
	cdctypes "github.com/cosmos/cosmos-sdk/codec/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/msgservice"
	// this line is used by starport scaffolding # 1
)

func RegisterInterfaces(registry cdctypes.InterfaceRegistry) {
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitPkgShare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitRkgShareRound1{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitRkgShareRound2{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitGkgShare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitShamirShare{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgKeySwitchRequest{},
	)
	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgSubmitPksShare{},
	)
	// this line is used by starport scaffolding # 3

	registry.RegisterImplementations((*sdk.Msg)(nil),
		&MsgUpdateParams{},
	)
	msgservice.RegisterMsgServiceDesc(registry, &_Msg_serviceDesc)
}
