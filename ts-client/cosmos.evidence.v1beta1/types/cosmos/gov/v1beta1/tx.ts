// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.3.0
//   protoc               unknown
// source: cosmos/gov/v1beta1/tx.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../google/protobuf/any";
import { Coin } from "../../base/v1beta1/coin";
import { VoteOption, voteOptionFromJSON, voteOptionToJSON, WeightedVoteOption } from "./gov";

export const protobufPackage = "cosmos.gov.v1beta1";

/**
 * MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary
 * proposal Content.
 */
export interface MsgSubmitProposal {
  /** content is the proposal's content. */
  content:
    | Any
    | undefined;
  /** initial_deposit is the deposit value that must be paid at proposal submission. */
  initialDeposit: Coin[];
  /** proposer is the account address of the proposer. */
  proposer: string;
}

/** MsgSubmitProposalResponse defines the Msg/SubmitProposal response type. */
export interface MsgSubmitProposalResponse {
  /** proposal_id defines the unique id of the proposal. */
  proposalId: number;
}

/** MsgVote defines a message to cast a vote. */
export interface MsgVote {
  /** proposal_id defines the unique id of the proposal. */
  proposalId: number;
  /** voter is the voter address for the proposal. */
  voter: string;
  /** option defines the vote option. */
  option: VoteOption;
}

/** MsgVoteResponse defines the Msg/Vote response type. */
export interface MsgVoteResponse {
}

/** MsgVoteEncrypted defines a message to cast an encrypted vote. */
export interface MsgVoteEncrypted {
  /** proposal_id defines the unique id of the proposal. */
  proposalId: number;
  /** voter is the voter address for the proposal. */
  voter: string;
  /** encrypted_data defines the encrypted vote option. */
  encryptedData: string;
}

/** MsgVoteResponse defines the Msg/Vote response type. */
export interface MsgVoteEncryptedResponse {
}

/**
 * MsgVoteWeighted defines a message to cast a vote.
 *
 * Since: cosmos-sdk 0.43
 */
export interface MsgVoteWeighted {
  /** proposal_id defines the unique id of the proposal. */
  proposalId: number;
  /** voter is the voter address for the proposal. */
  voter: string;
  /** options defines the weighted vote options. */
  options: WeightedVoteOption[];
}

/**
 * MsgVoteWeightedResponse defines the Msg/VoteWeighted response type.
 *
 * Since: cosmos-sdk 0.43
 */
export interface MsgVoteWeightedResponse {
}

/** MsgDeposit defines a message to submit a deposit to an existing proposal. */
export interface MsgDeposit {
  /** proposal_id defines the unique id of the proposal. */
  proposalId: number;
  /** depositor defines the deposit addresses from the proposals. */
  depositor: string;
  /** amount to be deposited by depositor. */
  amount: Coin[];
}

/** MsgDepositResponse defines the Msg/Deposit response type. */
export interface MsgDepositResponse {
}

function createBaseMsgSubmitProposal(): MsgSubmitProposal {
  return { content: undefined, initialDeposit: [], proposer: "" };
}

