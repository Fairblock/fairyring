import { GeneratedType } from "@cosmjs/proto-signing";
import { Minter } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/mint";
import { QueryParamsResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/query";
import { QueryInflationRequest } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/query";
import { QueryInflationResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/query";
import { QueryParamsRequest } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/query";
import { QueryAnnualProvisionsRequest } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/query";
import { QueryAnnualProvisionsResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/query";
import { Params } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/mint";
import { GenesisState } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/genesis";
import { MsgUpdateParamsResponse } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/tx";
import { MsgUpdateParams } from "./types/../../../../../pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/mint/v1beta1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.mint.v1beta1.Minter", Minter],
    ["/cosmos.mint.v1beta1.QueryParamsResponse", QueryParamsResponse],
    ["/cosmos.mint.v1beta1.QueryInflationRequest", QueryInflationRequest],
    ["/cosmos.mint.v1beta1.QueryInflationResponse", QueryInflationResponse],
    ["/cosmos.mint.v1beta1.QueryParamsRequest", QueryParamsRequest],
    ["/cosmos.mint.v1beta1.QueryAnnualProvisionsRequest", QueryAnnualProvisionsRequest],
    ["/cosmos.mint.v1beta1.QueryAnnualProvisionsResponse", QueryAnnualProvisionsResponse],
    ["/cosmos.mint.v1beta1.Params", Params],
    ["/cosmos.mint.v1beta1.GenesisState", GenesisState],
    ["/cosmos.mint.v1beta1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/cosmos.mint.v1beta1.MsgUpdateParams", MsgUpdateParams],
    
];

export { msgTypes }