import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/applications/interchain_accounts/host/v1/tx";
import { QueryParamsRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/applications/interchain_accounts/host/v1/query";
import { Params } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/applications/interchain_accounts/host/v1/host";
import { QueryParamsResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/applications/interchain_accounts/host/v1/query";
import { MsgUpdateParamsResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/applications/interchain_accounts/host/v1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/ibc.applications.interchain_accounts.host.v1.MsgUpdateParams", MsgUpdateParams],
    ["/ibc.applications.interchain_accounts.host.v1.QueryParamsRequest", QueryParamsRequest],
    ["/ibc.applications.interchain_accounts.host.v1.Params", Params],
    ["/ibc.applications.interchain_accounts.host.v1.QueryParamsResponse", QueryParamsResponse],
    ["/ibc.applications.interchain_accounts.host.v1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    
];

export { msgTypes }