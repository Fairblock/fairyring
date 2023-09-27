import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgSendAggrKeyshareData } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgSendAggrKeyshareData", MsgSendAggrKeyshareData],
    
];

export { msgTypes }