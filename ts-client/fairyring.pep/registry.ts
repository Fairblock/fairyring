import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    
];

export { msgTypes }