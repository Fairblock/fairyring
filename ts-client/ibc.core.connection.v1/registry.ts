import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgConnectionOpenInitResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { QueryConnectionResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionParamsResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgConnectionOpenTryResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { ConnectionPaths } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { QueryConnectionRequest } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionConsensusStateRequest } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { ClientPaths } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { Params } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { QueryConnectionsResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgConnectionOpenAckResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgUpdateParams } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { ConnectionEnd } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { MsgConnectionOpenTry } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgConnectionOpenAck } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgUpdateParamsResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgConnectionOpenConfirmResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { QueryClientConnectionsResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionClientStateRequest } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionParamsRequest } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { GenesisState } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/genesis";
import { QueryConnectionConsensusStateResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgConnectionOpenInit } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgConnectionOpenConfirm } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { Counterparty } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { Version } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { IdentifiedConnection } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { QueryConnectionClientStateResponse } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionsRequest } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryClientConnectionsRequest } from "./types/../../../go/pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/ibc.core.connection.v1.MsgConnectionOpenInitResponse", MsgConnectionOpenInitResponse],
    ["/ibc.core.connection.v1.QueryConnectionResponse", QueryConnectionResponse],
    ["/ibc.core.connection.v1.QueryConnectionParamsResponse", QueryConnectionParamsResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenTryResponse", MsgConnectionOpenTryResponse],
    ["/ibc.core.connection.v1.ConnectionPaths", ConnectionPaths],
    ["/ibc.core.connection.v1.QueryConnectionRequest", QueryConnectionRequest],
    ["/ibc.core.connection.v1.QueryConnectionConsensusStateRequest", QueryConnectionConsensusStateRequest],
    ["/ibc.core.connection.v1.ClientPaths", ClientPaths],
    ["/ibc.core.connection.v1.Params", Params],
    ["/ibc.core.connection.v1.QueryConnectionsResponse", QueryConnectionsResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenAckResponse", MsgConnectionOpenAckResponse],
    ["/ibc.core.connection.v1.MsgUpdateParams", MsgUpdateParams],
    ["/ibc.core.connection.v1.ConnectionEnd", ConnectionEnd],
    ["/ibc.core.connection.v1.MsgConnectionOpenTry", MsgConnectionOpenTry],
    ["/ibc.core.connection.v1.MsgConnectionOpenAck", MsgConnectionOpenAck],
    ["/ibc.core.connection.v1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenConfirmResponse", MsgConnectionOpenConfirmResponse],
    ["/ibc.core.connection.v1.QueryClientConnectionsResponse", QueryClientConnectionsResponse],
    ["/ibc.core.connection.v1.QueryConnectionClientStateRequest", QueryConnectionClientStateRequest],
    ["/ibc.core.connection.v1.QueryConnectionParamsRequest", QueryConnectionParamsRequest],
    ["/ibc.core.connection.v1.GenesisState", GenesisState],
    ["/ibc.core.connection.v1.QueryConnectionConsensusStateResponse", QueryConnectionConsensusStateResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenInit", MsgConnectionOpenInit],
    ["/ibc.core.connection.v1.MsgConnectionOpenConfirm", MsgConnectionOpenConfirm],
    ["/ibc.core.connection.v1.Counterparty", Counterparty],
    ["/ibc.core.connection.v1.Version", Version],
    ["/ibc.core.connection.v1.IdentifiedConnection", IdentifiedConnection],
    ["/ibc.core.connection.v1.QueryConnectionClientStateResponse", QueryConnectionClientStateResponse],
    ["/ibc.core.connection.v1.QueryConnectionsRequest", QueryConnectionsRequest],
    ["/ibc.core.connection.v1.QueryClientConnectionsRequest", QueryClientConnectionsRequest],
    
];

export { msgTypes }