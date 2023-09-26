/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination";
import { EncryptedTx, EncryptedTxArray } from "./encrypted_tx";
import { Params } from "./params";
import { PepNonce } from "./pep_nonce";
import { ActivePubKey, QueuedPubKey } from "./pub_key";

export const protobufPackage = "fairyring.pep";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetEncryptedTxRequest {
  targetHeight: number;
  index: number;
}

export interface QueryGetEncryptedTxResponse {
  encryptedTx: EncryptedTx | undefined;
}

export interface QueryAllEncryptedTxRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllEncryptedTxResponse {
  encryptedTxArray: EncryptedTxArray[];
  pagination: PageResponse | undefined;
}

export interface QueryAllEncryptedTxFromHeightRequest {
  targetHeight: number;
}

export interface QueryAllEncryptedTxFromHeightResponse {
  encryptedTxArray: EncryptedTxArray | undefined;
}

export interface QueryLatestHeightRequest {
}

export interface QueryLatestHeightResponse {
  height: number;
}

export interface QueryGetPepNonceRequest {
  address: string;
}

export interface QueryGetPepNonceResponse {
  pepNonce: PepNonce | undefined;
}

export interface QueryAllPepNonceRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllPepNonceResponse {
  pepNonce: PepNonce[];
  pagination: PageResponse | undefined;
}

export interface QueryPubKeyRequest {
}

