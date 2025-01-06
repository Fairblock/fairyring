/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

/**
 * Commitments defines the list of commitments to verify the
 * keyshares submitted by validators
 */
export interface Commitments {
  commitments: string[];
}

function createBaseCommitments(): Commitments {
  return { commitments: [] };
}

export const Commitments = {
  encode(message: Commitments, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.commitments) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Commitments {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommitments();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.commitments.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Commitments {
    return { commitments: Array.isArray(object?.commitments) ? object.commitments.map((e: any) => String(e)) : [] };
  },

  toJSON(message: Commitments): unknown {
    const obj: any = {};
    if (message.commitments?.length) {
      obj.commitments = message.commitments;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Commitments>, I>>(base?: I): Commitments {
    return Commitments.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Commitments>, I>>(object: I): Commitments {
    const message = createBaseCommitments();
    message.commitments = object.commitments?.map((e) => e) || [];
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
