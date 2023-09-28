/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

/** Params defines the parameters for the module. */
export interface Params {
  keyExpiry: number;
  trustedAddresses: string[];
  slashFractionNoKeyshare: Uint8Array;
  slashFractionWrongKeyshare: Uint8Array;
  minimumBonded: number;
  maxIdledBlock: number;
}

function createBaseParams(): Params {
  return {
    keyExpiry: 0,
    trustedAddresses: [],
    slashFractionNoKeyshare: new Uint8Array(),
    slashFractionWrongKeyshare: new Uint8Array(),
    minimumBonded: 0,
    maxIdledBlock: 0,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.keyExpiry !== 0) {
      writer.uint32(8).uint64(message.keyExpiry);
    }
    for (const v of message.trustedAddresses) {
      writer.uint32(18).string(v!);
    }
    if (message.slashFractionNoKeyshare.length !== 0) {
      writer.uint32(26).bytes(message.slashFractionNoKeyshare);
    }
    if (message.slashFractionWrongKeyshare.length !== 0) {
      writer.uint32(34).bytes(message.slashFractionWrongKeyshare);
    }
    if (message.minimumBonded !== 0) {
      writer.uint32(40).uint64(message.minimumBonded);
    }
    if (message.maxIdledBlock !== 0) {
      writer.uint32(48).uint64(message.maxIdledBlock);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.keyExpiry = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.trustedAddresses.push(reader.string());
          break;
        case 3:
          message.slashFractionNoKeyshare = reader.bytes();
          break;
        case 4:
          message.slashFractionWrongKeyshare = reader.bytes();
          break;
        case 5:
          message.minimumBonded = longToNumber(reader.uint64() as Long);
          break;
        case 6:
          message.maxIdledBlock = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      keyExpiry: isSet(object.keyExpiry) ? Number(object.keyExpiry) : 0,
      trustedAddresses: Array.isArray(object?.trustedAddresses)
        ? object.trustedAddresses.map((e: any) => String(e))
        : [],
      slashFractionNoKeyshare: isSet(object.slashFractionNoKeyshare)
        ? bytesFromBase64(object.slashFractionNoKeyshare)
        : new Uint8Array(),
      slashFractionWrongKeyshare: isSet(object.slashFractionWrongKeyshare)
        ? bytesFromBase64(object.slashFractionWrongKeyshare)
        : new Uint8Array(),
      minimumBonded: isSet(object.minimumBonded) ? Number(object.minimumBonded) : 0,
      maxIdledBlock: isSet(object.maxIdledBlock) ? Number(object.maxIdledBlock) : 0,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    message.keyExpiry !== undefined && (obj.keyExpiry = Math.round(message.keyExpiry));
    if (message.trustedAddresses) {
      obj.trustedAddresses = message.trustedAddresses.map((e) => e);
    } else {
      obj.trustedAddresses = [];
    }
    message.slashFractionNoKeyshare !== undefined
      && (obj.slashFractionNoKeyshare = base64FromBytes(
        message.slashFractionNoKeyshare !== undefined ? message.slashFractionNoKeyshare : new Uint8Array(),
      ));
    message.slashFractionWrongKeyshare !== undefined
      && (obj.slashFractionWrongKeyshare = base64FromBytes(
        message.slashFractionWrongKeyshare !== undefined ? message.slashFractionWrongKeyshare : new Uint8Array(),
      ));
    message.minimumBonded !== undefined && (obj.minimumBonded = Math.round(message.minimumBonded));
    message.maxIdledBlock !== undefined && (obj.maxIdledBlock = Math.round(message.maxIdledBlock));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.keyExpiry = object.keyExpiry ?? 0;
    message.trustedAddresses = object.trustedAddresses?.map((e) => e) || [];
    message.slashFractionNoKeyshare = object.slashFractionNoKeyshare ?? new Uint8Array();
    message.slashFractionWrongKeyshare = object.slashFractionWrongKeyshare ?? new Uint8Array();
    message.minimumBonded = object.minimumBonded ?? 0;
    message.maxIdledBlock = object.maxIdledBlock ?? 0;
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

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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
