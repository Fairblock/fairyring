/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

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
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidatorSet();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = reader.string();
          break;
        case 2:
          message.validator = reader.string();
          break;
        case 3:
          message.consAddr = reader.string();
          break;
        case 4:
          message.isActive = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
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
    message.index !== undefined && (obj.index = message.index);
    message.validator !== undefined && (obj.validator = message.validator);
    message.consAddr !== undefined && (obj.consAddr = message.consAddr);
    message.isActive !== undefined && (obj.isActive = message.isActive);
    return obj;
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
