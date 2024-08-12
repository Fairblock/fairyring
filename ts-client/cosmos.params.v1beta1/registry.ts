import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/query";
import { QueryParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/query";
import { QuerySubspacesRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/query";
import { ParameterChangeProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/params";
import { QuerySubspacesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/query";
import { Subspace } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/query";
import { ParamChange } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/params/v1beta1/params";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.params.v1beta1.QueryParamsRequest", QueryParamsRequest],
    ["/cosmos.params.v1beta1.QueryParamsResponse", QueryParamsResponse],
    ["/cosmos.params.v1beta1.QuerySubspacesRequest", QuerySubspacesRequest],
    ["/cosmos.params.v1beta1.ParameterChangeProposal", ParameterChangeProposal],
    ["/cosmos.params.v1beta1.QuerySubspacesResponse", QuerySubspacesResponse],
    ["/cosmos.params.v1beta1.Subspace", Subspace],
    ["/cosmos.params.v1beta1.ParamChange", ParamChange],
    
];

export { msgTypes }