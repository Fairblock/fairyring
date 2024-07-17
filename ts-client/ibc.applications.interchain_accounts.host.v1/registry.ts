import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsResponse } from "./types/ibc/applications/interchain_accounts/host/v1/query";
import { Params } from "./types/ibc/applications/interchain_accounts/host/v1/host";
import { QueryParamsRequest } from "./types/ibc/applications/interchain_accounts/host/v1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/ibc.applications.interchain_accounts.host.v1.QueryParamsResponse", QueryParamsResponse],
    ["/ibc.applications.interchain_accounts.host.v1.Params", Params],
    ["/ibc.applications.interchain_accounts.host.v1.QueryParamsRequest", QueryParamsRequest],
    
];

export { msgTypes }