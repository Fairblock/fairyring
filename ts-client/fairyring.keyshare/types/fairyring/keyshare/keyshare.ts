/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

/**
 * Keyshare defines the structure for submitting
 * blockwise keyshares by validators
 */
export interface Keyshare {
  validator: string;
  blockHeight: number;
  keyshare: string;
  keyshareIndex: number;
  receivedTimestamp: number;
  receivedBlockHeight: number;
}

/**
 * GeneralKeyshare defines the structure for submitting
 * general keyshares by validators
 */
export interface GeneralKeyshare {
  validator: string;
  idType: string;
  idValue: string;
  keyshare: string;
  keyshareIndex: number;
  receivedTimestamp: number;
  receivedBlockHeight: number;
}

/**
 * ValidatorEncryptedKeyshare defines the structure for
 * submitting encrypted keyshares by validators
 */
export interface ValidatorEncryptedKeyshare {
  validator: string;
  requester: string;
  keyshare: string;
  keyshareIndex: number;
  receivedTimestamp: number;
  receivedBlockHeight: number;
  identity: string;
}

function createBaseKeyshare(): Keyshare {
  return {
    validator: "",
    blockHeight: 0,
    keyshare: "",
    keyshareIndex: 0,
    receivedTimestamp: 0,
    receivedBlockHeight: 0,
  };
}

