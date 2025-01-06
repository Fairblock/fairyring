/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { PrivateDecryptionKey } from "../common/shared_types";

export const protobufPackage = "fairyring.keyshare";

/** DecryptionKeyRequest defines the storage structure for general keyshare requests */
export interface DecryptionKeyRequest {
  identity: string;
  pubkey: string;
  /** Used only when the request is made via IBC */
  ibcInfo:
    | IBCInfo
    | undefined;
  /** Used only when the request is made via IBC */
  counterparty: CounterPartyIBCInfo | undefined;
  decryptionKey: string;
  /** This is only used when the request is for private governance */
  proposalId: string;
  sent: boolean;
}

/**
 * IBCInfo defines the structure to verify request for
 * general and private keyshares in case the request was made over IBC
 */
export interface IBCInfo {
  clientId: string;
  connectionId: string;
  channelId: string;
  portId: string;
}

/**
 * CounterPartyIBCInfo defines the structure to send general
 * and private keyshares if the request was made over IBC
 */
export interface CounterPartyIBCInfo {
  clientId: string;
  connectionId: string;
  channelId: string;
  portId: string;
}

/**
 * PrivateDecryptionKeyRequest defines the stroage structure for private
 * encrypted and unaggregated decryption key requests
 */
export interface PrivateDecryptionKeyRequest {
  identity: string;
  pubkey: string;
  /** Used only when the request is made via IBC */
  ibcInfo:
    | IBCInfo
    | undefined;
  /** Used only when the request is made via IBC */
  counterparty: CounterPartyIBCInfo | undefined;
  privateDecryptionKeys: PrivateDecryptionKey[];
  sent: boolean;
}

function createBaseDecryptionKeyRequest(): DecryptionKeyRequest {
  return {
    identity: "",
    pubkey: "",
    ibcInfo: undefined,
    counterparty: undefined,
    decryptionKey: "",
    proposalId: "",
    sent: false,
  };
}

