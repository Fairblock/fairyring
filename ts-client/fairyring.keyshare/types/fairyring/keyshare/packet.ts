/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

export interface KeysharePacketData {
  noData?: NoData | undefined;
  requestAggrKeysharePacket?: RequestAggrKeysharePacketData | undefined;
  getAggrKeysharePacket?: GetAggrKeysharePacketData | undefined;
  aggrKeyshareDataPacket?: AggrKeyshareDataPacketData | undefined;
}

export interface NoData {
}

/** RequestAggrKeysharePacketData defines a struct for the packet payload */
export interface RequestAggrKeysharePacketData {
  proposalId?: string | undefined;
  requestId?: string | undefined;
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
  /** used for private governance */
  proposalId: string;
  /** might be useful to destination chains to sort out the response */
  requestId: string;
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.noData = NoData.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.requestAggrKeysharePacket = RequestAggrKeysharePacketData.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.getAggrKeysharePacket = GetAggrKeysharePacketData.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.aggrKeyshareDataPacket = AggrKeyshareDataPacketData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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
    if (message.noData !== undefined) {
      obj.noData = NoData.toJSON(message.noData);
    }
    if (message.requestAggrKeysharePacket !== undefined) {
      obj.requestAggrKeysharePacket = RequestAggrKeysharePacketData.toJSON(message.requestAggrKeysharePacket);
    }
    if (message.getAggrKeysharePacket !== undefined) {
      obj.getAggrKeysharePacket = GetAggrKeysharePacketData.toJSON(message.getAggrKeysharePacket);
    }
    if (message.aggrKeyshareDataPacket !== undefined) {
      obj.aggrKeyshareDataPacket = AggrKeyshareDataPacketData.toJSON(message.aggrKeyshareDataPacket);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeysharePacketData>, I>>(base?: I): KeysharePacketData {
    return KeysharePacketData.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoData();
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

  fromJSON(_: any): NoData {
    return {};
  },

  toJSON(_: NoData): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<NoData>, I>>(base?: I): NoData {
    return NoData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NoData>, I>>(_: I): NoData {
    const message = createBaseNoData();
    return message;
  },
};

function createBaseRequestAggrKeysharePacketData(): RequestAggrKeysharePacketData {
  return { proposalId: undefined, requestId: undefined };
}

export const RequestAggrKeysharePacketData = {
  encode(message: RequestAggrKeysharePacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.proposalId !== undefined) {
      writer.uint32(10).string(message.proposalId);
    }
    if (message.requestId !== undefined) {
      writer.uint32(18).string(message.requestId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestAggrKeysharePacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestAggrKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.proposalId = reader.string();
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

  fromJSON(object: any): RequestAggrKeysharePacketData {
    return {
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : undefined,
      requestId: isSet(object.requestId) ? String(object.requestId) : undefined,
    };
  },

  toJSON(message: RequestAggrKeysharePacketData): unknown {
    const obj: any = {};
    if (message.proposalId !== undefined) {
      obj.proposalId = message.proposalId;
    }
    if (message.requestId !== undefined) {
      obj.requestId = message.requestId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestAggrKeysharePacketData>, I>>(base?: I): RequestAggrKeysharePacketData {
    return RequestAggrKeysharePacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestAggrKeysharePacketData>, I>>(
    object: I,
  ): RequestAggrKeysharePacketData {
    const message = createBaseRequestAggrKeysharePacketData();
    message.proposalId = object.proposalId ?? undefined;
    message.requestId = object.requestId ?? undefined;
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestAggrKeysharePacketAck();
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

  fromJSON(object: any): RequestAggrKeysharePacketAck {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: RequestAggrKeysharePacketAck): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestAggrKeysharePacketAck>, I>>(base?: I): RequestAggrKeysharePacketAck {
    return RequestAggrKeysharePacketAck.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAggrKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): GetAggrKeysharePacketData {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: GetAggrKeysharePacketData): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAggrKeysharePacketData>, I>>(base?: I): GetAggrKeysharePacketData {
    return GetAggrKeysharePacketData.fromPartial(base ?? ({} as any));
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetAggrKeysharePacketAck();
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

  fromJSON(_: any): GetAggrKeysharePacketAck {
    return {};
  },

  toJSON(_: GetAggrKeysharePacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetAggrKeysharePacketAck>, I>>(base?: I): GetAggrKeysharePacketAck {
    return GetAggrKeysharePacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetAggrKeysharePacketAck>, I>>(_: I): GetAggrKeysharePacketAck {
    const message = createBaseGetAggrKeysharePacketAck();
    return message;
  },
};

function createBaseAggrKeyshareDataPacketData(): AggrKeyshareDataPacketData {
  return { identity: "", pubkey: "", aggrKeyshare: "", aggrHeight: "", proposalId: "", requestId: "", retries: 0 };
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
    if (message.requestId !== "") {
      writer.uint32(50).string(message.requestId);
    }
    if (message.retries !== 0) {
      writer.uint32(56).uint64(message.retries);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AggrKeyshareDataPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAggrKeyshareDataPacketData();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.aggrKeyshare = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.aggrHeight = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.proposalId = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.requestId = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.retries = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      retries: isSet(object.retries) ? Number(object.retries) : 0,
    };
  },

  toJSON(message: AggrKeyshareDataPacketData): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.aggrKeyshare !== "") {
      obj.aggrKeyshare = message.aggrKeyshare;
    }
    if (message.aggrHeight !== "") {
      obj.aggrHeight = message.aggrHeight;
    }
    if (message.proposalId !== "") {
      obj.proposalId = message.proposalId;
    }
    if (message.requestId !== "") {
      obj.requestId = message.requestId;
    }
    if (message.retries !== 0) {
      obj.retries = Math.round(message.retries);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AggrKeyshareDataPacketData>, I>>(base?: I): AggrKeyshareDataPacketData {
    return AggrKeyshareDataPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AggrKeyshareDataPacketData>, I>>(object: I): AggrKeyshareDataPacketData {
    const message = createBaseAggrKeyshareDataPacketData();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.aggrKeyshare = object.aggrKeyshare ?? "";
    message.aggrHeight = object.aggrHeight ?? "";
    message.proposalId = object.proposalId ?? "";
    message.requestId = object.requestId ?? "";
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAggrKeyshareDataPacketAck();
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

  fromJSON(_: any): AggrKeyshareDataPacketAck {
    return {};
  },

  toJSON(_: AggrKeyshareDataPacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<AggrKeyshareDataPacketAck>, I>>(base?: I): AggrKeyshareDataPacketAck {
    return AggrKeyshareDataPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AggrKeyshareDataPacketAck>, I>>(_: I): AggrKeyshareDataPacketAck {
    const message = createBaseAggrKeyshareDataPacketAck();
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
