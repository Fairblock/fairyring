// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               unknown
// source: fairyring/keyshare/validator_set.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "fairyring.keyshare";

/**
 * ValidatorSet defines the structure for storing the list of
 * validators who will be eligible to send keyshares
 */
export interface ValidatorSet {
  index: string;
  validator: string;
  consAddr: string;
  isActive: boolean;
}

function createBaseValidatorSet(): ValidatorSet {
  return { index: "", validator: "", consAddr: "", isActive: false };
}

export const ValidatorSet: MessageFns<ValidatorSet> = {
  encode(message: ValidatorSet, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    if (message.validator !== "") {
      writer.uint32(18).string(message.validator);
    }
    if (message.consAddr !== "") {
      writer.uint32(26).string(message.consAddr);
    }
    if (message.isActive !== false) {
      writer.uint32(32).bool(message.isActive);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ValidatorSet {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidatorSet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.index = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.validator = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.consAddr = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.isActive = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ValidatorSet {
    return {
      index: isSet(object.index) ? globalThis.String(object.index) : "",
      validator: isSet(object.validator) ? globalThis.String(object.validator) : "",
      consAddr: isSet(object.consAddr) ? globalThis.String(object.consAddr) : "",
      isActive: isSet(object.isActive) ? globalThis.Boolean(object.isActive) : false,
    };
  },

  toJSON(message: ValidatorSet): unknown {
    const obj: any = {};
    if (message.index !== "") {
      obj.index = message.index;
    }
    if (message.validator !== "") {
      obj.validator = message.validator;
    }
    if (message.consAddr !== "") {
      obj.consAddr = message.consAddr;
    }
    if (message.isActive !== false) {
      obj.isActive = message.isActive;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidatorSet>, I>>(base?: I): ValidatorSet {
    return ValidatorSet.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ValidatorSet>, I>>(object: I): ValidatorSet {
    const message = createBaseValidatorSet();
    message.index = object.index ?? "";
    message.validator = object.validator ?? "";
    message.consAddr = object.consAddr ?? "";
    message.isActive = object.isActive ?? false;
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