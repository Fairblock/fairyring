// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.0
//   protoc               unknown
// source: tendermint/version/types.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "tendermint.version";

/**
 * App includes the protocol and software version for the application.
 * This information is included in ResponseInfo. The App.Protocol can be
 * updated in ResponseEndBlock.
 */
export interface App {
  protocol: number;
  software: string;
}

/**
 * Consensus captures the consensus rules for processing a block in the blockchain,
 * including all blockchain data structures and the rules of the application's
 * state transition machine.
 */
export interface Consensus {
  block: number;
  app: number;
}

function createBaseApp(): App {
  return { protocol: 0, software: "" };
}

export const App: MessageFns<App> = {
  encode(message: App, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.protocol !== 0) {
      writer.uint32(8).uint64(message.protocol);
    }
    if (message.software !== "") {
      writer.uint32(18).string(message.software);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): App {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseApp();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.protocol = longToNumber(reader.uint64());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.software = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): App {
    return {
      protocol: isSet(object.protocol) ? globalThis.Number(object.protocol) : 0,
      software: isSet(object.software) ? globalThis.String(object.software) : "",
    };
  },

  toJSON(message: App): unknown {
    const obj: any = {};
    if (message.protocol !== 0) {
      obj.protocol = Math.round(message.protocol);
    }
    if (message.software !== "") {
      obj.software = message.software;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<App>, I>>(base?: I): App {
    return App.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<App>, I>>(object: I): App {
    const message = createBaseApp();
    message.protocol = object.protocol ?? 0;
    message.software = object.software ?? "";
    return message;
  },
};

function createBaseConsensus(): Consensus {
  return { block: 0, app: 0 };
}

export const Consensus: MessageFns<Consensus> = {
  encode(message: Consensus, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.block !== 0) {
      writer.uint32(8).uint64(message.block);
    }
    if (message.app !== 0) {
      writer.uint32(16).uint64(message.app);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Consensus {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsensus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.block = longToNumber(reader.uint64());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.app = longToNumber(reader.uint64());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Consensus {
    return {
      block: isSet(object.block) ? globalThis.Number(object.block) : 0,
      app: isSet(object.app) ? globalThis.Number(object.app) : 0,
    };
  },

  toJSON(message: Consensus): unknown {
    const obj: any = {};
    if (message.block !== 0) {
      obj.block = Math.round(message.block);
    }
    if (message.app !== 0) {
      obj.app = Math.round(message.app);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Consensus>, I>>(base?: I): Consensus {
    return Consensus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Consensus>, I>>(object: I): Consensus {
    const message = createBaseConsensus();
    message.block = object.block ?? 0;
    message.app = object.app ?? 0;
    return message;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
