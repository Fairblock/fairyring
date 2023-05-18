/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.pep";

export interface ActivePubKey {
  publicKey: string;
  creator: string;
  expiry: number;
}

export interface QueuedPubKey {
  publicKey: string;
  creator: string;
  expiry: number;
}

function createBaseActivePubKey(): ActivePubKey {
  return { publicKey: "", creator: "", expiry: 0 };
}

export const ActivePubKey = {
  encode(message: ActivePubKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    if (message.expiry !== 0) {
      writer.uint32(24).uint64(message.expiry);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivePubKey {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivePubKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKey = reader.string();
          break;
        case 2:
          message.creator = reader.string();
          break;
        case 3:
          message.expiry = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActivePubKey {
    return {
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      expiry: isSet(object.expiry) ? Number(object.expiry) : 0,
    };
  },

  toJSON(message: ActivePubKey): unknown {
    const obj: any = {};
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    message.creator !== undefined && (obj.creator = message.creator);
    message.expiry !== undefined && (obj.expiry = Math.round(message.expiry));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActivePubKey>, I>>(object: I): ActivePubKey {
    const message = createBaseActivePubKey();
    message.publicKey = object.publicKey ?? "";
    message.creator = object.creator ?? "";
    message.expiry = object.expiry ?? 0;
    return message;
  },
};

function createBaseQueuedPubKey(): QueuedPubKey {
  return { publicKey: "", creator: "", expiry: 0 };
}

export const QueuedPubKey = {
  encode(message: QueuedPubKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    if (message.expiry !== 0) {
      writer.uint32(24).uint64(message.expiry);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueuedPubKey {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueuedPubKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.publicKey = reader.string();
          break;
        case 2:
          message.creator = reader.string();
          break;
        case 3:
          message.expiry = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): QueuedPubKey {
    return {
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      expiry: isSet(object.expiry) ? Number(object.expiry) : 0,
    };
  },

  toJSON(message: QueuedPubKey): unknown {
    const obj: any = {};
    message.publicKey !== undefined && (obj.publicKey = message.publicKey);
    message.creator !== undefined && (obj.creator = message.creator);
    message.expiry !== undefined && (obj.expiry = Math.round(message.expiry));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<QueuedPubKey>, I>>(object: I): QueuedPubKey {
    const message = createBaseQueuedPubKey();
    message.publicKey = object.publicKey ?? "";
    message.creator = object.creator ?? "";
    message.expiry = object.expiry ?? 0;
    return message;
  },
};

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