export const Keyshare = {
  encode(message: Keyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.blockHeight !== 0) {
      writer.uint32(16).uint64(message.blockHeight);
    }
    if (message.keyshare !== "") {
      writer.uint32(26).string(message.keyshare);
    }
    if (message.keyshareIndex !== 0) {
      writer.uint32(32).uint64(message.keyshareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      writer.uint32(40).uint64(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(48).uint64(message.receivedBlockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Keyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.validator = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.blockHeight = longToNumber(reader.uint64() as Long);
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.keyshare = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.keyshareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.receivedTimestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Keyshare {
    return {
      validator: isSet(object.validator) ? String(object.validator) : "",
      blockHeight: isSet(object.blockHeight) ? Number(object.blockHeight) : 0,
      keyshare: isSet(object.keyshare) ? String(object.keyshare) : "",
      keyshareIndex: isSet(object.keyshareIndex) ? Number(object.keyshareIndex) : 0,
      receivedTimestamp: isSet(object.receivedTimestamp) ? Number(object.receivedTimestamp) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
    };
  },

  toJSON(message: Keyshare): unknown {
    const obj: any = {};
    if (message.validator !== "") {
      obj.validator = message.validator;
    }
    if (message.blockHeight !== 0) {
      obj.blockHeight = Math.round(message.blockHeight);
    }
    if (message.keyshare !== "") {
      obj.keyshare = message.keyshare;
    }
    if (message.keyshareIndex !== 0) {
      obj.keyshareIndex = Math.round(message.keyshareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      obj.receivedTimestamp = Math.round(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      obj.receivedBlockHeight = Math.round(message.receivedBlockHeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Keyshare>, I>>(base?: I): Keyshare {
    return Keyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Keyshare>, I>>(object: I): Keyshare {
    const message = createBaseKeyshare();
    message.validator = object.validator ?? "";
    message.blockHeight = object.blockHeight ?? 0;
    message.keyshare = object.keyshare ?? "";
    message.keyshareIndex = object.keyshareIndex ?? 0;
    message.receivedTimestamp = object.receivedTimestamp ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    return message;
  },
};

function createBaseGeneralKeyshare(): GeneralKeyshare {
  return {
    validator: "",
    idType: "",
    idValue: "",
    keyshare: "",
    keyshareIndex: 0,
    receivedTimestamp: 0,
    receivedBlockHeight: 0,
  };
}

export const GeneralKeyshare = {
  encode(message: GeneralKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.idType !== "") {
      writer.uint32(18).string(message.idType);
    }
    if (message.idValue !== "") {
      writer.uint32(26).string(message.idValue);
    }
    if (message.keyshare !== "") {
      writer.uint32(34).string(message.keyshare);
    }
    if (message.keyshareIndex !== 0) {
      writer.uint32(40).uint64(message.keyshareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      writer.uint32(48).uint64(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(56).uint64(message.receivedBlockHeight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GeneralKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGeneralKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.validator = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.idType = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.idValue = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keyshare = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.keyshareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.receivedTimestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GeneralKeyshare {
    return {
      validator: isSet(object.validator) ? String(object.validator) : "",
      idType: isSet(object.idType) ? String(object.idType) : "",
      idValue: isSet(object.idValue) ? String(object.idValue) : "",
      keyshare: isSet(object.keyshare) ? String(object.keyshare) : "",
      keyshareIndex: isSet(object.keyshareIndex) ? Number(object.keyshareIndex) : 0,
      receivedTimestamp: isSet(object.receivedTimestamp) ? Number(object.receivedTimestamp) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
    };
  },

  toJSON(message: GeneralKeyshare): unknown {
    const obj: any = {};
    if (message.validator !== "") {
      obj.validator = message.validator;
    }
    if (message.idType !== "") {
      obj.idType = message.idType;
    }
    if (message.idValue !== "") {
      obj.idValue = message.idValue;
    }
    if (message.keyshare !== "") {
      obj.keyshare = message.keyshare;
    }
    if (message.keyshareIndex !== 0) {
      obj.keyshareIndex = Math.round(message.keyshareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      obj.receivedTimestamp = Math.round(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      obj.receivedBlockHeight = Math.round(message.receivedBlockHeight);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GeneralKeyshare>, I>>(base?: I): GeneralKeyshare {
    return GeneralKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GeneralKeyshare>, I>>(object: I): GeneralKeyshare {
    const message = createBaseGeneralKeyshare();
    message.validator = object.validator ?? "";
    message.idType = object.idType ?? "";
    message.idValue = object.idValue ?? "";
    message.keyshare = object.keyshare ?? "";
    message.keyshareIndex = object.keyshareIndex ?? 0;
    message.receivedTimestamp = object.receivedTimestamp ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    return message;
  },
};

function createBaseValidatorEncryptedKeyshare(): ValidatorEncryptedKeyshare {
  return {
    validator: "",
    requester: "",
    keyshare: "",
    keyshareIndex: 0,
    receivedTimestamp: 0,
    receivedBlockHeight: 0,
    identity: "",
  };
}

export const ValidatorEncryptedKeyshare = {
  encode(message: ValidatorEncryptedKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.validator !== "") {
      writer.uint32(10).string(message.validator);
    }
    if (message.requester !== "") {
      writer.uint32(18).string(message.requester);
    }
    if (message.keyshare !== "") {
      writer.uint32(26).string(message.keyshare);
    }
    if (message.keyshareIndex !== 0) {
      writer.uint32(32).uint64(message.keyshareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      writer.uint32(40).uint64(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      writer.uint32(48).uint64(message.receivedBlockHeight);
    }
    if (message.identity !== "") {
      writer.uint32(58).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorEncryptedKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidatorEncryptedKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.validator = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.requester = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.keyshare = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.keyshareIndex = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.receivedTimestamp = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.receivedBlockHeight = longToNumber(reader.uint64() as Long);
          continue;
        case 7:
          if (tag !== 58) {
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

  fromJSON(object: any): ValidatorEncryptedKeyshare {
    return {
      validator: isSet(object.validator) ? String(object.validator) : "",
      requester: isSet(object.requester) ? String(object.requester) : "",
      keyshare: isSet(object.keyshare) ? String(object.keyshare) : "",
      keyshareIndex: isSet(object.keyshareIndex) ? Number(object.keyshareIndex) : 0,
      receivedTimestamp: isSet(object.receivedTimestamp) ? Number(object.receivedTimestamp) : 0,
      receivedBlockHeight: isSet(object.receivedBlockHeight) ? Number(object.receivedBlockHeight) : 0,
      identity: isSet(object.identity) ? String(object.identity) : "",
    };
  },

  toJSON(message: ValidatorEncryptedKeyshare): unknown {
    const obj: any = {};
    if (message.validator !== "") {
      obj.validator = message.validator;
    }
    if (message.requester !== "") {
      obj.requester = message.requester;
    }
    if (message.keyshare !== "") {
      obj.keyshare = message.keyshare;
    }
    if (message.keyshareIndex !== 0) {
      obj.keyshareIndex = Math.round(message.keyshareIndex);
    }
    if (message.receivedTimestamp !== 0) {
      obj.receivedTimestamp = Math.round(message.receivedTimestamp);
    }
    if (message.receivedBlockHeight !== 0) {
      obj.receivedBlockHeight = Math.round(message.receivedBlockHeight);
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidatorEncryptedKeyshare>, I>>(base?: I): ValidatorEncryptedKeyshare {
    return ValidatorEncryptedKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ValidatorEncryptedKeyshare>, I>>(object: I): ValidatorEncryptedKeyshare {
    const message = createBaseValidatorEncryptedKeyshare();
    message.validator = object.validator ?? "";
    message.requester = object.requester ?? "";
    message.keyshare = object.keyshare ?? "";
    message.keyshareIndex = object.keyshareIndex ?? 0;
    message.receivedTimestamp = object.receivedTimestamp ?? 0;
    message.receivedBlockHeight = object.receivedBlockHeight ?? 0;
    message.identity = object.identity ?? "";
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
