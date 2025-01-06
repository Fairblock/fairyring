/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Duration } from "../../google/protobuf/duration";

export const protobufPackage = "fairyring.common";

/** RequestDecryptionKey defines a struct for the data payload */
export interface RequestDecryptionKey {
  creator: string;
  proposalId?: string | undefined;
  identity?: string | undefined;
  estimatedDelay: Duration | undefined;
}

/** RequestDecryptionKeyResponse defines the response to the RequestDecryptionKey message */
export interface RequestDecryptionKeyResponse {
  identity: string;
  pubkey: string;
}

/** GetDecryptionKey defines a struct for the data payload */
export interface GetDecryptionKey {
  isGovernanceProposal: boolean;
  proposalId: string;
  identity: string;
}

/** GetDecryptionKeyResponse defines the response to the GetDecryptionKey message */
export interface GetDecryptionKeyResponse {
}

/** GetPrivateDecryptionKey defines a struct for the data payload */
export interface GetPrivateDecryptionKey {
  identity: string;
  requester: string;
  secpPubkey: string;
}

/** GetPrivateDecryptionKeyResponse defines the response to the GetPrivateDecryptionKey message */
export interface GetPrivateDecryptionKeyResponse {
  pubkey: string;
}

/** ActivePublicKey defines the pubkey currently in use */
export interface ActivePublicKey {
  publicKey: string;
  creator: string;
  expiry: number;
}

/**
 * QueuedPublicKey defines the pubkey that (when set) will replace the acive pubkey
 * when it expires
 */
export interface QueuedPublicKey {
  publicKey: string;
  creator: string;
  expiry: number;
}

/**
 * RequestPrivateDecryptionKey defines the structure to request for
 * encrypted and unaggregated keyshares
 */
export interface RequestPrivateDecryptionKey {
  creator: string;
  identity: string;
}

/**
 * PrivateDecryptionKey defines the storage structure for
 * the list of encrypted keyshares (unaggregated)
 */
export interface PrivateDecryptionKey {
  requester: string;
  privateKeyshares: IndexedEncryptedKeyshare[];
}

/**
 * IndexedEncryptedKeyshare defines the storage of submitted encrypted
 * keyshares along with their indices (can be decrypted and aggregated)
 */
export interface IndexedEncryptedKeyshare {
  encryptedKeyshareValue: string;
  encryptedKeyshareIndex: number;
}

function createBaseRequestDecryptionKey(): RequestDecryptionKey {
  return { creator: "", proposalId: undefined, identity: undefined, estimatedDelay: undefined };
}

