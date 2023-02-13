import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgRegisterHeight } from "./types/fairyring/fairblock/tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/fairblock/tx";
import { MsgSendCurrentHeight } from "./types/fairyring/fairblock/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.fairblock.MsgRegisterHeight", MsgRegisterHeight],
    ["/fairyring.fairblock.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.fairblock.MsgSendCurrentHeight", MsgSendCurrentHeight],
    
];

export { msgTypes }