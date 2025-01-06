/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination";
import { ActivePublicKey, PrivateDecryptionKey, QueuedPublicKey } from "../common/shared_types";
import { EncryptedTx, EncryptedTxArray, IdentityExecutionEntry } from "./encrypted_tx";
import { Params } from "./params";
import { PepNonce } from "./pep_nonce";

export const protobufPackage = "fairyring.pep";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

/** QueryGeneralIdentityRequest is request type for the Query/GeneralIdentity RPC method. */
export interface QueryGeneralIdentityRequest {
  identity: string;
}

/** QueryGeneralIdentityResponse is response type for the Query/GeneralIdentity RPC method. */
export interface QueryGeneralIdentityResponse {
  requestDetails: IdentityExecutionEntry | undefined;
}

/** QueryGeneralIdentityAllRequest is request type for the Query/GeneralIdentityAll RPC method. */
export interface QueryGeneralIdentityAllRequest {
  pagination: PageRequest | undefined;
}

/** QueryGeneralIdentityAllResponse is response type for the Query/GeneralIdentityAll RPC method. */
export interface QueryGeneralIdentityAllResponse {
  requestDetailsList: IdentityExecutionEntry[];
  pagination: PageResponse | undefined;
}

/** QueryEncryptedTxRequest is request type for the Query/EncryptedTx RPC method. */
export interface QueryEncryptedTxRequest {
  targetHeight: number;
  index: number;
}

/** QueryEncryptedTxResponse is response type for the Query/EncryptedTx RPC method. */
export interface QueryEncryptedTxResponse {
  encryptedTx: EncryptedTx | undefined;
}

/** QueryEncryptedTxAllRequest is request type for the Query/EncryptedTxAll RPC method. */
export interface QueryEncryptedTxAllRequest {
  pagination: PageRequest | undefined;
}

/** QueryEncryptedTxAllResponse is response type for the Query/EncryptedTxAll RPC method. */
export interface QueryEncryptedTxAllResponse {
  encryptedTxArray: EncryptedTxArray[];
  pagination: PageResponse | undefined;
}

/** QueryEncryptedTxAllFromHeightRequest is request type for the Query/EncryptedTxAllFromHeight RPC method. */
export interface QueryEncryptedTxAllFromHeightRequest {
  targetHeight: number;
}

/** QueryEncryptedTxAllFromHeightResponse is response type for the Query/EncryptedTxAllFromHeight RPC method. */
export interface QueryEncryptedTxAllFromHeightResponse {
  encryptedTxArray: EncryptedTxArray | undefined;
}

/** QueryLatestHeightRequest is request type for the Query/LatestHeight RPC method. */
export interface QueryLatestHeightRequest {
}

/** QueryLatestHeightResponse is response type for the Query/LatestHeight RPC method. */
export interface QueryLatestHeightResponse {
  height: number;
}

/** QueryPepNonceRequest is request type for the Query/PepNonce RPC method. */
export interface QueryPepNonceRequest {
  address: string;
}

/** QueryPepNonceResponse is response type for the Query/PepNonce RPC method. */
export interface QueryPepNonceResponse {
  pepNonce: PepNonce | undefined;
}

/** QueryPepNonceAllRequest is request type for the Query/PepNonceAll RPC method. */
export interface QueryPepNonceAllRequest {
  pagination: PageRequest | undefined;
}

/** QueryPepNonceAllResponse is response type for the Query/PepNonceAll RPC method. */
export interface QueryPepNonceAllResponse {
  pepNonce: PepNonce[];
  pagination: PageResponse | undefined;
}

/** QueryPubkeyRequest is request type for the Query/Pubkey RPC method. */
export interface QueryPubkeyRequest {
}

/** QueryPubkeyResponse is response type for the Query/Pubkey RPC method. */
export interface QueryPubkeyResponse {
  activePubkey: ActivePublicKey | undefined;
  queuedPubkey: QueuedPublicKey | undefined;
}

/** QueryPrivateIdentityRequest is request type for the Query/PrivateIdentity RPC method. */
export interface QueryPrivateIdentityRequest {
  identity: string;
}

