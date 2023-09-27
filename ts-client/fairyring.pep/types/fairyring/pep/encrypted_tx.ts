/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "fairyring.pep";

export interface EncryptedTx {
  targetHeight: number;
  index: number;
  data: string;
  creator: string;
  chargedGas: Coin | undefined;
}

export interface EncryptedTxArray {
  encryptedTx: EncryptedTx[];
}

function createBaseEncryptedTx(): EncryptedTx {
  return { targetHeight: 0, index: 0, data: "", creator: "", chargedGas: undefined };
}

export const EncryptedTx = {
  encode(message: EncryptedTx, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.targetHeight !== 0) {
      writer.uint32(8).uint64(message.targetHeight);
    }
    if (message.index !== 0) {
      writer.uint32(16).uint64(message.index);
    }
    if (message.data !== "") {
      writer.uint32(26).string(message.data);
    }
    if (message.creator !== "") {
      writer.uint32(34).string(message.creator);
    }
    if (message.chargedGas !== undefined) {
      Coin.encode(message.chargedGas, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.targetHeight = longToNumber(reader.uint64() as Long);
          break;
        case 2:
          message.index = longToNumber(reader.uint64() as Long);
          break;
        case 3:
          message.data = reader.string();
          break;
        case 4:
          message.creator = reader.string();
          break;
        case 5:
          message.chargedGas = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncryptedTx {
    return {
      targetHeight: isSet(object.targetHeight) ? Number(object.targetHeight) : 0,
      index: isSet(object.index) ? Number(object.index) : 0,
      data: isSet(object.data) ? String(object.data) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      chargedGas: isSet(object.chargedGas) ? Coin.fromJSON(object.chargedGas) : undefined,
    };
  },

  toJSON(message: EncryptedTx): unknown {
    const obj: any = {};
    message.targetHeight !== undefined && (obj.targetHeight = Math.round(message.targetHeight));
    message.index !== undefined && (obj.index = Math.round(message.index));
    message.data !== undefined && (obj.data = message.data);
    message.creator !== undefined && (obj.creator = message.creator);
    message.chargedGas !== undefined
      && (obj.chargedGas = message.chargedGas ? Coin.toJSON(message.chargedGas) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedTx>, I>>(object: I): EncryptedTx {
    const message = createBaseEncryptedTx();
    message.targetHeight = object.targetHeight ?? 0;
    message.index = object.index ?? 0;
    message.data = object.data ?? "";
    message.creator = object.creator ?? "";
    message.chargedGas = (object.chargedGas !== undefined && object.chargedGas !== null)
      ? Coin.fromPartial(object.chargedGas)
      : undefined;
    return message;
  },
};

function createBaseEncryptedTxArray(): EncryptedTxArray {
  return { encryptedTx: [] };
}

export const EncryptedTxArray = {
  encode(message: EncryptedTxArray, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.encryptedTx) {
      EncryptedTx.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedTxArray {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedTxArray();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.encryptedTx.push(EncryptedTx.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EncryptedTxArray {
    return {
      encryptedTx: Array.isArray(object?.encryptedTx)
        ? object.encryptedTx.map((e: any) => EncryptedTx.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EncryptedTxArray): unknown {
    const obj: any = {};
    if (message.encryptedTx) {
      obj.encryptedTx = message.encryptedTx.map((e) => e ? EncryptedTx.toJSON(e) : undefined);
    } else {
      obj.encryptedTx = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EncryptedTxArray>, I>>(object: I): EncryptedTxArray {
    const message = createBaseEncryptedTxArray();
    message.encryptedTx = object.encryptedTx?.map((e) => EncryptedTx.fromPartial(e)) || [];
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
