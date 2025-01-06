/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Params } from "./params";

export const protobufPackage = "fairyring.ckks";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryAggregatedRkgr1Request {
}

export interface QueryAggregatedRkgr1Response {
  aggregatedRkR1: string;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): QueryParamsRequest {
    return {};
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(base?: I): QueryParamsRequest {
    return QueryParamsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(_: I): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse = {
  encode(message: QueryParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    return { params: isSet(object.params) ? Params.fromJSON(object.params) : undefined };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(base?: I): QueryParamsResponse {
    return QueryParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(object: I): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseQueryAggregatedRkgr1Request(): QueryAggregatedRkgr1Request {
  return {};
}

export const QueryAggregatedRkgr1Request = {
  encode(_: QueryAggregatedRkgr1Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAggregatedRkgr1Request {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAggregatedRkgr1Request();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): QueryAggregatedRkgr1Request {
    return {};
  },

  toJSON(_: QueryAggregatedRkgr1Request): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAggregatedRkgr1Request>, I>>(base?: I): QueryAggregatedRkgr1Request {
    return QueryAggregatedRkgr1Request.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAggregatedRkgr1Request>, I>>(_: I): QueryAggregatedRkgr1Request {
    const message = createBaseQueryAggregatedRkgr1Request();
    return message;
  },
};

function createBaseQueryAggregatedRkgr1Response(): QueryAggregatedRkgr1Response {
  return { aggregatedRkR1: "" };
}

export const QueryAggregatedRkgr1Response = {
  encode(message: QueryAggregatedRkgr1Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.aggregatedRkR1 !== "") {
      writer.uint32(10).string(message.aggregatedRkR1);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAggregatedRkgr1Response {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAggregatedRkgr1Response();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.aggregatedRkR1 = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryAggregatedRkgr1Response {
    return { aggregatedRkR1: isSet(object.aggregatedRkR1) ? String(object.aggregatedRkR1) : "" };
  },

  toJSON(message: QueryAggregatedRkgr1Response): unknown {
    const obj: any = {};
    if (message.aggregatedRkR1 !== "") {
      obj.aggregatedRkR1 = message.aggregatedRkR1;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAggregatedRkgr1Response>, I>>(base?: I): QueryAggregatedRkgr1Response {
    return QueryAggregatedRkgr1Response.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAggregatedRkgr1Response>, I>>(object: I): QueryAggregatedRkgr1Response {
    const message = createBaseQueryAggregatedRkgr1Response();
    message.aggregatedRkR1 = object.aggregatedRkR1 ?? "";
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a list of AggregatedRkgr1 items. */
  AggregatedRkgr1(request: QueryAggregatedRkgr1Request): Promise<QueryAggregatedRkgr1Response>;
}

export const QueryServiceName = "fairyring.ckks.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.AggregatedRkgr1 = this.AggregatedRkgr1.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(_m0.Reader.create(data)));
  }

  AggregatedRkgr1(request: QueryAggregatedRkgr1Request): Promise<QueryAggregatedRkgr1Response> {
    const data = QueryAggregatedRkgr1Request.encode(request).finish();
    const promise = this.rpc.request(this.service, "AggregatedRkgr1", data);
    return promise.then((data) => QueryAggregatedRkgr1Response.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
