/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

export interface KeysharePacketData {
  noData: NoData | undefined;
  requestAggrKeysharePacket: RequestAggrKeysharePacketData | undefined;
  getAggrKeysharePacket: GetAggrKeysharePacketData | undefined;
  aggrKeyshareDataPacket: AggrKeyshareDataPacketData | undefined;
}

export interface NoData {
}

/** RequestAggrKeysharePacketData defines a struct for the packet payload */
export interface RequestAggrKeysharePacketData {
  proposalId: string;
}

/** RequestAggrKeysharePacketAck defines a struct for the packet acknowledgment */
export interface RequestAggrKeysharePacketAck {
  identity: string;
  pubkey: string;
}

/** GetAggrKeysharePacketData defines a struct for the packet payload */
export interface GetAggrKeysharePacketData {
  identity: string;
}

/** GetAggrKeysharePacketAck defines a struct for the packet acknowledgment */
export interface GetAggrKeysharePacketAck {
}

/** AggrKeyshareDataPacketData defines a struct for the packet payload */
export interface AggrKeyshareDataPacketData {
  identity: string;
  pubkey: string;
  aggrKeyshare: string;
  aggrHeight: string;
  proposalId: string;
  retries: number;
}

/** AggrKeyshareDataPacketAck defines a struct for the packet acknowledgment */
export interface AggrKeyshareDataPacketAck {
}

function createBaseKeysharePacketData(): KeysharePacketData {
  return {
    noData: undefined,
    requestAggrKeysharePacket: undefined,
    getAggrKeysharePacket: undefined,
    aggrKeyshareDataPacket: undefined,
  };
}

