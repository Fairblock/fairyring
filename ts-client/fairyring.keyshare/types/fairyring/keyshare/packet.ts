/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Duration } from "../../google/protobuf/duration";
import { ActivePublicKey, PrivateDecryptionKey, QueuedPublicKey } from "../common/shared_types";

export const protobufPackage = "fairyring.keyshare";

/** KeysharePacketData defines all the packet types of the keyshare module */
export interface KeysharePacketData {
  noData?: NoData | undefined;
  requestDecryptionKeyPacket?: RequestDecryptionKeyPacketData | undefined;
  getDecryptionKeyPacket?: GetDecryptionKeyPacketData | undefined;
  decryptionKeyDataPacket?: DecryptionKeyDataPacketData | undefined;
  privateDecryptionKeyDataPacket?: PrivateDecryptionKeyDataPacketData | undefined;
  currentKeysPacket?: CurrentKeysPacketData | undefined;
  requestPrivateDecryptionKeyPacket?: RequestPrivateDecryptionKeyPacketData | undefined;
  getPrivateDecryptionKeyPacket?: GetPrivateDecryptionKeyPacketData | undefined;
}

/** NoData defines a blank packet */
export interface NoData {
}

/** RequestDecryptionKeyPacketData defines a struct for the packet payload */
export interface RequestDecryptionKeyPacketData {
  requester: string;
  proposalId?: string | undefined;
  identity?: string | undefined;
  estimatedDelay: Duration | undefined;
}

/** RequestPrivateDecryptionKeyPacketData defines a struct for the packet payload */
export interface RequestPrivateDecryptionKeyPacketData {
  requester: string;
  identity: string;
}

/** RequestPrivateDecryptionKeyPacketAck defines a struct for the packet acknowledgment */
export interface RequestPrivateDecryptionKeyPacketAck {
  identity: string;
  pubkey: string;
}

/** RequestDecryptionKeyPacketAck defines a struct for the packet acknowledgment */
export interface RequestDecryptionKeyPacketAck {
  identity: string;
  pubkey: string;
}

/** GetDecryptionKeyPacketData defines a struct for the packet payload */
export interface GetDecryptionKeyPacketData {
  identity: string;
}

/** GetDecryptionKeyPacketAck defines a struct for the packet acknowledgment */
export interface GetDecryptionKeyPacketAck {
}

/** GetPrivateDecryptionKeyPacketData defines a struct for the packet payload */
export interface GetPrivateDecryptionKeyPacketData {
  identity: string;
  requester: string;
  secpPubkey: string;
}

/** GetPrivateKeysharePacketAck defines a struct for the packet acknowledgment */
export interface GetPrivateDecryptionKeyPacketAck {
}

/** DecryptionKeyDataPacketData defines a struct for the packet payload */
export interface DecryptionKeyDataPacketData {
  identity: string;
  pubkey: string;
  decryptionKey: string;
  aggrHeight: string;
  /** used for private governance */
  proposalId: string;
  retries: number;
}

/** DecryptionKeyPacketAck defines a struct for the packet acknowledgment */
export interface DecryptionKeyPacketAck {
}

/** PrivateDecryptionKeyDataPacketData defines a struct for the packet payload */
export interface PrivateDecryptionKeyDataPacketData {
  identity: string;
  pubkey: string;
  privateDecryptionKey: PrivateDecryptionKey[];
}

/** PrivateDecryptionKeyPacketAck defines a struct for the packet payload */
export interface PrivateDecryptionKeyPacketAck {
}

/** CurrentKeysPacketData defines a struct for the packet payload */
export interface CurrentKeysPacketData {
}

/** CurrentKeysPacketAck defines a struct for the packet acknowledgment */
export interface CurrentKeysPacketAck {
  activeKey: ActivePublicKey | undefined;
  queuedKey: QueuedPublicKey | undefined;
}

function createBaseKeysharePacketData(): KeysharePacketData {
  return {
    noData: undefined,
    requestDecryptionKeyPacket: undefined,
    getDecryptionKeyPacket: undefined,
    decryptionKeyDataPacket: undefined,
    privateDecryptionKeyDataPacket: undefined,
    currentKeysPacket: undefined,
    requestPrivateDecryptionKeyPacket: undefined,
    getPrivateDecryptionKeyPacket: undefined,
  };
}

