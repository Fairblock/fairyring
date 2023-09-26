/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { ActivePubKey, QueuedPubKey } from "./pub_key";

export const protobufPackage = "fairyring.pep";

export interface PepPacketData {
  noData: NoData | undefined;
  currentKeysPacket: CurrentKeysPacketData | undefined;
}

export interface NoData {
}

/** CurrentKeysPacketData defines a struct for the packet payload */
export interface CurrentKeysPacketData {
}

/** CurrentKeysPacketAck defines a struct for the packet acknowledgment */
export interface CurrentKeysPacketAck {
  activeKey: ActivePubKey | undefined;
  queuedKey: QueuedPubKey | undefined;
}

function createBasePepPacketData(): PepPacketData {
  return { noData: undefined, currentKeysPacket: undefined };
}

export const PepPacketData = {
  encode(message: PepPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.noData !== undefined) {
      NoData.encode(message.noData, writer.uint32(10).fork()).ldelim();
    }
    if (message.currentKeysPacket !== undefined) {
      CurrentKeysPacketData.encode(message.currentKeysPacket, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PepPacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePepPacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.noData = NoData.decode(reader, reader.uint32());
          break;
        case 2:
          message.currentKeysPacket = CurrentKeysPacketData.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PepPacketData {
    return {
      noData: isSet(object.noData) ? NoData.fromJSON(object.noData) : undefined,
      currentKeysPacket: isSet(object.currentKeysPacket)
        ? CurrentKeysPacketData.fromJSON(object.currentKeysPacket)
        : undefined,
    };
  },

  toJSON(message: PepPacketData): unknown {
    const obj: any = {};
    message.noData !== undefined && (obj.noData = message.noData ? NoData.toJSON(message.noData) : undefined);
    message.currentKeysPacket !== undefined && (obj.currentKeysPacket = message.currentKeysPacket
      ? CurrentKeysPacketData.toJSON(message.currentKeysPacket)
      : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PepPacketData>, I>>(object: I): PepPacketData {
    const message = createBasePepPacketData();
    message.noData = (object.noData !== undefined && object.noData !== null)
      ? NoData.fromPartial(object.noData)
      : undefined;
    message.currentKeysPacket = (object.currentKeysPacket !== undefined && object.currentKeysPacket !== null)
      ? CurrentKeysPacketData.fromPartial(object.currentKeysPacket)
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

function createBaseCurrentKeysPacketData(): CurrentKeysPacketData {
  return {};
}

export const CurrentKeysPacketData = {
  encode(_: CurrentKeysPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentKeysPacketData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentKeysPacketData();
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

  fromJSON(_: any): CurrentKeysPacketData {
    return {};
  },

  toJSON(_: CurrentKeysPacketData): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CurrentKeysPacketData>, I>>(_: I): CurrentKeysPacketData {
    const message = createBaseCurrentKeysPacketData();
    return message;
  },
};

function createBaseCurrentKeysPacketAck(): CurrentKeysPacketAck {
  return { activeKey: undefined, queuedKey: undefined };
}

export const CurrentKeysPacketAck = {
  encode(message: CurrentKeysPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeKey !== undefined) {
      ActivePubKey.encode(message.activeKey, writer.uint32(18).fork()).ldelim();
    }
    if (message.queuedKey !== undefined) {
      QueuedPubKey.encode(message.queuedKey, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentKeysPacketAck {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentKeysPacketAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2:
          message.activeKey = ActivePubKey.decode(reader, reader.uint32());
          break;
        case 3:
          message.queuedKey = QueuedPubKey.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CurrentKeysPacketAck {
    return {
      activeKey: isSet(object.activeKey) ? ActivePubKey.fromJSON(object.activeKey) : undefined,
      queuedKey: isSet(object.queuedKey) ? QueuedPubKey.fromJSON(object.queuedKey) : undefined,
    };
  },

  toJSON(message: CurrentKeysPacketAck): unknown {
    const obj: any = {};
    message.activeKey !== undefined
      && (obj.activeKey = message.activeKey ? ActivePubKey.toJSON(message.activeKey) : undefined);
    message.queuedKey !== undefined
      && (obj.queuedKey = message.queuedKey ? QueuedPubKey.toJSON(message.queuedKey) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CurrentKeysPacketAck>, I>>(object: I): CurrentKeysPacketAck {
    const message = createBaseCurrentKeysPacketAck();
    message.activeKey = (object.activeKey !== undefined && object.activeKey !== null)
      ? ActivePubKey.fromPartial(object.activeKey)
      : undefined;
    message.queuedKey = (object.queuedKey !== undefined && object.queuedKey !== null)
      ? QueuedPubKey.fromPartial(object.queuedKey)
      : undefined;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
