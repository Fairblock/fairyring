import { GeneratedType } from "@cosmjs/proto-signing";
import { IdentifiedConnection } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { QueryConnectionConsensusStateRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgConnectionOpenAckResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { QueryConnectionParamsResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgConnectionOpenInitResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgConnectionOpenConfirmResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { Params } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { MsgConnectionOpenConfirm } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { ConnectionEnd } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { Version } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { MsgConnectionOpenAck } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { QueryConnectionClientStateResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionsResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgUpdateParams } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgConnectionOpenTryResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { GenesisState } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/genesis";
import { MsgConnectionOpenTry } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { QueryConnectionConsensusStateResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryClientConnectionsResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { MsgConnectionOpenInit } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { MsgUpdateParamsResponse } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/tx";
import { Counterparty } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { ClientPaths } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { ConnectionPaths } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/connection";
import { QueryConnectionRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionsRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryClientConnectionsRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionClientStateRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";
import { QueryConnectionParamsRequest } from "./types/../../../../../pkg/mod/github.com/cosmos/ibc-go/v8@v8.2.1/proto/ibc/core/connection/v1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/ibc.core.connection.v1.IdentifiedConnection", IdentifiedConnection],
    ["/ibc.core.connection.v1.QueryConnectionConsensusStateRequest", QueryConnectionConsensusStateRequest],
    ["/ibc.core.connection.v1.MsgConnectionOpenAckResponse", MsgConnectionOpenAckResponse],
    ["/ibc.core.connection.v1.QueryConnectionParamsResponse", QueryConnectionParamsResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenInitResponse", MsgConnectionOpenInitResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenConfirmResponse", MsgConnectionOpenConfirmResponse],
    ["/ibc.core.connection.v1.Params", Params],
    ["/ibc.core.connection.v1.MsgConnectionOpenConfirm", MsgConnectionOpenConfirm],
    ["/ibc.core.connection.v1.ConnectionEnd", ConnectionEnd],
    ["/ibc.core.connection.v1.Version", Version],
    ["/ibc.core.connection.v1.MsgConnectionOpenAck", MsgConnectionOpenAck],
    ["/ibc.core.connection.v1.QueryConnectionClientStateResponse", QueryConnectionClientStateResponse],
    ["/ibc.core.connection.v1.QueryConnectionsResponse", QueryConnectionsResponse],
    ["/ibc.core.connection.v1.MsgUpdateParams", MsgUpdateParams],
    ["/ibc.core.connection.v1.MsgConnectionOpenTryResponse", MsgConnectionOpenTryResponse],
    ["/ibc.core.connection.v1.GenesisState", GenesisState],
    ["/ibc.core.connection.v1.MsgConnectionOpenTry", MsgConnectionOpenTry],
    ["/ibc.core.connection.v1.QueryConnectionConsensusStateResponse", QueryConnectionConsensusStateResponse],
    ["/ibc.core.connection.v1.QueryConnectionResponse", QueryConnectionResponse],
    ["/ibc.core.connection.v1.QueryClientConnectionsResponse", QueryClientConnectionsResponse],
    ["/ibc.core.connection.v1.MsgConnectionOpenInit", MsgConnectionOpenInit],
    ["/ibc.core.connection.v1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/ibc.core.connection.v1.Counterparty", Counterparty],
    ["/ibc.core.connection.v1.ClientPaths", ClientPaths],
    ["/ibc.core.connection.v1.ConnectionPaths", ConnectionPaths],
    ["/ibc.core.connection.v1.QueryConnectionRequest", QueryConnectionRequest],
    ["/ibc.core.connection.v1.QueryConnectionsRequest", QueryConnectionsRequest],
    ["/ibc.core.connection.v1.QueryClientConnectionsRequest", QueryClientConnectionsRequest],
    ["/ibc.core.connection.v1.QueryConnectionClientStateRequest", QueryConnectionClientStateRequest],
    ["/ibc.core.connection.v1.QueryConnectionParamsRequest", QueryConnectionParamsRequest],
    
];

export { msgTypes }