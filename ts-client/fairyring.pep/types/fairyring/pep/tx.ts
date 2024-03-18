/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.pep";

export interface MsgSubmitEncryptedTx {
  creator: string;
  data: string;
  targetBlockHeight: number;
}

export interface MsgSubmitEncryptedTxResponse {
}

/** this line is used by starport scaffolding # proto/tx/message */
export interface MsgCreateAggregatedKeyShare {
  creator: string;
  height: number;
  data: string;
}

export interface MsgCreateAggregatedKeyShareResponse {
}

export interface MsgRequestGeneralKeyshare {
  creator: string;
  requestId: string;
}

export interface MsgRequestGeneralKeyshareResponse {
  identity: string;
  pubkey: string;
}

export interface MsgGetGeneralKeyshare {
  creator: string;
  identity: string;
}

export interface MsgGetGeneralKeyshareResponse {
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEncryptedTx();
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

          message.data = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.targetBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.targetBlockHeight !== 0) {
      obj.targetBlockHeight = Math.round(message.targetBlockHeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitEncryptedTx>, I>>(base?: I): MsgSubmitEncryptedTx {
    return MsgSubmitEncryptedTx.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitEncryptedTxResponse();
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

  fromJSON(_: any): MsgSubmitEncryptedTxResponse {
    return {};
  },

  toJSON(_: MsgSubmitEncryptedTxResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitEncryptedTxResponse>, I>>(base?: I): MsgSubmitEncryptedTxResponse {
    return MsgSubmitEncryptedTxResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitEncryptedTxResponse>, I>>(_: I): MsgSubmitEncryptedTxResponse {
    const message = createBaseMsgSubmitEncryptedTxResponse();
    return message;
  },
};

function createBaseMsgCreateAggregatedKeyShare(): MsgCreateAggregatedKeyShare {
  return { creator: "", height: 0, data: "" };
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
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateAggregatedKeyShare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateAggregatedKeyShare();
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
          if (tag !== 16) {
            break;
          }

          message.height = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateAggregatedKeyShare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      height: isSet(object.height) ? Number(object.height) : 0,
      data: isSet(object.data) ? String(object.data) : "",
    };
  },

  toJSON(message: MsgCreateAggregatedKeyShare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.height !== 0) {
      obj.height = Math.round(message.height);
    }
    if (message.data !== "") {
      obj.data = message.data;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateAggregatedKeyShare>, I>>(base?: I): MsgCreateAggregatedKeyShare {
    return MsgCreateAggregatedKeyShare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateAggregatedKeyShare>, I>>(object: I): MsgCreateAggregatedKeyShare {
    const message = createBaseMsgCreateAggregatedKeyShare();
    message.creator = object.creator ?? "";
    message.height = object.height ?? 0;
    message.data = object.data ?? "";
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateAggregatedKeyShareResponse();
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

  fromJSON(_: any): MsgCreateAggregatedKeyShareResponse {
    return {};
  },

  toJSON(_: MsgCreateAggregatedKeyShareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateAggregatedKeyShareResponse>, I>>(
    base?: I,
  ): MsgCreateAggregatedKeyShareResponse {
    return MsgCreateAggregatedKeyShareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateAggregatedKeyShareResponse>, I>>(
    _: I,
  ): MsgCreateAggregatedKeyShareResponse {
    const message = createBaseMsgCreateAggregatedKeyShareResponse();
    return message;
  },
};

function createBaseMsgRequestGeneralKeyshare(): MsgRequestGeneralKeyshare {
  return { creator: "", requestId: "" };
}

export const MsgRequestGeneralKeyshare = {
  encode(message: MsgRequestGeneralKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.requestId !== "") {
      writer.uint32(18).string(message.requestId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRequestGeneralKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRequestGeneralKeyshare();
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

          message.requestId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRequestGeneralKeyshare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
    };
  },

  toJSON(message: MsgRequestGeneralKeyshare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.requestId !== "") {
      obj.requestId = message.requestId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRequestGeneralKeyshare>, I>>(base?: I): MsgRequestGeneralKeyshare {
    return MsgRequestGeneralKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRequestGeneralKeyshare>, I>>(object: I): MsgRequestGeneralKeyshare {
    const message = createBaseMsgRequestGeneralKeyshare();
    message.creator = object.creator ?? "";
    message.requestId = object.requestId ?? "";
    return message;
  },
};

function createBaseMsgRequestGeneralKeyshareResponse(): MsgRequestGeneralKeyshareResponse {
  return { identity: "", pubkey: "" };
}

export const MsgRequestGeneralKeyshareResponse = {
  encode(message: MsgRequestGeneralKeyshareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRequestGeneralKeyshareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRequestGeneralKeyshareResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pubkey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgRequestGeneralKeyshareResponse {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: MsgRequestGeneralKeyshareResponse): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgRequestGeneralKeyshareResponse>, I>>(
    base?: I,
  ): MsgRequestGeneralKeyshareResponse {
    return MsgRequestGeneralKeyshareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgRequestGeneralKeyshareResponse>, I>>(
    object: I,
  ): MsgRequestGeneralKeyshareResponse {
    const message = createBaseMsgRequestGeneralKeyshareResponse();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseMsgGetGeneralKeyshare(): MsgGetGeneralKeyshare {
  return { creator: "", identity: "" };
}

export const MsgGetGeneralKeyshare = {
  encode(message: MsgGetGeneralKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgGetGeneralKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgGetGeneralKeyshare();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgGetGeneralKeyshare {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
    };
  },

  toJSON(message: MsgGetGeneralKeyshare): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgGetGeneralKeyshare>, I>>(base?: I): MsgGetGeneralKeyshare {
    return MsgGetGeneralKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgGetGeneralKeyshare>, I>>(object: I): MsgGetGeneralKeyshare {
    const message = createBaseMsgGetGeneralKeyshare();
    message.creator = object.creator ?? "";
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseMsgGetGeneralKeyshareResponse(): MsgGetGeneralKeyshareResponse {
  return {};
}

export const MsgGetGeneralKeyshareResponse = {
  encode(_: MsgGetGeneralKeyshareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgGetGeneralKeyshareResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgGetGeneralKeyshareResponse();
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

  fromJSON(_: any): MsgGetGeneralKeyshareResponse {
    return {};
  },

  toJSON(_: MsgGetGeneralKeyshareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgGetGeneralKeyshareResponse>, I>>(base?: I): MsgGetGeneralKeyshareResponse {
    return MsgGetGeneralKeyshareResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgGetGeneralKeyshareResponse>, I>>(_: I): MsgGetGeneralKeyshareResponse {
    const message = createBaseMsgGetGeneralKeyshareResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  SubmitEncryptedTx(request: MsgSubmitEncryptedTx): Promise<MsgSubmitEncryptedTxResponse>;
  /** this line is used by starport scaffolding # proto/tx/rpc */
  CreateAggregatedKeyShare(request: MsgCreateAggregatedKeyShare): Promise<MsgCreateAggregatedKeyShareResponse>;
  RequestGeneralKeyshare(request: MsgRequestGeneralKeyshare): Promise<MsgRequestGeneralKeyshareResponse>;
  GetGeneralKeyshare(request: MsgGetGeneralKeyshare): Promise<MsgGetGeneralKeyshareResponse>;
}

export const MsgServiceName = "fairyring.pep.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.SubmitEncryptedTx = this.SubmitEncryptedTx.bind(this);
    this.CreateAggregatedKeyShare = this.CreateAggregatedKeyShare.bind(this);
    this.RequestGeneralKeyshare = this.RequestGeneralKeyshare.bind(this);
    this.GetGeneralKeyshare = this.GetGeneralKeyshare.bind(this);
  }
  SubmitEncryptedTx(request: MsgSubmitEncryptedTx): Promise<MsgSubmitEncryptedTxResponse> {
    const data = MsgSubmitEncryptedTx.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitEncryptedTx", data);
    return promise.then((data) => MsgSubmitEncryptedTxResponse.decode(_m0.Reader.create(data)));
  }

  CreateAggregatedKeyShare(request: MsgCreateAggregatedKeyShare): Promise<MsgCreateAggregatedKeyShareResponse> {
    const data = MsgCreateAggregatedKeyShare.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateAggregatedKeyShare", data);
    return promise.then((data) => MsgCreateAggregatedKeyShareResponse.decode(_m0.Reader.create(data)));
  }

  RequestGeneralKeyshare(request: MsgRequestGeneralKeyshare): Promise<MsgRequestGeneralKeyshareResponse> {
    const data = MsgRequestGeneralKeyshare.encode(request).finish();
    const promise = this.rpc.request(this.service, "RequestGeneralKeyshare", data);
    return promise.then((data) => MsgRequestGeneralKeyshareResponse.decode(_m0.Reader.create(data)));
  }

  GetGeneralKeyshare(request: MsgGetGeneralKeyshare): Promise<MsgGetGeneralKeyshareResponse> {
    const data = MsgGetGeneralKeyshare.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetGeneralKeyshare", data);
    return promise.then((data) => MsgGetGeneralKeyshareResponse.decode(_m0.Reader.create(data)));
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
