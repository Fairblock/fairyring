import { GeneratedType } from "@cosmjs/proto-signing";
import { Bech32PrefixRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { MsgUpdateParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/tx";
import { QueryParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryModuleAccountsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryModuleAccountByNameResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryModuleAccountsRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { AddressBytesToStringResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { AddressStringToBytesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryAccountAddressByIDResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryModuleAccountByNameRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { AddressStringToBytesRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { ModuleAccount } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/auth";
import { ModuleCredential } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/auth";
import { QueryAccountsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryAccountResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryAccountAddressByIDRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryAccountsRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryAccountInfoRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { BaseAccount } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/auth";
import { Params } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/auth";
import { QueryAccountRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { GenesisState } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/genesis";
import { QueryParamsRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { Bech32PrefixResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { AddressBytesToStringRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { QueryAccountInfoResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/query";
import { MsgUpdateParams } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/auth/v1beta1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.auth.v1beta1.Bech32PrefixRequest", Bech32PrefixRequest],
    ["/cosmos.auth.v1beta1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/cosmos.auth.v1beta1.QueryParamsResponse", QueryParamsResponse],
    ["/cosmos.auth.v1beta1.QueryModuleAccountsResponse", QueryModuleAccountsResponse],
    ["/cosmos.auth.v1beta1.QueryModuleAccountByNameResponse", QueryModuleAccountByNameResponse],
    ["/cosmos.auth.v1beta1.QueryModuleAccountsRequest", QueryModuleAccountsRequest],
    ["/cosmos.auth.v1beta1.AddressBytesToStringResponse", AddressBytesToStringResponse],
    ["/cosmos.auth.v1beta1.AddressStringToBytesResponse", AddressStringToBytesResponse],
    ["/cosmos.auth.v1beta1.QueryAccountAddressByIDResponse", QueryAccountAddressByIDResponse],
    ["/cosmos.auth.v1beta1.QueryModuleAccountByNameRequest", QueryModuleAccountByNameRequest],
    ["/cosmos.auth.v1beta1.AddressStringToBytesRequest", AddressStringToBytesRequest],
    ["/cosmos.auth.v1beta1.ModuleAccount", ModuleAccount],
    ["/cosmos.auth.v1beta1.ModuleCredential", ModuleCredential],
    ["/cosmos.auth.v1beta1.QueryAccountsResponse", QueryAccountsResponse],
    ["/cosmos.auth.v1beta1.QueryAccountResponse", QueryAccountResponse],
    ["/cosmos.auth.v1beta1.QueryAccountAddressByIDRequest", QueryAccountAddressByIDRequest],
    ["/cosmos.auth.v1beta1.QueryAccountsRequest", QueryAccountsRequest],
    ["/cosmos.auth.v1beta1.QueryAccountInfoRequest", QueryAccountInfoRequest],
    ["/cosmos.auth.v1beta1.BaseAccount", BaseAccount],
    ["/cosmos.auth.v1beta1.Params", Params],
    ["/cosmos.auth.v1beta1.QueryAccountRequest", QueryAccountRequest],
    ["/cosmos.auth.v1beta1.GenesisState", GenesisState],
    ["/cosmos.auth.v1beta1.QueryParamsRequest", QueryParamsRequest],
    ["/cosmos.auth.v1beta1.Bech32PrefixResponse", Bech32PrefixResponse],
    ["/cosmos.auth.v1beta1.AddressBytesToStringRequest", AddressBytesToStringRequest],
    ["/cosmos.auth.v1beta1.QueryAccountInfoResponse", QueryAccountInfoResponse],
    ["/cosmos.auth.v1beta1.MsgUpdateParams", MsgUpdateParams],
    
];

export { msgTypes }