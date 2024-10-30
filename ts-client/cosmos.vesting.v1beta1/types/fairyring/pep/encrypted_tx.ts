// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               unknown
// source: fairyring/pep/encrypted_tx.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Coin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "fairyring.pep";

/**
 * EncryptedTx defines the structure to store an encrypted transaction
 * by execution height
 */
export interface EncryptedTx {
  targetHeight: number;
  index: number;
  data: string;
  creator: string;
  chargedGas: Coin | undefined;
  processedAtChainHeight: number;
  expired: boolean;
}

/** EncryptedTxArray defines a list of EncryptedTx */
export interface EncryptedTxArray {
  encryptedTxs: EncryptedTx[];
}

/**
 * GeneralEncryptedTx defines the structure to store a
 * general encrypted transaction by identity
 */
export interface GeneralEncryptedTx {
  identity: string;
  index: number;
  data: string;
  creator: string;
  chargedGas: Coin | undefined;
}

/** GeneralEncryptedTxArray defines a list of GeneralEncryptedTx */
export interface GeneralEncryptedTxArray {
  encryptedTxs: GeneralEncryptedTx[];
}

/**
 * IdentityExecutionEntry defines the structure to queue up
 * identities that have decryption keys available and
 * are ready to execute any associated contracts or encrypted transactions
 */
export interface IdentityExecutionEntry {
  creator: string;
  requestId: string;
  identity: string;
  pubkey: string;
  txList: GeneralEncryptedTxArray | undefined;
  decryptionKey: string;
}

function createBaseEncryptedTx(): EncryptedTx {
  return {
    targetHeight: 0,
    index: 0,
    data: "",
    creator: "",
    chargedGas: undefined,
    processedAtChainHeight: 0,
    expired: false,
  };
}

