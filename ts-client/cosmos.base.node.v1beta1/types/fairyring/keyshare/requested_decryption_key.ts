// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               unknown
// source: fairyring/keyshare/requested_decryption_key.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
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
  /** might be useful to destination chains to sort out the response */
  requestId: string;
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
  requestId: string;
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
    requestId: "",
    sent: false,
  };
}

export const DecryptionKeyRequest: MessageFns<DecryptionKeyRequest> = {
  encode(message: DecryptionKeyRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    if (message.ibcInfo !== undefined) {
      IBCInfo.encode(message.ibcInfo, writer.uint32(26).fork()).join();
    }
    if (message.counterparty !== undefined) {
      CounterPartyIBCInfo.encode(message.counterparty, writer.uint32(34).fork()).join();
    }
    if (message.decryptionKey !== "") {
      writer.uint32(42).string(message.decryptionKey);
    }
    if (message.proposalId !== "") {
      writer.uint32(50).string(message.proposalId);
    }
    if (message.requestId !== "") {
      writer.uint32(58).string(message.requestId);
    }
    if (message.sent !== false) {
      writer.uint32(64).bool(message.sent);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DecryptionKeyRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
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
          if (tag !== 58) {
            break;
          }

          message.requestId = reader.string();
          continue;
        case 8:
          if (tag !== 64) {
            break;
          }

          message.sent = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DecryptionKeyRequest {
    return {
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? globalThis.String(object.pubkey) : "",
      ibcInfo: isSet(object.ibcInfo) ? IBCInfo.fromJSON(object.ibcInfo) : undefined,
      counterparty: isSet(object.counterparty) ? CounterPartyIBCInfo.fromJSON(object.counterparty) : undefined,
      decryptionKey: isSet(object.decryptionKey) ? globalThis.String(object.decryptionKey) : "",
      proposalId: isSet(object.proposalId) ? globalThis.String(object.proposalId) : "",
      requestId: isSet(object.requestId) ? globalThis.String(object.requestId) : "",
      sent: isSet(object.sent) ? globalThis.Boolean(object.sent) : false,
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
    if (message.requestId !== "") {
      obj.requestId = message.requestId;
    }
    if (message.sent !== false) {
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
    message.requestId = object.requestId ?? "";
    message.sent = object.sent ?? false;
    return message;
  },
};

function createBaseIBCInfo(): IBCInfo {
  return { clientId: "", connectionId: "", channelId: "", portId: "" };
}

export const IBCInfo: MessageFns<IBCInfo> = {
  encode(message: IBCInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
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

  decode(input: BinaryReader | Uint8Array, length?: number): IBCInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
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
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IBCInfo {
    return {
      clientId: isSet(object.clientId) ? globalThis.String(object.clientId) : "",
      connectionId: isSet(object.connectionId) ? globalThis.String(object.connectionId) : "",
      channelId: isSet(object.channelId) ? globalThis.String(object.channelId) : "",
      portId: isSet(object.portId) ? globalThis.String(object.portId) : "",
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

export const CounterPartyIBCInfo: MessageFns<CounterPartyIBCInfo> = {
  encode(message: CounterPartyIBCInfo, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
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

  decode(input: BinaryReader | Uint8Array, length?: number): CounterPartyIBCInfo {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
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
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CounterPartyIBCInfo {
    return {
      clientId: isSet(object.clientId) ? globalThis.String(object.clientId) : "",
      connectionId: isSet(object.connectionId) ? globalThis.String(object.connectionId) : "",
      channelId: isSet(object.channelId) ? globalThis.String(object.channelId) : "",
      portId: isSet(object.portId) ? globalThis.String(object.portId) : "",
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
    requestId: "",
    sent: false,
  };
}

export const PrivateDecryptionKeyRequest: MessageFns<PrivateDecryptionKeyRequest> = {
  encode(message: PrivateDecryptionKeyRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    if (message.ibcInfo !== undefined) {
      IBCInfo.encode(message.ibcInfo, writer.uint32(26).fork()).join();
    }
    if (message.counterparty !== undefined) {
      CounterPartyIBCInfo.encode(message.counterparty, writer.uint32(34).fork()).join();
    }
    for (const v of message.privateDecryptionKeys) {
      PrivateDecryptionKey.encode(v!, writer.uint32(42).fork()).join();
    }
    if (message.requestId !== "") {
      writer.uint32(50).string(message.requestId);
    }
    if (message.sent !== false) {
      writer.uint32(56).bool(message.sent);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PrivateDecryptionKeyRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
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

          message.sent = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PrivateDecryptionKeyRequest {
    return {
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? globalThis.String(object.pubkey) : "",
      ibcInfo: isSet(object.ibcInfo) ? IBCInfo.fromJSON(object.ibcInfo) : undefined,
      counterparty: isSet(object.counterparty) ? CounterPartyIBCInfo.fromJSON(object.counterparty) : undefined,
      privateDecryptionKeys: globalThis.Array.isArray(object?.privateDecryptionKeys)
        ? object.privateDecryptionKeys.map((e: any) => PrivateDecryptionKey.fromJSON(e))
        : [],
      requestId: isSet(object.requestId) ? globalThis.String(object.requestId) : "",
      sent: isSet(object.sent) ? globalThis.Boolean(object.sent) : false,
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
    if (message.requestId !== "") {
      obj.requestId = message.requestId;
    }
    if (message.sent !== false) {
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
    message.requestId = object.requestId ?? "";
    message.sent = object.sent ?? false;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
