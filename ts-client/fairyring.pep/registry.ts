import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    
];

export { msgTypes }