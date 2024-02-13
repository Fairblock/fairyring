/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

export interface KeyShareRequest {
  identity: string;
  pubkey: string;
  /** Used only when the request is made via IBC */
  ibcInfo:
    | IBCInfo
    | undefined;
  /** Used only when the request is made via IBC */
  counterparty: CounterPartyIBCInfo | undefined;
  aggrKeyshare: string;
  /** This is only used when the request is for private governance */
  proposalId: string;
  /** might be useful to destination chains to sort out the response */
  requestId: string;
  sent: boolean;
}

export interface IBCInfo {
  ClientID: string;
  ConnectionID: string;
  ChannelID: string;
  PortID: string;
}

export interface CounterPartyIBCInfo {
  ClientID: string;
  ConnectionID: string;
  ChannelID: string;
  PortID: string;
}

/** MsgRequestAggrKeyshare defines a struct for the data payload */
export interface MsgRequestAggrKeyshare {
  proposalId: string | undefined;
  requestId: string | undefined;
}

export interface MsgRequestAggrKeyshareResponse {
  identity: string;
  pubkey: string;
}

/** MsgGetAggrKeyshare defines a struct for the data payload */
export interface MsgGetAggrKeyshare {
  identity: string;
}

export interface MsgGetAggrKeyshareResponse {
}

function createBaseKeyShareRequest(): KeyShareRequest {
  return {
    identity: "",
    pubkey: "",
    ibcInfo: undefined,
    counterparty: undefined,
    aggrKeyshare: "",
    proposalId: "",
    requestId: "",
    sent: false,
  };
}

