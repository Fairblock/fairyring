import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    
];

export { msgTypes }