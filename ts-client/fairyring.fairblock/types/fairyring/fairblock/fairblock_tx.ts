/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.fairblock";

export interface FairblockTx {
  data: string;
  nonce: number;
  signed: string;
}

function createBaseFairblockTx(): FairblockTx {
  return { data: "", nonce: 0, signed: "" };
}

export const FairblockTx = {
  encode(message: FairblockTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data !== "") {
      writer.uint32(10).string(message.data);
    }
    if (message.nonce !== 0) {
      writer.uint32(16).uint64(message.nonce);
    }
    if (message.signed !== "") {
      writer.uint32(26).string(message.signed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FairblockTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFairblockTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data = reader.string();
          break;
        case 2:
          message.nonce = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.signed = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FairblockTx {
    return {
      data: isSet(object.data) ? String(object.data) : "",
      nonce: isSet(object.nonce) ? Number(object.nonce) : 0,
      signed: isSet(object.signed) ? String(object.signed) : "",
    };
  },

  toJSON(message: FairblockTx): unknown {
    const obj: any = {};
    message.data !== undefined && (obj.data = message.data);
    message.nonce !== undefined && (obj.nonce = Math.round(message.nonce));
    message.signed !== undefined && (obj.signed = message.signed);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FairblockTx>, I>>(object: I): FairblockTx {
    const message = createBaseFairblockTx();
    message.data = object.data ?? "";
    message.nonce = object.nonce ?? 0;
    message.signed = object.signed ?? "";
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
