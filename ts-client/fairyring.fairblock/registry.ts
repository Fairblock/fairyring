import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSubmitEncryptedTx } from "./types/fairyring/fairblock/tx";
import { MsgSendCurrentHeight } from "./types/fairyring/fairblock/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.fairblock.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.fairblock.MsgSendCurrentHeight", MsgSendCurrentHeight],
    
];

export { msgTypes }