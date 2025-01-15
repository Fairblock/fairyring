import { GeneratedType } from "@cosmjs/proto-signing";
import { GenesisState } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/genesis";
import { QueryGrantsResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/query";
import { QueryGranteeGrantsRequest } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/query";
import { MsgRevokeResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/tx";
import { QueryGranterGrantsRequest } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/query";
import { QueryGranterGrantsResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/query";
import { EventGrant } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/event";
import { QueryGrantsRequest } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/query";
import { MsgGrant } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/tx";
import { MsgExec } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/tx";
import { MsgExecResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/tx";
import { GenericAuthorization } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/authz";
import { Grant } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/authz";
import { GrantQueueItem } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/authz";
import { EventRevoke } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/event";
import { MsgGrantResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/tx";
import { MsgRevoke } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/tx";
import { GrantAuthorization } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/authz";
import { QueryGranteeGrantsResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring-2/proto/cosmos/authz/v1beta1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.authz.v1beta1.GenesisState", GenesisState],
    ["/cosmos.authz.v1beta1.QueryGrantsResponse", QueryGrantsResponse],
    ["/cosmos.authz.v1beta1.QueryGranteeGrantsRequest", QueryGranteeGrantsRequest],
    ["/cosmos.authz.v1beta1.MsgRevokeResponse", MsgRevokeResponse],
    ["/cosmos.authz.v1beta1.QueryGranterGrantsRequest", QueryGranterGrantsRequest],
    ["/cosmos.authz.v1beta1.QueryGranterGrantsResponse", QueryGranterGrantsResponse],
    ["/cosmos.authz.v1beta1.EventGrant", EventGrant],
    ["/cosmos.authz.v1beta1.QueryGrantsRequest", QueryGrantsRequest],
    ["/cosmos.authz.v1beta1.MsgGrant", MsgGrant],
    ["/cosmos.authz.v1beta1.MsgExec", MsgExec],
    ["/cosmos.authz.v1beta1.MsgExecResponse", MsgExecResponse],
    ["/cosmos.authz.v1beta1.GenericAuthorization", GenericAuthorization],
    ["/cosmos.authz.v1beta1.Grant", Grant],
    ["/cosmos.authz.v1beta1.GrantQueueItem", GrantQueueItem],
    ["/cosmos.authz.v1beta1.EventRevoke", EventRevoke],
    ["/cosmos.authz.v1beta1.MsgGrantResponse", MsgGrantResponse],
    ["/cosmos.authz.v1beta1.MsgRevoke", MsgRevoke],
    ["/cosmos.authz.v1beta1.GrantAuthorization", GrantAuthorization],
    ["/cosmos.authz.v1beta1.QueryGranteeGrantsResponse", QueryGranteeGrantsResponse],
    
];

export { msgTypes }