export const RequestDecryptionKey = {
  encode(message: RequestDecryptionKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.proposalId !== undefined) {
      writer.uint32(18).string(message.proposalId);
    }
    if (message.identity !== undefined) {
      writer.uint32(26).string(message.identity);
    }
    if (message.estimatedDelay !== undefined) {
      Duration.encode(message.estimatedDelay, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestDecryptionKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestDecryptionKey();
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

          message.proposalId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.identity = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.estimatedDelay = Duration.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RequestDecryptionKey {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : undefined,
      identity: isSet(object.identity) ? String(object.identity) : undefined,
      estimatedDelay: isSet(object.estimatedDelay) ? Duration.fromJSON(object.estimatedDelay) : undefined,
    };
  },

  toJSON(message: RequestDecryptionKey): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.proposalId !== undefined) {
      obj.proposalId = message.proposalId;
    }
    if (message.identity !== undefined) {
      obj.identity = message.identity;
    }
    if (message.estimatedDelay !== undefined) {
      obj.estimatedDelay = Duration.toJSON(message.estimatedDelay);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestDecryptionKey>, I>>(base?: I): RequestDecryptionKey {
    return RequestDecryptionKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestDecryptionKey>, I>>(object: I): RequestDecryptionKey {
    const message = createBaseRequestDecryptionKey();
    message.creator = object.creator ?? "";
    message.proposalId = object.proposalId ?? undefined;
    message.identity = object.identity ?? undefined;
    message.estimatedDelay = (object.estimatedDelay !== undefined && object.estimatedDelay !== null)
      ? Duration.fromPartial(object.estimatedDelay)
      : undefined;
    return message;
  },
};

function createBaseRequestDecryptionKeyResponse(): RequestDecryptionKeyResponse {
  return { identity: "", pubkey: "" };
}

export const RequestDecryptionKeyResponse = {
  encode(message: RequestDecryptionKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestDecryptionKeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestDecryptionKeyResponse();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RequestDecryptionKeyResponse {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: RequestDecryptionKeyResponse): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestDecryptionKeyResponse>, I>>(base?: I): RequestDecryptionKeyResponse {
    return RequestDecryptionKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestDecryptionKeyResponse>, I>>(object: I): RequestDecryptionKeyResponse {
    const message = createBaseRequestDecryptionKeyResponse();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseGetDecryptionKey(): GetDecryptionKey {
  return { isGovernanceProposal: false, proposalId: "", identity: "" };
}

export const GetDecryptionKey = {
  encode(message: GetDecryptionKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isGovernanceProposal === true) {
      writer.uint32(8).bool(message.isGovernanceProposal);
    }
    if (message.proposalId !== "") {
      writer.uint32(18).string(message.proposalId);
    }
    if (message.identity !== "") {
      writer.uint32(26).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDecryptionKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDecryptionKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.isGovernanceProposal = reader.bool();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.proposalId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.identity = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDecryptionKey {
    return {
      isGovernanceProposal: isSet(object.isGovernanceProposal) ? Boolean(object.isGovernanceProposal) : false,
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
    };
  },

  toJSON(message: GetDecryptionKey): unknown {
    const obj: any = {};
    if (message.isGovernanceProposal === true) {
      obj.isGovernanceProposal = message.isGovernanceProposal;
    }
    if (message.proposalId !== "") {
      obj.proposalId = message.proposalId;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDecryptionKey>, I>>(base?: I): GetDecryptionKey {
    return GetDecryptionKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetDecryptionKey>, I>>(object: I): GetDecryptionKey {
    const message = createBaseGetDecryptionKey();
    message.isGovernanceProposal = object.isGovernanceProposal ?? false;
    message.proposalId = object.proposalId ?? "";
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseGetDecryptionKeyResponse(): GetDecryptionKeyResponse {
  return {};
}

export const GetDecryptionKeyResponse = {
  encode(_: GetDecryptionKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDecryptionKeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDecryptionKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): GetDecryptionKeyResponse {
    return {};
  },

  toJSON(_: GetDecryptionKeyResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDecryptionKeyResponse>, I>>(base?: I): GetDecryptionKeyResponse {
    return GetDecryptionKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetDecryptionKeyResponse>, I>>(_: I): GetDecryptionKeyResponse {
    const message = createBaseGetDecryptionKeyResponse();
    return message;
  },
};

function createBaseGetPrivateDecryptionKey(): GetPrivateDecryptionKey {
  return { identity: "", requester: "", secpPubkey: "" };
}

export const GetPrivateDecryptionKey = {
  encode(message: GetPrivateDecryptionKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.requester !== "") {
      writer.uint32(18).string(message.requester);
    }
    if (message.secpPubkey !== "") {
      writer.uint32(26).string(message.secpPubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrivateDecryptionKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrivateDecryptionKey();
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

          message.requester = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.secpPubkey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetPrivateDecryptionKey {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      requester: isSet(object.requester) ? String(object.requester) : "",
      secpPubkey: isSet(object.secpPubkey) ? String(object.secpPubkey) : "",
    };
  },

  toJSON(message: GetPrivateDecryptionKey): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.requester !== "") {
      obj.requester = message.requester;
    }
    if (message.secpPubkey !== "") {
      obj.secpPubkey = message.secpPubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPrivateDecryptionKey>, I>>(base?: I): GetPrivateDecryptionKey {
    return GetPrivateDecryptionKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetPrivateDecryptionKey>, I>>(object: I): GetPrivateDecryptionKey {
    const message = createBaseGetPrivateDecryptionKey();
    message.identity = object.identity ?? "";
    message.requester = object.requester ?? "";
    message.secpPubkey = object.secpPubkey ?? "";
    return message;
  },
};

function createBaseGetPrivateDecryptionKeyResponse(): GetPrivateDecryptionKeyResponse {
  return { pubkey: "" };
}

export const GetPrivateDecryptionKeyResponse = {
  encode(message: GetPrivateDecryptionKeyResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.pubkey !== "") {
      writer.uint32(10).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrivateDecryptionKeyResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrivateDecryptionKeyResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.pubkey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetPrivateDecryptionKeyResponse {
    return { pubkey: isSet(object.pubkey) ? String(object.pubkey) : "" };
  },

  toJSON(message: GetPrivateDecryptionKeyResponse): unknown {
    const obj: any = {};
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPrivateDecryptionKeyResponse>, I>>(base?: I): GetPrivateDecryptionKeyResponse {
    return GetPrivateDecryptionKeyResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetPrivateDecryptionKeyResponse>, I>>(
    object: I,
  ): GetPrivateDecryptionKeyResponse {
    const message = createBaseGetPrivateDecryptionKeyResponse();
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseActivePublicKey(): ActivePublicKey {
  return { publicKey: "", creator: "", expiry: 0 };
}

export const ActivePublicKey = {
  encode(message: ActivePublicKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    if (message.expiry !== 0) {
      writer.uint32(24).uint64(message.expiry);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActivePublicKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActivePublicKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.expiry = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ActivePublicKey {
    return {
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      expiry: isSet(object.expiry) ? Number(object.expiry) : 0,
    };
  },

  toJSON(message: ActivePublicKey): unknown {
    const obj: any = {};
    if (message.publicKey !== "") {
      obj.publicKey = message.publicKey;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.expiry !== 0) {
      obj.expiry = Math.round(message.expiry);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ActivePublicKey>, I>>(base?: I): ActivePublicKey {
    return ActivePublicKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ActivePublicKey>, I>>(object: I): ActivePublicKey {
    const message = createBaseActivePublicKey();
    message.publicKey = object.publicKey ?? "";
    message.creator = object.creator ?? "";
    message.expiry = object.expiry ?? 0;
    return message;
  },
};

function createBaseQueuedPublicKey(): QueuedPublicKey {
  return { publicKey: "", creator: "", expiry: 0 };
}

export const QueuedPublicKey = {
  encode(message: QueuedPublicKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.publicKey !== "") {
      writer.uint32(10).string(message.publicKey);
    }
    if (message.creator !== "") {
      writer.uint32(18).string(message.creator);
    }
    if (message.expiry !== 0) {
      writer.uint32(24).uint64(message.expiry);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): QueuedPublicKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueuedPublicKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.publicKey = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.creator = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.expiry = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): QueuedPublicKey {
    return {
      publicKey: isSet(object.publicKey) ? String(object.publicKey) : "",
      creator: isSet(object.creator) ? String(object.creator) : "",
      expiry: isSet(object.expiry) ? Number(object.expiry) : 0,
    };
  },

  toJSON(message: QueuedPublicKey): unknown {
    const obj: any = {};
    if (message.publicKey !== "") {
      obj.publicKey = message.publicKey;
    }
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.expiry !== 0) {
      obj.expiry = Math.round(message.expiry);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueuedPublicKey>, I>>(base?: I): QueuedPublicKey {
    return QueuedPublicKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueuedPublicKey>, I>>(object: I): QueuedPublicKey {
    const message = createBaseQueuedPublicKey();
    message.publicKey = object.publicKey ?? "";
    message.creator = object.creator ?? "";
    message.expiry = object.expiry ?? 0;
    return message;
  },
};

function createBaseRequestPrivateDecryptionKey(): RequestPrivateDecryptionKey {
  return { creator: "", identity: "" };
}

export const RequestPrivateDecryptionKey = {
  encode(message: RequestPrivateDecryptionKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestPrivateDecryptionKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestPrivateDecryptionKey();
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
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RequestPrivateDecryptionKey {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
    };
  },

  toJSON(message: RequestPrivateDecryptionKey): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestPrivateDecryptionKey>, I>>(base?: I): RequestPrivateDecryptionKey {
    return RequestPrivateDecryptionKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestPrivateDecryptionKey>, I>>(object: I): RequestPrivateDecryptionKey {
    const message = createBaseRequestPrivateDecryptionKey();
    message.creator = object.creator ?? "";
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBasePrivateDecryptionKey(): PrivateDecryptionKey {
  return { requester: "", privateKeyshares: [] };
}

export const PrivateDecryptionKey = {
  encode(message: PrivateDecryptionKey, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requester !== "") {
      writer.uint32(10).string(message.requester);
    }
    for (const v of message.privateKeyshares) {
      IndexedEncryptedKeyshare.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PrivateDecryptionKey {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrivateDecryptionKey();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.requester = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.privateKeyshares.push(IndexedEncryptedKeyshare.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PrivateDecryptionKey {
    return {
      requester: isSet(object.requester) ? String(object.requester) : "",
      privateKeyshares: Array.isArray(object?.privateKeyshares)
        ? object.privateKeyshares.map((e: any) => IndexedEncryptedKeyshare.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PrivateDecryptionKey): unknown {
    const obj: any = {};
    if (message.requester !== "") {
      obj.requester = message.requester;
    }
    if (message.privateKeyshares?.length) {
      obj.privateKeyshares = message.privateKeyshares.map((e) => IndexedEncryptedKeyshare.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PrivateDecryptionKey>, I>>(base?: I): PrivateDecryptionKey {
    return PrivateDecryptionKey.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PrivateDecryptionKey>, I>>(object: I): PrivateDecryptionKey {
    const message = createBasePrivateDecryptionKey();
    message.requester = object.requester ?? "";
    message.privateKeyshares = object.privateKeyshares?.map((e) => IndexedEncryptedKeyshare.fromPartial(e)) || [];
    return message;
  },
};

function createBaseIndexedEncryptedKeyshare(): IndexedEncryptedKeyshare {
  return { encryptedKeyshareValue: "", encryptedKeyshareIndex: 0 };
}

export const IndexedEncryptedKeyshare = {
  encode(message: IndexedEncryptedKeyshare, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.encryptedKeyshareValue !== "") {
      writer.uint32(10).string(message.encryptedKeyshareValue);
    }
    if (message.encryptedKeyshareIndex !== 0) {
      writer.uint32(16).uint64(message.encryptedKeyshareIndex);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): IndexedEncryptedKeyshare {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseIndexedEncryptedKeyshare();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.encryptedKeyshareValue = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.encryptedKeyshareIndex = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): IndexedEncryptedKeyshare {
    return {
      encryptedKeyshareValue: isSet(object.encryptedKeyshareValue) ? String(object.encryptedKeyshareValue) : "",
      encryptedKeyshareIndex: isSet(object.encryptedKeyshareIndex) ? Number(object.encryptedKeyshareIndex) : 0,
    };
  },

  toJSON(message: IndexedEncryptedKeyshare): unknown {
    const obj: any = {};
    if (message.encryptedKeyshareValue !== "") {
      obj.encryptedKeyshareValue = message.encryptedKeyshareValue;
    }
    if (message.encryptedKeyshareIndex !== 0) {
      obj.encryptedKeyshareIndex = Math.round(message.encryptedKeyshareIndex);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<IndexedEncryptedKeyshare>, I>>(base?: I): IndexedEncryptedKeyshare {
    return IndexedEncryptedKeyshare.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<IndexedEncryptedKeyshare>, I>>(object: I): IndexedEncryptedKeyshare {
    const message = createBaseIndexedEncryptedKeyshare();
    message.encryptedKeyshareValue = object.encryptedKeyshareValue ?? "";
    message.encryptedKeyshareIndex = object.encryptedKeyshareIndex ?? 0;
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
