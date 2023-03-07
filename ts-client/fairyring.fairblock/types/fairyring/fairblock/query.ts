/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination";
import { EncryptedTx, EncryptedTxArray } from "./encrypted_tx";
import { FairblockExecutedNonce } from "./fairblock_executed_nonce";
import { FairblockNonce } from "./fairblock_nonce";
import { Params } from "./params";

export const protobufPackage = "fairyring.fairblock";

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

export interface QueryGetFairblockNonceRequest {
  address: string;
}

export interface QueryGetFairblockNonceResponse {
  fairblockNonce: FairblockNonce | undefined;
}

export interface QueryAllFairblockNonceRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllFairblockNonceResponse {
  fairblockNonce: FairblockNonce[];
  pagination: PageResponse | undefined;
}

export interface QueryGetFairblockExecutedNonceRequest {
  address: string;
}

export interface QueryGetFairblockExecutedNonceResponse {
  fairblockExecutedNonce: FairblockExecutedNonce | undefined;
}

export interface QueryAllFairblockExecutedNonceRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllFairblockExecutedNonceResponse {
  fairblockExecutedNonce: FairblockExecutedNonce[];
  pagination: PageResponse | undefined;
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

function createBaseQueryGetFairblockNonceRequest(): QueryGetFairblockNonceRequest {
  return { address: "" };
}

export const QueryGetFairblockNonceRequest = {
  encode(message: QueryGetFairblockNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetFairblockNonceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetFairblockNonceRequest();
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

  fromJSON(object: any): QueryGetFairblockNonceRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: QueryGetFairblockNonceRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetFairblockNonceRequest>, I>>(
    object: I,
  ): QueryGetFairblockNonceRequest {
    const message = createBaseQueryGetFairblockNonceRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseQueryGetFairblockNonceResponse(): QueryGetFairblockNonceResponse {
  return { fairblockNonce: undefined };
}

export const QueryGetFairblockNonceResponse = {
  encode(message: QueryGetFairblockNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fairblockNonce !== undefined) {
      FairblockNonce.encode(message.fairblockNonce, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetFairblockNonceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetFairblockNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fairblockNonce = FairblockNonce.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetFairblockNonceResponse {
    return {
      fairblockNonce: isSet(object.fairblockNonce) ? FairblockNonce.fromJSON(object.fairblockNonce) : undefined,
    };
  },

  toJSON(message: QueryGetFairblockNonceResponse): unknown {
    const obj: any = {};
    message.fairblockNonce !== undefined
      && (obj.fairblockNonce = message.fairblockNonce ? FairblockNonce.toJSON(message.fairblockNonce) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetFairblockNonceResponse>, I>>(
    object: I,
  ): QueryGetFairblockNonceResponse {
    const message = createBaseQueryGetFairblockNonceResponse();
    message.fairblockNonce = (object.fairblockNonce !== undefined && object.fairblockNonce !== null)
      ? FairblockNonce.fromPartial(object.fairblockNonce)
      : undefined;
    return message;
  },
};

function createBaseQueryAllFairblockNonceRequest(): QueryAllFairblockNonceRequest {
  return { pagination: undefined };
}

export const QueryAllFairblockNonceRequest = {
  encode(message: QueryAllFairblockNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllFairblockNonceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllFairblockNonceRequest();
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

  fromJSON(object: any): QueryAllFairblockNonceRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllFairblockNonceRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllFairblockNonceRequest>, I>>(
    object: I,
  ): QueryAllFairblockNonceRequest {
    const message = createBaseQueryAllFairblockNonceRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllFairblockNonceResponse(): QueryAllFairblockNonceResponse {
  return { fairblockNonce: [], pagination: undefined };
}

export const QueryAllFairblockNonceResponse = {
  encode(message: QueryAllFairblockNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.fairblockNonce) {
      FairblockNonce.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllFairblockNonceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllFairblockNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fairblockNonce.push(FairblockNonce.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllFairblockNonceResponse {
    return {
      fairblockNonce: Array.isArray(object?.fairblockNonce)
        ? object.fairblockNonce.map((e: any) => FairblockNonce.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllFairblockNonceResponse): unknown {
    const obj: any = {};
    if (message.fairblockNonce) {
      obj.fairblockNonce = message.fairblockNonce.map((e) => e ? FairblockNonce.toJSON(e) : undefined);
    } else {
      obj.fairblockNonce = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllFairblockNonceResponse>, I>>(
    object: I,
  ): QueryAllFairblockNonceResponse {
    const message = createBaseQueryAllFairblockNonceResponse();
    message.fairblockNonce = object.fairblockNonce?.map((e) => FairblockNonce.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGetFairblockExecutedNonceRequest(): QueryGetFairblockExecutedNonceRequest {
  return { address: "" };
}

export const QueryGetFairblockExecutedNonceRequest = {
  encode(message: QueryGetFairblockExecutedNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetFairblockExecutedNonceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetFairblockExecutedNonceRequest();
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

  fromJSON(object: any): QueryGetFairblockExecutedNonceRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: QueryGetFairblockExecutedNonceRequest): unknown {
    const obj: any = {};
    message.address !== undefined && (obj.address = message.address);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetFairblockExecutedNonceRequest>, I>>(
    object: I,
  ): QueryGetFairblockExecutedNonceRequest {
    const message = createBaseQueryGetFairblockExecutedNonceRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseQueryGetFairblockExecutedNonceResponse(): QueryGetFairblockExecutedNonceResponse {
  return { fairblockExecutedNonce: undefined };
}

export const QueryGetFairblockExecutedNonceResponse = {
  encode(message: QueryGetFairblockExecutedNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fairblockExecutedNonce !== undefined) {
      FairblockExecutedNonce.encode(message.fairblockExecutedNonce, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetFairblockExecutedNonceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetFairblockExecutedNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fairblockExecutedNonce = FairblockExecutedNonce.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetFairblockExecutedNonceResponse {
    return {
      fairblockExecutedNonce: isSet(object.fairblockExecutedNonce)
        ? FairblockExecutedNonce.fromJSON(object.fairblockExecutedNonce)
        : undefined,
    };
  },

  toJSON(message: QueryGetFairblockExecutedNonceResponse): unknown {
    const obj: any = {};
    message.fairblockExecutedNonce !== undefined && (obj.fairblockExecutedNonce = message.fairblockExecutedNonce
      ? FairblockExecutedNonce.toJSON(message.fairblockExecutedNonce)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetFairblockExecutedNonceResponse>, I>>(
    object: I,
  ): QueryGetFairblockExecutedNonceResponse {
    const message = createBaseQueryGetFairblockExecutedNonceResponse();
    message.fairblockExecutedNonce =
      (object.fairblockExecutedNonce !== undefined && object.fairblockExecutedNonce !== null)
        ? FairblockExecutedNonce.fromPartial(object.fairblockExecutedNonce)
        : undefined;
    return message;
  },
};

function createBaseQueryAllFairblockExecutedNonceRequest(): QueryAllFairblockExecutedNonceRequest {
  return { pagination: undefined };
}

export const QueryAllFairblockExecutedNonceRequest = {
  encode(message: QueryAllFairblockExecutedNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllFairblockExecutedNonceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllFairblockExecutedNonceRequest();
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

  fromJSON(object: any): QueryAllFairblockExecutedNonceRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllFairblockExecutedNonceRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllFairblockExecutedNonceRequest>, I>>(
    object: I,
  ): QueryAllFairblockExecutedNonceRequest {
    const message = createBaseQueryAllFairblockExecutedNonceRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllFairblockExecutedNonceResponse(): QueryAllFairblockExecutedNonceResponse {
  return { fairblockExecutedNonce: [], pagination: undefined };
}

export const QueryAllFairblockExecutedNonceResponse = {
  encode(message: QueryAllFairblockExecutedNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.fairblockExecutedNonce) {
      FairblockExecutedNonce.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllFairblockExecutedNonceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllFairblockExecutedNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fairblockExecutedNonce.push(FairblockExecutedNonce.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllFairblockExecutedNonceResponse {
    return {
      fairblockExecutedNonce: Array.isArray(object?.fairblockExecutedNonce)
        ? object.fairblockExecutedNonce.map((e: any) => FairblockExecutedNonce.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllFairblockExecutedNonceResponse): unknown {
    const obj: any = {};
    if (message.fairblockExecutedNonce) {
      obj.fairblockExecutedNonce = message.fairblockExecutedNonce.map((e) =>
        e ? FairblockExecutedNonce.toJSON(e) : undefined
      );
    } else {
      obj.fairblockExecutedNonce = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllFairblockExecutedNonceResponse>, I>>(
    object: I,
  ): QueryAllFairblockExecutedNonceResponse {
    const message = createBaseQueryAllFairblockExecutedNonceResponse();
    message.fairblockExecutedNonce = object.fairblockExecutedNonce?.map((e) => FairblockExecutedNonce.fromPartial(e))
      || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
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
  /** Queries a FairblockNonce by index. */
  FairblockNonce(request: QueryGetFairblockNonceRequest): Promise<QueryGetFairblockNonceResponse>;
  /** Queries a list of FairblockNonce items. */
  FairblockNonceAll(request: QueryAllFairblockNonceRequest): Promise<QueryAllFairblockNonceResponse>;
  /** Queries a FairblockExecutedNonce by index. */
  FairblockExecutedNonce(
    request: QueryGetFairblockExecutedNonceRequest,
  ): Promise<QueryGetFairblockExecutedNonceResponse>;
  /** Queries a list of FairblockExecutedNonce items. */
  FairblockExecutedNonceAll(
    request: QueryAllFairblockExecutedNonceRequest,
  ): Promise<QueryAllFairblockExecutedNonceResponse>;
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
    this.FairblockNonce = this.FairblockNonce.bind(this);
    this.FairblockNonceAll = this.FairblockNonceAll.bind(this);
    this.FairblockExecutedNonce = this.FairblockExecutedNonce.bind(this);
    this.FairblockExecutedNonceAll = this.FairblockExecutedNonceAll.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new _m0.Reader(data)));
  }

  EncryptedTx(request: QueryGetEncryptedTxRequest): Promise<QueryGetEncryptedTxResponse> {
    const data = QueryGetEncryptedTxRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "EncryptedTx", data);
    return promise.then((data) => QueryGetEncryptedTxResponse.decode(new _m0.Reader(data)));
  }

  EncryptedTxAll(request: QueryAllEncryptedTxRequest): Promise<QueryAllEncryptedTxResponse> {
    const data = QueryAllEncryptedTxRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "EncryptedTxAll", data);
    return promise.then((data) => QueryAllEncryptedTxResponse.decode(new _m0.Reader(data)));
  }

  EncryptedTxAllFromHeight(
    request: QueryAllEncryptedTxFromHeightRequest,
  ): Promise<QueryAllEncryptedTxFromHeightResponse> {
    const data = QueryAllEncryptedTxFromHeightRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "EncryptedTxAllFromHeight", data);
    return promise.then((data) => QueryAllEncryptedTxFromHeightResponse.decode(new _m0.Reader(data)));
  }

  LatestHeight(request: QueryLatestHeightRequest): Promise<QueryLatestHeightResponse> {
    const data = QueryLatestHeightRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "LatestHeight", data);
    return promise.then((data) => QueryLatestHeightResponse.decode(new _m0.Reader(data)));
  }

  FairblockNonce(request: QueryGetFairblockNonceRequest): Promise<QueryGetFairblockNonceResponse> {
    const data = QueryGetFairblockNonceRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "FairblockNonce", data);
    return promise.then((data) => QueryGetFairblockNonceResponse.decode(new _m0.Reader(data)));
  }

  FairblockNonceAll(request: QueryAllFairblockNonceRequest): Promise<QueryAllFairblockNonceResponse> {
    const data = QueryAllFairblockNonceRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "FairblockNonceAll", data);
    return promise.then((data) => QueryAllFairblockNonceResponse.decode(new _m0.Reader(data)));
  }

  FairblockExecutedNonce(
    request: QueryGetFairblockExecutedNonceRequest,
  ): Promise<QueryGetFairblockExecutedNonceResponse> {
    const data = QueryGetFairblockExecutedNonceRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "FairblockExecutedNonce", data);
    return promise.then((data) => QueryGetFairblockExecutedNonceResponse.decode(new _m0.Reader(data)));
  }

  FairblockExecutedNonceAll(
    request: QueryAllFairblockExecutedNonceRequest,
  ): Promise<QueryAllFairblockExecutedNonceResponse> {
    const data = QueryAllFairblockExecutedNonceRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Query", "FairblockExecutedNonceAll", data);
    return promise.then((data) => QueryAllFairblockExecutedNonceResponse.decode(new _m0.Reader(data)));
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
