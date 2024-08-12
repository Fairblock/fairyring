import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/consensus/v1/tx";
import { MsgUpdateParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/consensus/v1/tx";
import { QueryParamsRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/consensus/v1/query";
import { QueryParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/consensus/v1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.consensus.v1.MsgUpdateParams", MsgUpdateParams],
    ["/cosmos.consensus.v1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/cosmos.consensus.v1.QueryParamsRequest", QueryParamsRequest],
    ["/cosmos.consensus.v1.QueryParamsResponse", QueryParamsResponse],
    
];

export { msgTypes }