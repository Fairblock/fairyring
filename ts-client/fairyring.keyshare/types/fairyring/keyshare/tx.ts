/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Params } from "./params";
import { EncryptedKeyShare } from "./pub_key";

export const protobufPackage = "fairyring.keyshare";

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

export interface MsgRegisterValidator {
  creator: string;
}

export interface MsgRegisterValidatorResponse {
  creator: string;
}

export interface MsgDeRegisterValidator {
  creator: string;
}

export interface MsgDeRegisterValidatorResponse {
  creator: string;
}

export interface MsgSendKeyshare {
  creator: string;
  message: string;
  keyShareIndex: number;
  blockHeight: number;
}

export interface MsgSendKeyshareResponse {
  creator: string;
  keyshare: string;
  keyshareIndex: number;
  blockHeight: number;
  receivedBlockHeight: number;
  success: boolean;
  errorMessage: string;
}

/** this line is used by starport scaffolding # proto/tx/message */
export interface MsgCreateLatestPubKey {
  creator: string;
  publicKey: string;
  commitments: string[];
  numberOfValidators: number;
  encryptedKeyShares: EncryptedKeyShare[];
}

export interface MsgCreateLatestPubKeyResponse {
}

export interface MsgOverrideLatestPubKey {
  creator: string;
  publicKey: string;
  commitments: string[];
  numberOfValidators: number;
  encryptedKeyShares: EncryptedKeyShare[];
}

export interface MsgOverrideLatestPubKeyResponse {
}

export interface MsgCreateAuthorizedAddress {
  target: string;
  creator: string;
}

export interface MsgCreateAuthorizedAddressResponse {
}

export interface MsgUpdateAuthorizedAddress {
  target: string;
  isAuthorized: boolean;
  creator: string;
}

export interface MsgUpdateAuthorizedAddressResponse {
}

export interface MsgDeleteAuthorizedAddress {
  target: string;
  creator: string;
}

export interface MsgDeleteAuthorizedAddressResponse {
}

export interface MsgCreateGeneralKeyShare {
  creator: string;
  idType: string;
  idValue: string;
  keyShare: string;
  keyShareIndex: number;
  receivedTimestamp: number;
  receivedBlockHeight: number;
}

