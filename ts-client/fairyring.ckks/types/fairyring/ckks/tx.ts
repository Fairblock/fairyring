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
  handle: string;
}

export interface MsgKeySwitchRequestResponse {
}

export interface MsgSubmitPksShare {
  creator: string;
  shareData: string;
  handle: string;
}

export interface MsgSubmitPksShareResponse {
}

export interface MsgDecryptionRequest {
  creator: string;
  ct: string;
  handle: string;
}

export interface MsgDecryptionRequestResponse {
}

export interface MsgSubmitDecShare {
  creator: string;
  shareDataPublic: string;
  shareDataSecret: string;
  handle: string;
}

export interface MsgSubmitDecShareResponse {
}

export interface MsgSubmitBootstrapShare {
  creator: string;
  shareData: string;
  handle: string;
}

export interface MsgSubmitBootstrapShareResponse {
}

export interface MsgBootstrapRequest {
  creator: string;
}

export interface MsgBootstrapRequestResponse {
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
  return { creator: "", ct: "", newPk: "", handle: "" };
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
    if (message.handle !== "") {
      writer.uint32(34).string(message.handle);
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
        case 4:
          if (tag !== 34) {
            break;
          }

          message.handle = reader.string();
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
      handle: isSet(object.handle) ? String(object.handle) : "",
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
    if (message.handle !== "") {
      obj.handle = message.handle;
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
    message.handle = object.handle ?? "";
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

function createBaseMsgSubmitPksShare(): MsgSubmitPksShare {
  return { creator: "", shareData: "", handle: "" };
}

export const MsgSubmitPksShare = {
  encode(message: MsgSubmitPksShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareData !== "") {
      writer.uint32(18).string(message.shareData);
    }
    if (message.handle !== "") {
      writer.uint32(26).string(message.handle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitPksShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitPksShare();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.handle = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitPksShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareData: isSet(object.shareData) ? String(object.shareData) : "",
      handle: isSet(object.handle) ? String(object.handle) : "",
    };
  },

  toJSON(message: MsgSubmitPksShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareData !== "") {
      obj.shareData = message.shareData;
    }
    if (message.handle !== "") {
      obj.handle = message.handle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitPksShare>, I>>(base?: I): MsgSubmitPksShare {
    return MsgSubmitPksShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitPksShare>, I>>(object: I): MsgSubmitPksShare {
    const message = createBaseMsgSubmitPksShare();
    message.creator = object.creator ?? "";
    message.shareData = object.shareData ?? "";
    message.handle = object.handle ?? "";
    return message;
  },
};

function createBaseMsgSubmitPksShareResponse(): MsgSubmitPksShareResponse {
  return {};
}

export const MsgSubmitPksShareResponse = {
  encode(_: MsgSubmitPksShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitPksShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitPksShareResponse();
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

  fromJSON(_: any): MsgSubmitPksShareResponse {
    return {};
  },

  toJSON(_: MsgSubmitPksShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitPksShareResponse>, I>>(base?: I): MsgSubmitPksShareResponse {
    return MsgSubmitPksShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitPksShareResponse>, I>>(_: I): MsgSubmitPksShareResponse {
    const message = createBaseMsgSubmitPksShareResponse();
    return message;
  },
};

function createBaseMsgDecryptionRequest(): MsgDecryptionRequest {
  return { creator: "", ct: "", handle: "" };
}

export const MsgDecryptionRequest = {
  encode(message: MsgDecryptionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.ct !== "") {
      writer.uint32(18).string(message.ct);
    }
    if (message.handle !== "") {
      writer.uint32(26).string(message.handle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDecryptionRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDecryptionRequest();
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

          message.handle = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgDecryptionRequest {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      ct: isSet(object.ct) ? String(object.ct) : "",
      handle: isSet(object.handle) ? String(object.handle) : "",
    };
  },

  toJSON(message: MsgDecryptionRequest): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.ct !== "") {
      obj.ct = message.ct;
    }
    if (message.handle !== "") {
      obj.handle = message.handle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDecryptionRequest>, I>>(base?: I): MsgDecryptionRequest {
    return MsgDecryptionRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDecryptionRequest>, I>>(object: I): MsgDecryptionRequest {
    const message = createBaseMsgDecryptionRequest();
    message.creator = object.creator ?? "";
    message.ct = object.ct ?? "";
    message.handle = object.handle ?? "";
    return message;
  },
};

function createBaseMsgDecryptionRequestResponse(): MsgDecryptionRequestResponse {
  return {};
}

export const MsgDecryptionRequestResponse = {
  encode(_: MsgDecryptionRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDecryptionRequestResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDecryptionRequestResponse();
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

  fromJSON(_: any): MsgDecryptionRequestResponse {
    return {};
  },

  toJSON(_: MsgDecryptionRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDecryptionRequestResponse>, I>>(base?: I): MsgDecryptionRequestResponse {
    return MsgDecryptionRequestResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDecryptionRequestResponse>, I>>(_: I): MsgDecryptionRequestResponse {
    const message = createBaseMsgDecryptionRequestResponse();
    return message;
  },
};

function createBaseMsgSubmitDecShare(): MsgSubmitDecShare {
  return { creator: "", shareDataPublic: "", shareDataSecret: "", handle: "" };
}

export const MsgSubmitDecShare = {
  encode(message: MsgSubmitDecShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareDataPublic !== "") {
      writer.uint32(18).string(message.shareDataPublic);
    }
    if (message.shareDataSecret !== "") {
      writer.uint32(26).string(message.shareDataSecret);
    }
    if (message.handle !== "") {
      writer.uint32(34).string(message.handle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitDecShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitDecShare();
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

          message.shareDataPublic = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.shareDataSecret = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.handle = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitDecShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareDataPublic: isSet(object.shareDataPublic) ? String(object.shareDataPublic) : "",
      shareDataSecret: isSet(object.shareDataSecret) ? String(object.shareDataSecret) : "",
      handle: isSet(object.handle) ? String(object.handle) : "",
    };
  },

  toJSON(message: MsgSubmitDecShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareDataPublic !== "") {
      obj.shareDataPublic = message.shareDataPublic;
    }
    if (message.shareDataSecret !== "") {
      obj.shareDataSecret = message.shareDataSecret;
    }
    if (message.handle !== "") {
      obj.handle = message.handle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitDecShare>, I>>(base?: I): MsgSubmitDecShare {
    return MsgSubmitDecShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitDecShare>, I>>(object: I): MsgSubmitDecShare {
    const message = createBaseMsgSubmitDecShare();
    message.creator = object.creator ?? "";
    message.shareDataPublic = object.shareDataPublic ?? "";
    message.shareDataSecret = object.shareDataSecret ?? "";
    message.handle = object.handle ?? "";
    return message;
  },
};

function createBaseMsgSubmitDecShareResponse(): MsgSubmitDecShareResponse {
  return {};
}

export const MsgSubmitDecShareResponse = {
  encode(_: MsgSubmitDecShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitDecShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitDecShareResponse();
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

  fromJSON(_: any): MsgSubmitDecShareResponse {
    return {};
  },

  toJSON(_: MsgSubmitDecShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitDecShareResponse>, I>>(base?: I): MsgSubmitDecShareResponse {
    return MsgSubmitDecShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitDecShareResponse>, I>>(_: I): MsgSubmitDecShareResponse {
    const message = createBaseMsgSubmitDecShareResponse();
    return message;
  },
};

function createBaseMsgSubmitBootstrapShare(): MsgSubmitBootstrapShare {
  return { creator: "", shareData: "", handle: "" };
}

export const MsgSubmitBootstrapShare = {
  encode(message: MsgSubmitBootstrapShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.shareData !== "") {
      writer.uint32(18).string(message.shareData);
    }
    if (message.handle !== "") {
      writer.uint32(26).string(message.handle);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitBootstrapShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitBootstrapShare();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.handle = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitBootstrapShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      shareData: isSet(object.shareData) ? String(object.shareData) : "",
      handle: isSet(object.handle) ? String(object.handle) : "",
    };
  },

  toJSON(message: MsgSubmitBootstrapShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.shareData !== "") {
      obj.shareData = message.shareData;
    }
    if (message.handle !== "") {
      obj.handle = message.handle;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitBootstrapShare>, I>>(base?: I): MsgSubmitBootstrapShare {
    return MsgSubmitBootstrapShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitBootstrapShare>, I>>(object: I): MsgSubmitBootstrapShare {
    const message = createBaseMsgSubmitBootstrapShare();
    message.creator = object.creator ?? "";
    message.shareData = object.shareData ?? "";
    message.handle = object.handle ?? "";
    return message;
  },
};

function createBaseMsgSubmitBootstrapShareResponse(): MsgSubmitBootstrapShareResponse {
  return {};
}

export const MsgSubmitBootstrapShareResponse = {
  encode(_: MsgSubmitBootstrapShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitBootstrapShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitBootstrapShareResponse();
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

  fromJSON(_: any): MsgSubmitBootstrapShareResponse {
    return {};
  },

  toJSON(_: MsgSubmitBootstrapShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitBootstrapShareResponse>, I>>(base?: I): MsgSubmitBootstrapShareResponse {
    return MsgSubmitBootstrapShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitBootstrapShareResponse>, I>>(_: I): MsgSubmitBootstrapShareResponse {
    const message = createBaseMsgSubmitBootstrapShareResponse();
    return message;
  },
};

function createBaseMsgBootstrapRequest(): MsgBootstrapRequest {
  return { creator: "" };
}

export const MsgBootstrapRequest = {
  encode(message: MsgBootstrapRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBootstrapRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBootstrapRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgBootstrapRequest {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgBootstrapRequest): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgBootstrapRequest>, I>>(base?: I): MsgBootstrapRequest {
    return MsgBootstrapRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgBootstrapRequest>, I>>(object: I): MsgBootstrapRequest {
    const message = createBaseMsgBootstrapRequest();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgBootstrapRequestResponse(): MsgBootstrapRequestResponse {
  return {};
}

export const MsgBootstrapRequestResponse = {
  encode(_: MsgBootstrapRequestResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgBootstrapRequestResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBootstrapRequestResponse();
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

  fromJSON(_: any): MsgBootstrapRequestResponse {
    return {};
  },

  toJSON(_: MsgBootstrapRequestResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgBootstrapRequestResponse>, I>>(base?: I): MsgBootstrapRequestResponse {
    return MsgBootstrapRequestResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgBootstrapRequestResponse>, I>>(_: I): MsgBootstrapRequestResponse {
    const message = createBaseMsgBootstrapRequestResponse();
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
  SubmitPksShare(request: MsgSubmitPksShare): Promise<MsgSubmitPksShareResponse>;
  DecryptionRequest(request: MsgDecryptionRequest): Promise<MsgDecryptionRequestResponse>;
  SubmitDecShare(request: MsgSubmitDecShare): Promise<MsgSubmitDecShareResponse>;
  SubmitBootstrapShare(request: MsgSubmitBootstrapShare): Promise<MsgSubmitBootstrapShareResponse>;
  BootstrapRequest(request: MsgBootstrapRequest): Promise<MsgBootstrapRequestResponse>;
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
    this.SubmitPksShare = this.SubmitPksShare.bind(this);
    this.DecryptionRequest = this.DecryptionRequest.bind(this);
    this.SubmitDecShare = this.SubmitDecShare.bind(this);
    this.SubmitBootstrapShare = this.SubmitBootstrapShare.bind(this);
    this.BootstrapRequest = this.BootstrapRequest.bind(this);
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

  SubmitPksShare(request: MsgSubmitPksShare): Promise<MsgSubmitPksShareResponse> {
    const data = MsgSubmitPksShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitPksShare", data);
    return promise.then((data) => MsgSubmitPksShareResponse.decode(_m0.Reader.create(data)));
  }

  DecryptionRequest(request: MsgDecryptionRequest): Promise<MsgDecryptionRequestResponse> {
    const data = MsgDecryptionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "DecryptionRequest", data);
    return promise.then((data) => MsgDecryptionRequestResponse.decode(_m0.Reader.create(data)));
  }

  SubmitDecShare(request: MsgSubmitDecShare): Promise<MsgSubmitDecShareResponse> {
    const data = MsgSubmitDecShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitDecShare", data);
    return promise.then((data) => MsgSubmitDecShareResponse.decode(_m0.Reader.create(data)));
  }

  SubmitBootstrapShare(request: MsgSubmitBootstrapShare): Promise<MsgSubmitBootstrapShareResponse> {
    const data = MsgSubmitBootstrapShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitBootstrapShare", data);
    return promise.then((data) => MsgSubmitBootstrapShareResponse.decode(_m0.Reader.create(data)));
  }

  BootstrapRequest(request: MsgBootstrapRequest): Promise<MsgBootstrapRequestResponse> {
    const data = MsgBootstrapRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "BootstrapRequest", data);
    return promise.then((data) => MsgBootstrapRequestResponse.decode(_m0.Reader.create(data)));
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
