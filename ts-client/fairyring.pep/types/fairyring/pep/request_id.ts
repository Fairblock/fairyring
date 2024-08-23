/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.pep";

export interface RequestId {
  creator: string;
  reqId: string;
}

function createBaseRequestId(): RequestId {
  return { creator: "", reqId: "" };
}

export const RequestId = {
  encode(message: RequestId, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.reqId !== "") {
      writer.uint32(18).string(message.reqId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestId {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestId();
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

          message.reqId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RequestId {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      reqId: isSet(object.reqId) ? String(object.reqId) : "",
    };
  },

  toJSON(message: RequestId): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.reqId !== "") {
      obj.reqId = message.reqId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestId>, I>>(base?: I): RequestId {
    return RequestId.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestId>, I>>(object: I): RequestId {
    const message = createBaseRequestId();
    message.creator = object.creator ?? "";
    message.reqId = object.reqId ?? "";
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
