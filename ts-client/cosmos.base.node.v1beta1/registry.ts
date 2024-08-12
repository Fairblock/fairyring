import { GeneratedType } from "@cosmjs/proto-signing";
import { ConfigRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/base/node/v1beta1/query";
import { ConfigResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/base/node/v1beta1/query";
import { StatusRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/base/node/v1beta1/query";
import { StatusResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/cosmos-sdk@v0.50.8-fairyring/proto/cosmos/base/node/v1beta1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.base.node.v1beta1.ConfigRequest", ConfigRequest],
    ["/cosmos.base.node.v1beta1.ConfigResponse", ConfigResponse],
    ["/cosmos.base.node.v1beta1.StatusRequest", StatusRequest],
    ["/cosmos.base.node.v1beta1.StatusResponse", StatusResponse],
    
];

export { msgTypes }