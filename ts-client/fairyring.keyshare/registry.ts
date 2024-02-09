import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    
];

export { msgTypes }