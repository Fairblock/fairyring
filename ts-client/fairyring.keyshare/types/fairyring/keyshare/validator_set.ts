/* eslint-disable */
import _m0 from "protobufjs/minimal";

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

export const ValidatorSet = {
  encode(message: ValidatorSet, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    if (message.validator !== "") {
      writer.uint32(18).string(message.validator);
    }
    if (message.consAddr !== "") {
      writer.uint32(26).string(message.consAddr);
    }
    if (message.isActive === true) {
      writer.uint32(32).bool(message.isActive);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidatorSet {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidatorSet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.index = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.validator = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.consAddr = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.isActive = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ValidatorSet {
    return {
      index: isSet(object.index) ? String(object.index) : "",
      validator: isSet(object.validator) ? String(object.validator) : "",
      consAddr: isSet(object.consAddr) ? String(object.consAddr) : "",
      isActive: isSet(object.isActive) ? Boolean(object.isActive) : false,
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
    if (message.isActive === true) {
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
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
