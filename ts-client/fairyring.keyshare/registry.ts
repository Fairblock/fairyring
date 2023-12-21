import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgDeleteGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgUpdateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.MsgDeleteGeneralKeyShare", MsgDeleteGeneralKeyShare],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.MsgUpdateGeneralKeyShare", MsgUpdateGeneralKeyShare],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    
];

export { msgTypes }