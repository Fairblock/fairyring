/* eslint-disable */
import _m0 from "protobufjs/minimal";
import { PrivateDecryptionKey } from "../common/shared_types";

export const protobufPackage = "fairyring.pep";

/**
 * RequestId defines the structure for storing request ids
 * that have already been registered to prevent overlap
 */
export interface RequestId {
  creator: string;
  reqId: string;
}

/**
 * PrivateRequest defines the structure for storing private
 * decryption key requests along with the unaggregated encrypted keyshares
 */
export interface PrivateRequest {
  creator: string;
  identity: string;
  pubkey: string;
  privateDecryptionKeys: PrivateDecryptionKey[];
}

/**
 * ContractDetails defines the structure to store the details of a
 * contract that has been registered to execute automatically when
 * the identity associated with it has a decryption key available
 */
export interface ContractDetails {
  registrar: string;
  contractAddress: string;
}

/**
 * RegisteredContract defines the structure to store the list of
 * contracts that have been registered with a particular identity
 */
export interface RegisteredContract {
  identity: string;
  contracts: ContractDetails[];
}

/** ExecuteContractMsg defines the structure to callback registered contracts */
export interface ExecuteContractMsg {
  identity: string;
  pubkey: string;
  decryptionKey: string;
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

function createBasePrivateRequest(): PrivateRequest {
  return { creator: "", identity: "", pubkey: "", privateDecryptionKeys: [] };
}

export const PrivateRequest = {
  encode(message: PrivateRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(26).string(message.pubkey);
    }
    for (const v of message.privateDecryptionKeys) {
      PrivateDecryptionKey.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PrivateRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrivateRequest();
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

          message.identity = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.pubkey = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.privateDecryptionKeys.push(PrivateDecryptionKey.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PrivateRequest {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      privateDecryptionKeys: Array.isArray(object?.privateDecryptionKeys)
        ? object.privateDecryptionKeys.map((e: any) => PrivateDecryptionKey.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PrivateRequest): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.privateDecryptionKeys?.length) {
      obj.privateDecryptionKeys = message.privateDecryptionKeys.map((e) => PrivateDecryptionKey.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PrivateRequest>, I>>(base?: I): PrivateRequest {
    return PrivateRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PrivateRequest>, I>>(object: I): PrivateRequest {
    const message = createBasePrivateRequest();
    message.creator = object.creator ?? "";
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.privateDecryptionKeys = object.privateDecryptionKeys?.map((e) => PrivateDecryptionKey.fromPartial(e)) || [];
    return message;
  },
};

function createBaseContractDetails(): ContractDetails {
  return { registrar: "", contractAddress: "" };
}

export const ContractDetails = {
  encode(message: ContractDetails, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.registrar !== "") {
      writer.uint32(10).string(message.registrar);
    }
    if (message.contractAddress !== "") {
      writer.uint32(18).string(message.contractAddress);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ContractDetails {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseContractDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.registrar = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contractAddress = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ContractDetails {
    return {
      registrar: isSet(object.registrar) ? String(object.registrar) : "",
      contractAddress: isSet(object.contractAddress) ? String(object.contractAddress) : "",
    };
  },

  toJSON(message: ContractDetails): unknown {
    const obj: any = {};
    if (message.registrar !== "") {
      obj.registrar = message.registrar;
    }
    if (message.contractAddress !== "") {
      obj.contractAddress = message.contractAddress;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ContractDetails>, I>>(base?: I): ContractDetails {
    return ContractDetails.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ContractDetails>, I>>(object: I): ContractDetails {
    const message = createBaseContractDetails();
    message.registrar = object.registrar ?? "";
    message.contractAddress = object.contractAddress ?? "";
    return message;
  },
};

function createBaseRegisteredContract(): RegisteredContract {
  return { identity: "", contracts: [] };
}

export const RegisteredContract = {
  encode(message: RegisteredContract, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    for (const v of message.contracts) {
      ContractDetails.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RegisteredContract {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRegisteredContract();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.contracts.push(ContractDetails.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RegisteredContract {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      contracts: Array.isArray(object?.contracts) ? object.contracts.map((e: any) => ContractDetails.fromJSON(e)) : [],
    };
  },

  toJSON(message: RegisteredContract): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.contracts?.length) {
      obj.contracts = message.contracts.map((e) => ContractDetails.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RegisteredContract>, I>>(base?: I): RegisteredContract {
    return RegisteredContract.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RegisteredContract>, I>>(object: I): RegisteredContract {
    const message = createBaseRegisteredContract();
    message.identity = object.identity ?? "";
    message.contracts = object.contracts?.map((e) => ContractDetails.fromPartial(e)) || [];
    return message;
  },
};

function createBaseExecuteContractMsg(): ExecuteContractMsg {
  return { identity: "", pubkey: "", decryptionKey: "" };
}

export const ExecuteContractMsg = {
  encode(message: ExecuteContractMsg, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    if (message.decryptionKey !== "") {
      writer.uint32(26).string(message.decryptionKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ExecuteContractMsg {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseExecuteContractMsg();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.pubkey = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.decryptionKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ExecuteContractMsg {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      decryptionKey: isSet(object.decryptionKey) ? String(object.decryptionKey) : "",
    };
  },

  toJSON(message: ExecuteContractMsg): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.decryptionKey !== "") {
      obj.decryptionKey = message.decryptionKey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ExecuteContractMsg>, I>>(base?: I): ExecuteContractMsg {
    return ExecuteContractMsg.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ExecuteContractMsg>, I>>(object: I): ExecuteContractMsg {
    const message = createBaseExecuteContractMsg();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.decryptionKey = object.decryptionKey ?? "";
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