export const DecryptionKeyRequest = {
  encode(message: DecryptionKeyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    if (message.decryptionKey !== "") {
      writer.uint32(42).string(message.decryptionKey);
    }
    if (message.proposalId !== "") {
      writer.uint32(50).string(message.proposalId);
    }
    if (message.sent === true) {
      writer.uint32(56).bool(message.sent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecryptionKeyRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecryptionKeyRequest();
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

          message.ibcInfo = IBCInfo.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.counterparty = CounterPartyIBCInfo.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.decryptionKey = reader.string();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.proposalId = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.sent = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DecryptionKeyRequest {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      ibcInfo: isSet(object.ibcInfo) ? IBCInfo.fromJSON(object.ibcInfo) : undefined,
      counterparty: isSet(object.counterparty) ? CounterPartyIBCInfo.fromJSON(object.counterparty) : undefined,
      decryptionKey: isSet(object.decryptionKey) ? String(object.decryptionKey) : "",
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : "",
      sent: isSet(object.sent) ? Boolean(object.sent) : false,
    };
  },

  toJSON(message: DecryptionKeyRequest): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.ibcInfo !== undefined) {
      obj.ibcInfo = IBCInfo.toJSON(message.ibcInfo);
    }
    if (message.counterparty !== undefined) {
      obj.counterparty = CounterPartyIBCInfo.toJSON(message.counterparty);
    }
    if (message.decryptionKey !== "") {
      obj.decryptionKey = message.decryptionKey;
    }
    if (message.proposalId !== "") {
      obj.proposalId = message.proposalId;
    }
    if (message.sent === true) {
      obj.sent = message.sent;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DecryptionKeyRequest>, I>>(base?: I): DecryptionKeyRequest {
    return DecryptionKeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecryptionKeyRequest>, I>>(object: I): DecryptionKeyRequest {
    const message = createBaseDecryptionKeyRequest();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.ibcInfo = (object.ibcInfo !== undefined && object.ibcInfo !== null)
      ? IBCInfo.fromPartial(object.ibcInfo)
      : undefined;
    message.counterparty = (object.counterparty !== undefined && object.counterparty !== null)
      ? CounterPartyIBCInfo.fromPartial(object.counterparty)
      : undefined;
    message.decryptionKey = object.decryptionKey ?? "";
    message.proposalId = object.proposalId ?? "";
    message.sent = object.sent ?? false;
    return message;
  },
};

function createBaseIBCInfo(): IBCInfo {
  return { clientId: "", connectionId: "", channelId: "", portId: "" };
}

export const IBCInfo = {
  encode(message: IBCInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.connectionId !== "") {
      writer.uint32(18).string(message.connectionId);
    }
    if (message.channelId !== "") {
      writer.uint32(26).string(message.channelId);
    }
    if (message.portId !== "") {
      writer.uint32(34).string(message.portId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IBCInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIBCInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.clientId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.connectionId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.channelId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.portId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IBCInfo {
    return {
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
      connectionId: isSet(object.connectionId) ? String(object.connectionId) : "",
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      portId: isSet(object.portId) ? String(object.portId) : "",
    };
  },

  toJSON(message: IBCInfo): unknown {
    const obj: any = {};
    if (message.clientId !== "") {
      obj.clientId = message.clientId;
    }
    if (message.connectionId !== "") {
      obj.connectionId = message.connectionId;
    }
    if (message.channelId !== "") {
      obj.channelId = message.channelId;
    }
    if (message.portId !== "") {
      obj.portId = message.portId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IBCInfo>, I>>(base?: I): IBCInfo {
    return IBCInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IBCInfo>, I>>(object: I): IBCInfo {
    const message = createBaseIBCInfo();
    message.clientId = object.clientId ?? "";
    message.connectionId = object.connectionId ?? "";
    message.channelId = object.channelId ?? "";
    message.portId = object.portId ?? "";
    return message;
  },
};

function createBaseCounterPartyIBCInfo(): CounterPartyIBCInfo {
  return { clientId: "", connectionId: "", channelId: "", portId: "" };
}

export const CounterPartyIBCInfo = {
  encode(message: CounterPartyIBCInfo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.connectionId !== "") {
      writer.uint32(18).string(message.connectionId);
    }
    if (message.channelId !== "") {
      writer.uint32(26).string(message.channelId);
    }
    if (message.portId !== "") {
      writer.uint32(34).string(message.portId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CounterPartyIBCInfo {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounterPartyIBCInfo();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.clientId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.connectionId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.channelId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.portId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CounterPartyIBCInfo {
    return {
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
      connectionId: isSet(object.connectionId) ? String(object.connectionId) : "",
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      portId: isSet(object.portId) ? String(object.portId) : "",
    };
  },

  toJSON(message: CounterPartyIBCInfo): unknown {
    const obj: any = {};
    if (message.clientId !== "") {
      obj.clientId = message.clientId;
    }
    if (message.connectionId !== "") {
      obj.connectionId = message.connectionId;
    }
    if (message.channelId !== "") {
      obj.channelId = message.channelId;
    }
    if (message.portId !== "") {
      obj.portId = message.portId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CounterPartyIBCInfo>, I>>(base?: I): CounterPartyIBCInfo {
    return CounterPartyIBCInfo.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CounterPartyIBCInfo>, I>>(object: I): CounterPartyIBCInfo {
    const message = createBaseCounterPartyIBCInfo();
    message.clientId = object.clientId ?? "";
    message.connectionId = object.connectionId ?? "";
    message.channelId = object.channelId ?? "";
    message.portId = object.portId ?? "";
    return message;
  },
};

function createBasePrivateDecryptionKeyRequest(): PrivateDecryptionKeyRequest {
  return {
    identity: "",
    pubkey: "",
    ibcInfo: undefined,
    counterparty: undefined,
    privateDecryptionKeys: [],
    sent: false,
  };
}

export const PrivateDecryptionKeyRequest = {
  encode(message: PrivateDecryptionKeyRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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
    for (const v of message.privateDecryptionKeys) {
      PrivateDecryptionKey.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    if (message.sent === true) {
      writer.uint32(56).bool(message.sent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PrivateDecryptionKeyRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrivateDecryptionKeyRequest();
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

          message.ibcInfo = IBCInfo.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.counterparty = CounterPartyIBCInfo.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.privateDecryptionKeys.push(PrivateDecryptionKey.decode(reader, reader.uint32()));
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.sent = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PrivateDecryptionKeyRequest {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      ibcInfo: isSet(object.ibcInfo) ? IBCInfo.fromJSON(object.ibcInfo) : undefined,
      counterparty: isSet(object.counterparty) ? CounterPartyIBCInfo.fromJSON(object.counterparty) : undefined,
      privateDecryptionKeys: Array.isArray(object?.privateDecryptionKeys)
        ? object.privateDecryptionKeys.map((e: any) => PrivateDecryptionKey.fromJSON(e))
        : [],
      sent: isSet(object.sent) ? Boolean(object.sent) : false,
    };
  },

  toJSON(message: PrivateDecryptionKeyRequest): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.ibcInfo !== undefined) {
      obj.ibcInfo = IBCInfo.toJSON(message.ibcInfo);
    }
    if (message.counterparty !== undefined) {
      obj.counterparty = CounterPartyIBCInfo.toJSON(message.counterparty);
    }
    if (message.privateDecryptionKeys?.length) {
      obj.privateDecryptionKeys = message.privateDecryptionKeys.map((e) => PrivateDecryptionKey.toJSON(e));
    }
    if (message.sent === true) {
      obj.sent = message.sent;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PrivateDecryptionKeyRequest>, I>>(base?: I): PrivateDecryptionKeyRequest {
    return PrivateDecryptionKeyRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PrivateDecryptionKeyRequest>, I>>(object: I): PrivateDecryptionKeyRequest {
    const message = createBasePrivateDecryptionKeyRequest();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.ibcInfo = (object.ibcInfo !== undefined && object.ibcInfo !== null)
      ? IBCInfo.fromPartial(object.ibcInfo)
      : undefined;
    message.counterparty = (object.counterparty !== undefined && object.counterparty !== null)
      ? CounterPartyIBCInfo.fromPartial(object.counterparty)
      : undefined;
    message.privateDecryptionKeys = object.privateDecryptionKeys?.map((e) => PrivateDecryptionKey.fromPartial(e)) || [];
    message.sent = object.sent ?? false;
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
