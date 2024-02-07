/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination";
import { AggregatedKeyShare } from "./aggregated_key_share";
import { AuthorizedAddress } from "./authorized_address";
import { Commitments } from "./commitments";
import { GeneralKeyShare } from "./general_key_share";
import { KeyShare } from "./key_share";
import { Params } from "./params";
import { ActivePubKey, QueuedPubKey } from "./pub_key";
import { ValidatorSet } from "./validator_set";

export const protobufPackage = "fairyring.keyshare";

export interface QueryCommitmentsRequest {
}

export interface QueryCommitmentsResponse {
  activeCommitments: Commitments | undefined;
  queuedCommitments: Commitments | undefined;
}

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetValidatorSetRequest {
  index: string;
}

export interface QueryGetValidatorSetResponse {
  validatorSet: ValidatorSet | undefined;
}

export interface QueryAllValidatorSetRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllValidatorSetResponse {
  validatorSet: ValidatorSet[];
  pagination: PageResponse | undefined;
}

export interface QueryGetKeyShareRequest {
  validator: string;
  blockHeight: number;
}

export interface QueryGetKeyShareResponse {
  keyShare: KeyShare | undefined;
}

export interface QueryAllKeyShareRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllKeyShareResponse {
  keyShare: KeyShare[];
  pagination: PageResponse | undefined;
}

/** this line is used by starport scaffolding # 3 */
export interface QueryGetAggregatedKeyShareRequest {
  height: number;
}

export interface QueryGetAggregatedKeyShareResponse {
  aggregatedKeyShare: AggregatedKeyShare | undefined;
}

export interface QueryAllAggregatedKeyShareRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllAggregatedKeyShareResponse {
  aggregatedKeyShare: AggregatedKeyShare[];
  pagination: PageResponse | undefined;
}

export interface QueryPubKeyRequest {
}

export interface QueryPubKeyResponse {
  activePubKey: ActivePubKey | undefined;
  queuedPubKey: QueuedPubKey | undefined;
}

export interface QueryGetAuthorizedAddressRequest {
  target: string;
}

export interface QueryGetAuthorizedAddressResponse {
  authorizedAddress: AuthorizedAddress | undefined;
}

export interface QueryAllAuthorizedAddressRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllAuthorizedAddressResponse {
  authorizedAddress: AuthorizedAddress[];
  pagination: PageResponse | undefined;
}

export interface QueryGetGeneralKeyShareRequest {
  validator: string;
  idType: string;
  idValue: string;
}

export interface QueryGetGeneralKeyShareResponse {
  generalKeyShare: GeneralKeyShare | undefined;
}

export interface QueryAllGeneralKeyShareRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllGeneralKeyShareResponse {
  generalKeyShare: GeneralKeyShare[];
  pagination: PageResponse | undefined;
}

function createBaseQueryCommitmentsRequest(): QueryCommitmentsRequest {
  return {};
}