/** QueryPrivateIdentityResponse is response type for the Query/PrivateIdentity RPC method. */
export interface QueryPrivateIdentityResponse {
  creator: string;
  identity: string;
  pubkey: string;
  privateDecryptionKeys: PrivateDecryptionKey[];
}

/** QueryDecryptDataRequest is request type for the Query/DecryptData RPC method. */
export interface QueryDecryptDataRequest {
  pubkey: string;
  decryptionKey: string;
  encryptedData: string;
}

/** QueryDecryptDataResponse is response type for the Query/DecryptData RPC method. */
export interface QueryDecryptDataResponse {
  decryptedData: string;
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

function createBaseQueryGeneralIdentityRequest(): QueryGeneralIdentityRequest {
  return { identity: "" };
}

export const QueryGeneralIdentityRequest = {
  encode(message: QueryGeneralIdentityRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGeneralIdentityRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGeneralIdentityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryGeneralIdentityRequest {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: QueryGeneralIdentityRequest): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGeneralIdentityRequest>, I>>(base?: I): QueryGeneralIdentityRequest {
    return QueryGeneralIdentityRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGeneralIdentityRequest>, I>>(object: I): QueryGeneralIdentityRequest {
    const message = createBaseQueryGeneralIdentityRequest();
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseQueryGeneralIdentityResponse(): QueryGeneralIdentityResponse {
  return { requestDetails: undefined };
}

export const QueryGeneralIdentityResponse = {
  encode(message: QueryGeneralIdentityResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestDetails !== undefined) {
      IdentityExecutionEntry.encode(message.requestDetails, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGeneralIdentityResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGeneralIdentityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.requestDetails = IdentityExecutionEntry.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryGeneralIdentityResponse {
    return {
      requestDetails: isSet(object.requestDetails) ? IdentityExecutionEntry.fromJSON(object.requestDetails) : undefined,
    };
  },

  toJSON(message: QueryGeneralIdentityResponse): unknown {
    const obj: any = {};
    if (message.requestDetails !== undefined) {
      obj.requestDetails = IdentityExecutionEntry.toJSON(message.requestDetails);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGeneralIdentityResponse>, I>>(base?: I): QueryGeneralIdentityResponse {
    return QueryGeneralIdentityResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGeneralIdentityResponse>, I>>(object: I): QueryGeneralIdentityResponse {
    const message = createBaseQueryGeneralIdentityResponse();
    message.requestDetails = (object.requestDetails !== undefined && object.requestDetails !== null)
      ? IdentityExecutionEntry.fromPartial(object.requestDetails)
      : undefined;
    return message;
  },
};

function createBaseQueryGeneralIdentityAllRequest(): QueryGeneralIdentityAllRequest {
  return { pagination: undefined };
}

export const QueryGeneralIdentityAllRequest = {
  encode(message: QueryGeneralIdentityAllRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGeneralIdentityAllRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGeneralIdentityAllRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryGeneralIdentityAllRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryGeneralIdentityAllRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGeneralIdentityAllRequest>, I>>(base?: I): QueryGeneralIdentityAllRequest {
    return QueryGeneralIdentityAllRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGeneralIdentityAllRequest>, I>>(
    object: I,
  ): QueryGeneralIdentityAllRequest {
    const message = createBaseQueryGeneralIdentityAllRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGeneralIdentityAllResponse(): QueryGeneralIdentityAllResponse {
  return { requestDetailsList: [], pagination: undefined };
}

export const QueryGeneralIdentityAllResponse = {
  encode(message: QueryGeneralIdentityAllResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.requestDetailsList) {
      IdentityExecutionEntry.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGeneralIdentityAllResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGeneralIdentityAllResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.requestDetailsList.push(IdentityExecutionEntry.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryGeneralIdentityAllResponse {
    return {
      requestDetailsList: Array.isArray(object?.requestDetailsList)
        ? object.requestDetailsList.map((e: any) => IdentityExecutionEntry.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryGeneralIdentityAllResponse): unknown {
    const obj: any = {};
    if (message.requestDetailsList?.length) {
      obj.requestDetailsList = message.requestDetailsList.map((e) => IdentityExecutionEntry.toJSON(e));
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGeneralIdentityAllResponse>, I>>(base?: I): QueryGeneralIdentityAllResponse {
    return QueryGeneralIdentityAllResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGeneralIdentityAllResponse>, I>>(
    object: I,
  ): QueryGeneralIdentityAllResponse {
    const message = createBaseQueryGeneralIdentityAllResponse();
    message.requestDetailsList = object.requestDetailsList?.map((e) => IdentityExecutionEntry.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryEncryptedTxRequest(): QueryEncryptedTxRequest {
  return { targetHeight: 0, index: 0 };
}

export const QueryEncryptedTxRequest = {
  encode(message: QueryEncryptedTxRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHeight !== 0) {
      writer.uint32(8).uint64(message.targetHeight);
    }
    if (message.index !== 0) {
      writer.uint32(16).uint64(message.index);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEncryptedTxRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEncryptedTxRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.targetHeight = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.index = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryEncryptedTxRequest {
    return {
      targetHeight: isSet(object.targetHeight) ? Number(object.targetHeight) : 0,
      index: isSet(object.index) ? Number(object.index) : 0,
    };
  },

  toJSON(message: QueryEncryptedTxRequest): unknown {
    const obj: any = {};
    if (message.targetHeight !== 0) {
      obj.targetHeight = Math.round(message.targetHeight);
    }
    if (message.index !== 0) {
      obj.index = Math.round(message.index);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryEncryptedTxRequest>, I>>(base?: I): QueryEncryptedTxRequest {
    return QueryEncryptedTxRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryEncryptedTxRequest>, I>>(object: I): QueryEncryptedTxRequest {
    const message = createBaseQueryEncryptedTxRequest();
    message.targetHeight = object.targetHeight ?? 0;
    message.index = object.index ?? 0;
    return message;
  },
};

function createBaseQueryEncryptedTxResponse(): QueryEncryptedTxResponse {
  return { encryptedTx: undefined };
}

export const QueryEncryptedTxResponse = {
  encode(message: QueryEncryptedTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedTx !== undefined) {
      EncryptedTx.encode(message.encryptedTx, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEncryptedTxResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEncryptedTxResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encryptedTx = EncryptedTx.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryEncryptedTxResponse {
    return { encryptedTx: isSet(object.encryptedTx) ? EncryptedTx.fromJSON(object.encryptedTx) : undefined };
  },

  toJSON(message: QueryEncryptedTxResponse): unknown {
    const obj: any = {};
    if (message.encryptedTx !== undefined) {
      obj.encryptedTx = EncryptedTx.toJSON(message.encryptedTx);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryEncryptedTxResponse>, I>>(base?: I): QueryEncryptedTxResponse {
    return QueryEncryptedTxResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryEncryptedTxResponse>, I>>(object: I): QueryEncryptedTxResponse {
    const message = createBaseQueryEncryptedTxResponse();
    message.encryptedTx = (object.encryptedTx !== undefined && object.encryptedTx !== null)
      ? EncryptedTx.fromPartial(object.encryptedTx)
      : undefined;
    return message;
  },
};

function createBaseQueryEncryptedTxAllRequest(): QueryEncryptedTxAllRequest {
  return { pagination: undefined };
}

export const QueryEncryptedTxAllRequest = {
  encode(message: QueryEncryptedTxAllRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEncryptedTxAllRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEncryptedTxAllRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryEncryptedTxAllRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryEncryptedTxAllRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryEncryptedTxAllRequest>, I>>(base?: I): QueryEncryptedTxAllRequest {
    return QueryEncryptedTxAllRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryEncryptedTxAllRequest>, I>>(object: I): QueryEncryptedTxAllRequest {
    const message = createBaseQueryEncryptedTxAllRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryEncryptedTxAllResponse(): QueryEncryptedTxAllResponse {
  return { encryptedTxArray: [], pagination: undefined };
}

export const QueryEncryptedTxAllResponse = {
  encode(message: QueryEncryptedTxAllResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.encryptedTxArray) {
      EncryptedTxArray.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEncryptedTxAllResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEncryptedTxAllResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encryptedTxArray.push(EncryptedTxArray.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryEncryptedTxAllResponse {
    return {
      encryptedTxArray: Array.isArray(object?.encryptedTxArray)
        ? object.encryptedTxArray.map((e: any) => EncryptedTxArray.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryEncryptedTxAllResponse): unknown {
    const obj: any = {};
    if (message.encryptedTxArray?.length) {
      obj.encryptedTxArray = message.encryptedTxArray.map((e) => EncryptedTxArray.toJSON(e));
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryEncryptedTxAllResponse>, I>>(base?: I): QueryEncryptedTxAllResponse {
    return QueryEncryptedTxAllResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryEncryptedTxAllResponse>, I>>(object: I): QueryEncryptedTxAllResponse {
    const message = createBaseQueryEncryptedTxAllResponse();
    message.encryptedTxArray = object.encryptedTxArray?.map((e) => EncryptedTxArray.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryEncryptedTxAllFromHeightRequest(): QueryEncryptedTxAllFromHeightRequest {
  return { targetHeight: 0 };
}

export const QueryEncryptedTxAllFromHeightRequest = {
  encode(message: QueryEncryptedTxAllFromHeightRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHeight !== 0) {
      writer.uint32(8).uint64(message.targetHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEncryptedTxAllFromHeightRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEncryptedTxAllFromHeightRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.targetHeight = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryEncryptedTxAllFromHeightRequest {
    return { targetHeight: isSet(object.targetHeight) ? Number(object.targetHeight) : 0 };
  },

  toJSON(message: QueryEncryptedTxAllFromHeightRequest): unknown {
    const obj: any = {};
    if (message.targetHeight !== 0) {
      obj.targetHeight = Math.round(message.targetHeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryEncryptedTxAllFromHeightRequest>, I>>(
    base?: I,
  ): QueryEncryptedTxAllFromHeightRequest {
    return QueryEncryptedTxAllFromHeightRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryEncryptedTxAllFromHeightRequest>, I>>(
    object: I,
  ): QueryEncryptedTxAllFromHeightRequest {
    const message = createBaseQueryEncryptedTxAllFromHeightRequest();
    message.targetHeight = object.targetHeight ?? 0;
    return message;
  },
};

function createBaseQueryEncryptedTxAllFromHeightResponse(): QueryEncryptedTxAllFromHeightResponse {
  return { encryptedTxArray: undefined };
}

export const QueryEncryptedTxAllFromHeightResponse = {
  encode(message: QueryEncryptedTxAllFromHeightResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedTxArray !== undefined) {
      EncryptedTxArray.encode(message.encryptedTxArray, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryEncryptedTxAllFromHeightResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryEncryptedTxAllFromHeightResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encryptedTxArray = EncryptedTxArray.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryEncryptedTxAllFromHeightResponse {
    return {
      encryptedTxArray: isSet(object.encryptedTxArray) ? EncryptedTxArray.fromJSON(object.encryptedTxArray) : undefined,
    };
  },

  toJSON(message: QueryEncryptedTxAllFromHeightResponse): unknown {
    const obj: any = {};
    if (message.encryptedTxArray !== undefined) {
      obj.encryptedTxArray = EncryptedTxArray.toJSON(message.encryptedTxArray);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryEncryptedTxAllFromHeightResponse>, I>>(
    base?: I,
  ): QueryEncryptedTxAllFromHeightResponse {
    return QueryEncryptedTxAllFromHeightResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryEncryptedTxAllFromHeightResponse>, I>>(
    object: I,
  ): QueryEncryptedTxAllFromHeightResponse {
    const message = createBaseQueryEncryptedTxAllFromHeightResponse();
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLatestHeightRequest();
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

  fromJSON(_: any): QueryLatestHeightRequest {
    return {};
  },

  toJSON(_: QueryLatestHeightRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryLatestHeightRequest>, I>>(base?: I): QueryLatestHeightRequest {
    return QueryLatestHeightRequest.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryLatestHeightResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.height = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryLatestHeightResponse {
    return { height: isSet(object.height) ? Number(object.height) : 0 };
  },

  toJSON(message: QueryLatestHeightResponse): unknown {
    const obj: any = {};
    if (message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryLatestHeightResponse>, I>>(base?: I): QueryLatestHeightResponse {
    return QueryLatestHeightResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryLatestHeightResponse>, I>>(object: I): QueryLatestHeightResponse {
    const message = createBaseQueryLatestHeightResponse();
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseQueryPepNonceRequest(): QueryPepNonceRequest {
  return { address: "" };
}

export const QueryPepNonceRequest = {
  encode(message: QueryPepNonceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.address !== "") {
      writer.uint32(10).string(message.address);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPepNonceRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPepNonceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.address = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPepNonceRequest {
    return { address: isSet(object.address) ? String(object.address) : "" };
  },

  toJSON(message: QueryPepNonceRequest): unknown {
    const obj: any = {};
    if (message.address !== "") {
      obj.address = message.address;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPepNonceRequest>, I>>(base?: I): QueryPepNonceRequest {
    return QueryPepNonceRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPepNonceRequest>, I>>(object: I): QueryPepNonceRequest {
    const message = createBaseQueryPepNonceRequest();
    message.address = object.address ?? "";
    return message;
  },
};

function createBaseQueryPepNonceResponse(): QueryPepNonceResponse {
  return { pepNonce: undefined };
}

export const QueryPepNonceResponse = {
  encode(message: QueryPepNonceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pepNonce !== undefined) {
      PepNonce.encode(message.pepNonce, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPepNonceResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPepNonceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pepNonce = PepNonce.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPepNonceResponse {
    return { pepNonce: isSet(object.pepNonce) ? PepNonce.fromJSON(object.pepNonce) : undefined };
  },

  toJSON(message: QueryPepNonceResponse): unknown {
    const obj: any = {};
    if (message.pepNonce !== undefined) {
      obj.pepNonce = PepNonce.toJSON(message.pepNonce);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPepNonceResponse>, I>>(base?: I): QueryPepNonceResponse {
    return QueryPepNonceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPepNonceResponse>, I>>(object: I): QueryPepNonceResponse {
    const message = createBaseQueryPepNonceResponse();
    message.pepNonce = (object.pepNonce !== undefined && object.pepNonce !== null)
      ? PepNonce.fromPartial(object.pepNonce)
      : undefined;
    return message;
  },
};

function createBaseQueryPepNonceAllRequest(): QueryPepNonceAllRequest {
  return { pagination: undefined };
}

export const QueryPepNonceAllRequest = {
  encode(message: QueryPepNonceAllRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPepNonceAllRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPepNonceAllRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPepNonceAllRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryPepNonceAllRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPepNonceAllRequest>, I>>(base?: I): QueryPepNonceAllRequest {
    return QueryPepNonceAllRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPepNonceAllRequest>, I>>(object: I): QueryPepNonceAllRequest {
    const message = createBaseQueryPepNonceAllRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryPepNonceAllResponse(): QueryPepNonceAllResponse {
  return { pepNonce: [], pagination: undefined };
}

export const QueryPepNonceAllResponse = {
  encode(message: QueryPepNonceAllResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.pepNonce) {
      PepNonce.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPepNonceAllResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPepNonceAllResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pepNonce.push(PepNonce.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPepNonceAllResponse {
    return {
      pepNonce: Array.isArray(object?.pepNonce) ? object.pepNonce.map((e: any) => PepNonce.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryPepNonceAllResponse): unknown {
    const obj: any = {};
    if (message.pepNonce?.length) {
      obj.pepNonce = message.pepNonce.map((e) => PepNonce.toJSON(e));
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPepNonceAllResponse>, I>>(base?: I): QueryPepNonceAllResponse {
    return QueryPepNonceAllResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPepNonceAllResponse>, I>>(object: I): QueryPepNonceAllResponse {
    const message = createBaseQueryPepNonceAllResponse();
    message.pepNonce = object.pepNonce?.map((e) => PepNonce.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryPubkeyRequest(): QueryPubkeyRequest {
  return {};
}

export const QueryPubkeyRequest = {
  encode(_: QueryPubkeyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPubkeyRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPubkeyRequest();
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

  fromJSON(_: any): QueryPubkeyRequest {
    return {};
  },

  toJSON(_: QueryPubkeyRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPubkeyRequest>, I>>(base?: I): QueryPubkeyRequest {
    return QueryPubkeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPubkeyRequest>, I>>(_: I): QueryPubkeyRequest {
    const message = createBaseQueryPubkeyRequest();
    return message;
  },
};

function createBaseQueryPubkeyResponse(): QueryPubkeyResponse {
  return { activePubkey: undefined, queuedPubkey: undefined };
}

export const QueryPubkeyResponse = {
  encode(message: QueryPubkeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activePubkey !== undefined) {
      ActivePublicKey.encode(message.activePubkey, writer.uint32(10).fork()).ldelim();
    }
    if (message.queuedPubkey !== undefined) {
      QueuedPublicKey.encode(message.queuedPubkey, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPubkeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPubkeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.activePubkey = ActivePublicKey.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.queuedPubkey = QueuedPublicKey.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPubkeyResponse {
    return {
      activePubkey: isSet(object.activePubkey) ? ActivePublicKey.fromJSON(object.activePubkey) : undefined,
      queuedPubkey: isSet(object.queuedPubkey) ? QueuedPublicKey.fromJSON(object.queuedPubkey) : undefined,
    };
  },

  toJSON(message: QueryPubkeyResponse): unknown {
    const obj: any = {};
    if (message.activePubkey !== undefined) {
      obj.activePubkey = ActivePublicKey.toJSON(message.activePubkey);
    }
    if (message.queuedPubkey !== undefined) {
      obj.queuedPubkey = QueuedPublicKey.toJSON(message.queuedPubkey);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPubkeyResponse>, I>>(base?: I): QueryPubkeyResponse {
    return QueryPubkeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPubkeyResponse>, I>>(object: I): QueryPubkeyResponse {
    const message = createBaseQueryPubkeyResponse();
    message.activePubkey = (object.activePubkey !== undefined && object.activePubkey !== null)
      ? ActivePublicKey.fromPartial(object.activePubkey)
      : undefined;
    message.queuedPubkey = (object.queuedPubkey !== undefined && object.queuedPubkey !== null)
      ? QueuedPublicKey.fromPartial(object.queuedPubkey)
      : undefined;
    return message;
  },
};

function createBaseQueryPrivateIdentityRequest(): QueryPrivateIdentityRequest {
  return { identity: "" };
}

export const QueryPrivateIdentityRequest = {
  encode(message: QueryPrivateIdentityRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPrivateIdentityRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPrivateIdentityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPrivateIdentityRequest {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: QueryPrivateIdentityRequest): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPrivateIdentityRequest>, I>>(base?: I): QueryPrivateIdentityRequest {
    return QueryPrivateIdentityRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPrivateIdentityRequest>, I>>(object: I): QueryPrivateIdentityRequest {
    const message = createBaseQueryPrivateIdentityRequest();
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseQueryPrivateIdentityResponse(): QueryPrivateIdentityResponse {
  return { creator: "", identity: "", pubkey: "", privateDecryptionKeys: [] };
}

export const QueryPrivateIdentityResponse = {
  encode(message: QueryPrivateIdentityResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(26).string(message.pubkey);
    }
    for (const v of message.privateDecryptionKeys) {
      PrivateDecryptionKey.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryPrivateIdentityResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryPrivateIdentityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pubkey = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.privateDecryptionKeys.push(PrivateDecryptionKey.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryPrivateIdentityResponse {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      privateDecryptionKeys: Array.isArray(object?.privateDecryptionKeys)
        ? object.privateDecryptionKeys.map((e: any) => PrivateDecryptionKey.fromJSON(e))
        : [],
    };
  },

  toJSON(message: QueryPrivateIdentityResponse): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.privateDecryptionKeys?.length) {
      obj.privateDecryptionKeys = message.privateDecryptionKeys.map((e) => PrivateDecryptionKey.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryPrivateIdentityResponse>, I>>(base?: I): QueryPrivateIdentityResponse {
    return QueryPrivateIdentityResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryPrivateIdentityResponse>, I>>(object: I): QueryPrivateIdentityResponse {
    const message = createBaseQueryPrivateIdentityResponse();
    message.creator = object.creator ?? "";
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.privateDecryptionKeys = object.privateDecryptionKeys?.map((e) => PrivateDecryptionKey.fromPartial(e)) || [];
    return message;
  },
};

function createBaseQueryDecryptDataRequest(): QueryDecryptDataRequest {
  return { pubkey: "", decryptionKey: "", encryptedData: "" };
}

export const QueryDecryptDataRequest = {
  encode(message: QueryDecryptDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pubkey !== "") {
      writer.uint32(10).string(message.pubkey);
    }
    if (message.decryptionKey !== "") {
      writer.uint32(18).string(message.decryptionKey);
    }
    if (message.encryptedData !== "") {
      writer.uint32(26).string(message.encryptedData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDecryptDataRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDecryptDataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pubkey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.decryptionKey = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.encryptedData = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryDecryptDataRequest {
    return {
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      decryptionKey: isSet(object.decryptionKey) ? String(object.decryptionKey) : "",
      encryptedData: isSet(object.encryptedData) ? String(object.encryptedData) : "",
    };
  },

  toJSON(message: QueryDecryptDataRequest): unknown {
    const obj: any = {};
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.decryptionKey !== "") {
      obj.decryptionKey = message.decryptionKey;
    }
    if (message.encryptedData !== "") {
      obj.encryptedData = message.encryptedData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryDecryptDataRequest>, I>>(base?: I): QueryDecryptDataRequest {
    return QueryDecryptDataRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryDecryptDataRequest>, I>>(object: I): QueryDecryptDataRequest {
    const message = createBaseQueryDecryptDataRequest();
    message.pubkey = object.pubkey ?? "";
    message.decryptionKey = object.decryptionKey ?? "";
    message.encryptedData = object.encryptedData ?? "";
    return message;
  },
};

function createBaseQueryDecryptDataResponse(): QueryDecryptDataResponse {
  return { decryptedData: "" };
}

export const QueryDecryptDataResponse = {
  encode(message: QueryDecryptDataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.decryptedData !== "") {
      writer.uint32(10).string(message.decryptedData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryDecryptDataResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryDecryptDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.decryptedData = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueryDecryptDataResponse {
    return { decryptedData: isSet(object.decryptedData) ? String(object.decryptedData) : "" };
  },

  toJSON(message: QueryDecryptDataResponse): unknown {
    const obj: any = {};
    if (message.decryptedData !== "") {
      obj.decryptedData = message.decryptedData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryDecryptDataResponse>, I>>(base?: I): QueryDecryptDataResponse {
    return QueryDecryptDataResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryDecryptDataResponse>, I>>(object: I): QueryDecryptDataResponse {
    const message = createBaseQueryDecryptDataResponse();
    message.decryptedData = object.decryptedData ?? "";
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a EncryptedTx by index. */
  EncryptedTx(request: QueryEncryptedTxRequest): Promise<QueryEncryptedTxResponse>;
  /** Queries a list of EncryptedTx items. */
  EncryptedTxAll(request: QueryEncryptedTxAllRequest): Promise<QueryEncryptedTxAllResponse>;
  /** Queries a list of EncryptedTx items. */
  EncryptedTxAllFromHeight(
    request: QueryEncryptedTxAllFromHeightRequest,
  ): Promise<QueryEncryptedTxAllFromHeightResponse>;
  /** Queries a list of LatestHeight items. */
  LatestHeight(request: QueryLatestHeightRequest): Promise<QueryLatestHeightResponse>;
  /** Queries a PepNonce by index. */
  PepNonce(request: QueryPepNonceRequest): Promise<QueryPepNonceResponse>;
  /** Queries a list of PepNonce items. */
  PepNonceAll(request: QueryPepNonceAllRequest): Promise<QueryPepNonceAllResponse>;
  /** Queries the public keys */
  Pubkey(request: QueryPubkeyRequest): Promise<QueryPubkeyResponse>;
  /** Queries a General Identity request by identity */
  GeneralIdentity(request: QueryGeneralIdentityRequest): Promise<QueryGeneralIdentityResponse>;
  /** Queries a list of General Identity requests */
  GeneralIdentityAll(request: QueryGeneralIdentityAllRequest): Promise<QueryGeneralIdentityAllResponse>;
  /** Queries a Private Identity request item by identity */
  PrivateIdentity(request: QueryPrivateIdentityRequest): Promise<QueryPrivateIdentityResponse>;
  /** Queries a list of DecryptData items. */
  DecryptData(request: QueryDecryptDataRequest): Promise<QueryDecryptDataResponse>;
}

export const QueryServiceName = "fairyring.pep.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.EncryptedTx = this.EncryptedTx.bind(this);
    this.EncryptedTxAll = this.EncryptedTxAll.bind(this);
    this.EncryptedTxAllFromHeight = this.EncryptedTxAllFromHeight.bind(this);
    this.LatestHeight = this.LatestHeight.bind(this);
    this.PepNonce = this.PepNonce.bind(this);
    this.PepNonceAll = this.PepNonceAll.bind(this);
    this.Pubkey = this.Pubkey.bind(this);
    this.GeneralIdentity = this.GeneralIdentity.bind(this);
    this.GeneralIdentityAll = this.GeneralIdentityAll.bind(this);
    this.PrivateIdentity = this.PrivateIdentity.bind(this);
    this.DecryptData = this.DecryptData.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(_m0.Reader.create(data)));
  }

  EncryptedTx(request: QueryEncryptedTxRequest): Promise<QueryEncryptedTxResponse> {
    const data = QueryEncryptedTxRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "EncryptedTx", data);
    return promise.then((data) => QueryEncryptedTxResponse.decode(_m0.Reader.create(data)));
  }

  EncryptedTxAll(request: QueryEncryptedTxAllRequest): Promise<QueryEncryptedTxAllResponse> {
    const data = QueryEncryptedTxAllRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "EncryptedTxAll", data);
    return promise.then((data) => QueryEncryptedTxAllResponse.decode(_m0.Reader.create(data)));
  }

  EncryptedTxAllFromHeight(
    request: QueryEncryptedTxAllFromHeightRequest,
  ): Promise<QueryEncryptedTxAllFromHeightResponse> {
    const data = QueryEncryptedTxAllFromHeightRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "EncryptedTxAllFromHeight", data);
    return promise.then((data) => QueryEncryptedTxAllFromHeightResponse.decode(_m0.Reader.create(data)));
  }

  LatestHeight(request: QueryLatestHeightRequest): Promise<QueryLatestHeightResponse> {
    const data = QueryLatestHeightRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "LatestHeight", data);
    return promise.then((data) => QueryLatestHeightResponse.decode(_m0.Reader.create(data)));
  }

  PepNonce(request: QueryPepNonceRequest): Promise<QueryPepNonceResponse> {
    const data = QueryPepNonceRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "PepNonce", data);
    return promise.then((data) => QueryPepNonceResponse.decode(_m0.Reader.create(data)));
  }

  PepNonceAll(request: QueryPepNonceAllRequest): Promise<QueryPepNonceAllResponse> {
    const data = QueryPepNonceAllRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "PepNonceAll", data);
    return promise.then((data) => QueryPepNonceAllResponse.decode(_m0.Reader.create(data)));
  }

  Pubkey(request: QueryPubkeyRequest): Promise<QueryPubkeyResponse> {
    const data = QueryPubkeyRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Pubkey", data);
    return promise.then((data) => QueryPubkeyResponse.decode(_m0.Reader.create(data)));
  }

  GeneralIdentity(request: QueryGeneralIdentityRequest): Promise<QueryGeneralIdentityResponse> {
    const data = QueryGeneralIdentityRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GeneralIdentity", data);
    return promise.then((data) => QueryGeneralIdentityResponse.decode(_m0.Reader.create(data)));
  }

  GeneralIdentityAll(request: QueryGeneralIdentityAllRequest): Promise<QueryGeneralIdentityAllResponse> {
    const data = QueryGeneralIdentityAllRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GeneralIdentityAll", data);
    return promise.then((data) => QueryGeneralIdentityAllResponse.decode(_m0.Reader.create(data)));
  }

  PrivateIdentity(request: QueryPrivateIdentityRequest): Promise<QueryPrivateIdentityResponse> {
    const data = QueryPrivateIdentityRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "PrivateIdentity", data);
    return promise.then((data) => QueryPrivateIdentityResponse.decode(_m0.Reader.create(data)));
  }

  DecryptData(request: QueryDecryptDataRequest): Promise<QueryDecryptDataResponse> {
    const data = QueryDecryptDataRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DecryptData", data);
    return promise.then((data) => QueryDecryptDataResponse.decode(_m0.Reader.create(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
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
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
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