export interface QueryPubKeyResponse {
  activePubKey: ActivePubKey | undefined;
  queuedPubKey: QueuedPubKey | undefined;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest = {
  encode(_: QueryParamsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryParamsResponse {
    return { params: isSet(object.params) ? Params.fromJSON(object.params) : undefined };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(object: I): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseQueryGetEncryptedTxRequest(): QueryGetEncryptedTxRequest {
  return { targetHeight: 0, index: 0 };
}

export const QueryGetEncryptedTxRequest = {
  encode(message: QueryGetEncryptedTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHeight !== 0) {
      writer.uint32(8).uint64(message.targetHeight);
    }
    if (message.index !== 0) {
      writer.uint32(16).uint64(message.index);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetEncryptedTxRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetEncryptedTxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.targetHeight = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.index = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetEncryptedTxRequest {
    return {
      targetHeight: isSet(object.targetHeight) ? Number(object.targetHeight) : 0,
      index: isSet(object.index) ? Number(object.index) : 0,
    };
  },

  toJSON(message: QueryGetEncryptedTxRequest): unknown {
    const obj: any = {};
    message.targetHeight !== undefined && (obj.targetHeight = Math.round(message.targetHeight));
    message.index !== undefined && (obj.index = Math.round(message.index));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetEncryptedTxRequest>, I>>(object: I): QueryGetEncryptedTxRequest {
    const message = createBaseQueryGetEncryptedTxRequest();
    message.targetHeight = object.targetHeight ?? 0;
    message.index = object.index ?? 0;
    return message;
  },
};

function createBaseQueryGetEncryptedTxResponse(): QueryGetEncryptedTxResponse {
  return { encryptedTx: undefined };
}

export const QueryGetEncryptedTxResponse = {
  encode(message: QueryGetEncryptedTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedTx !== undefined) {
      EncryptedTx.encode(message.encryptedTx, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetEncryptedTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetEncryptedTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encryptedTx = EncryptedTx.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetEncryptedTxResponse {
    return { encryptedTx: isSet(object.encryptedTx) ? EncryptedTx.fromJSON(object.encryptedTx) : undefined };
  },

  toJSON(message: QueryGetEncryptedTxResponse): unknown {
    const obj: any = {};
    message.encryptedTx !== undefined
      && (obj.encryptedTx = message.encryptedTx ? EncryptedTx.toJSON(message.encryptedTx) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetEncryptedTxResponse>, I>>(object: I): QueryGetEncryptedTxResponse {
    const message = createBaseQueryGetEncryptedTxResponse();
    message.encryptedTx = (object.encryptedTx !== undefined && object.encryptedTx !== null)
      ? EncryptedTx.fromPartial(object.encryptedTx)
      : undefined;
    return message;
  },
};

function createBaseQueryAllEncryptedTxRequest(): QueryAllEncryptedTxRequest {
  return { pagination: undefined };
}

export const QueryAllEncryptedTxRequest = {
  encode(message: QueryAllEncryptedTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllEncryptedTxRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllEncryptedTxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllEncryptedTxRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllEncryptedTxRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllEncryptedTxRequest>, I>>(object: I): QueryAllEncryptedTxRequest {
    const message = createBaseQueryAllEncryptedTxRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllEncryptedTxResponse(): QueryAllEncryptedTxResponse {
  return { encryptedTxArray: [], pagination: undefined };
}

export const QueryAllEncryptedTxResponse = {
  encode(message: QueryAllEncryptedTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.encryptedTxArray) {
      EncryptedTxArray.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllEncryptedTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllEncryptedTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encryptedTxArray.push(EncryptedTxArray.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllEncryptedTxResponse {
    return {
      encryptedTxArray: Array.isArray(object?.encryptedTxArray)
        ? object.encryptedTxArray.map((e: any) => EncryptedTxArray.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllEncryptedTxResponse): unknown {
    const obj: any = {};
    if (message.encryptedTxArray) {
      obj.encryptedTxArray = message.encryptedTxArray.map((e) => e ? EncryptedTxArray.toJSON(e) : undefined);
    } else {
      obj.encryptedTxArray = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllEncryptedTxResponse>, I>>(object: I): QueryAllEncryptedTxResponse {
    const message = createBaseQueryAllEncryptedTxResponse();
    message.encryptedTxArray = object.encryptedTxArray?.map((e) => EncryptedTxArray.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllEncryptedTxFromHeightRequest(): QueryAllEncryptedTxFromHeightRequest {
  return { targetHeight: 0 };
}

export const QueryAllEncryptedTxFromHeightRequest = {
  encode(message: QueryAllEncryptedTxFromHeightRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHeight !== 0) {
      writer.uint32(8).uint64(message.targetHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllEncryptedTxFromHeightRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllEncryptedTxFromHeightRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.targetHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllEncryptedTxFromHeightRequest {
    return { targetHeight: isSet(object.targetHeight) ? Number(object.targetHeight) : 0 };
  },

  toJSON(message: QueryAllEncryptedTxFromHeightRequest): unknown {
    const obj: any = {};
    message.targetHeight !== undefined && (obj.targetHeight = Math.round(message.targetHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllEncryptedTxFromHeightRequest>, I>>(
    object: I,
  ): QueryAllEncryptedTxFromHeightRequest {
    const message = createBaseQueryAllEncryptedTxFromHeightRequest();
    message.targetHeight = object.targetHeight ?? 0;
    return message;
  },
};

function createBaseQueryAllEncryptedTxFromHeightResponse(): QueryAllEncryptedTxFromHeightResponse {
  return { encryptedTxArray: undefined };
}

export const QueryAllEncryptedTxFromHeightResponse = {
  encode(message: QueryAllEncryptedTxFromHeightResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedTxArray !== undefined) {
      EncryptedTxArray.encode(message.encryptedTxArray, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllEncryptedTxFromHeightResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllEncryptedTxFromHeightResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encryptedTxArray = EncryptedTxArray.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllEncryptedTxFromHeightResponse {
    return {
      encryptedTxArray: isSet(object.encryptedTxArray) ? EncryptedTxArray.fromJSON(object.encryptedTxArray) : undefined,
    };
  },

  toJSON(message: QueryAllEncryptedTxFromHeightResponse): unknown {
    const obj: any = {};
    message.encryptedTxArray !== undefined && (obj.encryptedTxArray = message.encryptedTxArray
      ? EncryptedTxArray.toJSON(message.encryptedTxArray)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllEncryptedTxFromHeightResponse>, I>>(
    object: I,
  ): QueryAllEncryptedTxFromHeightResponse {
    const message = createBaseQueryAllEncryptedTxFromHeightResponse();
    message.encryptedTxArray = (object.encryptedTxArray !== undefined && object.encryptedTxArray !== null)
      ? EncryptedTxArray.fromPartial(object.encryptedTxArray)
      : undefined;
    return message;
  },
};

function createBaseQueryLatestHeightRequest(): QueryLatestHeightRequest {
  return {};
}

export const QueryLatestHeightRequest = {
  encode(_: QueryLatestHeightRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryLatestHeightRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLatestHeightRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryLatestHeightRequest {
    return {};
  },

  toJSON(_: QueryLatestHeightRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryLatestHeightRequest>, I>>(_: I): QueryLatestHeightRequest {
    const message = createBaseQueryLatestHeightRequest();
    return message;
  },
};

function createBaseQueryLatestHeightResponse(): QueryLatestHeightResponse {
  return { height: 0 };
}

export const QueryLatestHeightResponse = {
  encode(message: QueryLatestHeightResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.height !== 0) {
      writer.uint32(8).uint64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryLatestHeightResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLatestHeightResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryLatestHeightResponse {
    return { height: isSet(object.height) ? Number(object.height) : 0 };
  },

  toJSON(message: QueryLatestHeightResponse): unknown {
    const obj: any = {};
    message.height !== undefined && (obj.height = Math.round(message.height));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryLatestHeightResponse>, I>>(object: I): QueryLatestHeightResponse {
    const message = createBaseQueryLatestHeightResponse();
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseQueryGetPepNonceRequest(): QueryGetPepNonceRequest {
  return { address: "" };
}

export const QueryGetPepNonceRequest = {
  encode(message: QueryGetPepNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetPepNonceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetPepNonceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.address = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetPepNonceRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: QueryGetPepNonceRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetPepNonceRequest>, I>>(object: I): QueryGetPepNonceRequest {
    const message = createBaseQueryGetPepNonceRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseQueryGetPepNonceResponse(): QueryGetPepNonceResponse {
  return { pepNonce: undefined };
}

export const QueryGetPepNonceResponse = {
  encode(message: QueryGetPepNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pepNonce !== undefined) {
      PepNonce.encode(message.pepNonce, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetPepNonceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetPepNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pepNonce = PepNonce.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetPepNonceResponse {
    return { pepNonce: isSet(object.pepNonce) ? PepNonce.fromJSON(object.pepNonce) : undefined };
  },

  toJSON(message: QueryGetPepNonceResponse): unknown {
    const obj: any = {};
    message.pepNonce !== undefined && (obj.pepNonce = message.pepNonce ? PepNonce.toJSON(message.pepNonce) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetPepNonceResponse>, I>>(object: I): QueryGetPepNonceResponse {
    const message = createBaseQueryGetPepNonceResponse();
    message.pepNonce = (object.pepNonce !== undefined && object.pepNonce !== null)
      ? PepNonce.fromPartial(object.pepNonce)
      : undefined;
    return message;
  },
};

function createBaseQueryAllPepNonceRequest(): QueryAllPepNonceRequest {
  return { pagination: undefined };
}

export const QueryAllPepNonceRequest = {
  encode(message: QueryAllPepNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllPepNonceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllPepNonceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pagination = PageRequest.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllPepNonceRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllPepNonceRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllPepNonceRequest>, I>>(object: I): QueryAllPepNonceRequest {
    const message = createBaseQueryAllPepNonceRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllPepNonceResponse(): QueryAllPepNonceResponse {
  return { pepNonce: [], pagination: undefined };
}

export const QueryAllPepNonceResponse = {
  encode(message: QueryAllPepNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.pepNonce) {
      PepNonce.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllPepNonceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllPepNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pepNonce.push(PepNonce.decode(reader, reader.uint32()));
          break;
        case 2:
          message.pagination = PageResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryAllPepNonceResponse {
    return {
      pepNonce: Array.isArray(object?.pepNonce) ? object.pepNonce.map((e: any) => PepNonce.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllPepNonceResponse): unknown {
    const obj: any = {};
    if (message.pepNonce) {
      obj.pepNonce = message.pepNonce.map((e) => e ? PepNonce.toJSON(e) : undefined);
    } else {
      obj.pepNonce = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllPepNonceResponse>, I>>(object: I): QueryAllPepNonceResponse {
    const message = createBaseQueryAllPepNonceResponse();
    message.pepNonce = object.pepNonce?.map((e) => PepNonce.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryPubKeyRequest(): QueryPubKeyRequest {
  return {};
}

export const QueryPubKeyRequest = {
  encode(_: QueryPubKeyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPubKeyRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPubKeyRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): QueryPubKeyRequest {
    return {};
  },

  toJSON(_: QueryPubKeyRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryPubKeyRequest>, I>>(_: I): QueryPubKeyRequest {
    const message = createBaseQueryPubKeyRequest();
    return message;
  },
};

function createBaseQueryPubKeyResponse(): QueryPubKeyResponse {
  return { activePubKey: undefined, queuedPubKey: undefined };
}

export const QueryPubKeyResponse = {
  encode(message: QueryPubKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activePubKey !== undefined) {
      ActivePubKey.encode(message.activePubKey, writer.uint32(10).fork()).ldelim();
    }
    if (message.queuedPubKey !== undefined) {
      QueuedPubKey.encode(message.queuedPubKey, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPubKeyResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPubKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activePubKey = ActivePubKey.decode(reader, reader.uint32());
          break;
        case 2:
          message.queuedPubKey = QueuedPubKey.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryPubKeyResponse {
    return {
      activePubKey: isSet(object.activePubKey) ? ActivePubKey.fromJSON(object.activePubKey) : undefined,
      queuedPubKey: isSet(object.queuedPubKey) ? QueuedPubKey.fromJSON(object.queuedPubKey) : undefined,
    };
  },

  toJSON(message: QueryPubKeyResponse): unknown {
    const obj: any = {};
    message.activePubKey !== undefined
      && (obj.activePubKey = message.activePubKey ? ActivePubKey.toJSON(message.activePubKey) : undefined);
    message.queuedPubKey !== undefined
      && (obj.queuedPubKey = message.queuedPubKey ? QueuedPubKey.toJSON(message.queuedPubKey) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryPubKeyResponse>, I>>(object: I): QueryPubKeyResponse {
    const message = createBaseQueryPubKeyResponse();
    message.activePubKey = (object.activePubKey !== undefined && object.activePubKey !== null)
      ? ActivePubKey.fromPartial(object.activePubKey)
      : undefined;
    message.queuedPubKey = (object.queuedPubKey !== undefined && object.queuedPubKey !== null)
      ? QueuedPubKey.fromPartial(object.queuedPubKey)
      : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a EncryptedTx by index. */
  EncryptedTx(request: QueryGetEncryptedTxRequest): Promise<QueryGetEncryptedTxResponse>;
  /** Queries a list of EncryptedTx items. */
  EncryptedTxAll(request: QueryAllEncryptedTxRequest): Promise<QueryAllEncryptedTxResponse>;
  /** Queries a list of EncryptedTx items. */
  EncryptedTxAllFromHeight(
    request: QueryAllEncryptedTxFromHeightRequest,
  ): Promise<QueryAllEncryptedTxFromHeightResponse>;
  /** Queries a list of LatestHeight items. */
  LatestHeight(request: QueryLatestHeightRequest): Promise<QueryLatestHeightResponse>;
  /** Queries a PepNonce by index. */
  PepNonce(request: QueryGetPepNonceRequest): Promise<QueryGetPepNonceResponse>;
  /** Queries a list of PepNonce items. */
  PepNonceAll(request: QueryAllPepNonceRequest): Promise<QueryAllPepNonceResponse>;
  /** Queries the public keys */
  PubKey(request: QueryPubKeyRequest): Promise<QueryPubKeyResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.EncryptedTx = this.EncryptedTx.bind(this);
    this.EncryptedTxAll = this.EncryptedTxAll.bind(this);
    this.EncryptedTxAllFromHeight = this.EncryptedTxAllFromHeight.bind(this);
    this.LatestHeight = this.LatestHeight.bind(this);
    this.PepNonce = this.PepNonce.bind(this);
    this.PepNonceAll = this.PepNonceAll.bind(this);
    this.PubKey = this.PubKey.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new _m0.Reader(data)));
  }

  EncryptedTx(request: QueryGetEncryptedTxRequest): Promise<QueryGetEncryptedTxResponse> {
    const data = QueryGetEncryptedTxRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "EncryptedTx", data);
    return promise.then((data) => QueryGetEncryptedTxResponse.decode(new _m0.Reader(data)));
  }

  EncryptedTxAll(request: QueryAllEncryptedTxRequest): Promise<QueryAllEncryptedTxResponse> {
    const data = QueryAllEncryptedTxRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "EncryptedTxAll", data);
    return promise.then((data) => QueryAllEncryptedTxResponse.decode(new _m0.Reader(data)));
  }

  EncryptedTxAllFromHeight(
    request: QueryAllEncryptedTxFromHeightRequest,
  ): Promise<QueryAllEncryptedTxFromHeightResponse> {
    const data = QueryAllEncryptedTxFromHeightRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "EncryptedTxAllFromHeight", data);
    return promise.then((data) => QueryAllEncryptedTxFromHeightResponse.decode(new _m0.Reader(data)));
  }

  LatestHeight(request: QueryLatestHeightRequest): Promise<QueryLatestHeightResponse> {
    const data = QueryLatestHeightRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "LatestHeight", data);
    return promise.then((data) => QueryLatestHeightResponse.decode(new _m0.Reader(data)));
  }

  PepNonce(request: QueryGetPepNonceRequest): Promise<QueryGetPepNonceResponse> {
    const data = QueryGetPepNonceRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "PepNonce", data);
    return promise.then((data) => QueryGetPepNonceResponse.decode(new _m0.Reader(data)));
  }

  PepNonceAll(request: QueryAllPepNonceRequest): Promise<QueryAllPepNonceResponse> {
    const data = QueryAllPepNonceRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "PepNonceAll", data);
    return promise.then((data) => QueryAllPepNonceResponse.decode(new _m0.Reader(data)));
  }

  PubKey(request: QueryPubKeyRequest): Promise<QueryPubKeyResponse> {
    const data = QueryPubKeyRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.pep.Query", "PubKey", data);
    return promise.then((data) => QueryPubKeyResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