export const KeysharePacketData = {
  encode(message: KeysharePacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.noData !== undefined) {
      NoData.encode(message.noData, writer.uint32(10).fork()).ldelim();
    }
    if (message.requestAggrKeysharePacket !== undefined) {
      RequestAggrKeysharePacketData.encode(message.requestAggrKeysharePacket, writer.uint32(18).fork()).ldelim();
    }
    if (message.getAggrKeysharePacket !== undefined) {
      GetAggrKeysharePacketData.encode(message.getAggrKeysharePacket, writer.uint32(26).fork()).ldelim();
    }
    if (message.aggrKeyshareDataPacket !== undefined) {
      AggrKeyshareDataPacketData.encode(message.aggrKeyshareDataPacket, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeysharePacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.noData = NoData.decode(reader, reader.uint32());
          break;
        case 2:
          message.requestAggrKeysharePacket = RequestAggrKeysharePacketData.decode(reader, reader.uint32());
          break;
        case 3:
          message.getAggrKeysharePacket = GetAggrKeysharePacketData.decode(reader, reader.uint32());
          break;
        case 4:
          message.aggrKeyshareDataPacket = AggrKeyshareDataPacketData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): KeysharePacketData {
    return {
      noData: isSet(object.noData) ? NoData.fromJSON(object.noData) : undefined,
      requestAggrKeysharePacket: isSet(object.requestAggrKeysharePacket)
        ? RequestAggrKeysharePacketData.fromJSON(object.requestAggrKeysharePacket)
        : undefined,
      getAggrKeysharePacket: isSet(object.getAggrKeysharePacket)
        ? GetAggrKeysharePacketData.fromJSON(object.getAggrKeysharePacket)
        : undefined,
      aggrKeyshareDataPacket: isSet(object.aggrKeyshareDataPacket)
        ? AggrKeyshareDataPacketData.fromJSON(object.aggrKeyshareDataPacket)
        : undefined,
    };
  },

  toJSON(message: KeysharePacketData): unknown {
    const obj: any = {};
    message.noData !== undefined && (obj.noData = message.noData ? NoData.toJSON(message.noData) : undefined);
    message.requestAggrKeysharePacket !== undefined
      && (obj.requestAggrKeysharePacket = message.requestAggrKeysharePacket
        ? RequestAggrKeysharePacketData.toJSON(message.requestAggrKeysharePacket)
        : undefined);
    message.getAggrKeysharePacket !== undefined && (obj.getAggrKeysharePacket = message.getAggrKeysharePacket
      ? GetAggrKeysharePacketData.toJSON(message.getAggrKeysharePacket)
      : undefined);
    message.aggrKeyshareDataPacket !== undefined && (obj.aggrKeyshareDataPacket = message.aggrKeyshareDataPacket
      ? AggrKeyshareDataPacketData.toJSON(message.aggrKeyshareDataPacket)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<KeysharePacketData>, I>>(object: I): KeysharePacketData {
    const message = createBaseKeysharePacketData();
    message.noData = (object.noData !== undefined && object.noData !== null)
      ? NoData.fromPartial(object.noData)
      : undefined;
    message.requestAggrKeysharePacket =
      (object.requestAggrKeysharePacket !== undefined && object.requestAggrKeysharePacket !== null)
        ? RequestAggrKeysharePacketData.fromPartial(object.requestAggrKeysharePacket)
        : undefined;
    message.getAggrKeysharePacket =
      (object.getAggrKeysharePacket !== undefined && object.getAggrKeysharePacket !== null)
        ? GetAggrKeysharePacketData.fromPartial(object.getAggrKeysharePacket)
        : undefined;
    message.aggrKeyshareDataPacket =
      (object.aggrKeyshareDataPacket !== undefined && object.aggrKeyshareDataPacket !== null)
        ? AggrKeyshareDataPacketData.fromPartial(object.aggrKeyshareDataPacket)
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

function createBaseRequestAggrKeysharePacketData(): RequestAggrKeysharePacketData {
  return { proposalId: "" };
}

export const RequestAggrKeysharePacketData = {
  encode(message: RequestAggrKeysharePacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.proposalId !== "") {
      writer.uint32(10).string(message.proposalId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestAggrKeysharePacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestAggrKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.proposalId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RequestAggrKeysharePacketData {
    return { proposalId: isSet(object.proposalId) ? String(object.proposalId) : "" };
  },

  toJSON(message: RequestAggrKeysharePacketData): unknown {
    const obj: any = {};
    message.proposalId !== undefined && (obj.proposalId = message.proposalId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RequestAggrKeysharePacketData>, I>>(
    object: I,
  ): RequestAggrKeysharePacketData {
    const message = createBaseRequestAggrKeysharePacketData();
    message.proposalId = object.proposalId ?? "";
    return message;
  },
};

function createBaseRequestAggrKeysharePacketAck(): RequestAggrKeysharePacketAck {
  return { identity: "", pubkey: "" };
}

export const RequestAggrKeysharePacketAck = {
  encode(message: RequestAggrKeysharePacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestAggrKeysharePacketAck {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestAggrKeysharePacketAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identity = reader.string();
          break;
        case 2:
          message.pubkey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RequestAggrKeysharePacketAck {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: RequestAggrKeysharePacketAck): unknown {
    const obj: any = {};
    message.identity !== undefined && (obj.identity = message.identity);
    message.pubkey !== undefined && (obj.pubkey = message.pubkey);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RequestAggrKeysharePacketAck>, I>>(object: I): RequestAggrKeysharePacketAck {
    const message = createBaseRequestAggrKeysharePacketAck();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseGetAggrKeysharePacketData(): GetAggrKeysharePacketData {
  return { identity: "" };
}

export const GetAggrKeysharePacketData = {
  encode(message: GetAggrKeysharePacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAggrKeysharePacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAggrKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identity = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetAggrKeysharePacketData {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: GetAggrKeysharePacketData): unknown {
    const obj: any = {};
    message.identity !== undefined && (obj.identity = message.identity);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAggrKeysharePacketData>, I>>(object: I): GetAggrKeysharePacketData {
    const message = createBaseGetAggrKeysharePacketData();
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseGetAggrKeysharePacketAck(): GetAggrKeysharePacketAck {
  return {};
}

export const GetAggrKeysharePacketAck = {
  encode(_: GetAggrKeysharePacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetAggrKeysharePacketAck {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAggrKeysharePacketAck();
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

  fromJSON(_: any): GetAggrKeysharePacketAck {
    return {};
  },

  toJSON(_: GetAggrKeysharePacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetAggrKeysharePacketAck>, I>>(_: I): GetAggrKeysharePacketAck {
    const message = createBaseGetAggrKeysharePacketAck();
    return message;
  },
};

function createBaseAggrKeyshareDataPacketData(): AggrKeyshareDataPacketData {
  return { identity: "", pubkey: "", aggrKeyshare: "", aggrHeight: "", proposalId: "", retries: 0 };
}

export const AggrKeyshareDataPacketData = {
  encode(message: AggrKeyshareDataPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    if (message.aggrKeyshare !== "") {
      writer.uint32(26).string(message.aggrKeyshare);
    }
    if (message.aggrHeight !== "") {
      writer.uint32(34).string(message.aggrHeight);
    }
    if (message.proposalId !== "") {
      writer.uint32(42).string(message.proposalId);
    }
    if (message.retries !== 0) {
      writer.uint32(48).uint64(message.retries);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AggrKeyshareDataPacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAggrKeyshareDataPacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.identity = reader.string();
          break;
        case 2:
          message.pubkey = reader.string();
          break;
        case 3:
          message.aggrKeyshare = reader.string();
          break;
        case 4:
          message.aggrHeight = reader.string();
          break;
        case 5:
          message.proposalId = reader.string();
          break;
        case 6:
          message.retries = longToNumber(reader.uint64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AggrKeyshareDataPacketData {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      aggrKeyshare: isSet(object.aggrKeyshare) ? String(object.aggrKeyshare) : "",
      aggrHeight: isSet(object.aggrHeight) ? String(object.aggrHeight) : "",
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : "",
      retries: isSet(object.retries) ? Number(object.retries) : 0,
    };
  },

  toJSON(message: AggrKeyshareDataPacketData): unknown {
    const obj: any = {};
    message.identity !== undefined && (obj.identity = message.identity);
    message.pubkey !== undefined && (obj.pubkey = message.pubkey);
    message.aggrKeyshare !== undefined && (obj.aggrKeyshare = message.aggrKeyshare);
    message.aggrHeight !== undefined && (obj.aggrHeight = message.aggrHeight);
    message.proposalId !== undefined && (obj.proposalId = message.proposalId);
    message.retries !== undefined && (obj.retries = Math.round(message.retries));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AggrKeyshareDataPacketData>, I>>(object: I): AggrKeyshareDataPacketData {
    const message = createBaseAggrKeyshareDataPacketData();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.aggrKeyshare = object.aggrKeyshare ?? "";
    message.aggrHeight = object.aggrHeight ?? "";
    message.proposalId = object.proposalId ?? "";
    message.retries = object.retries ?? 0;
    return message;
  },
};

function createBaseAggrKeyshareDataPacketAck(): AggrKeyshareDataPacketAck {
  return {};
}

export const AggrKeyshareDataPacketAck = {
  encode(_: AggrKeyshareDataPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AggrKeyshareDataPacketAck {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAggrKeyshareDataPacketAck();
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

  fromJSON(_: any): AggrKeyshareDataPacketAck {
    return {};
  },

  toJSON(_: AggrKeyshareDataPacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AggrKeyshareDataPacketAck>, I>>(_: I): AggrKeyshareDataPacketAck {
    const message = createBaseAggrKeyshareDataPacketAck();
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