export const QueryCommitmentsRequest = {
  encode(_: QueryCommitmentsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCommitmentsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCommitmentsRequest();
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

  fromJSON(_: any): QueryCommitmentsRequest {
    return {};
  },

  toJSON(_: QueryCommitmentsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryCommitmentsRequest>, I>>(_: I): QueryCommitmentsRequest {
    const message = createBaseQueryCommitmentsRequest();
    return message;
  },
};

function createBaseQueryCommitmentsResponse(): QueryCommitmentsResponse {
  return { activeCommitments: undefined, queuedCommitments: undefined };
}

export const QueryCommitmentsResponse = {
  encode(message: QueryCommitmentsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeCommitments !== undefined) {
      Commitments.encode(message.activeCommitments, writer.uint32(10).fork()).ldelim();
    }
    if (message.queuedCommitments !== undefined) {
      Commitments.encode(message.queuedCommitments, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryCommitmentsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryCommitmentsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activeCommitments = Commitments.decode(reader, reader.uint32());
          break;
        case 2:
          message.queuedCommitments = Commitments.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryCommitmentsResponse {
    return {
      activeCommitments: isSet(object.activeCommitments) ? Commitments.fromJSON(object.activeCommitments) : undefined,
      queuedCommitments: isSet(object.queuedCommitments) ? Commitments.fromJSON(object.queuedCommitments) : undefined,
    };
  },

  toJSON(message: QueryCommitmentsResponse): unknown {
    const obj: any = {};
    message.activeCommitments !== undefined
      && (obj.activeCommitments = message.activeCommitments
        ? Commitments.toJSON(message.activeCommitments)
        : undefined);
    message.queuedCommitments !== undefined
      && (obj.queuedCommitments = message.queuedCommitments
        ? Commitments.toJSON(message.queuedCommitments)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryCommitmentsResponse>, I>>(object: I): QueryCommitmentsResponse {
    const message = createBaseQueryCommitmentsResponse();
    message.activeCommitments = (object.activeCommitments !== undefined && object.activeCommitments !== null)
      ? Commitments.fromPartial(object.activeCommitments)
      : undefined;
    message.queuedCommitments = (object.queuedCommitments !== undefined && object.queuedCommitments !== null)
      ? Commitments.fromPartial(object.queuedCommitments)
      : undefined;
    return message;
  },
};

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

function createBaseQueryGetValidatorSetRequest(): QueryGetValidatorSetRequest {
  return { index: "" };
}

export const QueryGetValidatorSetRequest = {
  encode(message: QueryGetValidatorSetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetValidatorSetRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetValidatorSetRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetValidatorSetRequest {
    return { index: isSet(object.index) ? String(object.index) : "" };
  },

  toJSON(message: QueryGetValidatorSetRequest): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetValidatorSetRequest>, I>>(object: I): QueryGetValidatorSetRequest {
    const message = createBaseQueryGetValidatorSetRequest();
    message.index = object.index ?? "";
    return message;
  },
};

function createBaseQueryGetValidatorSetResponse(): QueryGetValidatorSetResponse {
  return { validatorSet: undefined };
}

export const QueryGetValidatorSetResponse = {
  encode(message: QueryGetValidatorSetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validatorSet !== undefined) {
      ValidatorSet.encode(message.validatorSet, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetValidatorSetResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetValidatorSetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorSet = ValidatorSet.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetValidatorSetResponse {
    return { validatorSet: isSet(object.validatorSet) ? ValidatorSet.fromJSON(object.validatorSet) : undefined };
  },

  toJSON(message: QueryGetValidatorSetResponse): unknown {
    const obj: any = {};
    message.validatorSet !== undefined
      && (obj.validatorSet = message.validatorSet ? ValidatorSet.toJSON(message.validatorSet) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetValidatorSetResponse>, I>>(object: I): QueryGetValidatorSetResponse {
    const message = createBaseQueryGetValidatorSetResponse();
    message.validatorSet = (object.validatorSet !== undefined && object.validatorSet !== null)
      ? ValidatorSet.fromPartial(object.validatorSet)
      : undefined;
    return message;
  },
};

function createBaseQueryAllValidatorSetRequest(): QueryAllValidatorSetRequest {
  return { pagination: undefined };
}

export const QueryAllValidatorSetRequest = {
  encode(message: QueryAllValidatorSetRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllValidatorSetRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllValidatorSetRequest();
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

  fromJSON(object: any): QueryAllValidatorSetRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllValidatorSetRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllValidatorSetRequest>, I>>(object: I): QueryAllValidatorSetRequest {
    const message = createBaseQueryAllValidatorSetRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllValidatorSetResponse(): QueryAllValidatorSetResponse {
  return { validatorSet: [], pagination: undefined };
}

export const QueryAllValidatorSetResponse = {
  encode(message: QueryAllValidatorSetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.validatorSet) {
      ValidatorSet.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllValidatorSetResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllValidatorSetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validatorSet.push(ValidatorSet.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllValidatorSetResponse {
    return {
      validatorSet: Array.isArray(object?.validatorSet)
        ? object.validatorSet.map((e: any) => ValidatorSet.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllValidatorSetResponse): unknown {
    const obj: any = {};
    if (message.validatorSet) {
      obj.validatorSet = message.validatorSet.map((e) => e ? ValidatorSet.toJSON(e) : undefined);
    } else {
      obj.validatorSet = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllValidatorSetResponse>, I>>(object: I): QueryAllValidatorSetResponse {
    const message = createBaseQueryAllValidatorSetResponse();
    message.validatorSet = object.validatorSet?.map((e) => ValidatorSet.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGetKeyShareRequest(): QueryGetKeyShareRequest {
  return { validator: "", blockHeight: 0 };
}

export const QueryGetKeyShareRequest = {
  encode(message: QueryGetKeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(16).uint64(message.blockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetKeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetKeyShareRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validator = reader.string();
          break;
        case 2:
          message.blockHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetKeyShareRequest {
    return {
      validator: isSet(object.validator) ? String(object.validator) : "",
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0,
    };
  },

  toJSON(message: QueryGetKeyShareRequest): unknown {
    const obj: any = {};
    message.validator !== undefined && (obj.validator = message.validator);
    message.blockHeight !== undefined && (obj.blockHeight = Math.round(message.blockHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetKeyShareRequest>, I>>(object: I): QueryGetKeyShareRequest {
    const message = createBaseQueryGetKeyShareRequest();
    message.validator = object.validator ?? "";
    message.blockHeight = object.blockHeight ?? 0;
    return message;
  },
};

function createBaseQueryGetKeyShareResponse(): QueryGetKeyShareResponse {
  return { keyShare: undefined };
}

export const QueryGetKeyShareResponse = {
  encode(message: QueryGetKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.keyShare !== undefined) {
      KeyShare.encode(message.keyShare, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetKeyShareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.keyShare = KeyShare.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetKeyShareResponse {
    return { keyShare: isSet(object.keyShare) ? KeyShare.fromJSON(object.keyShare) : undefined };
  },

  toJSON(message: QueryGetKeyShareResponse): unknown {
    const obj: any = {};
    message.keyShare !== undefined && (obj.keyShare = message.keyShare ? KeyShare.toJSON(message.keyShare) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetKeyShareResponse>, I>>(object: I): QueryGetKeyShareResponse {
    const message = createBaseQueryGetKeyShareResponse();
    message.keyShare = (object.keyShare !== undefined && object.keyShare !== null)
      ? KeyShare.fromPartial(object.keyShare)
      : undefined;
    return message;
  },
};

function createBaseQueryAllKeyShareRequest(): QueryAllKeyShareRequest {
  return { pagination: undefined };
}

export const QueryAllKeyShareRequest = {
  encode(message: QueryAllKeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllKeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllKeyShareRequest();
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

  fromJSON(object: any): QueryAllKeyShareRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllKeyShareRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllKeyShareRequest>, I>>(object: I): QueryAllKeyShareRequest {
    const message = createBaseQueryAllKeyShareRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllKeyShareResponse(): QueryAllKeyShareResponse {
  return { keyShare: [], pagination: undefined };
}

export const QueryAllKeyShareResponse = {
  encode(message: QueryAllKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.keyShare) {
      KeyShare.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllKeyShareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.keyShare.push(KeyShare.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllKeyShareResponse {
    return {
      keyShare: Array.isArray(object?.keyShare) ? object.keyShare.map((e: any) => KeyShare.fromJSON(e)) : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllKeyShareResponse): unknown {
    const obj: any = {};
    if (message.keyShare) {
      obj.keyShare = message.keyShare.map((e) => e ? KeyShare.toJSON(e) : undefined);
    } else {
      obj.keyShare = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllKeyShareResponse>, I>>(object: I): QueryAllKeyShareResponse {
    const message = createBaseQueryAllKeyShareResponse();
    message.keyShare = object.keyShare?.map((e) => KeyShare.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGetAggregatedKeyShareRequest(): QueryGetAggregatedKeyShareRequest {
  return { height: 0 };
}

export const QueryGetAggregatedKeyShareRequest = {
  encode(message: QueryGetAggregatedKeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.height !== 0) {
      writer.uint32(8).uint64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetAggregatedKeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetAggregatedKeyShareRequest();
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

  fromJSON(object: any): QueryGetAggregatedKeyShareRequest {
    return { height: isSet(object.height) ? Number(object.height) : 0 };
  },

  toJSON(message: QueryGetAggregatedKeyShareRequest): unknown {
    const obj: any = {};
    message.height !== undefined && (obj.height = Math.round(message.height));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetAggregatedKeyShareRequest>, I>>(
    object: I,
  ): QueryGetAggregatedKeyShareRequest {
    const message = createBaseQueryGetAggregatedKeyShareRequest();
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseQueryGetAggregatedKeyShareResponse(): QueryGetAggregatedKeyShareResponse {
  return { aggregatedKeyShare: undefined };
}

export const QueryGetAggregatedKeyShareResponse = {
  encode(message: QueryGetAggregatedKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.aggregatedKeyShare !== undefined) {
      AggregatedKeyShare.encode(message.aggregatedKeyShare, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetAggregatedKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetAggregatedKeyShareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.aggregatedKeyShare = AggregatedKeyShare.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetAggregatedKeyShareResponse {
    return {
      aggregatedKeyShare: isSet(object.aggregatedKeyShare)
        ? AggregatedKeyShare.fromJSON(object.aggregatedKeyShare)
        : undefined,
    };
  },

  toJSON(message: QueryGetAggregatedKeyShareResponse): unknown {
    const obj: any = {};
    message.aggregatedKeyShare !== undefined && (obj.aggregatedKeyShare = message.aggregatedKeyShare
      ? AggregatedKeyShare.toJSON(message.aggregatedKeyShare)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetAggregatedKeyShareResponse>, I>>(
    object: I,
  ): QueryGetAggregatedKeyShareResponse {
    const message = createBaseQueryGetAggregatedKeyShareResponse();
    message.aggregatedKeyShare = (object.aggregatedKeyShare !== undefined && object.aggregatedKeyShare !== null)
      ? AggregatedKeyShare.fromPartial(object.aggregatedKeyShare)
      : undefined;
    return message;
  },
};

function createBaseQueryAllAggregatedKeyShareRequest(): QueryAllAggregatedKeyShareRequest {
  return { pagination: undefined };
}

export const QueryAllAggregatedKeyShareRequest = {
  encode(message: QueryAllAggregatedKeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllAggregatedKeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllAggregatedKeyShareRequest();
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

  fromJSON(object: any): QueryAllAggregatedKeyShareRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllAggregatedKeyShareRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllAggregatedKeyShareRequest>, I>>(
    object: I,
  ): QueryAllAggregatedKeyShareRequest {
    const message = createBaseQueryAllAggregatedKeyShareRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllAggregatedKeyShareResponse(): QueryAllAggregatedKeyShareResponse {
  return { aggregatedKeyShare: [], pagination: undefined };
}

export const QueryAllAggregatedKeyShareResponse = {
  encode(message: QueryAllAggregatedKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.aggregatedKeyShare) {
      AggregatedKeyShare.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllAggregatedKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllAggregatedKeyShareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.aggregatedKeyShare.push(AggregatedKeyShare.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllAggregatedKeyShareResponse {
    return {
      aggregatedKeyShare: Array.isArray(object?.aggregatedKeyShare)
        ? object.aggregatedKeyShare.map((e: any) => AggregatedKeyShare.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllAggregatedKeyShareResponse): unknown {
    const obj: any = {};
    if (message.aggregatedKeyShare) {
      obj.aggregatedKeyShare = message.aggregatedKeyShare.map((e) => e ? AggregatedKeyShare.toJSON(e) : undefined);
    } else {
      obj.aggregatedKeyShare = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllAggregatedKeyShareResponse>, I>>(
    object: I,
  ): QueryAllAggregatedKeyShareResponse {
    const message = createBaseQueryAllAggregatedKeyShareResponse();
    message.aggregatedKeyShare = object.aggregatedKeyShare?.map((e) => AggregatedKeyShare.fromPartial(e)) || [];
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

function createBaseQueryGetAuthorizedAddressRequest(): QueryGetAuthorizedAddressRequest {
  return { target: "" };
}

export const QueryGetAuthorizedAddressRequest = {
  encode(message: QueryGetAuthorizedAddressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetAuthorizedAddressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetAuthorizedAddressRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.target = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetAuthorizedAddressRequest {
    return { target: isSet(object.target) ? String(object.target) : "" };
  },

  toJSON(message: QueryGetAuthorizedAddressRequest): unknown {
    const obj: any = {};
    message.target !== undefined && (obj.target = message.target);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetAuthorizedAddressRequest>, I>>(
    object: I,
  ): QueryGetAuthorizedAddressRequest {
    const message = createBaseQueryGetAuthorizedAddressRequest();
    message.target = object.target ?? "";
    return message;
  },
};

function createBaseQueryGetAuthorizedAddressResponse(): QueryGetAuthorizedAddressResponse {
  return { authorizedAddress: undefined };
}

export const QueryGetAuthorizedAddressResponse = {
  encode(message: QueryGetAuthorizedAddressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authorizedAddress !== undefined) {
      AuthorizedAddress.encode(message.authorizedAddress, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetAuthorizedAddressResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetAuthorizedAddressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authorizedAddress = AuthorizedAddress.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetAuthorizedAddressResponse {
    return {
      authorizedAddress: isSet(object.authorizedAddress)
        ? AuthorizedAddress.fromJSON(object.authorizedAddress)
        : undefined,
    };
  },

  toJSON(message: QueryGetAuthorizedAddressResponse): unknown {
    const obj: any = {};
    message.authorizedAddress !== undefined && (obj.authorizedAddress = message.authorizedAddress
      ? AuthorizedAddress.toJSON(message.authorizedAddress)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetAuthorizedAddressResponse>, I>>(
    object: I,
  ): QueryGetAuthorizedAddressResponse {
    const message = createBaseQueryGetAuthorizedAddressResponse();
    message.authorizedAddress = (object.authorizedAddress !== undefined && object.authorizedAddress !== null)
      ? AuthorizedAddress.fromPartial(object.authorizedAddress)
      : undefined;
    return message;
  },
};

function createBaseQueryAllAuthorizedAddressRequest(): QueryAllAuthorizedAddressRequest {
  return { pagination: undefined };
}

export const QueryAllAuthorizedAddressRequest = {
  encode(message: QueryAllAuthorizedAddressRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllAuthorizedAddressRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllAuthorizedAddressRequest();
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

  fromJSON(object: any): QueryAllAuthorizedAddressRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllAuthorizedAddressRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllAuthorizedAddressRequest>, I>>(
    object: I,
  ): QueryAllAuthorizedAddressRequest {
    const message = createBaseQueryAllAuthorizedAddressRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllAuthorizedAddressResponse(): QueryAllAuthorizedAddressResponse {
  return { authorizedAddress: [], pagination: undefined };
}

export const QueryAllAuthorizedAddressResponse = {
  encode(message: QueryAllAuthorizedAddressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.authorizedAddress) {
      AuthorizedAddress.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllAuthorizedAddressResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllAuthorizedAddressResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.authorizedAddress.push(AuthorizedAddress.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllAuthorizedAddressResponse {
    return {
      authorizedAddress: Array.isArray(object?.authorizedAddress)
        ? object.authorizedAddress.map((e: any) => AuthorizedAddress.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllAuthorizedAddressResponse): unknown {
    const obj: any = {};
    if (message.authorizedAddress) {
      obj.authorizedAddress = message.authorizedAddress.map((e) => e ? AuthorizedAddress.toJSON(e) : undefined);
    } else {
      obj.authorizedAddress = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllAuthorizedAddressResponse>, I>>(
    object: I,
  ): QueryAllAuthorizedAddressResponse {
    const message = createBaseQueryAllAuthorizedAddressResponse();
    message.authorizedAddress = object.authorizedAddress?.map((e) => AuthorizedAddress.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGetGeneralKeyShareRequest(): QueryGetGeneralKeyShareRequest {
  return { validator: "", idType: "", idValue: "" };
}

export const QueryGetGeneralKeyShareRequest = {
  encode(message: QueryGetGeneralKeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.idType !== "") {
      writer.uint32(18).string(message.idType);
    }
    if (message.idValue !== "") {
      writer.uint32(26).string(message.idValue);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetGeneralKeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetGeneralKeyShareRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.validator = reader.string();
          break;
        case 2:
          message.idType = reader.string();
          break;
        case 3:
          message.idValue = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetGeneralKeyShareRequest {
    return {
      validator: isSet(object.validator) ? String(object.validator) : "",
      idType: isSet(object.idType) ? String(object.idType) : "",
      idValue: isSet(object.idValue) ? String(object.idValue) : "",
    };
  },

  toJSON(message: QueryGetGeneralKeyShareRequest): unknown {
    const obj: any = {};
    message.validator !== undefined && (obj.validator = message.validator);
    message.idType !== undefined && (obj.idType = message.idType);
    message.idValue !== undefined && (obj.idValue = message.idValue);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetGeneralKeyShareRequest>, I>>(
    object: I,
  ): QueryGetGeneralKeyShareRequest {
    const message = createBaseQueryGetGeneralKeyShareRequest();
    message.validator = object.validator ?? "";
    message.idType = object.idType ?? "";
    message.idValue = object.idValue ?? "";
    return message;
  },
};

function createBaseQueryGetGeneralKeyShareResponse(): QueryGetGeneralKeyShareResponse {
  return { generalKeyShare: undefined };
}

export const QueryGetGeneralKeyShareResponse = {
  encode(message: QueryGetGeneralKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.generalKeyShare !== undefined) {
      GeneralKeyShare.encode(message.generalKeyShare, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryGetGeneralKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetGeneralKeyShareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.generalKeyShare = GeneralKeyShare.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueryGetGeneralKeyShareResponse {
    return {
      generalKeyShare: isSet(object.generalKeyShare) ? GeneralKeyShare.fromJSON(object.generalKeyShare) : undefined,
    };
  },

  toJSON(message: QueryGetGeneralKeyShareResponse): unknown {
    const obj: any = {};
    message.generalKeyShare !== undefined
      && (obj.generalKeyShare = message.generalKeyShare ? GeneralKeyShare.toJSON(message.generalKeyShare) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryGetGeneralKeyShareResponse>, I>>(
    object: I,
  ): QueryGetGeneralKeyShareResponse {
    const message = createBaseQueryGetGeneralKeyShareResponse();
    message.generalKeyShare = (object.generalKeyShare !== undefined && object.generalKeyShare !== null)
      ? GeneralKeyShare.fromPartial(object.generalKeyShare)
      : undefined;
    return message;
  },
};

function createBaseQueryAllGeneralKeyShareRequest(): QueryAllGeneralKeyShareRequest {
  return { pagination: undefined };
}

export const QueryAllGeneralKeyShareRequest = {
  encode(message: QueryAllGeneralKeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllGeneralKeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllGeneralKeyShareRequest();
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

  fromJSON(object: any): QueryAllGeneralKeyShareRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllGeneralKeyShareRequest): unknown {
    const obj: any = {};
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageRequest.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllGeneralKeyShareRequest>, I>>(
    object: I,
  ): QueryAllGeneralKeyShareRequest {
    const message = createBaseQueryAllGeneralKeyShareRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllGeneralKeyShareResponse(): QueryAllGeneralKeyShareResponse {
  return { generalKeyShare: [], pagination: undefined };
}

export const QueryAllGeneralKeyShareResponse = {
  encode(message: QueryAllGeneralKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.generalKeyShare) {
      GeneralKeyShare.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueryAllGeneralKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllGeneralKeyShareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.generalKeyShare.push(GeneralKeyShare.decode(reader, reader.uint32()));
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

  fromJSON(object: any): QueryAllGeneralKeyShareResponse {
    return {
      generalKeyShare: Array.isArray(object?.generalKeyShare)
        ? object.generalKeyShare.map((e: any) => GeneralKeyShare.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllGeneralKeyShareResponse): unknown {
    const obj: any = {};
    if (message.generalKeyShare) {
      obj.generalKeyShare = message.generalKeyShare.map((e) => e ? GeneralKeyShare.toJSON(e) : undefined);
    } else {
      obj.generalKeyShare = [];
    }
    message.pagination !== undefined
      && (obj.pagination = message.pagination ? PageResponse.toJSON(message.pagination) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueryAllGeneralKeyShareResponse>, I>>(
    object: I,
  ): QueryAllGeneralKeyShareResponse {
    const message = createBaseQueryAllGeneralKeyShareResponse();
    message.generalKeyShare = object.generalKeyShare?.map((e) => GeneralKeyShare.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  Commitments(request: QueryCommitmentsRequest): Promise<QueryCommitmentsResponse>;
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a ValidatorSet by index. */
  ValidatorSet(request: QueryGetValidatorSetRequest): Promise<QueryGetValidatorSetResponse>;
  /** Queries a list of ValidatorSet items. */
  ValidatorSetAll(request: QueryAllValidatorSetRequest): Promise<QueryAllValidatorSetResponse>;
  /** Queries a KeyShare by index. */
  KeyShare(request: QueryGetKeyShareRequest): Promise<QueryGetKeyShareResponse>;
  /** Queries a list of KeyShare items. */
  KeyShareAll(request: QueryAllKeyShareRequest): Promise<QueryAllKeyShareResponse>;
  /** Queries a list of AggregatedKeyShare items. */
  AggregatedKeyShare(request: QueryGetAggregatedKeyShareRequest): Promise<QueryGetAggregatedKeyShareResponse>;
  AggregatedKeyShareAll(request: QueryAllAggregatedKeyShareRequest): Promise<QueryAllAggregatedKeyShareResponse>;
  /** Queries the public keys */
  PubKey(request: QueryPubKeyRequest): Promise<QueryPubKeyResponse>;
  /** Queries a list of AuthorizedAddress items. */
  AuthorizedAddress(request: QueryGetAuthorizedAddressRequest): Promise<QueryGetAuthorizedAddressResponse>;
  AuthorizedAddressAll(request: QueryAllAuthorizedAddressRequest): Promise<QueryAllAuthorizedAddressResponse>;
  /** Queries a list of GeneralKeyShare items. */
  GeneralKeyShare(request: QueryGetGeneralKeyShareRequest): Promise<QueryGetGeneralKeyShareResponse>;
  GeneralKeyShareAll(request: QueryAllGeneralKeyShareRequest): Promise<QueryAllGeneralKeyShareResponse>;
}

export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.Commitments = this.Commitments.bind(this);
    this.Params = this.Params.bind(this);
    this.ValidatorSet = this.ValidatorSet.bind(this);
    this.ValidatorSetAll = this.ValidatorSetAll.bind(this);
    this.KeyShare = this.KeyShare.bind(this);
    this.KeyShareAll = this.KeyShareAll.bind(this);
    this.AggregatedKeyShare = this.AggregatedKeyShare.bind(this);
    this.AggregatedKeyShareAll = this.AggregatedKeyShareAll.bind(this);
    this.PubKey = this.PubKey.bind(this);
    this.AuthorizedAddress = this.AuthorizedAddress.bind(this);
    this.AuthorizedAddressAll = this.AuthorizedAddressAll.bind(this);
    this.GeneralKeyShare = this.GeneralKeyShare.bind(this);
    this.GeneralKeyShareAll = this.GeneralKeyShareAll.bind(this);
  }
  Commitments(request: QueryCommitmentsRequest): Promise<QueryCommitmentsResponse> {
    const data = QueryCommitmentsRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "Commitments", data);
    return promise.then((data) => QueryCommitmentsResponse.decode(new _m0.Reader(data)));
  }

  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new _m0.Reader(data)));
  }

  ValidatorSet(request: QueryGetValidatorSetRequest): Promise<QueryGetValidatorSetResponse> {
    const data = QueryGetValidatorSetRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "ValidatorSet", data);
    return promise.then((data) => QueryGetValidatorSetResponse.decode(new _m0.Reader(data)));
  }

  ValidatorSetAll(request: QueryAllValidatorSetRequest): Promise<QueryAllValidatorSetResponse> {
    const data = QueryAllValidatorSetRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "ValidatorSetAll", data);
    return promise.then((data) => QueryAllValidatorSetResponse.decode(new _m0.Reader(data)));
  }

  KeyShare(request: QueryGetKeyShareRequest): Promise<QueryGetKeyShareResponse> {
    const data = QueryGetKeyShareRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "KeyShare", data);
    return promise.then((data) => QueryGetKeyShareResponse.decode(new _m0.Reader(data)));
  }

  KeyShareAll(request: QueryAllKeyShareRequest): Promise<QueryAllKeyShareResponse> {
    const data = QueryAllKeyShareRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "KeyShareAll", data);
    return promise.then((data) => QueryAllKeyShareResponse.decode(new _m0.Reader(data)));
  }

  AggregatedKeyShare(request: QueryGetAggregatedKeyShareRequest): Promise<QueryGetAggregatedKeyShareResponse> {
    const data = QueryGetAggregatedKeyShareRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "AggregatedKeyShare", data);
    return promise.then((data) => QueryGetAggregatedKeyShareResponse.decode(new _m0.Reader(data)));
  }

  AggregatedKeyShareAll(request: QueryAllAggregatedKeyShareRequest): Promise<QueryAllAggregatedKeyShareResponse> {
    const data = QueryAllAggregatedKeyShareRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "AggregatedKeyShareAll", data);
    return promise.then((data) => QueryAllAggregatedKeyShareResponse.decode(new _m0.Reader(data)));
  }

  PubKey(request: QueryPubKeyRequest): Promise<QueryPubKeyResponse> {
    const data = QueryPubKeyRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "PubKey", data);
    return promise.then((data) => QueryPubKeyResponse.decode(new _m0.Reader(data)));
  }

  AuthorizedAddress(request: QueryGetAuthorizedAddressRequest): Promise<QueryGetAuthorizedAddressResponse> {
    const data = QueryGetAuthorizedAddressRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "AuthorizedAddress", data);
    return promise.then((data) => QueryGetAuthorizedAddressResponse.decode(new _m0.Reader(data)));
  }

  AuthorizedAddressAll(request: QueryAllAuthorizedAddressRequest): Promise<QueryAllAuthorizedAddressResponse> {
    const data = QueryAllAuthorizedAddressRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "AuthorizedAddressAll", data);
    return promise.then((data) => QueryAllAuthorizedAddressResponse.decode(new _m0.Reader(data)));
  }

  GeneralKeyShare(request: QueryGetGeneralKeyShareRequest): Promise<QueryGetGeneralKeyShareResponse> {
    const data = QueryGetGeneralKeyShareRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "GeneralKeyShare", data);
    return promise.then((data) => QueryGetGeneralKeyShareResponse.decode(new _m0.Reader(data)));
  }

  GeneralKeyShareAll(request: QueryAllGeneralKeyShareRequest): Promise<QueryAllGeneralKeyShareResponse> {
    const data = QueryAllGeneralKeyShareRequest.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Query", "GeneralKeyShareAll", data);
    return promise.then((data) => QueryAllGeneralKeyShareResponse.decode(new _m0.Reader(data)));
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