export interface MsgCreateGeneralKeyShareResponse {
  creator: string;
  idType: string;
  idValue: string;
  keyShare: string;
  keyShareIndex: number;
  receivedBlockHeight: number;
  success: boolean;
  errorMessage: string;
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

function createBaseMsgRegisterValidator(): MsgRegisterValidator {
  return { creator: "" };
}

export const MsgRegisterValidator = {
  encode(message: MsgRegisterValidator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterValidator {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterValidator();
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

  fromJSON(object: any): MsgRegisterValidator {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgRegisterValidator): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterValidator>, I>>(base?: I): MsgRegisterValidator {
    return MsgRegisterValidator.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterValidator>, I>>(object: I): MsgRegisterValidator {
    const message = createBaseMsgRegisterValidator();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgRegisterValidatorResponse(): MsgRegisterValidatorResponse {
  return { creator: "" };
}

export const MsgRegisterValidatorResponse = {
  encode(message: MsgRegisterValidatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterValidatorResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterValidatorResponse();
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

  fromJSON(object: any): MsgRegisterValidatorResponse {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgRegisterValidatorResponse): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRegisterValidatorResponse>, I>>(base?: I): MsgRegisterValidatorResponse {
    return MsgRegisterValidatorResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRegisterValidatorResponse>, I>>(object: I): MsgRegisterValidatorResponse {
    const message = createBaseMsgRegisterValidatorResponse();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgDeRegisterValidator(): MsgDeRegisterValidator {
  return { creator: "" };
}

export const MsgDeRegisterValidator = {
  encode(message: MsgDeRegisterValidator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeRegisterValidator {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeRegisterValidator();
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

  fromJSON(object: any): MsgDeRegisterValidator {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgDeRegisterValidator): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeRegisterValidator>, I>>(base?: I): MsgDeRegisterValidator {
    return MsgDeRegisterValidator.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeRegisterValidator>, I>>(object: I): MsgDeRegisterValidator {
    const message = createBaseMsgDeRegisterValidator();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgDeRegisterValidatorResponse(): MsgDeRegisterValidatorResponse {
  return { creator: "" };
}

export const MsgDeRegisterValidatorResponse = {
  encode(message: MsgDeRegisterValidatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeRegisterValidatorResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeRegisterValidatorResponse();
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

  fromJSON(object: any): MsgDeRegisterValidatorResponse {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgDeRegisterValidatorResponse): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeRegisterValidatorResponse>, I>>(base?: I): MsgDeRegisterValidatorResponse {
    return MsgDeRegisterValidatorResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeRegisterValidatorResponse>, I>>(
    object: I,
  ): MsgDeRegisterValidatorResponse {
    const message = createBaseMsgDeRegisterValidatorResponse();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgSendKeyshare(): MsgSendKeyshare {
  return { creator: "", message: "", keyShareIndex: 0, blockHeight: 0 };
}

export const MsgSendKeyshare = {
  encode(message: MsgSendKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.keyShareIndex !== 0) {
      writer.uint32(24).uint64(message.keyShareIndex);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(32).uint64(message.blockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendKeyshare();
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

          message.message = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.keyShareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.blockHeight = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSendKeyshare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      message: isSet(object.message) ? String(object.message) : "",
      keyShareIndex: isSet(object.keyShareIndex) ? Number(object.keyShareIndex) : 0,
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0,
    };
  },

  toJSON(message: MsgSendKeyshare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.message !== "") {
      obj.message = message.message;
    }
    if (message.keyShareIndex !== 0) {
      obj.keyShareIndex = Math.round(message.keyShareIndex);
    }
    if (message.blockHeight !== 0) {
      obj.blockHeight = Math.round(message.blockHeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSendKeyshare>, I>>(base?: I): MsgSendKeyshare {
    return MsgSendKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSendKeyshare>, I>>(object: I): MsgSendKeyshare {
    const message = createBaseMsgSendKeyshare();
    message.creator = object.creator ?? "";
    message.message = object.message ?? "";
    message.keyShareIndex = object.keyShareIndex ?? 0;
    message.blockHeight = object.blockHeight ?? 0;
    return message;
  },
};

function createBaseMsgSendKeyshareResponse(): MsgSendKeyshareResponse {
  return {
    creator: "",
    keyshare: "",
    keyshareIndex: 0,
    blockHeight: 0,
    receivedBlockHeight: 0,
    success: false,
    errorMessage: "",
  };
}

export const MsgSendKeyshareResponse = {
  encode(message: MsgSendKeyshareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.keyshare !== "") {
      writer.uint32(18).string(message.keyshare);
    }
    if (message.keyshareIndex !== 0) {
      writer.uint32(24).uint64(message.keyshareIndex);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(32).uint64(message.blockHeight);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(40).uint64(message.receivedBlockHeight);
    }
    if (message.success === true) {
      writer.uint32(48).bool(message.success);
    }
    if (message.errorMessage !== "") {
      writer.uint32(58).string(message.errorMessage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendKeyshareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendKeyshareResponse();
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

          message.keyshare = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.keyshareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.blockHeight = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.errorMessage = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSendKeyshareResponse {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      keyshare: isSet(object.keyshare) ? String(object.keyshare) : "",
      keyshareIndex: isSet(object.keyshareIndex) ? Number(object.keyshareIndex) : 0,
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
      success: isSet(object.success) ? Boolean(object.success) : false,
      errorMessage: isSet(object.errorMessage) ? String(object.errorMessage) : "",
    };
  },

  toJSON(message: MsgSendKeyshareResponse): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.keyshare !== "") {
      obj.keyshare = message.keyshare;
    }
    if (message.keyshareIndex !== 0) {
      obj.keyshareIndex = Math.round(message.keyshareIndex);
    }
    if (message.blockHeight !== 0) {
      obj.blockHeight = Math.round(message.blockHeight);
    }
    if (message.receivedBlockHeight !== 0) {
      obj.receivedBlockHeight = Math.round(message.receivedBlockHeight);
    }
    if (message.success === true) {
      obj.success = message.success;
    }
    if (message.errorMessage !== "") {
      obj.errorMessage = message.errorMessage;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSendKeyshareResponse>, I>>(base?: I): MsgSendKeyshareResponse {
    return MsgSendKeyshareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSendKeyshareResponse>, I>>(object: I): MsgSendKeyshareResponse {
    const message = createBaseMsgSendKeyshareResponse();
    message.creator = object.creator ?? "";
    message.keyshare = object.keyshare ?? "";
    message.keyshareIndex = object.keyshareIndex ?? 0;
    message.blockHeight = object.blockHeight ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    message.success = object.success ?? false;
    message.errorMessage = object.errorMessage ?? "";
    return message;
  },
};

function createBaseMsgCreateLatestPubKey(): MsgCreateLatestPubKey {
  return { creator: "", publicKey: "", commitments: [], numberOfValidators: 0, encryptedKeyShares: [] };
}

export const MsgCreateLatestPubKey = {
  encode(message: MsgCreateLatestPubKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.publicKey !== "") {
      writer.uint32(18).string(message.publicKey);
    }
    for (const v of message.commitments) {
      writer.uint32(26).string(v!);
    }
    if (message.numberOfValidators !== 0) {
      writer.uint32(32).uint64(message.numberOfValidators);
    }
    for (const v of message.encryptedKeyShares) {
      EncryptedKeyShare.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateLatestPubKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateLatestPubKey();
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

          message.publicKey = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.commitments.push(reader.string());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.numberOfValidators = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.encryptedKeyShares.push(EncryptedKeyShare.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateLatestPubKey {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      commitments: Array.isArray(object?.commitments) ? object.commitments.map((e: any) => String(e)) : [],
      numberOfValidators: isSet(object.numberOfValidators) ? Number(object.numberOfValidators) : 0,
      encryptedKeyShares: Array.isArray(object?.encryptedKeyShares)
        ? object.encryptedKeyShares.map((e: any) => EncryptedKeyShare.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MsgCreateLatestPubKey): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.publicKey !== "") {
      obj.publicKey = message.publicKey;
    }
    if (message.commitments?.length) {
      obj.commitments = message.commitments;
    }
    if (message.numberOfValidators !== 0) {
      obj.numberOfValidators = Math.round(message.numberOfValidators);
    }
    if (message.encryptedKeyShares?.length) {
      obj.encryptedKeyShares = message.encryptedKeyShares.map((e) => EncryptedKeyShare.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateLatestPubKey>, I>>(base?: I): MsgCreateLatestPubKey {
    return MsgCreateLatestPubKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateLatestPubKey>, I>>(object: I): MsgCreateLatestPubKey {
    const message = createBaseMsgCreateLatestPubKey();
    message.creator = object.creator ?? "";
    message.publicKey = object.publicKey ?? "";
    message.commitments = object.commitments?.map((e) => e) || [];
    message.numberOfValidators = object.numberOfValidators ?? 0;
    message.encryptedKeyShares = object.encryptedKeyShares?.map((e) => EncryptedKeyShare.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgCreateLatestPubKeyResponse(): MsgCreateLatestPubKeyResponse {
  return {};
}

export const MsgCreateLatestPubKeyResponse = {
  encode(_: MsgCreateLatestPubKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateLatestPubKeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateLatestPubKeyResponse();
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

  fromJSON(_: any): MsgCreateLatestPubKeyResponse {
    return {};
  },

  toJSON(_: MsgCreateLatestPubKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateLatestPubKeyResponse>, I>>(base?: I): MsgCreateLatestPubKeyResponse {
    return MsgCreateLatestPubKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateLatestPubKeyResponse>, I>>(_: I): MsgCreateLatestPubKeyResponse {
    const message = createBaseMsgCreateLatestPubKeyResponse();
    return message;
  },
};

function createBaseMsgOverrideLatestPubKey(): MsgOverrideLatestPubKey {
  return { creator: "", publicKey: "", commitments: [], numberOfValidators: 0, encryptedKeyShares: [] };
}

export const MsgOverrideLatestPubKey = {
  encode(message: MsgOverrideLatestPubKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.publicKey !== "") {
      writer.uint32(18).string(message.publicKey);
    }
    for (const v of message.commitments) {
      writer.uint32(26).string(v!);
    }
    if (message.numberOfValidators !== 0) {
      writer.uint32(32).uint64(message.numberOfValidators);
    }
    for (const v of message.encryptedKeyShares) {
      EncryptedKeyShare.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgOverrideLatestPubKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgOverrideLatestPubKey();
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

          message.publicKey = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.commitments.push(reader.string());
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.numberOfValidators = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.encryptedKeyShares.push(EncryptedKeyShare.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgOverrideLatestPubKey {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      commitments: Array.isArray(object?.commitments) ? object.commitments.map((e: any) => String(e)) : [],
      numberOfValidators: isSet(object.numberOfValidators) ? Number(object.numberOfValidators) : 0,
      encryptedKeyShares: Array.isArray(object?.encryptedKeyShares)
        ? object.encryptedKeyShares.map((e: any) => EncryptedKeyShare.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MsgOverrideLatestPubKey): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.publicKey !== "") {
      obj.publicKey = message.publicKey;
    }
    if (message.commitments?.length) {
      obj.commitments = message.commitments;
    }
    if (message.numberOfValidators !== 0) {
      obj.numberOfValidators = Math.round(message.numberOfValidators);
    }
    if (message.encryptedKeyShares?.length) {
      obj.encryptedKeyShares = message.encryptedKeyShares.map((e) => EncryptedKeyShare.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgOverrideLatestPubKey>, I>>(base?: I): MsgOverrideLatestPubKey {
    return MsgOverrideLatestPubKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgOverrideLatestPubKey>, I>>(object: I): MsgOverrideLatestPubKey {
    const message = createBaseMsgOverrideLatestPubKey();
    message.creator = object.creator ?? "";
    message.publicKey = object.publicKey ?? "";
    message.commitments = object.commitments?.map((e) => e) || [];
    message.numberOfValidators = object.numberOfValidators ?? 0;
    message.encryptedKeyShares = object.encryptedKeyShares?.map((e) => EncryptedKeyShare.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgOverrideLatestPubKeyResponse(): MsgOverrideLatestPubKeyResponse {
  return {};
}

export const MsgOverrideLatestPubKeyResponse = {
  encode(_: MsgOverrideLatestPubKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgOverrideLatestPubKeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgOverrideLatestPubKeyResponse();
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

  fromJSON(_: any): MsgOverrideLatestPubKeyResponse {
    return {};
  },

  toJSON(_: MsgOverrideLatestPubKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgOverrideLatestPubKeyResponse>, I>>(base?: I): MsgOverrideLatestPubKeyResponse {
    return MsgOverrideLatestPubKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgOverrideLatestPubKeyResponse>, I>>(_: I): MsgOverrideLatestPubKeyResponse {
    const message = createBaseMsgOverrideLatestPubKeyResponse();
    return message;
  },
};

function createBaseMsgCreateAuthorizedAddress(): MsgCreateAuthorizedAddress {
  return { target: "", creator: "" };
}

export const MsgCreateAuthorizedAddress = {
  encode(message: MsgCreateAuthorizedAddress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateAuthorizedAddress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateAuthorizedAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): MsgCreateAuthorizedAddress {
    return {
      target: isSet(object.target) ? String(object.target) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
    };
  },

  toJSON(message: MsgCreateAuthorizedAddress): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateAuthorizedAddress>, I>>(base?: I): MsgCreateAuthorizedAddress {
    return MsgCreateAuthorizedAddress.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateAuthorizedAddress>, I>>(object: I): MsgCreateAuthorizedAddress {
    const message = createBaseMsgCreateAuthorizedAddress();
    message.target = object.target ?? "";
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgCreateAuthorizedAddressResponse(): MsgCreateAuthorizedAddressResponse {
  return {};
}

export const MsgCreateAuthorizedAddressResponse = {
  encode(_: MsgCreateAuthorizedAddressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateAuthorizedAddressResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateAuthorizedAddressResponse();
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

  fromJSON(_: any): MsgCreateAuthorizedAddressResponse {
    return {};
  },

  toJSON(_: MsgCreateAuthorizedAddressResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateAuthorizedAddressResponse>, I>>(
    base?: I,
  ): MsgCreateAuthorizedAddressResponse {
    return MsgCreateAuthorizedAddressResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateAuthorizedAddressResponse>, I>>(
    _: I,
  ): MsgCreateAuthorizedAddressResponse {
    const message = createBaseMsgCreateAuthorizedAddressResponse();
    return message;
  },
};

function createBaseMsgUpdateAuthorizedAddress(): MsgUpdateAuthorizedAddress {
  return { target: "", isAuthorized: false, creator: "" };
}

export const MsgUpdateAuthorizedAddress = {
  encode(message: MsgUpdateAuthorizedAddress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.isAuthorized === true) {
      writer.uint32(16).bool(message.isAuthorized);
    }
    if (message.creator !== "") {
      writer.uint32(26).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateAuthorizedAddress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateAuthorizedAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.isAuthorized = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
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

  fromJSON(object: any): MsgUpdateAuthorizedAddress {
    return {
      target: isSet(object.target) ? String(object.target) : "",
      isAuthorized: isSet(object.isAuthorized) ? Boolean(object.isAuthorized) : false,
      creator: isSet(object.creator) ? String(object.creator) : "",
    };
  },

  toJSON(message: MsgUpdateAuthorizedAddress): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.isAuthorized === true) {
      obj.isAuthorized = message.isAuthorized;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateAuthorizedAddress>, I>>(base?: I): MsgUpdateAuthorizedAddress {
    return MsgUpdateAuthorizedAddress.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateAuthorizedAddress>, I>>(object: I): MsgUpdateAuthorizedAddress {
    const message = createBaseMsgUpdateAuthorizedAddress();
    message.target = object.target ?? "";
    message.isAuthorized = object.isAuthorized ?? false;
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgUpdateAuthorizedAddressResponse(): MsgUpdateAuthorizedAddressResponse {
  return {};
}

export const MsgUpdateAuthorizedAddressResponse = {
  encode(_: MsgUpdateAuthorizedAddressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdateAuthorizedAddressResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateAuthorizedAddressResponse();
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

  fromJSON(_: any): MsgUpdateAuthorizedAddressResponse {
    return {};
  },

  toJSON(_: MsgUpdateAuthorizedAddressResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateAuthorizedAddressResponse>, I>>(
    base?: I,
  ): MsgUpdateAuthorizedAddressResponse {
    return MsgUpdateAuthorizedAddressResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateAuthorizedAddressResponse>, I>>(
    _: I,
  ): MsgUpdateAuthorizedAddressResponse {
    const message = createBaseMsgUpdateAuthorizedAddressResponse();
    return message;
  },
};

function createBaseMsgDeleteAuthorizedAddress(): MsgDeleteAuthorizedAddress {
  return { target: "", creator: "" };
}

export const MsgDeleteAuthorizedAddress = {
  encode(message: MsgDeleteAuthorizedAddress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteAuthorizedAddress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteAuthorizedAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
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

  fromJSON(object: any): MsgDeleteAuthorizedAddress {
    return {
      target: isSet(object.target) ? String(object.target) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
    };
  },

  toJSON(message: MsgDeleteAuthorizedAddress): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeleteAuthorizedAddress>, I>>(base?: I): MsgDeleteAuthorizedAddress {
    return MsgDeleteAuthorizedAddress.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeleteAuthorizedAddress>, I>>(object: I): MsgDeleteAuthorizedAddress {
    const message = createBaseMsgDeleteAuthorizedAddress();
    message.target = object.target ?? "";
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgDeleteAuthorizedAddressResponse(): MsgDeleteAuthorizedAddressResponse {
  return {};
}

export const MsgDeleteAuthorizedAddressResponse = {
  encode(_: MsgDeleteAuthorizedAddressResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteAuthorizedAddressResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteAuthorizedAddressResponse();
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

  fromJSON(_: any): MsgDeleteAuthorizedAddressResponse {
    return {};
  },

  toJSON(_: MsgDeleteAuthorizedAddressResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeleteAuthorizedAddressResponse>, I>>(
    base?: I,
  ): MsgDeleteAuthorizedAddressResponse {
    return MsgDeleteAuthorizedAddressResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeleteAuthorizedAddressResponse>, I>>(
    _: I,
  ): MsgDeleteAuthorizedAddressResponse {
    const message = createBaseMsgDeleteAuthorizedAddressResponse();
    return message;
  },
};

function createBaseMsgCreateGeneralKeyShare(): MsgCreateGeneralKeyShare {
  return {
    creator: "",
    idType: "",
    idValue: "",
    keyShare: "",
    keyShareIndex: 0,
    receivedTimestamp: 0,
    receivedBlockHeight: 0,
  };
}

export const MsgCreateGeneralKeyShare = {
  encode(message: MsgCreateGeneralKeyShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.idType !== "") {
      writer.uint32(18).string(message.idType);
    }
    if (message.idValue !== "") {
      writer.uint32(26).string(message.idValue);
    }
    if (message.keyShare !== "") {
      writer.uint32(34).string(message.keyShare);
    }
    if (message.keyShareIndex !== 0) {
      writer.uint32(40).uint64(message.keyShareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      writer.uint32(48).uint64(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(56).uint64(message.receivedBlockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateGeneralKeyShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateGeneralKeyShare();
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

          message.idType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.idValue = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keyShare = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.keyShareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.receivedTimestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateGeneralKeyShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      idType: isSet(object.idType) ? String(object.idType) : "",
      idValue: isSet(object.idValue) ? String(object.idValue) : "",
      keyShare: isSet(object.keyShare) ? String(object.keyShare) : "",
      keyShareIndex: isSet(object.keyShareIndex) ? Number(object.keyShareIndex) : 0,
      receivedTimestamp: isSet(object.receivedTimestamp) ? Number(object.receivedTimestamp) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
    };
  },

  toJSON(message: MsgCreateGeneralKeyShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.idType !== "") {
      obj.idType = message.idType;
    }
    if (message.idValue !== "") {
      obj.idValue = message.idValue;
    }
    if (message.keyShare !== "") {
      obj.keyShare = message.keyShare;
    }
    if (message.keyShareIndex !== 0) {
      obj.keyShareIndex = Math.round(message.keyShareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      obj.receivedTimestamp = Math.round(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      obj.receivedBlockHeight = Math.round(message.receivedBlockHeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateGeneralKeyShare>, I>>(base?: I): MsgCreateGeneralKeyShare {
    return MsgCreateGeneralKeyShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateGeneralKeyShare>, I>>(object: I): MsgCreateGeneralKeyShare {
    const message = createBaseMsgCreateGeneralKeyShare();
    message.creator = object.creator ?? "";
    message.idType = object.idType ?? "";
    message.idValue = object.idValue ?? "";
    message.keyShare = object.keyShare ?? "";
    message.keyShareIndex = object.keyShareIndex ?? 0;
    message.receivedTimestamp = object.receivedTimestamp ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    return message;
  },
};

function createBaseMsgCreateGeneralKeyShareResponse(): MsgCreateGeneralKeyShareResponse {
  return {
    creator: "",
    idType: "",
    idValue: "",
    keyShare: "",
    keyShareIndex: 0,
    receivedBlockHeight: 0,
    success: false,
    errorMessage: "",
  };
}

export const MsgCreateGeneralKeyShareResponse = {
  encode(message: MsgCreateGeneralKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.idType !== "") {
      writer.uint32(18).string(message.idType);
    }
    if (message.idValue !== "") {
      writer.uint32(26).string(message.idValue);
    }
    if (message.keyShare !== "") {
      writer.uint32(34).string(message.keyShare);
    }
    if (message.keyShareIndex !== 0) {
      writer.uint32(40).uint64(message.keyShareIndex);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(48).uint64(message.receivedBlockHeight);
    }
    if (message.success === true) {
      writer.uint32(56).bool(message.success);
    }
    if (message.errorMessage !== "") {
      writer.uint32(66).string(message.errorMessage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateGeneralKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateGeneralKeyShareResponse();
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

          message.idType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.idValue = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keyShare = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.keyShareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.success = reader.bool();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.errorMessage = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateGeneralKeyShareResponse {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      idType: isSet(object.idType) ? String(object.idType) : "",
      idValue: isSet(object.idValue) ? String(object.idValue) : "",
      keyShare: isSet(object.keyShare) ? String(object.keyShare) : "",
      keyShareIndex: isSet(object.keyShareIndex) ? Number(object.keyShareIndex) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
      success: isSet(object.success) ? Boolean(object.success) : false,
      errorMessage: isSet(object.errorMessage) ? String(object.errorMessage) : "",
    };
  },

  toJSON(message: MsgCreateGeneralKeyShareResponse): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.idType !== "") {
      obj.idType = message.idType;
    }
    if (message.idValue !== "") {
      obj.idValue = message.idValue;
    }
    if (message.keyShare !== "") {
      obj.keyShare = message.keyShare;
    }
    if (message.keyShareIndex !== 0) {
      obj.keyShareIndex = Math.round(message.keyShareIndex);
    }
    if (message.receivedBlockHeight !== 0) {
      obj.receivedBlockHeight = Math.round(message.receivedBlockHeight);
    }
    if (message.success === true) {
      obj.success = message.success;
    }
    if (message.errorMessage !== "") {
      obj.errorMessage = message.errorMessage;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateGeneralKeyShareResponse>, I>>(
    base?: I,
  ): MsgCreateGeneralKeyShareResponse {
    return MsgCreateGeneralKeyShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateGeneralKeyShareResponse>, I>>(
    object: I,
  ): MsgCreateGeneralKeyShareResponse {
    const message = createBaseMsgCreateGeneralKeyShareResponse();
    message.creator = object.creator ?? "";
    message.idType = object.idType ?? "";
    message.idValue = object.idValue ?? "";
    message.keyShare = object.keyShare ?? "";
    message.keyShareIndex = object.keyShareIndex ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    message.success = object.success ?? false;
    message.errorMessage = object.errorMessage ?? "";
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
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse>;
  DeRegisterValidator(request: MsgDeRegisterValidator): Promise<MsgDeRegisterValidatorResponse>;
  SendKeyshare(request: MsgSendKeyshare): Promise<MsgSendKeyshareResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  CreateLatestPubKey(request: MsgCreateLatestPubKey): Promise<MsgCreateLatestPubKeyResponse>;
  OverrideLatestPubKey(request: MsgOverrideLatestPubKey): Promise<MsgOverrideLatestPubKeyResponse>;
  CreateAuthorizedAddress(request: MsgCreateAuthorizedAddress): Promise<MsgCreateAuthorizedAddressResponse>;
  UpdateAuthorizedAddress(request: MsgUpdateAuthorizedAddress): Promise<MsgUpdateAuthorizedAddressResponse>;
  DeleteAuthorizedAddress(request: MsgDeleteAuthorizedAddress): Promise<MsgDeleteAuthorizedAddressResponse>;
  CreateGeneralKeyShare(request: MsgCreateGeneralKeyShare): Promise<MsgCreateGeneralKeyShareResponse>;
}

export const MsgServiceName = "fairyring.keyshare.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.UpdateParams = this.UpdateParams.bind(this);
    this.RegisterValidator = this.RegisterValidator.bind(this);
    this.DeRegisterValidator = this.DeRegisterValidator.bind(this);
    this.SendKeyshare = this.SendKeyshare.bind(this);
    this.CreateLatestPubKey = this.CreateLatestPubKey.bind(this);
    this.OverrideLatestPubKey = this.OverrideLatestPubKey.bind(this);
    this.CreateAuthorizedAddress = this.CreateAuthorizedAddress.bind(this);
    this.UpdateAuthorizedAddress = this.UpdateAuthorizedAddress.bind(this);
    this.DeleteAuthorizedAddress = this.DeleteAuthorizedAddress.bind(this);
    this.CreateGeneralKeyShare = this.CreateGeneralKeyShare.bind(this);
  }
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateParams", data);
    return promise.then((data) => MsgUpdateParamsResponse.decode(_m0.Reader.create(data)));
  }

  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse> {
    const data = MsgRegisterValidator.encode(request).finish();
    const promise = this.rpc.request(this.service, "RegisterValidator", data);
    return promise.then((data) => MsgRegisterValidatorResponse.decode(_m0.Reader.create(data)));
  }

  DeRegisterValidator(request: MsgDeRegisterValidator): Promise<MsgDeRegisterValidatorResponse> {
    const data = MsgDeRegisterValidator.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeRegisterValidator", data);
    return promise.then((data) => MsgDeRegisterValidatorResponse.decode(_m0.Reader.create(data)));
  }

  SendKeyshare(request: MsgSendKeyshare): Promise<MsgSendKeyshareResponse> {
    const data = MsgSendKeyshare.encode(request).finish();
    const promise = this.rpc.request(this.service, "SendKeyshare", data);
    return promise.then((data) => MsgSendKeyshareResponse.decode(_m0.Reader.create(data)));
  }

  CreateLatestPubKey(request: MsgCreateLatestPubKey): Promise<MsgCreateLatestPubKeyResponse> {
    const data = MsgCreateLatestPubKey.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateLatestPubKey", data);
    return promise.then((data) => MsgCreateLatestPubKeyResponse.decode(_m0.Reader.create(data)));
  }

  OverrideLatestPubKey(request: MsgOverrideLatestPubKey): Promise<MsgOverrideLatestPubKeyResponse> {
    const data = MsgOverrideLatestPubKey.encode(request).finish();
    const promise = this.rpc.request(this.service, "OverrideLatestPubKey", data);
    return promise.then((data) => MsgOverrideLatestPubKeyResponse.decode(_m0.Reader.create(data)));
  }

  CreateAuthorizedAddress(request: MsgCreateAuthorizedAddress): Promise<MsgCreateAuthorizedAddressResponse> {
    const data = MsgCreateAuthorizedAddress.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateAuthorizedAddress", data);
    return promise.then((data) => MsgCreateAuthorizedAddressResponse.decode(_m0.Reader.create(data)));
  }

  UpdateAuthorizedAddress(request: MsgUpdateAuthorizedAddress): Promise<MsgUpdateAuthorizedAddressResponse> {
    const data = MsgUpdateAuthorizedAddress.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateAuthorizedAddress", data);
    return promise.then((data) => MsgUpdateAuthorizedAddressResponse.decode(_m0.Reader.create(data)));
  }

  DeleteAuthorizedAddress(request: MsgDeleteAuthorizedAddress): Promise<MsgDeleteAuthorizedAddressResponse> {
    const data = MsgDeleteAuthorizedAddress.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteAuthorizedAddress", data);
    return promise.then((data) => MsgDeleteAuthorizedAddressResponse.decode(_m0.Reader.create(data)));
  }

  CreateGeneralKeyShare(request: MsgCreateGeneralKeyShare): Promise<MsgCreateGeneralKeyShareResponse> {
    const data = MsgCreateGeneralKeyShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateGeneralKeyShare", data);
    return promise.then((data) => MsgCreateGeneralKeyShareResponse.decode(_m0.Reader.create(data)));
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