export const MsgSubmitProposal: MessageFns<MsgSubmitProposal> = {
  encode(message: MsgSubmitProposal, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.content !== undefined) {
      Any.encode(message.content, writer.uint32(10).fork()).join();
    }
    for (const v of message.initialDeposit) {
      Coin.encode(v!, writer.uint32(18).fork()).join();
    }
    if (message.proposer !== "") {
      writer.uint32(26).string(message.proposer);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgSubmitProposal {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitProposal();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.content = Any.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.initialDeposit.push(Coin.decode(reader, reader.uint32()));
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.proposer = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitProposal {
    return {
      content: isSet(object.content) ? Any.fromJSON(object.content) : undefined,
      initialDeposit: globalThis.Array.isArray(object?.initialDeposit)
        ? object.initialDeposit.map((e: any) => Coin.fromJSON(e))
        : [],
      proposer: isSet(object.proposer) ? globalThis.String(object.proposer) : "",
    };
  },

  toJSON(message: MsgSubmitProposal): unknown {
    const obj: any = {};
    if (message.content !== undefined) {
      obj.content = Any.toJSON(message.content);
    }
    if (message.initialDeposit?.length) {
      obj.initialDeposit = message.initialDeposit.map((e) => Coin.toJSON(e));
    }
    if (message.proposer !== "") {
      obj.proposer = message.proposer;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitProposal>, I>>(base?: I): MsgSubmitProposal {
    return MsgSubmitProposal.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitProposal>, I>>(object: I): MsgSubmitProposal {
    const message = createBaseMsgSubmitProposal();
    message.content = (object.content !== undefined && object.content !== null)
      ? Any.fromPartial(object.content)
      : undefined;
    message.initialDeposit = object.initialDeposit?.map((e) => Coin.fromPartial(e)) || [];
    message.proposer = object.proposer ?? "";
    return message;
  },
};

function createBaseMsgSubmitProposalResponse(): MsgSubmitProposalResponse {
  return { proposalId: 0 };
}

export const MsgSubmitProposalResponse: MessageFns<MsgSubmitProposalResponse> = {
  encode(message: MsgSubmitProposalResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.proposalId !== 0) {
      writer.uint32(8).uint64(message.proposalId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgSubmitProposalResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSubmitProposalResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.proposalId = longToNumber(reader.uint64());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgSubmitProposalResponse {
    return { proposalId: isSet(object.proposalId) ? globalThis.Number(object.proposalId) : 0 };
  },

  toJSON(message: MsgSubmitProposalResponse): unknown {
    const obj: any = {};
    if (message.proposalId !== 0) {
      obj.proposalId = Math.round(message.proposalId);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgSubmitProposalResponse>, I>>(base?: I): MsgSubmitProposalResponse {
    return MsgSubmitProposalResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgSubmitProposalResponse>, I>>(object: I): MsgSubmitProposalResponse {
    const message = createBaseMsgSubmitProposalResponse();
    message.proposalId = object.proposalId ?? 0;
    return message;
  },
};

function createBaseMsgVote(): MsgVote {
  return { proposalId: 0, voter: "", option: 0 };
}

export const MsgVote: MessageFns<MsgVote> = {
  encode(message: MsgVote, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.proposalId !== 0) {
      writer.uint32(8).uint64(message.proposalId);
    }
    if (message.voter !== "") {
      writer.uint32(18).string(message.voter);
    }
    if (message.option !== 0) {
      writer.uint32(24).int32(message.option);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgVote {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVote();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.proposalId = longToNumber(reader.uint64());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.voter = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.option = reader.int32() as any;
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgVote {
    return {
      proposalId: isSet(object.proposalId) ? globalThis.Number(object.proposalId) : 0,
      voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
      option: isSet(object.option) ? voteOptionFromJSON(object.option) : 0,
    };
  },

  toJSON(message: MsgVote): unknown {
    const obj: any = {};
    if (message.proposalId !== 0) {
      obj.proposalId = Math.round(message.proposalId);
    }
    if (message.voter !== "") {
      obj.voter = message.voter;
    }
    if (message.option !== 0) {
      obj.option = voteOptionToJSON(message.option);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVote>, I>>(base?: I): MsgVote {
    return MsgVote.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVote>, I>>(object: I): MsgVote {
    const message = createBaseMsgVote();
    message.proposalId = object.proposalId ?? 0;
    message.voter = object.voter ?? "";
    message.option = object.option ?? 0;
    return message;
  },
};

function createBaseMsgVoteResponse(): MsgVoteResponse {
  return {};
}

export const MsgVoteResponse: MessageFns<MsgVoteResponse> = {
  encode(_: MsgVoteResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgVoteResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVoteResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgVoteResponse {
    return {};
  },

  toJSON(_: MsgVoteResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVoteResponse>, I>>(base?: I): MsgVoteResponse {
    return MsgVoteResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVoteResponse>, I>>(_: I): MsgVoteResponse {
    const message = createBaseMsgVoteResponse();
    return message;
  },
};

function createBaseMsgVoteEncrypted(): MsgVoteEncrypted {
  return { proposalId: 0, voter: "", encryptedData: "" };
}

export const MsgVoteEncrypted: MessageFns<MsgVoteEncrypted> = {
  encode(message: MsgVoteEncrypted, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.proposalId !== 0) {
      writer.uint32(8).uint64(message.proposalId);
    }
    if (message.voter !== "") {
      writer.uint32(18).string(message.voter);
    }
    if (message.encryptedData !== "") {
      writer.uint32(26).string(message.encryptedData);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgVoteEncrypted {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVoteEncrypted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.proposalId = longToNumber(reader.uint64());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.voter = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.encryptedData = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgVoteEncrypted {
    return {
      proposalId: isSet(object.proposalId) ? globalThis.Number(object.proposalId) : 0,
      voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
      encryptedData: isSet(object.encryptedData) ? globalThis.String(object.encryptedData) : "",
    };
  },

  toJSON(message: MsgVoteEncrypted): unknown {
    const obj: any = {};
    if (message.proposalId !== 0) {
      obj.proposalId = Math.round(message.proposalId);
    }
    if (message.voter !== "") {
      obj.voter = message.voter;
    }
    if (message.encryptedData !== "") {
      obj.encryptedData = message.encryptedData;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVoteEncrypted>, I>>(base?: I): MsgVoteEncrypted {
    return MsgVoteEncrypted.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVoteEncrypted>, I>>(object: I): MsgVoteEncrypted {
    const message = createBaseMsgVoteEncrypted();
    message.proposalId = object.proposalId ?? 0;
    message.voter = object.voter ?? "";
    message.encryptedData = object.encryptedData ?? "";
    return message;
  },
};

function createBaseMsgVoteEncryptedResponse(): MsgVoteEncryptedResponse {
  return {};
}

export const MsgVoteEncryptedResponse: MessageFns<MsgVoteEncryptedResponse> = {
  encode(_: MsgVoteEncryptedResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgVoteEncryptedResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVoteEncryptedResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgVoteEncryptedResponse {
    return {};
  },

  toJSON(_: MsgVoteEncryptedResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVoteEncryptedResponse>, I>>(base?: I): MsgVoteEncryptedResponse {
    return MsgVoteEncryptedResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVoteEncryptedResponse>, I>>(_: I): MsgVoteEncryptedResponse {
    const message = createBaseMsgVoteEncryptedResponse();
    return message;
  },
};

function createBaseMsgVoteWeighted(): MsgVoteWeighted {
  return { proposalId: 0, voter: "", options: [] };
}

export const MsgVoteWeighted: MessageFns<MsgVoteWeighted> = {
  encode(message: MsgVoteWeighted, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.proposalId !== 0) {
      writer.uint32(8).uint64(message.proposalId);
    }
    if (message.voter !== "") {
      writer.uint32(18).string(message.voter);
    }
    for (const v of message.options) {
      WeightedVoteOption.encode(v!, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgVoteWeighted {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVoteWeighted();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.proposalId = longToNumber(reader.uint64());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.voter = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.options.push(WeightedVoteOption.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgVoteWeighted {
    return {
      proposalId: isSet(object.proposalId) ? globalThis.Number(object.proposalId) : 0,
      voter: isSet(object.voter) ? globalThis.String(object.voter) : "",
      options: globalThis.Array.isArray(object?.options)
        ? object.options.map((e: any) => WeightedVoteOption.fromJSON(e))
        : [],
    };
  },

  toJSON(message: MsgVoteWeighted): unknown {
    const obj: any = {};
    if (message.proposalId !== 0) {
      obj.proposalId = Math.round(message.proposalId);
    }
    if (message.voter !== "") {
      obj.voter = message.voter;
    }
    if (message.options?.length) {
      obj.options = message.options.map((e) => WeightedVoteOption.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVoteWeighted>, I>>(base?: I): MsgVoteWeighted {
    return MsgVoteWeighted.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVoteWeighted>, I>>(object: I): MsgVoteWeighted {
    const message = createBaseMsgVoteWeighted();
    message.proposalId = object.proposalId ?? 0;
    message.voter = object.voter ?? "";
    message.options = object.options?.map((e) => WeightedVoteOption.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgVoteWeightedResponse(): MsgVoteWeightedResponse {
  return {};
}

export const MsgVoteWeightedResponse: MessageFns<MsgVoteWeightedResponse> = {
  encode(_: MsgVoteWeightedResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgVoteWeightedResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgVoteWeightedResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgVoteWeightedResponse {
    return {};
  },

  toJSON(_: MsgVoteWeightedResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgVoteWeightedResponse>, I>>(base?: I): MsgVoteWeightedResponse {
    return MsgVoteWeightedResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgVoteWeightedResponse>, I>>(_: I): MsgVoteWeightedResponse {
    const message = createBaseMsgVoteWeightedResponse();
    return message;
  },
};

function createBaseMsgDeposit(): MsgDeposit {
  return { proposalId: 0, depositor: "", amount: [] };
}

export const MsgDeposit: MessageFns<MsgDeposit> = {
  encode(message: MsgDeposit, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.proposalId !== 0) {
      writer.uint32(8).uint64(message.proposalId);
    }
    if (message.depositor !== "") {
      writer.uint32(18).string(message.depositor);
    }
    for (const v of message.amount) {
      Coin.encode(v!, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgDeposit {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeposit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.proposalId = longToNumber(reader.uint64());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.depositor = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.amount.push(Coin.decode(reader, reader.uint32()));
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgDeposit {
    return {
      proposalId: isSet(object.proposalId) ? globalThis.Number(object.proposalId) : 0,
      depositor: isSet(object.depositor) ? globalThis.String(object.depositor) : "",
      amount: globalThis.Array.isArray(object?.amount) ? object.amount.map((e: any) => Coin.fromJSON(e)) : [],
    };
  },

  toJSON(message: MsgDeposit): unknown {
    const obj: any = {};
    if (message.proposalId !== 0) {
      obj.proposalId = Math.round(message.proposalId);
    }
    if (message.depositor !== "") {
      obj.depositor = message.depositor;
    }
    if (message.amount?.length) {
      obj.amount = message.amount.map((e) => Coin.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDeposit>, I>>(base?: I): MsgDeposit {
    return MsgDeposit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDeposit>, I>>(object: I): MsgDeposit {
    const message = createBaseMsgDeposit();
    message.proposalId = object.proposalId ?? 0;
    message.depositor = object.depositor ?? "";
    message.amount = object.amount?.map((e) => Coin.fromPartial(e)) || [];
    return message;
  },
};

function createBaseMsgDepositResponse(): MsgDepositResponse {
  return {};
}

export const MsgDepositResponse: MessageFns<MsgDepositResponse> = {
  encode(_: MsgDepositResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgDepositResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDepositResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgDepositResponse {
    return {};
  },

  toJSON(_: MsgDepositResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgDepositResponse>, I>>(base?: I): MsgDepositResponse {
    return MsgDepositResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgDepositResponse>, I>>(_: I): MsgDepositResponse {
    const message = createBaseMsgDepositResponse();
    return message;
  },
};

/** Msg defines the gov Msg service. */
export interface Msg {
  /** SubmitProposal defines a method to create new proposal given a content. */
  SubmitProposal(request: MsgSubmitProposal): Promise<MsgSubmitProposalResponse>;
  /** Vote defines a method to add a vote on a specific proposal. */
  Vote(request: MsgVote): Promise<MsgVoteResponse>;
  /** VoteEncrypted defines a method to add an encrypted vote on a specific proposal. */
  VoteEncrypted(request: MsgVoteEncrypted): Promise<MsgVoteEncryptedResponse>;
  /**
   * VoteWeighted defines a method to add a weighted vote on a specific proposal.
   *
   * Since: cosmos-sdk 0.43
   */
  VoteWeighted(request: MsgVoteWeighted): Promise<MsgVoteWeightedResponse>;
  /** Deposit defines a method to add deposit on a specific proposal. */
  Deposit(request: MsgDeposit): Promise<MsgDepositResponse>;
}

export const MsgServiceName = "cosmos.gov.v1beta1.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.SubmitProposal = this.SubmitProposal.bind(this);
    this.Vote = this.Vote.bind(this);
    this.VoteEncrypted = this.VoteEncrypted.bind(this);
    this.VoteWeighted = this.VoteWeighted.bind(this);
    this.Deposit = this.Deposit.bind(this);
  }
  SubmitProposal(request: MsgSubmitProposal): Promise<MsgSubmitProposalResponse> {
    const data = MsgSubmitProposal.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitProposal", data);
    return promise.then((data) => MsgSubmitProposalResponse.decode(new BinaryReader(data)));
  }

  Vote(request: MsgVote): Promise<MsgVoteResponse> {
    const data = MsgVote.encode(request).finish();
    const promise = this.rpc.request(this.service, "Vote", data);
    return promise.then((data) => MsgVoteResponse.decode(new BinaryReader(data)));
  }

  VoteEncrypted(request: MsgVoteEncrypted): Promise<MsgVoteEncryptedResponse> {
    const data = MsgVoteEncrypted.encode(request).finish();
    const promise = this.rpc.request(this.service, "VoteEncrypted", data);
    return promise.then((data) => MsgVoteEncryptedResponse.decode(new BinaryReader(data)));
  }

  VoteWeighted(request: MsgVoteWeighted): Promise<MsgVoteWeightedResponse> {
    const data = MsgVoteWeighted.encode(request).finish();
    const promise = this.rpc.request(this.service, "VoteWeighted", data);
    return promise.then((data) => MsgVoteWeightedResponse.decode(new BinaryReader(data)));
  }

  Deposit(request: MsgDeposit): Promise<MsgDepositResponse> {
    const data = MsgDeposit.encode(request).finish();
    const promise = this.rpc.request(this.service, "Deposit", data);
    return promise.then((data) => MsgDepositResponse.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
