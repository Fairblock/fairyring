/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.fairblock";

export interface FairblockPacketData {
  noData:
    | NoData
    | undefined;
  /** this line is used by starport scaffolding # ibc/packet/proto/field */
  currentHeightPacket: CurrentHeightPacketData | undefined;
}

export interface NoData {
}

/** CurrentHeightPacketData defines a struct for the packet payload */
export interface CurrentHeightPacketData {
}

/** CurrentHeightPacketAck defines a struct for the packet acknowledgment */
export interface CurrentHeightPacketAck {
  height: number;
}

function createBaseFairblockPacketData(): FairblockPacketData {
  return { noData: undefined, currentHeightPacket: undefined };
}

export const FairblockPacketData = {
  encode(message: FairblockPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.noData !== undefined) {
      NoData.encode(message.noData, writer.uint32(10).fork()).ldelim();
    }
    if (message.currentHeightPacket !== undefined) {
      CurrentHeightPacketData.encode(message.currentHeightPacket, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FairblockPacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFairblockPacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.noData = NoData.decode(reader, reader.uint32());
          break;
        case 2:
          message.currentHeightPacket = CurrentHeightPacketData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FairblockPacketData {
    return {
      noData: isSet(object.noData) ? NoData.fromJSON(object.noData) : undefined,
      currentHeightPacket: isSet(object.currentHeightPacket)
        ? CurrentHeightPacketData.fromJSON(object.currentHeightPacket)
        : undefined,
    };
  },

  toJSON(message: FairblockPacketData): unknown {
    const obj: any = {};
    message.noData !== undefined && (obj.noData = message.noData ? NoData.toJSON(message.noData) : undefined);
    message.currentHeightPacket !== undefined && (obj.currentHeightPacket = message.currentHeightPacket
      ? CurrentHeightPacketData.toJSON(message.currentHeightPacket)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FairblockPacketData>, I>>(object: I): FairblockPacketData {
    const message = createBaseFairblockPacketData();
    message.noData = (object.noData !== undefined && object.noData !== null)
      ? NoData.fromPartial(object.noData)
      : undefined;
    message.currentHeightPacket = (object.currentHeightPacket !== undefined && object.currentHeightPacket !== null)
      ? CurrentHeightPacketData.fromPartial(object.currentHeightPacket)
      : undefined;
    return message;
  },
};

function createBaseNoData(): NoData {
  return {};
}

export const NoData = {
  encode(_: NoData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoData();
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

  fromJSON(_: any): NoData {
    return {};
  },

  toJSON(_: NoData): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NoData>, I>>(_: I): NoData {
    const message = createBaseNoData();
    return message;
  },
};

function createBaseCurrentHeightPacketData(): CurrentHeightPacketData {
  return {};
}

export const CurrentHeightPacketData = {
  encode(_: CurrentHeightPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentHeightPacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentHeightPacketData();
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

  fromJSON(_: any): CurrentHeightPacketData {
    return {};
  },

  toJSON(_: CurrentHeightPacketData): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CurrentHeightPacketData>, I>>(_: I): CurrentHeightPacketData {
    const message = createBaseCurrentHeightPacketData();
    return message;
  },
};

function createBaseCurrentHeightPacketAck(): CurrentHeightPacketAck {
  return { height: 0 };
}

export const CurrentHeightPacketAck = {
  encode(message: CurrentHeightPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.height !== 0) {
      writer.uint32(8).uint64(message.height);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentHeightPacketAck {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentHeightPacketAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.height = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CurrentHeightPacketAck {
    return { height: isSet(object.height) ? Number(object.height) : 0 };
  },

  toJSON(message: CurrentHeightPacketAck): unknown {
    const obj: any = {};
    message.height !== undefined && (obj.height = Math.round(message.height));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CurrentHeightPacketAck>, I>>(object: I): CurrentHeightPacketAck {
    const message = createBaseCurrentHeightPacketAck();
    message.height = object.height ?? 0;
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
