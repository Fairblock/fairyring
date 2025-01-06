/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Params } from "./params";

export const protobufPackage = "fairyring.ckks";

/** MsgUpdateParams is the Msg/UpdateParams request type. */
export interface MsgUpdateParams {
  /** authority is the address that controls the module (defaults to x/gov unless overwritten). */
  authority: string;
  /** NOTE: All parameters must be supplied. */
  params: Params | undefined;
}

/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 */
export interface MsgUpdateParamsResponse {
}

export interface MsgSubmitPkgShare {
  creator: string;
  shareData: string;
}

export interface MsgSubmitPkgShareResponse {
}

export interface MsgSubmitRkgShareRound1 {
  creator: string;
  shareData: string;
}

export interface MsgSubmitRkgShareRound1Response {
}

export interface MsgSubmitRkgShareRound2 {
  creator: string;
  shareData: string;
}

export interface MsgSubmitRkgShareRound2Response {
}

export interface MsgSubmitGkgShare {
  creator: string;
  shareData: string;
}

export interface MsgSubmitGkgShareResponse {
}

export interface MsgSubmitShamirShare {
  creator: string;
  shareList: string;
}

export interface MsgSubmitShamirShareResponse {
}

export interface MsgKeySwitchRequest {
  creator: string;
  ct: string;
  newPk: string;
}

export interface MsgKeySwitchRequestResponse {
}

function createBaseMsgUpdateParams(): MsgUpdateParams {
  return { authority: "", params: undefined };
}

