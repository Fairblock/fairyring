/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "fairyring.pep";

/** Params defines the parameters for the module. */
export interface Params {
  trustedCounterParties: TrustedCounterParty[];
  trustedAddresses: string[];
  channelId: string;
  minGasPrice: Coin | undefined;
}

export interface TrustedCounterParty {
  clientId: string;
  connectionId: string;
  channelId: string;
}

function createBaseParams(): Params {
  return { trustedCounterParties: [], trustedAddresses: [], channelId: "", minGasPrice: undefined };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.trustedCounterParties) {
      TrustedCounterParty.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.trustedAddresses) {
      writer.uint32(18).string(v!);
    }
    if (message.channelId !== "") {
      writer.uint32(26).string(message.channelId);
    }
    if (message.minGasPrice !== undefined) {
      Coin.encode(message.minGasPrice, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.trustedCounterParties.push(TrustedCounterParty.decode(reader, reader.uint32()));
          break;
        case 2:
          message.trustedAddresses.push(reader.string());
          break;
        case 3:
          message.channelId = reader.string();
          break;
        case 4:
          message.minGasPrice = Coin.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Params {
    return {
      trustedCounterParties: Array.isArray(object?.trustedCounterParties)
        ? object.trustedCounterParties.map((e: any) => TrustedCounterParty.fromJSON(e))
        : [],
      trustedAddresses: Array.isArray(object?.trustedAddresses)
        ? object.trustedAddresses.map((e: any) => String(e))
        : [],
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
      minGasPrice: isSet(object.minGasPrice) ? Coin.fromJSON(object.minGasPrice) : undefined,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.trustedCounterParties) {
      obj.trustedCounterParties = message.trustedCounterParties.map((e) =>
        e ? TrustedCounterParty.toJSON(e) : undefined
      );
    } else {
      obj.trustedCounterParties = [];
    }
    if (message.trustedAddresses) {
      obj.trustedAddresses = message.trustedAddresses.map((e) => e);
    } else {
      obj.trustedAddresses = [];
    }
    message.channelId !== undefined && (obj.channelId = message.channelId);
    message.minGasPrice !== undefined
      && (obj.minGasPrice = message.minGasPrice ? Coin.toJSON(message.minGasPrice) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.trustedCounterParties = object.trustedCounterParties?.map((e) => TrustedCounterParty.fromPartial(e)) || [];
    message.trustedAddresses = object.trustedAddresses?.map((e) => e) || [];
    message.channelId = object.channelId ?? "";
    message.minGasPrice = (object.minGasPrice !== undefined && object.minGasPrice !== null)
      ? Coin.fromPartial(object.minGasPrice)
      : undefined;
    return message;
  },
};

function createBaseTrustedCounterParty(): TrustedCounterParty {
  return { clientId: "", connectionId: "", channelId: "" };
}

export const TrustedCounterParty = {
  encode(message: TrustedCounterParty, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    if (message.connectionId !== "") {
      writer.uint32(18).string(message.connectionId);
    }
    if (message.channelId !== "") {
      writer.uint32(26).string(message.channelId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TrustedCounterParty {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrustedCounterParty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        case 2:
          message.connectionId = reader.string();
          break;
        case 3:
          message.channelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TrustedCounterParty {
    return {
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
      connectionId: isSet(object.connectionId) ? String(object.connectionId) : "",
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
    };
  },

  toJSON(message: TrustedCounterParty): unknown {
    const obj: any = {};
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.connectionId !== undefined && (obj.connectionId = message.connectionId);
    message.channelId !== undefined && (obj.channelId = message.channelId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TrustedCounterParty>, I>>(object: I): TrustedCounterParty {
    const message = createBaseTrustedCounterParty();
    message.clientId = object.clientId ?? "";
    message.connectionId = object.connectionId ?? "";
    message.channelId = object.channelId ?? "";
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
