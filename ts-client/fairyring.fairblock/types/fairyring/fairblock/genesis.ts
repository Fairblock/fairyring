/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { AggregatedKeyShare } from "./aggregated_key_share";
import { EncryptedTxArray } from "./encrypted_tx";
import { FairblockExecutedNonce } from "./fairblock_executed_nonce";
import { FairblockNonce } from "./fairblock_nonce";
import { Params } from "./params";

export const protobufPackage = "fairyring.fairblock";

/** GenesisState defines the fairblock module's genesis state. */
export interface GenesisState {
  params: Params | undefined;
  portId: string;
  encryptedTxArray: EncryptedTxArray[];
  fairblockNonceList: FairblockNonce[];
  fairblockExecutedNonceList: FairblockExecutedNonce[];
  /** this line is used by starport scaffolding # genesis/proto/state */
  aggregatedKeyShareList: AggregatedKeyShare[];
}

function createBaseGenesisState(): GenesisState {
  return {
    params: undefined,
    portId: "",
    encryptedTxArray: [],
    fairblockNonceList: [],
    fairblockExecutedNonceList: [],
    aggregatedKeyShareList: [],
  };
}

export const GenesisState = {
  encode(message: GenesisState, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).ldelim();
    }
    if (message.portId !== "") {
      writer.uint32(18).string(message.portId);
    }
    for (const v of message.encryptedTxArray) {
      EncryptedTxArray.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.fairblockNonceList) {
      FairblockNonce.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    for (const v of message.fairblockExecutedNonceList) {
      FairblockExecutedNonce.encode(v!, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.aggregatedKeyShareList) {
      AggregatedKeyShare.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenesisState {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenesisState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.params = Params.decode(reader, reader.uint32());
          break;
        case 2:
          message.portId = reader.string();
          break;
        case 3:
          message.encryptedTxArray.push(EncryptedTxArray.decode(reader, reader.uint32()));
          break;
        case 4:
          message.fairblockNonceList.push(FairblockNonce.decode(reader, reader.uint32()));
          break;
        case 5:
          message.fairblockExecutedNonceList.push(FairblockExecutedNonce.decode(reader, reader.uint32()));
          break;
        case 6:
          message.aggregatedKeyShareList.push(AggregatedKeyShare.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenesisState {
    return {
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
      portId: isSet(object.portId) ? String(object.portId) : "",
      encryptedTxArray: Array.isArray(object?.encryptedTxArray)
        ? object.encryptedTxArray.map((e: any) => EncryptedTxArray.fromJSON(e))
        : [],
      fairblockNonceList: Array.isArray(object?.fairblockNonceList)
        ? object.fairblockNonceList.map((e: any) => FairblockNonce.fromJSON(e))
        : [],
      fairblockExecutedNonceList: Array.isArray(object?.fairblockExecutedNonceList)
        ? object.fairblockExecutedNonceList.map((e: any) => FairblockExecutedNonce.fromJSON(e))
        : [],
      aggregatedKeyShareList: Array.isArray(object?.aggregatedKeyShareList)
        ? object.aggregatedKeyShareList.map((e: any) => AggregatedKeyShare.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GenesisState): unknown {
    const obj: any = {};
    message.params !== undefined && (obj.params = message.params ? Params.toJSON(message.params) : undefined);
    message.portId !== undefined && (obj.portId = message.portId);
    if (message.encryptedTxArray) {
      obj.encryptedTxArray = message.encryptedTxArray.map((e) => e ? EncryptedTxArray.toJSON(e) : undefined);
    } else {
      obj.encryptedTxArray = [];
    }
    if (message.fairblockNonceList) {
      obj.fairblockNonceList = message.fairblockNonceList.map((e) => e ? FairblockNonce.toJSON(e) : undefined);
    } else {
      obj.fairblockNonceList = [];
    }
    if (message.fairblockExecutedNonceList) {
      obj.fairblockExecutedNonceList = message.fairblockExecutedNonceList.map((e) =>
        e ? FairblockExecutedNonce.toJSON(e) : undefined
      );
    } else {
      obj.fairblockExecutedNonceList = [];
    }
    if (message.aggregatedKeyShareList) {
      obj.aggregatedKeyShareList = message.aggregatedKeyShareList.map((e) =>
        e ? AggregatedKeyShare.toJSON(e) : undefined
      );
    } else {
      obj.aggregatedKeyShareList = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GenesisState>, I>>(object: I): GenesisState {
    const message = createBaseGenesisState();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    message.portId = object.portId ?? "";
    message.encryptedTxArray = object.encryptedTxArray?.map((e) => EncryptedTxArray.fromPartial(e)) || [];
    message.fairblockNonceList = object.fairblockNonceList?.map((e) => FairblockNonce.fromPartial(e)) || [];
    message.fairblockExecutedNonceList =
      object.fairblockExecutedNonceList?.map((e) => FairblockExecutedNonce.fromPartial(e)) || [];
    message.aggregatedKeyShareList = object.aggregatedKeyShareList?.map((e) => AggregatedKeyShare.fromPartial(e)) || [];
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
