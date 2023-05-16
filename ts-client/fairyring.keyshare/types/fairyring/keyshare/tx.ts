/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

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
export interface MsgCreateLatestPubKey {
  creator: string;
  publicKey: string;
}

export interface MsgCreateLatestPubKeyResponse {
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

function createBaseMsgCreateLatestPubKey(): MsgCreateLatestPubKey {
  return { creator: "", publicKey: "" };
}

export const MsgCreateLatestPubKey = {
  encode(message: MsgCreateLatestPubKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.publicKey !== "") {
      writer.uint32(18).string(message.publicKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateLatestPubKey {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateLatestPubKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.publicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateLatestPubKey {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
    };
  },

  toJSON(message: MsgCreateLatestPubKey): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateLatestPubKey>, I>>(object: I): MsgCreateLatestPubKey {
    const message = createBaseMsgCreateLatestPubKey();
    message.creator = object.creator ?? "";
    message.publicKey = object.publicKey ?? "";
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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateLatestPubKeyResponse();
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

  fromJSON(_: any): MsgCreateLatestPubKeyResponse {
    return {};
  },

  toJSON(_: MsgCreateLatestPubKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateLatestPubKeyResponse>, I>>(_: I): MsgCreateLatestPubKeyResponse {
    const message = createBaseMsgCreateLatestPubKeyResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse>;
  SendKeyshare(request: MsgSendKeyshare): Promise<MsgSendKeyshareResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  CreateLatestPubKey(request: MsgCreateLatestPubKey): Promise<MsgCreateLatestPubKeyResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RegisterValidator = this.RegisterValidator.bind(this);
    this.SendKeyshare = this.SendKeyshare.bind(this);
    this.CreateLatestPubKey = this.CreateLatestPubKey.bind(this);
  }
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse> {
    const data = MsgRegisterValidator.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Msg", "RegisterValidator", data);
    return promise.then((data) => MsgRegisterValidatorResponse.decode(new _m0.Reader(data)));
  }

  SendKeyshare(request: MsgSendKeyshare): Promise<MsgSendKeyshareResponse> {
    const data = MsgSendKeyshare.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Msg", "SendKeyshare", data);
    return promise.then((data) => MsgSendKeyshareResponse.decode(new _m0.Reader(data)));
  }

  CreateLatestPubKey(request: MsgCreateLatestPubKey): Promise<MsgCreateLatestPubKeyResponse> {
    const data = MsgCreateLatestPubKey.encode(request).finish();
    const promise = this.rpc.request("fairyring.keyshare.Msg", "CreateLatestPubKey", data);
    return promise.then((data) => MsgCreateLatestPubKeyResponse.decode(new _m0.Reader(data)));
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
