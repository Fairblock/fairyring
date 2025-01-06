/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

/**
 * EncryptedKeyshare defines the structure for storing
 * the keyshare of the master secret key distributed to the validators
 */
export interface EncryptedKeyshare {
  data: string;
  validator: string;
}

/** ActivePubkey defines the structure of the active public key */
export interface ActivePubkey {
  publicKey: string;
  creator: string;
  expiry: number;
  numberOfValidators: number;
  encryptedKeyshares: EncryptedKeyshare[];
}

/** QueuedPubkey defines the structure of the queued public key */
export interface QueuedPubkey {
  publicKey: string;
  creator: string;
  expiry: number;
  numberOfValidators: number;
  encryptedKeyshares: EncryptedKeyshare[];
}

function createBaseEncryptedKeyshare(): EncryptedKeyshare {
  return { data: "", validator: "" };
}

export const EncryptedKeyshare = {
  encode(message: EncryptedKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.data !== "") {
      writer.uint32(10).string(message.data);
    }
    if (message.validator !== "") {
      writer.uint32(18).string(message.validator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EncryptedKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEncryptedKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.data = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.validator = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): EncryptedKeyshare {
    return {
      data: isSet(object.data) ? String(object.data) : "",
      validator: isSet(object.validator) ? String(object.validator) : "",
    };
  },

  toJSON(message: EncryptedKeyshare): unknown {
    const obj: any = {};
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.validator !== "") {
      obj.validator = message.validator;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<EncryptedKeyshare>, I>>(base?: I): EncryptedKeyshare {
    return EncryptedKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<EncryptedKeyshare>, I>>(object: I): EncryptedKeyshare {
    const message = createBaseEncryptedKeyshare();
    message.data = object.data ?? "";
    message.validator = object.validator ?? "";
    return message;
  },
};

function createBaseActivePubkey(): ActivePubkey {
  return { publicKey: "", creator: "", expiry: 0, numberOfValidators: 0, encryptedKeyshares: [] };
}

export const ActivePubkey = {
  encode(message: ActivePubkey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    if (message.expiry !== 0) {
      writer.uint32(24).uint64(message.expiry);
    }
    if (message.numberOfValidators !== 0) {
      writer.uint32(32).uint64(message.numberOfValidators);
    }
    for (const v of message.encryptedKeyshares) {
      EncryptedKeyshare.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivePubkey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivePubkey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.expiry = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.numberOfValidators = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.encryptedKeyshares.push(EncryptedKeyshare.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActivePubkey {
    return {
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      expiry: isSet(object.expiry) ? Number(object.expiry) : 0,
      numberOfValidators: isSet(object.numberOfValidators) ? Number(object.numberOfValidators) : 0,
      encryptedKeyshares: Array.isArray(object?.encryptedKeyshares)
        ? object.encryptedKeyshares.map((e: any) => EncryptedKeyshare.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ActivePubkey): unknown {
    const obj: any = {};
    if (message.publicKey !== "") {
      obj.publicKey = message.publicKey;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.expiry !== 0) {
      obj.expiry = Math.round(message.expiry);
    }
    if (message.numberOfValidators !== 0) {
      obj.numberOfValidators = Math.round(message.numberOfValidators);
    }
    if (message.encryptedKeyshares?.length) {
      obj.encryptedKeyshares = message.encryptedKeyshares.map((e) => EncryptedKeyshare.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivePubkey>, I>>(base?: I): ActivePubkey {
    return ActivePubkey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivePubkey>, I>>(object: I): ActivePubkey {
    const message = createBaseActivePubkey();
    message.publicKey = object.publicKey ?? "";
    message.creator = object.creator ?? "";
    message.expiry = object.expiry ?? 0;
    message.numberOfValidators = object.numberOfValidators ?? 0;
    message.encryptedKeyshares = object.encryptedKeyshares?.map((e) => EncryptedKeyshare.fromPartial(e)) || [];
    return message;
  },
};

function createBaseQueuedPubkey(): QueuedPubkey {
  return { publicKey: "", creator: "", expiry: 0, numberOfValidators: 0, encryptedKeyshares: [] };
}

export const QueuedPubkey = {
  encode(message: QueuedPubkey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    if (message.expiry !== 0) {
      writer.uint32(24).uint64(message.expiry);
    }
    if (message.numberOfValidators !== 0) {
      writer.uint32(32).uint64(message.numberOfValidators);
    }
    for (const v of message.encryptedKeyshares) {
      EncryptedKeyshare.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueuedPubkey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueuedPubkey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.expiry = longToNumber(reader.uint64() as Long);
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.numberOfValidators = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.encryptedKeyshares.push(EncryptedKeyshare.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueuedPubkey {
    return {
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      expiry: isSet(object.expiry) ? Number(object.expiry) : 0,
      numberOfValidators: isSet(object.numberOfValidators) ? Number(object.numberOfValidators) : 0,
      encryptedKeyshares: Array.isArray(object?.encryptedKeyshares)
        ? object.encryptedKeyshares.map((e: any) => EncryptedKeyshare.fromJSON(e))
        : [],
    };
  },

  toJSON(message: QueuedPubkey): unknown {
    const obj: any = {};
    if (message.publicKey !== "") {
      obj.publicKey = message.publicKey;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.expiry !== 0) {
      obj.expiry = Math.round(message.expiry);
    }
    if (message.numberOfValidators !== 0) {
      obj.numberOfValidators = Math.round(message.numberOfValidators);
    }
    if (message.encryptedKeyshares?.length) {
      obj.encryptedKeyshares = message.encryptedKeyshares.map((e) => EncryptedKeyshare.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueuedPubkey>, I>>(base?: I): QueuedPubkey {
    return QueuedPubkey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueuedPubkey>, I>>(object: I): QueuedPubkey {
    const message = createBaseQueuedPubkey();
    message.publicKey = object.publicKey ?? "";
    message.creator = object.creator ?? "";
    message.expiry = object.expiry ?? 0;
    message.numberOfValidators = object.numberOfValidators ?? 0;
    message.encryptedKeyshares = object.encryptedKeyshares?.map((e) => EncryptedKeyshare.fromPartial(e)) || [];
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
