import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSubmitEncryptedTx } from "./types/fairyring/fairblock/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/fairblock/tx";
import { MsgUpdateAggregatedKeyShare } from "./types/fairyring/fairblock/tx";
import { MsgDeleteAggregatedKeyShare } from "./types/fairyring/fairblock/tx";
import { MsgSendCurrentHeight } from "./types/fairyring/fairblock/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.fairblock.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.fairblock.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.fairblock.MsgUpdateAggregatedKeyShare", MsgUpdateAggregatedKeyShare],
    ["/fairyring.fairblock.MsgDeleteAggregatedKeyShare", MsgDeleteAggregatedKeyShare],
    ["/fairyring.fairblock.MsgSendCurrentHeight", MsgSendCurrentHeight],
    
];

export { msgTypes }