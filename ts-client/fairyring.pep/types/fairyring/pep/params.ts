/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Coin } from "../../cosmos/base/v1beta1/coin";

export const protobufPackage = "fairyring.pep";

/** Params defines the parameters for the module. */
export interface Params {
  /** option (gogoproto.equal) = true; */
  keyshareChannelId: string;
  isSourceChain: boolean;
  trustedCounterParties: TrustedCounterParty[];
  trustedAddresses: string[];
  minGasPrice: Coin | undefined;
  privateDecryptionKeyPrice: Coin | undefined;
  maxContractGas: number;
}

/**
 * TrustedCounterParty defines the structure to store the ibc info
 * of the source chain (fairyring) to reliably fetch active keys and
 * general/private decryption keys
 */
export interface TrustedCounterParty {
  clientId: string;
  connectionId: string;
  channelId: string;
}

function createBaseParams(): Params {
  return {
    keyshareChannelId: "",
    isSourceChain: false,
    trustedCounterParties: [],
    trustedAddresses: [],
    minGasPrice: undefined,
    privateDecryptionKeyPrice: undefined,
    maxContractGas: 0,
  };
}

export const Params = {
  encode(message: Params, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.keyshareChannelId !== "") {
      writer.uint32(10).string(message.keyshareChannelId);
    }
    if (message.isSourceChain === true) {
      writer.uint32(16).bool(message.isSourceChain);
    }
    for (const v of message.trustedCounterParties) {
      TrustedCounterParty.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.trustedAddresses) {
      writer.uint32(34).string(v!);
    }
    if (message.minGasPrice !== undefined) {
      Coin.encode(message.minGasPrice, writer.uint32(42).fork()).ldelim();
    }
    if (message.privateDecryptionKeyPrice !== undefined) {
      Coin.encode(message.privateDecryptionKeyPrice, writer.uint32(50).fork()).ldelim();
    }
    if (message.maxContractGas !== 0) {
      writer.uint32(56).uint64(message.maxContractGas);
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

          message.keyshareChannelId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.isSourceChain = reader.bool();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.trustedCounterParties.push(TrustedCounterParty.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.trustedAddresses.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.minGasPrice = Coin.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.privateDecryptionKeyPrice = Coin.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.maxContractGas = longToNumber(reader.uint64() as Long);
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
      keyshareChannelId: isSet(object.keyshareChannelId) ? String(object.keyshareChannelId) : "",
      isSourceChain: isSet(object.isSourceChain) ? Boolean(object.isSourceChain) : false,
      trustedCounterParties: Array.isArray(object?.trustedCounterParties)
        ? object.trustedCounterParties.map((e: any) => TrustedCounterParty.fromJSON(e))
        : [],
      trustedAddresses: Array.isArray(object?.trustedAddresses)
        ? object.trustedAddresses.map((e: any) => String(e))
        : [],
      minGasPrice: isSet(object.minGasPrice) ? Coin.fromJSON(object.minGasPrice) : undefined,
      privateDecryptionKeyPrice: isSet(object.privateDecryptionKeyPrice)
        ? Coin.fromJSON(object.privateDecryptionKeyPrice)
        : undefined,
      maxContractGas: isSet(object.maxContractGas) ? Number(object.maxContractGas) : 0,
    };
  },

  toJSON(message: Params): unknown {
    const obj: any = {};
    if (message.keyshareChannelId !== "") {
      obj.keyshareChannelId = message.keyshareChannelId;
    }
    if (message.isSourceChain === true) {
      obj.isSourceChain = message.isSourceChain;
    }
    if (message.trustedCounterParties?.length) {
      obj.trustedCounterParties = message.trustedCounterParties.map((e) => TrustedCounterParty.toJSON(e));
    }
    if (message.trustedAddresses?.length) {
      obj.trustedAddresses = message.trustedAddresses;
    }
    if (message.minGasPrice !== undefined) {
      obj.minGasPrice = Coin.toJSON(message.minGasPrice);
    }
    if (message.privateDecryptionKeyPrice !== undefined) {
      obj.privateDecryptionKeyPrice = Coin.toJSON(message.privateDecryptionKeyPrice);
    }
    if (message.maxContractGas !== 0) {
      obj.maxContractGas = Math.round(message.maxContractGas);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Params>, I>>(base?: I): Params {
    return Params.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Params>, I>>(object: I): Params {
    const message = createBaseParams();
    message.keyshareChannelId = object.keyshareChannelId ?? "";
    message.isSourceChain = object.isSourceChain ?? false;
    message.trustedCounterParties = object.trustedCounterParties?.map((e) => TrustedCounterParty.fromPartial(e)) || [];
    message.trustedAddresses = object.trustedAddresses?.map((e) => e) || [];
    message.minGasPrice = (object.minGasPrice !== undefined && object.minGasPrice !== null)
      ? Coin.fromPartial(object.minGasPrice)
      : undefined;
    message.privateDecryptionKeyPrice =
      (object.privateDecryptionKeyPrice !== undefined && object.privateDecryptionKeyPrice !== null)
        ? Coin.fromPartial(object.privateDecryptionKeyPrice)
        : undefined;
    message.maxContractGas = object.maxContractGas ?? 0;
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
