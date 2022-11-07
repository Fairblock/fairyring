/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.fairyring";

export interface MsgRegisterValidator {
  creator: string;
}

export interface MsgRegisterValidatorResponse {
  creator: string;
}

function createBaseMsgRegisterValidator(): MsgRegisterValidator {
  return { creator: "" };
}

export const MsgRegisterValidator = {
  encode(message: MsgRegisterValidator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterValidator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterValidator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterValidator {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgRegisterValidator): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRegisterValidator>, I>>(object: I): MsgRegisterValidator {
    const message = createBaseMsgRegisterValidator();
    message.creator = object.creator ?? "";
    return message;
  },
};

function createBaseMsgRegisterValidatorResponse(): MsgRegisterValidatorResponse {
  return { creator: "" };
}

export const MsgRegisterValidatorResponse = {
  encode(message: MsgRegisterValidatorResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRegisterValidatorResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRegisterValidatorResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRegisterValidatorResponse {
    return { creator: isSet(object.creator) ? String(object.creator) : "" };
  },

  toJSON(message: MsgRegisterValidatorResponse): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRegisterValidatorResponse>, I>>(object: I): MsgRegisterValidatorResponse {
    const message = createBaseMsgRegisterValidatorResponse();
    message.creator = object.creator ?? "";
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /** this line is used by starport scaffolding # proto/tx/rpc */
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.RegisterValidator = this.RegisterValidator.bind(this);
  }
  RegisterValidator(request: MsgRegisterValidator): Promise<MsgRegisterValidatorResponse> {
    const data = MsgRegisterValidator.encode(request).finish();
    const promise = this.rpc.request("fairyring.fairyring.Msg", "RegisterValidator", data);
    return promise.then((data) => MsgRegisterValidatorResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