export const MsgUpdateParams = {
  encode(message: MsgUpdateParams, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.authority = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: MsgUpdateParams): unknown {
    const obj: any = {};
    if (message.authority !== "") {
      obj.authority = message.authority;
    }
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(base?: I): MsgUpdateParams {
    return MsgUpdateParams.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(object: I): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}

export const MsgUpdateParamsResponse = {
  encode(_: MsgUpdateParamsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
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

  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },

  toJSON(_: MsgUpdateParamsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(base?: I): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(_: I): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
};

function createBaseMsgSubmitPkgShare(): MsgSubmitPkgShare {
  return { creator: "", shareData: "" };
}

export const MsgSubmitPkgShare = {
  encode(message: MsgSubmitPkgShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareData !== "") {
      writer.uint32(18).string(message.shareData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitPkgShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitPkgShare();
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

          message.shareData = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitPkgShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareData: isSet(object.shareData) ? String(object.shareData) : "",
    };
  },

  toJSON(message: MsgSubmitPkgShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareData !== "") {
      obj.shareData = message.shareData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitPkgShare>, I>>(base?: I): MsgSubmitPkgShare {
    return MsgSubmitPkgShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitPkgShare>, I>>(object: I): MsgSubmitPkgShare {
    const message = createBaseMsgSubmitPkgShare();
    message.creator = object.creator ?? "";
    message.shareData = object.shareData ?? "";
    return message;
  },
};

function createBaseMsgSubmitPkgShareResponse(): MsgSubmitPkgShareResponse {
  return {};
}

export const MsgSubmitPkgShareResponse = {
  encode(_: MsgSubmitPkgShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitPkgShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitPkgShareResponse();
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

  fromJSON(_: any): MsgSubmitPkgShareResponse {
    return {};
  },

  toJSON(_: MsgSubmitPkgShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitPkgShareResponse>, I>>(base?: I): MsgSubmitPkgShareResponse {
    return MsgSubmitPkgShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitPkgShareResponse>, I>>(_: I): MsgSubmitPkgShareResponse {
    const message = createBaseMsgSubmitPkgShareResponse();
    return message;
  },
};

function createBaseMsgSubmitRkgShareRound1(): MsgSubmitRkgShareRound1 {
  return { creator: "", shareData: "" };
}

export const MsgSubmitRkgShareRound1 = {
  encode(message: MsgSubmitRkgShareRound1, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareData !== "") {
      writer.uint32(18).string(message.shareData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitRkgShareRound1 {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitRkgShareRound1();
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

          message.shareData = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitRkgShareRound1 {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareData: isSet(object.shareData) ? String(object.shareData) : "",
    };
  },

  toJSON(message: MsgSubmitRkgShareRound1): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareData !== "") {
      obj.shareData = message.shareData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitRkgShareRound1>, I>>(base?: I): MsgSubmitRkgShareRound1 {
    return MsgSubmitRkgShareRound1.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitRkgShareRound1>, I>>(object: I): MsgSubmitRkgShareRound1 {
    const message = createBaseMsgSubmitRkgShareRound1();
    message.creator = object.creator ?? "";
    message.shareData = object.shareData ?? "";
    return message;
  },
};

function createBaseMsgSubmitRkgShareRound1Response(): MsgSubmitRkgShareRound1Response {
  return {};
}

export const MsgSubmitRkgShareRound1Response = {
  encode(_: MsgSubmitRkgShareRound1Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitRkgShareRound1Response {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitRkgShareRound1Response();
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

  fromJSON(_: any): MsgSubmitRkgShareRound1Response {
    return {};
  },

  toJSON(_: MsgSubmitRkgShareRound1Response): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitRkgShareRound1Response>, I>>(base?: I): MsgSubmitRkgShareRound1Response {
    return MsgSubmitRkgShareRound1Response.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitRkgShareRound1Response>, I>>(_: I): MsgSubmitRkgShareRound1Response {
    const message = createBaseMsgSubmitRkgShareRound1Response();
    return message;
  },
};

function createBaseMsgSubmitRkgShareRound2(): MsgSubmitRkgShareRound2 {
  return { creator: "", shareData: "" };
}

export const MsgSubmitRkgShareRound2 = {
  encode(message: MsgSubmitRkgShareRound2, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareData !== "") {
      writer.uint32(18).string(message.shareData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitRkgShareRound2 {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitRkgShareRound2();
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

          message.shareData = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitRkgShareRound2 {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareData: isSet(object.shareData) ? String(object.shareData) : "",
    };
  },

  toJSON(message: MsgSubmitRkgShareRound2): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareData !== "") {
      obj.shareData = message.shareData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitRkgShareRound2>, I>>(base?: I): MsgSubmitRkgShareRound2 {
    return MsgSubmitRkgShareRound2.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitRkgShareRound2>, I>>(object: I): MsgSubmitRkgShareRound2 {
    const message = createBaseMsgSubmitRkgShareRound2();
    message.creator = object.creator ?? "";
    message.shareData = object.shareData ?? "";
    return message;
  },
};

function createBaseMsgSubmitRkgShareRound2Response(): MsgSubmitRkgShareRound2Response {
  return {};
}

export const MsgSubmitRkgShareRound2Response = {
  encode(_: MsgSubmitRkgShareRound2Response, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitRkgShareRound2Response {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitRkgShareRound2Response();
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

  fromJSON(_: any): MsgSubmitRkgShareRound2Response {
    return {};
  },

  toJSON(_: MsgSubmitRkgShareRound2Response): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitRkgShareRound2Response>, I>>(base?: I): MsgSubmitRkgShareRound2Response {
    return MsgSubmitRkgShareRound2Response.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitRkgShareRound2Response>, I>>(_: I): MsgSubmitRkgShareRound2Response {
    const message = createBaseMsgSubmitRkgShareRound2Response();
    return message;
  },
};

function createBaseMsgSubmitGkgShare(): MsgSubmitGkgShare {
  return { creator: "", shareData: "" };
}

export const MsgSubmitGkgShare = {
  encode(message: MsgSubmitGkgShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareData !== "") {
      writer.uint32(18).string(message.shareData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitGkgShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitGkgShare();
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

          message.shareData = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitGkgShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareData: isSet(object.shareData) ? String(object.shareData) : "",
    };
  },

  toJSON(message: MsgSubmitGkgShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareData !== "") {
      obj.shareData = message.shareData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitGkgShare>, I>>(base?: I): MsgSubmitGkgShare {
    return MsgSubmitGkgShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitGkgShare>, I>>(object: I): MsgSubmitGkgShare {
    const message = createBaseMsgSubmitGkgShare();
    message.creator = object.creator ?? "";
    message.shareData = object.shareData ?? "";
    return message;
  },
};

function createBaseMsgSubmitGkgShareResponse(): MsgSubmitGkgShareResponse {
  return {};
}

export const MsgSubmitGkgShareResponse = {
  encode(_: MsgSubmitGkgShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitGkgShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitGkgShareResponse();
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

  fromJSON(_: any): MsgSubmitGkgShareResponse {
    return {};
  },

  toJSON(_: MsgSubmitGkgShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitGkgShareResponse>, I>>(base?: I): MsgSubmitGkgShareResponse {
    return MsgSubmitGkgShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitGkgShareResponse>, I>>(_: I): MsgSubmitGkgShareResponse {
    const message = createBaseMsgSubmitGkgShareResponse();
    return message;
  },
};

function createBaseMsgSubmitShamirShare(): MsgSubmitShamirShare {
  return { creator: "", shareList: "" };
}

export const MsgSubmitShamirShare = {
  encode(message: MsgSubmitShamirShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareList !== "") {
      writer.uint32(18).string(message.shareList);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitShamirShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitShamirShare();
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

          message.shareList = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitShamirShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareList: isSet(object.shareList) ? String(object.shareList) : "",
    };
  },

  toJSON(message: MsgSubmitShamirShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareList !== "") {
      obj.shareList = message.shareList;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitShamirShare>, I>>(base?: I): MsgSubmitShamirShare {
    return MsgSubmitShamirShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitShamirShare>, I>>(object: I): MsgSubmitShamirShare {
    const message = createBaseMsgSubmitShamirShare();
    message.creator = object.creator ?? "";
    message.shareList = object.shareList ?? "";
    return message;
  },
};

function createBaseMsgSubmitShamirShareResponse(): MsgSubmitShamirShareResponse {
  return {};
}

export const MsgSubmitShamirShareResponse = {
  encode(_: MsgSubmitShamirShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitShamirShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitShamirShareResponse();
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

  fromJSON(_: any): MsgSubmitShamirShareResponse {
    return {};
  },

  toJSON(_: MsgSubmitShamirShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitShamirShareResponse>, I>>(base?: I): MsgSubmitShamirShareResponse {
    return MsgSubmitShamirShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitShamirShareResponse>, I>>(_: I): MsgSubmitShamirShareResponse {
    const message = createBaseMsgSubmitShamirShareResponse();
    return message;
  },
};

function createBaseMsgKeySwitchRequest(): MsgKeySwitchRequest {
  return { creator: "", ct: "", newPk: "" };
}

export const MsgKeySwitchRequest = {
  encode(message: MsgKeySwitchRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.ct !== "") {
      writer.uint32(18).string(message.ct);
    }
    if (message.newPk !== "") {
      writer.uint32(26).string(message.newPk);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgKeySwitchRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgKeySwitchRequest();
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

          message.ct = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.newPk = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgKeySwitchRequest {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      ct: isSet(object.ct) ? String(object.ct) : "",
      newPk: isSet(object.newPk) ? String(object.newPk) : "",
    };
  },

  toJSON(message: MsgKeySwitchRequest): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.ct !== "") {
      obj.ct = message.ct;
    }
    if (message.newPk !== "") {
      obj.newPk = message.newPk;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgKeySwitchRequest>, I>>(base?: I): MsgKeySwitchRequest {
    return MsgKeySwitchRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgKeySwitchRequest>, I>>(object: I): MsgKeySwitchRequest {
    const message = createBaseMsgKeySwitchRequest();
    message.creator = object.creator ?? "";
    message.ct = object.ct ?? "";
    message.newPk = object.newPk ?? "";
    return message;
  },
};

function createBaseMsgKeySwitchRequestResponse(): MsgKeySwitchRequestResponse {
  return {};
}

export const MsgKeySwitchRequestResponse = {
  encode(_: MsgKeySwitchRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgKeySwitchRequestResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgKeySwitchRequestResponse();
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

  fromJSON(_: any): MsgKeySwitchRequestResponse {
    return {};
  },

  toJSON(_: MsgKeySwitchRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgKeySwitchRequestResponse>, I>>(base?: I): MsgKeySwitchRequestResponse {
    return MsgKeySwitchRequestResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgKeySwitchRequestResponse>, I>>(_: I): MsgKeySwitchRequestResponse {
    const message = createBaseMsgKeySwitchRequestResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /**
   * UpdateParams defines a (governance) operation for updating the module
   * parameters. The authority defaults to the x/gov module account.
   */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
  SubmitPkgShare(request: MsgSubmitPkgShare): Promise<MsgSubmitPkgShareResponse>;
  SubmitRkgShareRound1(request: MsgSubmitRkgShareRound1): Promise<MsgSubmitRkgShareRound1Response>;
  SubmitRkgShareRound2(request: MsgSubmitRkgShareRound2): Promise<MsgSubmitRkgShareRound2Response>;
  SubmitGkgShare(request: MsgSubmitGkgShare): Promise<MsgSubmitGkgShareResponse>;
  SubmitShamirShare(request: MsgSubmitShamirShare): Promise<MsgSubmitShamirShareResponse>;
  KeySwitchRequest(request: MsgKeySwitchRequest): Promise<MsgKeySwitchRequestResponse>;
}

export const MsgServiceName = "fairyring.ckks.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.UpdateParams = this.UpdateParams.bind(this);
    this.SubmitPkgShare = this.SubmitPkgShare.bind(this);
    this.SubmitRkgShareRound1 = this.SubmitRkgShareRound1.bind(this);
    this.SubmitRkgShareRound2 = this.SubmitRkgShareRound2.bind(this);
    this.SubmitGkgShare = this.SubmitGkgShare.bind(this);
    this.SubmitShamirShare = this.SubmitShamirShare.bind(this);
    this.KeySwitchRequest = this.KeySwitchRequest.bind(this);
  }
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateParams", data);
    return promise.then((data) => MsgUpdateParamsResponse.decode(_m0.Reader.create(data)));
  }

  SubmitPkgShare(request: MsgSubmitPkgShare): Promise<MsgSubmitPkgShareResponse> {
    const data = MsgSubmitPkgShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitPkgShare", data);
    return promise.then((data) => MsgSubmitPkgShareResponse.decode(_m0.Reader.create(data)));
  }

  SubmitRkgShareRound1(request: MsgSubmitRkgShareRound1): Promise<MsgSubmitRkgShareRound1Response> {
    const data = MsgSubmitRkgShareRound1.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitRkgShareRound1", data);
    return promise.then((data) => MsgSubmitRkgShareRound1Response.decode(_m0.Reader.create(data)));
  }

  SubmitRkgShareRound2(request: MsgSubmitRkgShareRound2): Promise<MsgSubmitRkgShareRound2Response> {
    const data = MsgSubmitRkgShareRound2.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitRkgShareRound2", data);
    return promise.then((data) => MsgSubmitRkgShareRound2Response.decode(_m0.Reader.create(data)));
  }

  SubmitGkgShare(request: MsgSubmitGkgShare): Promise<MsgSubmitGkgShareResponse> {
    const data = MsgSubmitGkgShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitGkgShare", data);
    return promise.then((data) => MsgSubmitGkgShareResponse.decode(_m0.Reader.create(data)));
  }

  SubmitShamirShare(request: MsgSubmitShamirShare): Promise<MsgSubmitShamirShareResponse> {
    const data = MsgSubmitShamirShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitShamirShare", data);
    return promise.then((data) => MsgSubmitShamirShareResponse.decode(_m0.Reader.create(data)));
  }

  KeySwitchRequest(request: MsgKeySwitchRequest): Promise<MsgKeySwitchRequestResponse> {
    const data = MsgKeySwitchRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "KeySwitchRequest", data);
    return promise.then((data) => MsgKeySwitchRequestResponse.decode(_m0.Reader.create(data)));
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
