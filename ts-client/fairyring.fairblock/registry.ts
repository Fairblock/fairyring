import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSendCurrentHeight } from "./types/fairyring/fairblock/tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/fairblock/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/fairblock/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.fairblock.MsgSendCurrentHeight", MsgSendCurrentHeight],
    ["/fairyring.fairblock.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.fairblock.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    
];

export { msgTypes }