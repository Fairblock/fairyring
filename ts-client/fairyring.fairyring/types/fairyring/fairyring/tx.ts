/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.fairyring";

export interface MsgRegisterValidator {
  creator: string;
}

export interface MsgRegisterValidatorResponse {
  creator: string;
}

export interface MsgSendKeyshare {
  creator: string;
  message: string;
  commitment: string;
  keyShareIndex: number;
  blockHeight: number;
}

export interface MsgSendKeyshareResponse {
  creator: string;
  keyshare: string;
  commitment: string;
  keyshareIndex: number;
  blockHeight: number;
  receivedBlockHeight: number;
}

/** this line is used by starport scaffolding # proto/tx/message */
export interface MsgCreatePubKeyID {
  creator: string;
  height: number;
  publicKey: string;
  ibeID: string;
}

export interface MsgCreatePubKeyIDResponse {
}

export interface MsgUpdatePubKeyID {
  creator: string;
  height: number;
  publicKey: string;
  ibeID: string;
}

export interface MsgUpdatePubKeyIDResponse {
}

export interface MsgDeletePubKeyID {
  creator: string;
  height: number;
}

export interface MsgDeletePubKeyIDResponse {
}

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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterValidator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterValidator {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgRegisterValidator): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    return obj;
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterValidatorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterValidatorResponse {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgRegisterValidatorResponse): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRegisterValidatorResponse>, I>>(object: I): MsgRegisterValidatorResponse {
    const message = createBaseMsgRegisterValidatorResponse();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgSendKeyshare(): MsgSendKeyshare {
  return { creator: "", message: "", commitment: "", keyShareIndex: 0, blockHeight: 0 };
}

export const MsgSendKeyshare = {
  encode(message: MsgSendKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.commitment !== "") {
      writer.uint32(26).string(message.commitment);
    }
    if (message.keyShareIndex !== 0) {
      writer.uint32(32).uint64(message.keyShareIndex);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(40).uint64(message.blockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendKeyshare {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.message = reader.string();
          break;
        case 3:
          message.commitment = reader.string();
          break;
        case 4:
          message.keyShareIndex = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.blockHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSendKeyshare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      message: isSet(object.message) ? String(object.message) : "",
      commitment: isSet(object.commitment) ? String(object.commitment) : "",
      keyShareIndex: isSet(object.keyShareIndex) ? Number(object.keyShareIndex) : 0,
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0,
    };
  },

  toJSON(message: MsgSendKeyshare): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.message !== undefined && (obj.message = message.message);
    message.commitment !== undefined && (obj.commitment = message.commitment);
    message.keyShareIndex !== undefined && (obj.keyShareIndex = Math.round(message.keyShareIndex));
    message.blockHeight !== undefined && (obj.blockHeight = Math.round(message.blockHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSendKeyshare>, I>>(object: I): MsgSendKeyshare {
    const message = createBaseMsgSendKeyshare();
    message.creator = object.creator ?? "";
    message.message = object.message ?? "";
    message.commitment = object.commitment ?? "";
    message.keyShareIndex = object.keyShareIndex ?? 0;
    message.blockHeight = object.blockHeight ?? 0;
    return message;
  },
};

function createBaseMsgSendKeyshareResponse(): MsgSendKeyshareResponse {
  return { creator: "", keyshare: "", commitment: "", keyshareIndex: 0, blockHeight: 0, receivedBlockHeight: 0 };
}

export const MsgSendKeyshareResponse = {
  encode(message: MsgSendKeyshareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.keyshare !== "") {
      writer.uint32(18).string(message.keyshare);
    }
    if (message.commitment !== "") {
      writer.uint32(26).string(message.commitment);
    }
    if (message.keyshareIndex !== 0) {
      writer.uint32(32).uint64(message.keyshareIndex);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(40).uint64(message.blockHeight);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(48).uint64(message.receivedBlockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendKeyshareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendKeyshareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.keyshare = reader.string();
          break;
        case 3:
          message.commitment = reader.string();
          break;
        case 4:
          message.keyshareIndex = longToNumber(reader.uint64() as Long);
          break;
        case 5:
          message.blockHeight = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSendKeyshareResponse {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      keyshare: isSet(object.keyshare) ? String(object.keyshare) : "",
      commitment: isSet(object.commitment) ? String(object.commitment) : "",
      keyshareIndex: isSet(object.keyshareIndex) ? Number(object.keyshareIndex) : 0,
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
    };
  },

  toJSON(message: MsgSendKeyshareResponse): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.keyshare !== undefined && (obj.keyshare = message.keyshare);
    message.commitment !== undefined && (obj.commitment = message.commitment);
    message.keyshareIndex !== undefined && (obj.keyshareIndex = Math.round(message.keyshareIndex));
    message.blockHeight !== undefined && (obj.blockHeight = Math.round(message.blockHeight));
    message.receivedBlockHeight !== undefined && (obj.receivedBlockHeight = Math.round(message.receivedBlockHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSendKeyshareResponse>, I>>(object: I): MsgSendKeyshareResponse {
    const message = createBaseMsgSendKeyshareResponse();
    message.creator = object.creator ?? "";
    message.keyshare = object.keyshare ?? "";
    message.commitment = object.commitment ?? "";
    message.keyshareIndex = object.keyshareIndex ?? 0;
    message.blockHeight = object.blockHeight ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    return message;
  },
};

function createBaseMsgCreatePubKeyID(): MsgCreatePubKeyID {
  return { creator: "", height: 0, publicKey: "", ibeID: "" };
}

export const MsgCreatePubKeyID = {
  encode(message: MsgCreatePubKeyID, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    if (message.publicKey !== "") {
      writer.uint32(26).string(message.publicKey);
    }
    if (message.ibeID !== "") {
      writer.uint32(34).string(message.ibeID);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreatePubKeyID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreatePubKeyID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.publicKey = reader.string();
          break;
        case 4:
          message.ibeID = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreatePubKeyID {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      ibeID: isSet(object.ibeID) ? String(object.ibeID) : "",
    };
  },

  toJSON(message: MsgCreatePubKeyID): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    message.ibeID !== undefined && (obj.ibeID = message.ibeID);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreatePubKeyID>, I>>(object: I): MsgCreatePubKeyID {
    const message = createBaseMsgCreatePubKeyID();
    message.creator = object.creator ?? "";
    message.height = object.height ?? 0;
    message.publicKey = object.publicKey ?? "";
    message.ibeID = object.ibeID ?? "";
    return message;
  },
};

function createBaseMsgCreatePubKeyIDResponse(): MsgCreatePubKeyIDResponse {
  return {};
}

export const MsgCreatePubKeyIDResponse = {
  encode(_: MsgCreatePubKeyIDResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreatePubKeyIDResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreatePubKeyIDResponse();
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

  fromJSON(_: any): MsgCreatePubKeyIDResponse {
    return {};
  },

  toJSON(_: MsgCreatePubKeyIDResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreatePubKeyIDResponse>, I>>(_: I): MsgCreatePubKeyIDResponse {
    const message = createBaseMsgCreatePubKeyIDResponse();
    return message;
  },
};

function createBaseMsgUpdatePubKeyID(): MsgUpdatePubKeyID {
  return { creator: "", height: 0, publicKey: "", ibeID: "" };
}

export const MsgUpdatePubKeyID = {
  encode(message: MsgUpdatePubKeyID, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    if (message.publicKey !== "") {
      writer.uint32(26).string(message.publicKey);
    }
    if (message.ibeID !== "") {
      writer.uint32(34).string(message.ibeID);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdatePubKeyID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdatePubKeyID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.publicKey = reader.string();
          break;
        case 4:
          message.ibeID = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgUpdatePubKeyID {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      ibeID: isSet(object.ibeID) ? String(object.ibeID) : "",
    };
  },

  toJSON(message: MsgUpdatePubKeyID): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    message.ibeID !== undefined && (obj.ibeID = message.ibeID);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdatePubKeyID>, I>>(object: I): MsgUpdatePubKeyID {
    const message = createBaseMsgUpdatePubKeyID();
    message.creator = object.creator ?? "";
    message.height = object.height ?? 0;
    message.publicKey = object.publicKey ?? "";
    message.ibeID = object.ibeID ?? "";
    return message;
  },
};

function createBaseMsgUpdatePubKeyIDResponse(): MsgUpdatePubKeyIDResponse {
  return {};
}

export const MsgUpdatePubKeyIDResponse = {
  encode(_: MsgUpdatePubKeyIDResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgUpdatePubKeyIDResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdatePubKeyIDResponse();
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

  fromJSON(_: any): MsgUpdatePubKeyIDResponse {
    return {};
  },

  toJSON(_: MsgUpdatePubKeyIDResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgUpdatePubKeyIDResponse>, I>>(_: I): MsgUpdatePubKeyIDResponse {
    const message = createBaseMsgUpdatePubKeyIDResponse();
    return message;
  },
};

function createBaseMsgDeletePubKeyID(): MsgDeletePubKeyID {
  return { creator: "", height: 0 };
}

export const MsgDeletePubKeyID = {
  encode(message: MsgDeletePubKeyID, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeletePubKeyID {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeletePubKeyID();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeletePubKeyID {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
    };
  },

  toJSON(message: MsgDeletePubKeyID): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.height !== undefined && (obj.height = Math.round(message.height));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeletePubKeyID>, I>>(object: I): MsgDeletePubKeyID {
    const message = createBaseMsgDeletePubKeyID();
    message.creator = object.creator ?? "";
    message.height = object.height ?? 0;
    return message;
  },
};

function createBaseMsgDeletePubKeyIDResponse(): MsgDeletePubKeyIDResponse {
  return {};
}

export const MsgDeletePubKeyIDResponse = {
  encode(_: MsgDeletePubKeyIDResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeletePubKeyIDResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeletePubKeyIDResponse();
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

  fromJSON(_: any): MsgDeletePubKeyIDResponse {
    return {};
  },

  toJSON(_: MsgDeletePubKeyIDResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeletePubKeyIDResponse>, I>>(_: I): MsgDeletePubKeyIDResponse {
    const message = createBaseMsgDeletePubKeyIDResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse>;
  SendKeyshare(request: MsgSendKeyshare): Promise<MsgSendKeyshareResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  CreatePubKeyID(request: MsgCreatePubKeyID): Promise<MsgCreatePubKeyIDResponse>;
  UpdatePubKeyID(request: MsgUpdatePubKeyID): Promise<MsgUpdatePubKeyIDResponse>;
  DeletePubKeyID(request: MsgDeletePubKeyID): Promise<MsgDeletePubKeyIDResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RegisterValidator = this.RegisterValidator.bind(this);
    this.SendKeyshare = this.SendKeyshare.bind(this);
    this.CreatePubKeyID = this.CreatePubKeyID.bind(this);
    this.UpdatePubKeyID = this.UpdatePubKeyID.bind(this);
    this.DeletePubKeyID = this.DeletePubKeyID.bind(this);
  }
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse> {
    const data = MsgRegisterValidator.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairyring.Msg", "RegisterValidator", data);
    return promise.then((data) => MsgRegisterValidatorResponse.decode(new _m0.Reader(data)));
  }

  SendKeyshare(request: MsgSendKeyshare): Promise<MsgSendKeyshareResponse> {
    const data = MsgSendKeyshare.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairyring.Msg", "SendKeyshare", data);
    return promise.then((data) => MsgSendKeyshareResponse.decode(new _m0.Reader(data)));
  }

  CreatePubKeyID(request: MsgCreatePubKeyID): Promise<MsgCreatePubKeyIDResponse> {
    const data = MsgCreatePubKeyID.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairyring.Msg", "CreatePubKeyID", data);
    return promise.then((data) => MsgCreatePubKeyIDResponse.decode(new _m0.Reader(data)));
  }

  UpdatePubKeyID(request: MsgUpdatePubKeyID): Promise<MsgUpdatePubKeyIDResponse> {
    const data = MsgUpdatePubKeyID.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairyring.Msg", "UpdatePubKeyID", data);
    return promise.then((data) => MsgUpdatePubKeyIDResponse.decode(new _m0.Reader(data)));
  }

  DeletePubKeyID(request: MsgDeletePubKeyID): Promise<MsgDeletePubKeyIDResponse> {
    const data = MsgDeletePubKeyID.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairyring.Msg", "DeletePubKeyID", data);
    return promise.then((data) => MsgDeletePubKeyIDResponse.decode(new _m0.Reader(data)));
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
