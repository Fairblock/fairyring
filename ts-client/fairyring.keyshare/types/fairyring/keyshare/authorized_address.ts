/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "fairyring.keyshare";

/** AuthorizedAddress defines if an address is authorized to submit keyshares */
export interface AuthorizedAddress {
  target: string;
  isAuthorized: boolean;
  authorizedBy: string;
}

function createBaseAuthorizedAddress(): AuthorizedAddress {
  return { target: "", isAuthorized: false, authorizedBy: "" };
}

export const AuthorizedAddress = {
  encode(message: AuthorizedAddress, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.target !== "") {
      writer.uint32(10).string(message.target);
    }
    if (message.isAuthorized === true) {
      writer.uint32(16).bool(message.isAuthorized);
    }
    if (message.authorizedBy !== "") {
      writer.uint32(26).string(message.authorizedBy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AuthorizedAddress {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAuthorizedAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.target = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.isAuthorized = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.authorizedBy = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AuthorizedAddress {
    return {
      target: isSet(object.target) ? String(object.target) : "",
      isAuthorized: isSet(object.isAuthorized) ? Boolean(object.isAuthorized) : false,
      authorizedBy: isSet(object.authorizedBy) ? String(object.authorizedBy) : "",
    };
  },

  toJSON(message: AuthorizedAddress): unknown {
    const obj: any = {};
    if (message.target !== "") {
      obj.target = message.target;
    }
    if (message.isAuthorized === true) {
      obj.isAuthorized = message.isAuthorized;
    }
    if (message.authorizedBy !== "") {
      obj.authorizedBy = message.authorizedBy;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AuthorizedAddress>, I>>(base?: I): AuthorizedAddress {
    return AuthorizedAddress.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AuthorizedAddress>, I>>(object: I): AuthorizedAddress {
    const message = createBaseAuthorizedAddress();
    message.target = object.target ?? "";
    message.isAuthorized = object.isAuthorized ?? false;
    message.authorizedBy = object.authorizedBy ?? "";
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