export const KeyShareRequest = {
  encode(message: KeyShareRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    if (message.ibcInfo !== undefined) {
      IBCInfo.encode(message.ibcInfo, writer.uint32(26).fork()).ldelim();
    }
    if (message.counterparty !== undefined) {
      CounterPartyIBCInfo.encode(message.counterparty, writer.uint32(34).fork()).ldelim();
    }
    if (message.aggrKeyshare !== "") {
      writer.uint32(42).string(message.aggrKeyshare);
    }
    if (message.proposalId !== "") {
      writer.uint32(50).string(message.proposalId);
    }
    if (message.requestId !== "") {
      writer.uint32(58).string(message.requestId);
    }
    if (message.sent === true) {
      writer.uint32(64).bool(message.sent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeyShareRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyShareRequest();
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
          message.ibcInfo = IBCInfo.decode(reader, reader.uint32());
          break;
        case 4:
          message.counterparty = CounterPartyIBCInfo.decode(reader, reader.uint32());
          break;
        case 5:
          message.aggrKeyshare = reader.string();
          break;
        case 6:
          message.proposalId = reader.string();
          break;
        case 7:
          message.requestId = reader.string();
          break;
        case 8:
          message.sent = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): KeyShareRequest {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      ibcInfo: isSet(object.ibcInfo) ? IBCInfo.fromJSON(object.ibcInfo) : undefined,
      counterparty: isSet(object.counterparty) ? CounterPartyIBCInfo.fromJSON(object.counterparty) : undefined,
      aggrKeyshare: isSet(object.aggrKeyshare) ? String(object.aggrKeyshare) : "",
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : "",
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      sent: isSet(object.sent) ? Boolean(object.sent) : false,
    };
  },

  toJSON(message: KeyShareRequest): unknown {
    const obj: any = {};
    message.identity !== undefined && (obj.identity = message.identity);
    message.pubkey !== undefined && (obj.pubkey = message.pubkey);
    message.ibcInfo !== undefined && (obj.ibcInfo = message.ibcInfo ? IBCInfo.toJSON(message.ibcInfo) : undefined);
    message.counterparty !== undefined
      && (obj.counterparty = message.counterparty ? CounterPartyIBCInfo.toJSON(message.counterparty) : undefined);
    message.aggrKeyshare !== undefined && (obj.aggrKeyshare = message.aggrKeyshare);
    message.proposalId !== undefined && (obj.proposalId = message.proposalId);
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.sent !== undefined && (obj.sent = message.sent);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<KeyShareRequest>, I>>(object: I): KeyShareRequest {
    const message = createBaseKeyShareRequest();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.ibcInfo = (object.ibcInfo !== undefined && object.ibcInfo !== null)
      ? IBCInfo.fromPartial(object.ibcInfo)
      : undefined;
    message.counterparty = (object.counterparty !== undefined && object.counterparty !== null)
      ? CounterPartyIBCInfo.fromPartial(object.counterparty)
      : undefined;
    message.aggrKeyshare = object.aggrKeyshare ?? "";
    message.proposalId = object.proposalId ?? "";
    message.requestId = object.requestId ?? "";
    message.sent = object.sent ?? false;
    return message;
  },
};

function createBaseIBCInfo(): IBCInfo {
  return { ClientID: "", ConnectionID: "", ChannelID: "", PortID: "" };
}

export const IBCInfo = {
  encode(message: IBCInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ClientID !== "") {
      writer.uint32(10).string(message.ClientID);
    }
    if (message.ConnectionID !== "") {
      writer.uint32(18).string(message.ConnectionID);
    }
    if (message.ChannelID !== "") {
      writer.uint32(26).string(message.ChannelID);
    }
    if (message.PortID !== "") {
      writer.uint32(34).string(message.PortID);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IBCInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIBCInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ClientID = reader.string();
          break;
        case 2:
          message.ConnectionID = reader.string();
          break;
        case 3:
          message.ChannelID = reader.string();
          break;
        case 4:
          message.PortID = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): IBCInfo {
    return {
      ClientID: isSet(object.ClientID) ? String(object.ClientID) : "",
      ConnectionID: isSet(object.ConnectionID) ? String(object.ConnectionID) : "",
      ChannelID: isSet(object.ChannelID) ? String(object.ChannelID) : "",
      PortID: isSet(object.PortID) ? String(object.PortID) : "",
    };
  },

  toJSON(message: IBCInfo): unknown {
    const obj: any = {};
    message.ClientID !== undefined && (obj.ClientID = message.ClientID);
    message.ConnectionID !== undefined && (obj.ConnectionID = message.ConnectionID);
    message.ChannelID !== undefined && (obj.ChannelID = message.ChannelID);
    message.PortID !== undefined && (obj.PortID = message.PortID);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<IBCInfo>, I>>(object: I): IBCInfo {
    const message = createBaseIBCInfo();
    message.ClientID = object.ClientID ?? "";
    message.ConnectionID = object.ConnectionID ?? "";
    message.ChannelID = object.ChannelID ?? "";
    message.PortID = object.PortID ?? "";
    return message;
  },
};

function createBaseCounterPartyIBCInfo(): CounterPartyIBCInfo {
  return { ClientID: "", ConnectionID: "", ChannelID: "", PortID: "" };
}

export const CounterPartyIBCInfo = {
  encode(message: CounterPartyIBCInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.ClientID !== "") {
      writer.uint32(10).string(message.ClientID);
    }
    if (message.ConnectionID !== "") {
      writer.uint32(18).string(message.ConnectionID);
    }
    if (message.ChannelID !== "") {
      writer.uint32(26).string(message.ChannelID);
    }
    if (message.PortID !== "") {
      writer.uint32(34).string(message.PortID);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CounterPartyIBCInfo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounterPartyIBCInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ClientID = reader.string();
          break;
        case 2:
          message.ConnectionID = reader.string();
          break;
        case 3:
          message.ChannelID = reader.string();
          break;
        case 4:
          message.PortID = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CounterPartyIBCInfo {
    return {
      ClientID: isSet(object.ClientID) ? String(object.ClientID) : "",
      ConnectionID: isSet(object.ConnectionID) ? String(object.ConnectionID) : "",
      ChannelID: isSet(object.ChannelID) ? String(object.ChannelID) : "",
      PortID: isSet(object.PortID) ? String(object.PortID) : "",
    };
  },

  toJSON(message: CounterPartyIBCInfo): unknown {
    const obj: any = {};
    message.ClientID !== undefined && (obj.ClientID = message.ClientID);
    message.ConnectionID !== undefined && (obj.ConnectionID = message.ConnectionID);
    message.ChannelID !== undefined && (obj.ChannelID = message.ChannelID);
    message.PortID !== undefined && (obj.PortID = message.PortID);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CounterPartyIBCInfo>, I>>(object: I): CounterPartyIBCInfo {
    const message = createBaseCounterPartyIBCInfo();
    message.ClientID = object.ClientID ?? "";
    message.ConnectionID = object.ConnectionID ?? "";
    message.ChannelID = object.ChannelID ?? "";
    message.PortID = object.PortID ?? "";
    return message;
  },
};

function createBaseMsgRequestAggrKeyshare(): MsgRequestAggrKeyshare {
  return { proposalId: undefined, requestId: undefined };
}

export const MsgRequestAggrKeyshare = {
  encode(message: MsgRequestAggrKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.proposalId !== undefined) {
      writer.uint32(10).string(message.proposalId);
    }
    if (message.requestId !== undefined) {
      writer.uint32(18).string(message.requestId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRequestAggrKeyshare {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRequestAggrKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.proposalId = reader.string();
          break;
        case 2:
          message.requestId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRequestAggrKeyshare {
    return {
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : undefined,
      requestId: isSet(object.requestId) ? String(object.requestId) : undefined,
    };
  },

  toJSON(message: MsgRequestAggrKeyshare): unknown {
    const obj: any = {};
    message.proposalId !== undefined && (obj.proposalId = message.proposalId);
    message.requestId !== undefined && (obj.requestId = message.requestId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRequestAggrKeyshare>, I>>(object: I): MsgRequestAggrKeyshare {
    const message = createBaseMsgRequestAggrKeyshare();
    message.proposalId = object.proposalId ?? undefined;
    message.requestId = object.requestId ?? undefined;
    return message;
  },
};

function createBaseMsgRequestAggrKeyshareResponse(): MsgRequestAggrKeyshareResponse {
  return { identity: "", pubkey: "" };
}

export const MsgRequestAggrKeyshareResponse = {
  encode(message: MsgRequestAggrKeyshareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRequestAggrKeyshareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRequestAggrKeyshareResponse();
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

  fromJSON(object: any): MsgRequestAggrKeyshareResponse {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: MsgRequestAggrKeyshareResponse): unknown {
    const obj: any = {};
    message.identity !== undefined && (obj.identity = message.identity);
    message.pubkey !== undefined && (obj.pubkey = message.pubkey);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRequestAggrKeyshareResponse>, I>>(
    object: I,
  ): MsgRequestAggrKeyshareResponse {
    const message = createBaseMsgRequestAggrKeyshareResponse();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseMsgGetAggrKeyshare(): MsgGetAggrKeyshare {
  return { identity: "" };
}

export const MsgGetAggrKeyshare = {
  encode(message: MsgGetAggrKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgGetAggrKeyshare {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgGetAggrKeyshare();
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

  fromJSON(object: any): MsgGetAggrKeyshare {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: MsgGetAggrKeyshare): unknown {
    const obj: any = {};
    message.identity !== undefined && (obj.identity = message.identity);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgGetAggrKeyshare>, I>>(object: I): MsgGetAggrKeyshare {
    const message = createBaseMsgGetAggrKeyshare();
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseMsgGetAggrKeyshareResponse(): MsgGetAggrKeyshareResponse {
  return {};
}

export const MsgGetAggrKeyshareResponse = {
  encode(_: MsgGetAggrKeyshareResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgGetAggrKeyshareResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgGetAggrKeyshareResponse();
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

  fromJSON(_: any): MsgGetAggrKeyshareResponse {
    return {};
  },

  toJSON(_: MsgGetAggrKeyshareResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgGetAggrKeyshareResponse>, I>>(_: I): MsgGetAggrKeyshareResponse {
    const message = createBaseMsgGetAggrKeyshareResponse();
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