export const EncryptedTx: MessageFns<EncryptedTx> = {
  encode(message: EncryptedTx, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
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
      Coin.encode(message.chargedGas, writer.uint32(42).fork()).join();
    }
    if (message.processedAtChainHeight !== 0) {
      writer.uint32(48).uint64(message.processedAtChainHeight);
    }
    if (message.expired !== false) {
      writer.uint32(56).bool(message.expired);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EncryptedTx {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.targetHeight = longToNumber(reader.uint64());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.index = longToNumber(reader.uint64());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.chargedGas = Coin.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.processedAtChainHeight = longToNumber(reader.uint64());
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.expired = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EncryptedTx {
    return {
      targetHeight: isSet(object.targetHeight) ? globalThis.Number(object.targetHeight) : 0,
      index: isSet(object.index) ? globalThis.Number(object.index) : 0,
      data: isSet(object.data) ? globalThis.String(object.data) : "",
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      chargedGas: isSet(object.chargedGas) ? Coin.fromJSON(object.chargedGas) : undefined,
      processedAtChainHeight: isSet(object.processedAtChainHeight)
        ? globalThis.Number(object.processedAtChainHeight)
        : 0,
      expired: isSet(object.expired) ? globalThis.Boolean(object.expired) : false,
    };
  },

  toJSON(message: EncryptedTx): unknown {
    const obj: any = {};
    if (message.targetHeight !== 0) {
      obj.targetHeight = Math.round(message.targetHeight);
    }
    if (message.index !== 0) {
      obj.index = Math.round(message.index);
    }
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.chargedGas !== undefined) {
      obj.chargedGas = Coin.toJSON(message.chargedGas);
    }
    if (message.processedAtChainHeight !== 0) {
      obj.processedAtChainHeight = Math.round(message.processedAtChainHeight);
    }
    if (message.expired !== false) {
      obj.expired = message.expired;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EncryptedTx>, I>>(base?: I): EncryptedTx {
    return EncryptedTx.fromPartial(base ?? ({} as any));
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
    message.processedAtChainHeight = object.processedAtChainHeight ?? 0;
    message.expired = object.expired ?? false;
    return message;
  },
};

function createBaseEncryptedTxArray(): EncryptedTxArray {
  return { encryptedTxs: [] };
}

export const EncryptedTxArray: MessageFns<EncryptedTxArray> = {
  encode(message: EncryptedTxArray, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.encryptedTxs) {
      EncryptedTx.encode(v!, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): EncryptedTxArray {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedTxArray();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encryptedTxs.push(EncryptedTx.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EncryptedTxArray {
    return {
      encryptedTxs: globalThis.Array.isArray(object?.encryptedTxs)
        ? object.encryptedTxs.map((e: any) => EncryptedTx.fromJSON(e))
        : [],
    };
  },

  toJSON(message: EncryptedTxArray): unknown {
    const obj: any = {};
    if (message.encryptedTxs?.length) {
      obj.encryptedTxs = message.encryptedTxs.map((e) => EncryptedTx.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EncryptedTxArray>, I>>(base?: I): EncryptedTxArray {
    return EncryptedTxArray.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EncryptedTxArray>, I>>(object: I): EncryptedTxArray {
    const message = createBaseEncryptedTxArray();
    message.encryptedTxs = object.encryptedTxs?.map((e) => EncryptedTx.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGeneralEncryptedTx(): GeneralEncryptedTx {
  return { identity: "", index: 0, data: "", creator: "", chargedGas: undefined };
}

export const GeneralEncryptedTx: MessageFns<GeneralEncryptedTx> = {
  encode(message: GeneralEncryptedTx, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
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
      Coin.encode(message.chargedGas, writer.uint32(42).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GeneralEncryptedTx {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGeneralEncryptedTx();
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
          if (tag !== 16) {
            break;
          }

          message.index = longToNumber(reader.uint64());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.data = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.chargedGas = Coin.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GeneralEncryptedTx {
    return {
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      index: isSet(object.index) ? globalThis.Number(object.index) : 0,
      data: isSet(object.data) ? globalThis.String(object.data) : "",
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      chargedGas: isSet(object.chargedGas) ? Coin.fromJSON(object.chargedGas) : undefined,
    };
  },

  toJSON(message: GeneralEncryptedTx): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.index !== 0) {
      obj.index = Math.round(message.index);
    }
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.chargedGas !== undefined) {
      obj.chargedGas = Coin.toJSON(message.chargedGas);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GeneralEncryptedTx>, I>>(base?: I): GeneralEncryptedTx {
    return GeneralEncryptedTx.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GeneralEncryptedTx>, I>>(object: I): GeneralEncryptedTx {
    const message = createBaseGeneralEncryptedTx();
    message.identity = object.identity ?? "";
    message.index = object.index ?? 0;
    message.data = object.data ?? "";
    message.creator = object.creator ?? "";
    message.chargedGas = (object.chargedGas !== undefined && object.chargedGas !== null)
      ? Coin.fromPartial(object.chargedGas)
      : undefined;
    return message;
  },
};

function createBaseGeneralEncryptedTxArray(): GeneralEncryptedTxArray {
  return { encryptedTxs: [] };
}

export const GeneralEncryptedTxArray: MessageFns<GeneralEncryptedTxArray> = {
  encode(message: GeneralEncryptedTxArray, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.encryptedTxs) {
      GeneralEncryptedTx.encode(v!, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GeneralEncryptedTxArray {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGeneralEncryptedTxArray();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encryptedTxs.push(GeneralEncryptedTx.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GeneralEncryptedTxArray {
    return {
      encryptedTxs: globalThis.Array.isArray(object?.encryptedTxs)
        ? object.encryptedTxs.map((e: any) => GeneralEncryptedTx.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GeneralEncryptedTxArray): unknown {
    const obj: any = {};
    if (message.encryptedTxs?.length) {
      obj.encryptedTxs = message.encryptedTxs.map((e) => GeneralEncryptedTx.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GeneralEncryptedTxArray>, I>>(base?: I): GeneralEncryptedTxArray {
    return GeneralEncryptedTxArray.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GeneralEncryptedTxArray>, I>>(object: I): GeneralEncryptedTxArray {
    const message = createBaseGeneralEncryptedTxArray();
    message.encryptedTxs = object.encryptedTxs?.map((e) => GeneralEncryptedTx.fromPartial(e)) || [];
    return message;
  },
};

function createBaseIdentityExecutionEntry(): IdentityExecutionEntry {
  return { creator: "", requestId: "", identity: "", pubkey: "", txList: undefined, decryptionKey: "" };
}

export const IdentityExecutionEntry: MessageFns<IdentityExecutionEntry> = {
  encode(message: IdentityExecutionEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.requestId !== "") {
      writer.uint32(18).string(message.requestId);
    }
    if (message.identity !== "") {
      writer.uint32(26).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(34).string(message.pubkey);
    }
    if (message.txList !== undefined) {
      GeneralEncryptedTxArray.encode(message.txList, writer.uint32(42).fork()).join();
    }
    if (message.decryptionKey !== "") {
      writer.uint32(50).string(message.decryptionKey);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): IdentityExecutionEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIdentityExecutionEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.requestId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.pubkey = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.txList = GeneralEncryptedTxArray.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.decryptionKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IdentityExecutionEntry {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      requestId: isSet(object.requestId) ? globalThis.String(object.requestId) : "",
      identity: isSet(object.identity) ? globalThis.String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? globalThis.String(object.pubkey) : "",
      txList: isSet(object.txList) ? GeneralEncryptedTxArray.fromJSON(object.txList) : undefined,
      decryptionKey: isSet(object.decryptionKey) ? globalThis.String(object.decryptionKey) : "",
    };
  },

  toJSON(message: IdentityExecutionEntry): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.requestId !== "") {
      obj.requestId = message.requestId;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.txList !== undefined) {
      obj.txList = GeneralEncryptedTxArray.toJSON(message.txList);
    }
    if (message.decryptionKey !== "") {
      obj.decryptionKey = message.decryptionKey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IdentityExecutionEntry>, I>>(base?: I): IdentityExecutionEntry {
    return IdentityExecutionEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IdentityExecutionEntry>, I>>(object: I): IdentityExecutionEntry {
    const message = createBaseIdentityExecutionEntry();
    message.creator = object.creator ?? "";
    message.requestId = object.requestId ?? "";
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.txList = (object.txList !== undefined && object.txList !== null)
      ? GeneralEncryptedTxArray.fromPartial(object.txList)
      : undefined;
    message.decryptionKey = object.decryptionKey ?? "";
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

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

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