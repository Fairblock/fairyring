/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.fairblock";

export interface MsgSubmitEncryptedTx {
  creator: string;
  data: string;
  targetBlockHeight: number;
}

export interface MsgSubmitEncryptedTxResponse {
}

export interface MsgSendCurrentHeight {
  creator: string;
  port: string;
  channelID: string;
  timeoutTimestamp: number;
}

export interface MsgSendCurrentHeightResponse {
}

/** this line is used by starport scaffolding # proto/tx/message */
export interface MsgCreateAggregatedKeyShare {
  creator: string;
  height: number;
  data: string;
  publicKey: string;
}

export interface MsgCreateAggregatedKeyShareResponse {
}

function createBaseMsgSubmitEncryptedTx(): MsgSubmitEncryptedTx {
  return { creator: "", data: "", targetBlockHeight: 0 };
}

export const MsgSubmitEncryptedTx = {
  encode(message: MsgSubmitEncryptedTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.data !== "") {
      writer.uint32(18).string(message.data);
    }
    if (message.targetBlockHeight !== 0) {
      writer.uint32(24).uint64(message.targetBlockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitEncryptedTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEncryptedTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.data = reader.string();
          break;
        case 3:
          message.targetBlockHeight = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitEncryptedTx {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      data: isSet(object.data) ? String(object.data) : "",
      targetBlockHeight: isSet(object.targetBlockHeight) ? Number(object.targetBlockHeight) : 0,
    };
  },

  toJSON(message: MsgSubmitEncryptedTx): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.data !== undefined && (obj.data = message.data);
    message.targetBlockHeight !== undefined && (obj.targetBlockHeight = Math.round(message.targetBlockHeight));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSubmitEncryptedTx>, I>>(object: I): MsgSubmitEncryptedTx {
    const message = createBaseMsgSubmitEncryptedTx();
    message.creator = object.creator ?? "";
    message.data = object.data ?? "";
    message.targetBlockHeight = object.targetBlockHeight ?? 0;
    return message;
  },
};

function createBaseMsgSubmitEncryptedTxResponse(): MsgSubmitEncryptedTxResponse {
  return {};
}

export const MsgSubmitEncryptedTxResponse = {
  encode(_: MsgSubmitEncryptedTxResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSubmitEncryptedTxResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEncryptedTxResponse();
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

  fromJSON(_: any): MsgSubmitEncryptedTxResponse {
    return {};
  },

  toJSON(_: MsgSubmitEncryptedTxResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSubmitEncryptedTxResponse>, I>>(_: I): MsgSubmitEncryptedTxResponse {
    const message = createBaseMsgSubmitEncryptedTxResponse();
    return message;
  },
};

function createBaseMsgSendCurrentHeight(): MsgSendCurrentHeight {
  return { creator: "", port: "", channelID: "", timeoutTimestamp: 0 };
}

export const MsgSendCurrentHeight = {
  encode(message: MsgSendCurrentHeight, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.port !== "") {
      writer.uint32(18).string(message.port);
    }
    if (message.channelID !== "") {
      writer.uint32(26).string(message.channelID);
    }
    if (message.timeoutTimestamp !== 0) {
      writer.uint32(32).uint64(message.timeoutTimestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendCurrentHeight {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendCurrentHeight();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.port = reader.string();
          break;
        case 3:
          message.channelID = reader.string();
          break;
        case 4:
          message.timeoutTimestamp = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSendCurrentHeight {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      port: isSet(object.port) ? String(object.port) : "",
      channelID: isSet(object.channelID) ? String(object.channelID) : "",
      timeoutTimestamp: isSet(object.timeoutTimestamp) ? Number(object.timeoutTimestamp) : 0,
    };
  },

  toJSON(message: MsgSendCurrentHeight): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.port !== undefined && (obj.port = message.port);
    message.channelID !== undefined && (obj.channelID = message.channelID);
    message.timeoutTimestamp !== undefined && (obj.timeoutTimestamp = Math.round(message.timeoutTimestamp));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSendCurrentHeight>, I>>(object: I): MsgSendCurrentHeight {
    const message = createBaseMsgSendCurrentHeight();
    message.creator = object.creator ?? "";
    message.port = object.port ?? "";
    message.channelID = object.channelID ?? "";
    message.timeoutTimestamp = object.timeoutTimestamp ?? 0;
    return message;
  },
};

function createBaseMsgSendCurrentHeightResponse(): MsgSendCurrentHeightResponse {
  return {};
}

export const MsgSendCurrentHeightResponse = {
  encode(_: MsgSendCurrentHeightResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSendCurrentHeightResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSendCurrentHeightResponse();
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

  fromJSON(_: any): MsgSendCurrentHeightResponse {
    return {};
  },

  toJSON(_: MsgSendCurrentHeightResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSendCurrentHeightResponse>, I>>(_: I): MsgSendCurrentHeightResponse {
    const message = createBaseMsgSendCurrentHeightResponse();
    return message;
  },
};

function createBaseMsgCreateAggregatedKeyShare(): MsgCreateAggregatedKeyShare {
  return { creator: "", height: 0, data: "", publicKey: "" };
}

export const MsgCreateAggregatedKeyShare = {
  encode(message: MsgCreateAggregatedKeyShare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.height !== 0) {
      writer.uint32(16).uint64(message.height);
    }
    if (message.data !== "") {
      writer.uint32(26).string(message.data);
    }
    if (message.publicKey !== "") {
      writer.uint32(34).string(message.publicKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateAggregatedKeyShare {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateAggregatedKeyShare();
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
          message.data = reader.string();
          break;
        case 4:
          message.publicKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateAggregatedKeyShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
      data: isSet(object.data) ? String(object.data) : "",
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
    };
  },

  toJSON(message: MsgCreateAggregatedKeyShare): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.height !== undefined && (obj.height = Math.round(message.height));
    message.data !== undefined && (obj.data = message.data);
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateAggregatedKeyShare>, I>>(object: I): MsgCreateAggregatedKeyShare {
    const message = createBaseMsgCreateAggregatedKeyShare();
    message.creator = object.creator ?? "";
    message.height = object.height ?? 0;
    message.data = object.data ?? "";
    message.publicKey = object.publicKey ?? "";
    return message;
  },
};

function createBaseMsgCreateAggregatedKeyShareResponse(): MsgCreateAggregatedKeyShareResponse {
  return {};
}

export const MsgCreateAggregatedKeyShareResponse = {
  encode(_: MsgCreateAggregatedKeyShareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateAggregatedKeyShareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateAggregatedKeyShareResponse();
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

  fromJSON(_: any): MsgCreateAggregatedKeyShareResponse {
    return {};
  },

  toJSON(_: MsgCreateAggregatedKeyShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateAggregatedKeyShareResponse>, I>>(
    _: I,
  ): MsgCreateAggregatedKeyShareResponse {
    const message = createBaseMsgCreateAggregatedKeyShareResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  SubmitEncryptedTx(request: MsgSubmitEncryptedTx): Promise<MsgSubmitEncryptedTxResponse>;
  SendCurrentHeight(request: MsgSendCurrentHeight): Promise<MsgSendCurrentHeightResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  CreateAggregatedKeyShare(request: MsgCreateAggregatedKeyShare): Promise<MsgCreateAggregatedKeyShareResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.SubmitEncryptedTx = this.SubmitEncryptedTx.bind(this);
    this.SendCurrentHeight = this.SendCurrentHeight.bind(this);
    this.CreateAggregatedKeyShare = this.CreateAggregatedKeyShare.bind(this);
  }
  SubmitEncryptedTx(request: MsgSubmitEncryptedTx): Promise<MsgSubmitEncryptedTxResponse> {
    const data = MsgSubmitEncryptedTx.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Msg", "SubmitEncryptedTx", data);
    return promise.then((data) => MsgSubmitEncryptedTxResponse.decode(new _m0.Reader(data)));
  }

  SendCurrentHeight(request: MsgSendCurrentHeight): Promise<MsgSendCurrentHeightResponse> {
    const data = MsgSendCurrentHeight.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Msg", "SendCurrentHeight", data);
    return promise.then((data) => MsgSendCurrentHeightResponse.decode(new _m0.Reader(data)));
  }

  CreateAggregatedKeyShare(request: MsgCreateAggregatedKeyShare): Promise<MsgCreateAggregatedKeyShareResponse> {
    const data = MsgCreateAggregatedKeyShare.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairblock.Msg", "CreateAggregatedKeyShare", data);
    return promise.then((data) => MsgCreateAggregatedKeyShareResponse.decode(new _m0.Reader(data)));
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