export const KeysharePacketData = {
  encode(message: KeysharePacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.noData !== undefined) {
      NoData.encode(message.noData, writer.uint32(10).fork()).ldelim();
    }
    if (message.requestDecryptionKeyPacket !== undefined) {
      RequestDecryptionKeyPacketData.encode(message.requestDecryptionKeyPacket, writer.uint32(18).fork()).ldelim();
    }
    if (message.getDecryptionKeyPacket !== undefined) {
      GetDecryptionKeyPacketData.encode(message.getDecryptionKeyPacket, writer.uint32(26).fork()).ldelim();
    }
    if (message.decryptionKeyDataPacket !== undefined) {
      DecryptionKeyDataPacketData.encode(message.decryptionKeyDataPacket, writer.uint32(34).fork()).ldelim();
    }
    if (message.privateDecryptionKeyDataPacket !== undefined) {
      PrivateDecryptionKeyDataPacketData.encode(message.privateDecryptionKeyDataPacket, writer.uint32(42).fork())
        .ldelim();
    }
    if (message.currentKeysPacket !== undefined) {
      CurrentKeysPacketData.encode(message.currentKeysPacket, writer.uint32(50).fork()).ldelim();
    }
    if (message.requestPrivateDecryptionKeyPacket !== undefined) {
      RequestPrivateDecryptionKeyPacketData.encode(message.requestPrivateDecryptionKeyPacket, writer.uint32(58).fork())
        .ldelim();
    }
    if (message.getPrivateDecryptionKeyPacket !== undefined) {
      GetPrivateDecryptionKeyPacketData.encode(message.getPrivateDecryptionKeyPacket, writer.uint32(66).fork())
        .ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): KeysharePacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseKeysharePacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.noData = NoData.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.requestDecryptionKeyPacket = RequestDecryptionKeyPacketData.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.getDecryptionKeyPacket = GetDecryptionKeyPacketData.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.decryptionKeyDataPacket = DecryptionKeyDataPacketData.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.privateDecryptionKeyDataPacket = PrivateDecryptionKeyDataPacketData.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.currentKeysPacket = CurrentKeysPacketData.decode(reader, reader.uint32());
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.requestPrivateDecryptionKeyPacket = RequestPrivateDecryptionKeyPacketData.decode(
            reader,
            reader.uint32(),
          );
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.getPrivateDecryptionKeyPacket = GetPrivateDecryptionKeyPacketData.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): KeysharePacketData {
    return {
      noData: isSet(object.noData) ? NoData.fromJSON(object.noData) : undefined,
      requestDecryptionKeyPacket: isSet(object.requestDecryptionKeyPacket)
        ? RequestDecryptionKeyPacketData.fromJSON(object.requestDecryptionKeyPacket)
        : undefined,
      getDecryptionKeyPacket: isSet(object.getDecryptionKeyPacket)
        ? GetDecryptionKeyPacketData.fromJSON(object.getDecryptionKeyPacket)
        : undefined,
      decryptionKeyDataPacket: isSet(object.decryptionKeyDataPacket)
        ? DecryptionKeyDataPacketData.fromJSON(object.decryptionKeyDataPacket)
        : undefined,
      privateDecryptionKeyDataPacket: isSet(object.privateDecryptionKeyDataPacket)
        ? PrivateDecryptionKeyDataPacketData.fromJSON(object.privateDecryptionKeyDataPacket)
        : undefined,
      currentKeysPacket: isSet(object.currentKeysPacket)
        ? CurrentKeysPacketData.fromJSON(object.currentKeysPacket)
        : undefined,
      requestPrivateDecryptionKeyPacket: isSet(object.requestPrivateDecryptionKeyPacket)
        ? RequestPrivateDecryptionKeyPacketData.fromJSON(object.requestPrivateDecryptionKeyPacket)
        : undefined,
      getPrivateDecryptionKeyPacket: isSet(object.getPrivateDecryptionKeyPacket)
        ? GetPrivateDecryptionKeyPacketData.fromJSON(object.getPrivateDecryptionKeyPacket)
        : undefined,
    };
  },

  toJSON(message: KeysharePacketData): unknown {
    const obj: any = {};
    if (message.noData !== undefined) {
      obj.noData = NoData.toJSON(message.noData);
    }
    if (message.requestDecryptionKeyPacket !== undefined) {
      obj.requestDecryptionKeyPacket = RequestDecryptionKeyPacketData.toJSON(message.requestDecryptionKeyPacket);
    }
    if (message.getDecryptionKeyPacket !== undefined) {
      obj.getDecryptionKeyPacket = GetDecryptionKeyPacketData.toJSON(message.getDecryptionKeyPacket);
    }
    if (message.decryptionKeyDataPacket !== undefined) {
      obj.decryptionKeyDataPacket = DecryptionKeyDataPacketData.toJSON(message.decryptionKeyDataPacket);
    }
    if (message.privateDecryptionKeyDataPacket !== undefined) {
      obj.privateDecryptionKeyDataPacket = PrivateDecryptionKeyDataPacketData.toJSON(
        message.privateDecryptionKeyDataPacket,
      );
    }
    if (message.currentKeysPacket !== undefined) {
      obj.currentKeysPacket = CurrentKeysPacketData.toJSON(message.currentKeysPacket);
    }
    if (message.requestPrivateDecryptionKeyPacket !== undefined) {
      obj.requestPrivateDecryptionKeyPacket = RequestPrivateDecryptionKeyPacketData.toJSON(
        message.requestPrivateDecryptionKeyPacket,
      );
    }
    if (message.getPrivateDecryptionKeyPacket !== undefined) {
      obj.getPrivateDecryptionKeyPacket = GetPrivateDecryptionKeyPacketData.toJSON(
        message.getPrivateDecryptionKeyPacket,
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<KeysharePacketData>, I>>(base?: I): KeysharePacketData {
    return KeysharePacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<KeysharePacketData>, I>>(object: I): KeysharePacketData {
    const message = createBaseKeysharePacketData();
    message.noData = (object.noData !== undefined && object.noData !== null)
      ? NoData.fromPartial(object.noData)
      : undefined;
    message.requestDecryptionKeyPacket =
      (object.requestDecryptionKeyPacket !== undefined && object.requestDecryptionKeyPacket !== null)
        ? RequestDecryptionKeyPacketData.fromPartial(object.requestDecryptionKeyPacket)
        : undefined;
    message.getDecryptionKeyPacket =
      (object.getDecryptionKeyPacket !== undefined && object.getDecryptionKeyPacket !== null)
        ? GetDecryptionKeyPacketData.fromPartial(object.getDecryptionKeyPacket)
        : undefined;
    message.decryptionKeyDataPacket =
      (object.decryptionKeyDataPacket !== undefined && object.decryptionKeyDataPacket !== null)
        ? DecryptionKeyDataPacketData.fromPartial(object.decryptionKeyDataPacket)
        : undefined;
    message.privateDecryptionKeyDataPacket =
      (object.privateDecryptionKeyDataPacket !== undefined && object.privateDecryptionKeyDataPacket !== null)
        ? PrivateDecryptionKeyDataPacketData.fromPartial(object.privateDecryptionKeyDataPacket)
        : undefined;
    message.currentKeysPacket = (object.currentKeysPacket !== undefined && object.currentKeysPacket !== null)
      ? CurrentKeysPacketData.fromPartial(object.currentKeysPacket)
      : undefined;
    message.requestPrivateDecryptionKeyPacket =
      (object.requestPrivateDecryptionKeyPacket !== undefined && object.requestPrivateDecryptionKeyPacket !== null)
        ? RequestPrivateDecryptionKeyPacketData.fromPartial(object.requestPrivateDecryptionKeyPacket)
        : undefined;
    message.getPrivateDecryptionKeyPacket =
      (object.getPrivateDecryptionKeyPacket !== undefined && object.getPrivateDecryptionKeyPacket !== null)
        ? GetPrivateDecryptionKeyPacketData.fromPartial(object.getPrivateDecryptionKeyPacket)
        : undefined;
    return message;
  },
};

function createBaseNoData(): NoData {
  return {};
}

export const NoData = {
  encode(_: NoData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NoData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNoData();
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

  fromJSON(_: any): NoData {
    return {};
  },

  toJSON(_: NoData): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<NoData>, I>>(base?: I): NoData {
    return NoData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NoData>, I>>(_: I): NoData {
    const message = createBaseNoData();
    return message;
  },
};

function createBaseRequestDecryptionKeyPacketData(): RequestDecryptionKeyPacketData {
  return { requester: "", proposalId: undefined, identity: undefined, estimatedDelay: undefined };
}

export const RequestDecryptionKeyPacketData = {
  encode(message: RequestDecryptionKeyPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requester !== "") {
      writer.uint32(10).string(message.requester);
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

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestDecryptionKeyPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestDecryptionKeyPacketData();
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

  fromJSON(object: any): RequestDecryptionKeyPacketData {
    return {
      requester: isSet(object.requester) ? String(object.requester) : "",
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : undefined,
      identity: isSet(object.identity) ? String(object.identity) : undefined,
      estimatedDelay: isSet(object.estimatedDelay) ? Duration.fromJSON(object.estimatedDelay) : undefined,
    };
  },

  toJSON(message: RequestDecryptionKeyPacketData): unknown {
    const obj: any = {};
    if (message.requester !== "") {
      obj.requester = message.requester;
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

  create<I extends Exact<DeepPartial<RequestDecryptionKeyPacketData>, I>>(base?: I): RequestDecryptionKeyPacketData {
    return RequestDecryptionKeyPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestDecryptionKeyPacketData>, I>>(
    object: I,
  ): RequestDecryptionKeyPacketData {
    const message = createBaseRequestDecryptionKeyPacketData();
    message.requester = object.requester ?? "";
    message.proposalId = object.proposalId ?? undefined;
    message.identity = object.identity ?? undefined;
    message.estimatedDelay = (object.estimatedDelay !== undefined && object.estimatedDelay !== null)
      ? Duration.fromPartial(object.estimatedDelay)
      : undefined;
    return message;
  },
};

function createBaseRequestPrivateDecryptionKeyPacketData(): RequestPrivateDecryptionKeyPacketData {
  return { requester: "", identity: "" };
}

export const RequestPrivateDecryptionKeyPacketData = {
  encode(message: RequestPrivateDecryptionKeyPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requester !== "") {
      writer.uint32(10).string(message.requester);
    }
    if (message.identity !== "") {
      writer.uint32(18).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestPrivateDecryptionKeyPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestPrivateDecryptionKeyPacketData();
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

  fromJSON(object: any): RequestPrivateDecryptionKeyPacketData {
    return {
      requester: isSet(object.requester) ? String(object.requester) : "",
      identity: isSet(object.identity) ? String(object.identity) : "",
    };
  },

  toJSON(message: RequestPrivateDecryptionKeyPacketData): unknown {
    const obj: any = {};
    if (message.requester !== "") {
      obj.requester = message.requester;
    }
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestPrivateDecryptionKeyPacketData>, I>>(
    base?: I,
  ): RequestPrivateDecryptionKeyPacketData {
    return RequestPrivateDecryptionKeyPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestPrivateDecryptionKeyPacketData>, I>>(
    object: I,
  ): RequestPrivateDecryptionKeyPacketData {
    const message = createBaseRequestPrivateDecryptionKeyPacketData();
    message.requester = object.requester ?? "";
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseRequestPrivateDecryptionKeyPacketAck(): RequestPrivateDecryptionKeyPacketAck {
  return { identity: "", pubkey: "" };
}

export const RequestPrivateDecryptionKeyPacketAck = {
  encode(message: RequestPrivateDecryptionKeyPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestPrivateDecryptionKeyPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestPrivateDecryptionKeyPacketAck();
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

  fromJSON(object: any): RequestPrivateDecryptionKeyPacketAck {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: RequestPrivateDecryptionKeyPacketAck): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestPrivateDecryptionKeyPacketAck>, I>>(
    base?: I,
  ): RequestPrivateDecryptionKeyPacketAck {
    return RequestPrivateDecryptionKeyPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestPrivateDecryptionKeyPacketAck>, I>>(
    object: I,
  ): RequestPrivateDecryptionKeyPacketAck {
    const message = createBaseRequestPrivateDecryptionKeyPacketAck();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseRequestDecryptionKeyPacketAck(): RequestDecryptionKeyPacketAck {
  return { identity: "", pubkey: "" };
}

export const RequestDecryptionKeyPacketAck = {
  encode(message: RequestDecryptionKeyPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestDecryptionKeyPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequestDecryptionKeyPacketAck();
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

  fromJSON(object: any): RequestDecryptionKeyPacketAck {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
    };
  },

  toJSON(message: RequestDecryptionKeyPacketAck): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RequestDecryptionKeyPacketAck>, I>>(base?: I): RequestDecryptionKeyPacketAck {
    return RequestDecryptionKeyPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RequestDecryptionKeyPacketAck>, I>>(
    object: I,
  ): RequestDecryptionKeyPacketAck {
    const message = createBaseRequestDecryptionKeyPacketAck();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    return message;
  },
};

function createBaseGetDecryptionKeyPacketData(): GetDecryptionKeyPacketData {
  return { identity: "" };
}

export const GetDecryptionKeyPacketData = {
  encode(message: GetDecryptionKeyPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDecryptionKeyPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDecryptionKeyPacketData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
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

  fromJSON(object: any): GetDecryptionKeyPacketData {
    return { identity: isSet(object.identity) ? String(object.identity) : "" };
  },

  toJSON(message: GetDecryptionKeyPacketData): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDecryptionKeyPacketData>, I>>(base?: I): GetDecryptionKeyPacketData {
    return GetDecryptionKeyPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetDecryptionKeyPacketData>, I>>(object: I): GetDecryptionKeyPacketData {
    const message = createBaseGetDecryptionKeyPacketData();
    message.identity = object.identity ?? "";
    return message;
  },
};

function createBaseGetDecryptionKeyPacketAck(): GetDecryptionKeyPacketAck {
  return {};
}

export const GetDecryptionKeyPacketAck = {
  encode(_: GetDecryptionKeyPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDecryptionKeyPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDecryptionKeyPacketAck();
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

  fromJSON(_: any): GetDecryptionKeyPacketAck {
    return {};
  },

  toJSON(_: GetDecryptionKeyPacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDecryptionKeyPacketAck>, I>>(base?: I): GetDecryptionKeyPacketAck {
    return GetDecryptionKeyPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetDecryptionKeyPacketAck>, I>>(_: I): GetDecryptionKeyPacketAck {
    const message = createBaseGetDecryptionKeyPacketAck();
    return message;
  },
};

function createBaseGetPrivateDecryptionKeyPacketData(): GetPrivateDecryptionKeyPacketData {
  return { identity: "", requester: "", secpPubkey: "" };
}

export const GetPrivateDecryptionKeyPacketData = {
  encode(message: GetPrivateDecryptionKeyPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
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

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrivateDecryptionKeyPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrivateDecryptionKeyPacketData();
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

  fromJSON(object: any): GetPrivateDecryptionKeyPacketData {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      requester: isSet(object.requester) ? String(object.requester) : "",
      secpPubkey: isSet(object.secpPubkey) ? String(object.secpPubkey) : "",
    };
  },

  toJSON(message: GetPrivateDecryptionKeyPacketData): unknown {
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

  create<I extends Exact<DeepPartial<GetPrivateDecryptionKeyPacketData>, I>>(
    base?: I,
  ): GetPrivateDecryptionKeyPacketData {
    return GetPrivateDecryptionKeyPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetPrivateDecryptionKeyPacketData>, I>>(
    object: I,
  ): GetPrivateDecryptionKeyPacketData {
    const message = createBaseGetPrivateDecryptionKeyPacketData();
    message.identity = object.identity ?? "";
    message.requester = object.requester ?? "";
    message.secpPubkey = object.secpPubkey ?? "";
    return message;
  },
};

function createBaseGetPrivateDecryptionKeyPacketAck(): GetPrivateDecryptionKeyPacketAck {
  return {};
}

export const GetPrivateDecryptionKeyPacketAck = {
  encode(_: GetPrivateDecryptionKeyPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPrivateDecryptionKeyPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPrivateDecryptionKeyPacketAck();
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

  fromJSON(_: any): GetPrivateDecryptionKeyPacketAck {
    return {};
  },

  toJSON(_: GetPrivateDecryptionKeyPacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPrivateDecryptionKeyPacketAck>, I>>(
    base?: I,
  ): GetPrivateDecryptionKeyPacketAck {
    return GetPrivateDecryptionKeyPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetPrivateDecryptionKeyPacketAck>, I>>(
    _: I,
  ): GetPrivateDecryptionKeyPacketAck {
    const message = createBaseGetPrivateDecryptionKeyPacketAck();
    return message;
  },
};

function createBaseDecryptionKeyDataPacketData(): DecryptionKeyDataPacketData {
  return { identity: "", pubkey: "", decryptionKey: "", aggrHeight: "", proposalId: "", retries: 0 };
}

export const DecryptionKeyDataPacketData = {
  encode(message: DecryptionKeyDataPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    if (message.decryptionKey !== "") {
      writer.uint32(26).string(message.decryptionKey);
    }
    if (message.aggrHeight !== "") {
      writer.uint32(34).string(message.aggrHeight);
    }
    if (message.proposalId !== "") {
      writer.uint32(42).string(message.proposalId);
    }
    if (message.retries !== 0) {
      writer.uint32(48).uint64(message.retries);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecryptionKeyDataPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecryptionKeyDataPacketData();
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
        case 4:
          if (tag !== 34) {
            break;
          }

          message.aggrHeight = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.proposalId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.retries = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DecryptionKeyDataPacketData {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      decryptionKey: isSet(object.decryptionKey) ? String(object.decryptionKey) : "",
      aggrHeight: isSet(object.aggrHeight) ? String(object.aggrHeight) : "",
      proposalId: isSet(object.proposalId) ? String(object.proposalId) : "",
      retries: isSet(object.retries) ? Number(object.retries) : 0,
    };
  },

  toJSON(message: DecryptionKeyDataPacketData): unknown {
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
    if (message.aggrHeight !== "") {
      obj.aggrHeight = message.aggrHeight;
    }
    if (message.proposalId !== "") {
      obj.proposalId = message.proposalId;
    }
    if (message.retries !== 0) {
      obj.retries = Math.round(message.retries);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DecryptionKeyDataPacketData>, I>>(base?: I): DecryptionKeyDataPacketData {
    return DecryptionKeyDataPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecryptionKeyDataPacketData>, I>>(object: I): DecryptionKeyDataPacketData {
    const message = createBaseDecryptionKeyDataPacketData();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.decryptionKey = object.decryptionKey ?? "";
    message.aggrHeight = object.aggrHeight ?? "";
    message.proposalId = object.proposalId ?? "";
    message.retries = object.retries ?? 0;
    return message;
  },
};

function createBaseDecryptionKeyPacketAck(): DecryptionKeyPacketAck {
  return {};
}

export const DecryptionKeyPacketAck = {
  encode(_: DecryptionKeyPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DecryptionKeyPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDecryptionKeyPacketAck();
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

  fromJSON(_: any): DecryptionKeyPacketAck {
    return {};
  },

  toJSON(_: DecryptionKeyPacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DecryptionKeyPacketAck>, I>>(base?: I): DecryptionKeyPacketAck {
    return DecryptionKeyPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DecryptionKeyPacketAck>, I>>(_: I): DecryptionKeyPacketAck {
    const message = createBaseDecryptionKeyPacketAck();
    return message;
  },
};

function createBasePrivateDecryptionKeyDataPacketData(): PrivateDecryptionKeyDataPacketData {
  return { identity: "", pubkey: "", privateDecryptionKey: [] };
}

export const PrivateDecryptionKeyDataPacketData = {
  encode(message: PrivateDecryptionKeyDataPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.identity !== "") {
      writer.uint32(10).string(message.identity);
    }
    if (message.pubkey !== "") {
      writer.uint32(18).string(message.pubkey);
    }
    for (const v of message.privateDecryptionKey) {
      PrivateDecryptionKey.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PrivateDecryptionKeyDataPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrivateDecryptionKeyDataPacketData();
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
        case 4:
          if (tag !== 34) {
            break;
          }

          message.privateDecryptionKey.push(PrivateDecryptionKey.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PrivateDecryptionKeyDataPacketData {
    return {
      identity: isSet(object.identity) ? String(object.identity) : "",
      pubkey: isSet(object.pubkey) ? String(object.pubkey) : "",
      privateDecryptionKey: Array.isArray(object?.privateDecryptionKey)
        ? object.privateDecryptionKey.map((e: any) => PrivateDecryptionKey.fromJSON(e))
        : [],
    };
  },

  toJSON(message: PrivateDecryptionKeyDataPacketData): unknown {
    const obj: any = {};
    if (message.identity !== "") {
      obj.identity = message.identity;
    }
    if (message.pubkey !== "") {
      obj.pubkey = message.pubkey;
    }
    if (message.privateDecryptionKey?.length) {
      obj.privateDecryptionKey = message.privateDecryptionKey.map((e) => PrivateDecryptionKey.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PrivateDecryptionKeyDataPacketData>, I>>(
    base?: I,
  ): PrivateDecryptionKeyDataPacketData {
    return PrivateDecryptionKeyDataPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PrivateDecryptionKeyDataPacketData>, I>>(
    object: I,
  ): PrivateDecryptionKeyDataPacketData {
    const message = createBasePrivateDecryptionKeyDataPacketData();
    message.identity = object.identity ?? "";
    message.pubkey = object.pubkey ?? "";
    message.privateDecryptionKey = object.privateDecryptionKey?.map((e) => PrivateDecryptionKey.fromPartial(e)) || [];
    return message;
  },
};

function createBasePrivateDecryptionKeyPacketAck(): PrivateDecryptionKeyPacketAck {
  return {};
}

export const PrivateDecryptionKeyPacketAck = {
  encode(_: PrivateDecryptionKeyPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PrivateDecryptionKeyPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePrivateDecryptionKeyPacketAck();
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

  fromJSON(_: any): PrivateDecryptionKeyPacketAck {
    return {};
  },

  toJSON(_: PrivateDecryptionKeyPacketAck): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<PrivateDecryptionKeyPacketAck>, I>>(base?: I): PrivateDecryptionKeyPacketAck {
    return PrivateDecryptionKeyPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PrivateDecryptionKeyPacketAck>, I>>(_: I): PrivateDecryptionKeyPacketAck {
    const message = createBasePrivateDecryptionKeyPacketAck();
    return message;
  },
};

function createBaseCurrentKeysPacketData(): CurrentKeysPacketData {
  return {};
}

export const CurrentKeysPacketData = {
  encode(_: CurrentKeysPacketData, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentKeysPacketData {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentKeysPacketData();
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

  fromJSON(_: any): CurrentKeysPacketData {
    return {};
  },

  toJSON(_: CurrentKeysPacketData): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CurrentKeysPacketData>, I>>(base?: I): CurrentKeysPacketData {
    return CurrentKeysPacketData.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CurrentKeysPacketData>, I>>(_: I): CurrentKeysPacketData {
    const message = createBaseCurrentKeysPacketData();
    return message;
  },
};

function createBaseCurrentKeysPacketAck(): CurrentKeysPacketAck {
  return { activeKey: undefined, queuedKey: undefined };
}

export const CurrentKeysPacketAck = {
  encode(message: CurrentKeysPacketAck, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeKey !== undefined) {
      ActivePublicKey.encode(message.activeKey, writer.uint32(10).fork()).ldelim();
    }
    if (message.queuedKey !== undefined) {
      QueuedPublicKey.encode(message.queuedKey, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CurrentKeysPacketAck {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCurrentKeysPacketAck();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.activeKey = ActivePublicKey.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.queuedKey = QueuedPublicKey.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CurrentKeysPacketAck {
    return {
      activeKey: isSet(object.activeKey) ? ActivePublicKey.fromJSON(object.activeKey) : undefined,
      queuedKey: isSet(object.queuedKey) ? QueuedPublicKey.fromJSON(object.queuedKey) : undefined,
    };
  },

  toJSON(message: CurrentKeysPacketAck): unknown {
    const obj: any = {};
    if (message.activeKey !== undefined) {
      obj.activeKey = ActivePublicKey.toJSON(message.activeKey);
    }
    if (message.queuedKey !== undefined) {
      obj.queuedKey = QueuedPublicKey.toJSON(message.queuedKey);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CurrentKeysPacketAck>, I>>(base?: I): CurrentKeysPacketAck {
    return CurrentKeysPacketAck.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CurrentKeysPacketAck>, I>>(object: I): CurrentKeysPacketAck {
    const message = createBaseCurrentKeysPacketAck();
    message.activeKey = (object.activeKey !== undefined && object.activeKey !== null)
      ? ActivePublicKey.fromPartial(object.activeKey)
      : undefined;
    message.queuedKey = (object.queuedKey !== undefined && object.queuedKey !== null)
      ? QueuedPublicKey.fromPartial(object.queuedKey)
      : undefined;
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
