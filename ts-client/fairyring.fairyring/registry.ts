import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgRegisterValidator } from "./types/fairyring/fairyring/tx";
import { MsgSendKeyshare } from "./types/fairyring/fairyring/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.fairyring.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.fairyring.MsgSendKeyshare", MsgSendKeyshare],
    
];

export { msgTypes }