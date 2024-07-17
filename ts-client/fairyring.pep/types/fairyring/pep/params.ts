/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "fairyring.pep";

/** Params defines the parameters for the module. */
export interface Params {
  trustedCounterParties: TrustedCounterParty[];
  trustedAddresses: string[];
  /** string pep_channel_id = 3; */
  keyshareChannelId: string;
  minGasPrice: Coin | undefined;
  isSourceChain: boolean;
}

export interface TrustedCounterParty {
  clientId: string;
  connectionId: string;
  channelId: string;
}

function createBaseParams(): Params {
  return {
    trustedCounterParties: [],
    trustedAddresses: [],
    keyshareChannelId: "",
    minGasPrice: undefined,
    isSourceChain: false,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.trustedCounterParties) {
      TrustedCounterParty.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.trustedAddresses) {
      writer.uint32(18).string(v!);
    }
    if (message.keyshareChannelId !== "") {
      writer.uint32(34).string(message.keyshareChannelId);
    }
    if (message.minGasPrice !== undefined) {
      Coin.encode(message.minGasPrice, writer.uint32(42).fork()).ldelim();
    }
    if (message.isSourceChain === true) {
      writer.uint32(48).bool(message.isSourceChain);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Params {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.trustedCounterParties.push(TrustedCounterParty.decode(reader, reader.uint32()));
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.trustedAddresses.push(reader.string());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keyshareChannelId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.minGasPrice = Coin.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.isSourceChain = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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
      keyshareChannelId: isSet(object.keyshareChannelId) ? String(object.keyshareChannelId) : "",
      minGasPrice: isSet(object.minGasPrice) ? Coin.fromJSON(object.minGasPrice) : undefined,
      isSourceChain: isSet(object.isSourceChain) ? Boolean(object.isSourceChain) : false,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.trustedCounterParties?.length) {
      obj.trustedCounterParties = message.trustedCounterParties.map((e) => TrustedCounterParty.toJSON(e));
    }
    if (message.trustedAddresses?.length) {
      obj.trustedAddresses = message.trustedAddresses;
    }
    if (message.keyshareChannelId !== "") {
      obj.keyshareChannelId = message.keyshareChannelId;
    }
    if (message.minGasPrice !== undefined) {
      obj.minGasPrice = Coin.toJSON(message.minGasPrice);
    }
    if (message.isSourceChain === true) {
      obj.isSourceChain = message.isSourceChain;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.trustedCounterParties = object.trustedCounterParties?.map((e) => TrustedCounterParty.fromPartial(e)) || [];
    message.trustedAddresses = object.trustedAddresses?.map((e) => e) || [];
    message.keyshareChannelId = object.keyshareChannelId ?? "";
    message.minGasPrice = (object.minGasPrice !== undefined && object.minGasPrice !== null)
      ? Coin.fromPartial(object.minGasPrice)
      : undefined;
    message.isSourceChain = object.isSourceChain ?? false;
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
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrustedCounterParty();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.clientId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.connectionId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.channelId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
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
    if (message.clientId !== "") {
      obj.clientId = message.clientId;
    }
    if (message.connectionId !== "") {
      obj.connectionId = message.connectionId;
    }
    if (message.channelId !== "") {
      obj.channelId = message.channelId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TrustedCounterParty>, I>>(base?: I): TrustedCounterParty {
    return TrustedCounterParty.fromPartial(base ?? ({} as any));
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
