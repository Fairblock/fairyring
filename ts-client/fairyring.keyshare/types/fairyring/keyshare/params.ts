/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

/** Params defines the parameters for the module. */
export interface Params {
  keyExpiry: number;
  minimumBonded: number;
  maxIdledBlock: number;
  trustedAddresses: string[];
  slashFractionNoKeyshare: Uint8Array;
  slashFractionWrongKeyshare: Uint8Array;
  avgBlockTime: number;
}

function createBaseParams(): Params {
  return {
    keyExpiry: 0,
    minimumBonded: 0,
    maxIdledBlock: 0,
    trustedAddresses: [],
    slashFractionNoKeyshare: new Uint8Array(0),
    slashFractionWrongKeyshare: new Uint8Array(0),
    avgBlockTime: 0,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.keyExpiry !== 0) {
      writer.uint32(8).uint64(message.keyExpiry);
    }
    if (message.minimumBonded !== 0) {
      writer.uint32(16).uint64(message.minimumBonded);
    }
    if (message.maxIdledBlock !== 0) {
      writer.uint32(24).uint64(message.maxIdledBlock);
    }
    for (const v of message.trustedAddresses) {
      writer.uint32(34).string(v!);
    }
    if (message.slashFractionNoKeyshare.length !== 0) {
      writer.uint32(42).bytes(message.slashFractionNoKeyshare);
    }
    if (message.slashFractionWrongKeyshare.length !== 0) {
      writer.uint32(50).bytes(message.slashFractionWrongKeyshare);
    }
    if (message.avgBlockTime !== 0) {
      writer.uint32(61).float(message.avgBlockTime);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.keyExpiry = longToNumber(reader.uint64() as Long);
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.minimumBonded = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.maxIdledBlock = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.trustedAddresses.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.slashFractionNoKeyshare = reader.bytes();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.slashFractionWrongKeyshare = reader.bytes();
          continue;
        case 7:
          if (tag !== 61) {
            break;
          }

          message.avgBlockTime = reader.float();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      keyExpiry: isSet(object.keyExpiry) ? Number(object.keyExpiry) : 0,
      minimumBonded: isSet(object.minimumBonded) ? Number(object.minimumBonded) : 0,
      maxIdledBlock: isSet(object.maxIdledBlock) ? Number(object.maxIdledBlock) : 0,
      trustedAddresses: Array.isArray(object?.trustedAddresses)
        ? object.trustedAddresses.map((e: any) => String(e))
        : [],
      slashFractionNoKeyshare: isSet(object.slashFractionNoKeyshare)
        ? bytesFromBase64(object.slashFractionNoKeyshare)
        : new Uint8Array(0),
      slashFractionWrongKeyshare: isSet(object.slashFractionWrongKeyshare)
        ? bytesFromBase64(object.slashFractionWrongKeyshare)
        : new Uint8Array(0),
      avgBlockTime: isSet(object.avgBlockTime) ? Number(object.avgBlockTime) : 0,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.keyExpiry !== 0) {
      obj.keyExpiry = Math.round(message.keyExpiry);
    }
    if (message.minimumBonded !== 0) {
      obj.minimumBonded = Math.round(message.minimumBonded);
    }
    if (message.maxIdledBlock !== 0) {
      obj.maxIdledBlock = Math.round(message.maxIdledBlock);
    }
    if (message.trustedAddresses?.length) {
      obj.trustedAddresses = message.trustedAddresses;
    }
    if (message.slashFractionNoKeyshare.length !== 0) {
      obj.slashFractionNoKeyshare = base64FromBytes(message.slashFractionNoKeyshare);
    }
    if (message.slashFractionWrongKeyshare.length !== 0) {
      obj.slashFractionWrongKeyshare = base64FromBytes(message.slashFractionWrongKeyshare);
    }
    if (message.avgBlockTime !== 0) {
      obj.avgBlockTime = message.avgBlockTime;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.keyExpiry = object.keyExpiry ?? 0;
    message.minimumBonded = object.minimumBonded ?? 0;
    message.maxIdledBlock = object.maxIdledBlock ?? 0;
    message.trustedAddresses = object.trustedAddresses?.map((e) => e) || [];
    message.slashFractionNoKeyshare = object.slashFractionNoKeyshare ?? new Uint8Array(0);
    message.slashFractionWrongKeyshare = object.slashFractionWrongKeyshare ?? new Uint8Array(0);
    message.avgBlockTime = object.avgBlockTime ?? 0;
    return message;
  },
};

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

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
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
