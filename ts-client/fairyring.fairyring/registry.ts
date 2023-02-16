import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSendKeyshare } from "./types/fairyring/fairyring/tx";
import { MsgRegisterValidator } from "./types/fairyring/fairyring/tx";
import { MsgDeletePubKeyID } from "./types/fairyring/fairyring/tx";
import { MsgUpdatePubKeyID } from "./types/fairyring/fairyring/tx";
import { MsgCreatePubKeyID } from "./types/fairyring/fairyring/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.fairyring.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.fairyring.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.fairyring.MsgDeletePubKeyID", MsgDeletePubKeyID],
    ["/fairyring.fairyring.MsgUpdatePubKeyID", MsgUpdatePubKeyID],
    ["/fairyring.fairyring.MsgCreatePubKeyID", MsgCreatePubKeyID],
    
];

export { msgTypes }