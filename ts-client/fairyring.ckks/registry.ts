import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsRequest } from "./types/fairyring/ckks/query";
import { QueryParamsResponse } from "./types/fairyring/ckks/query";
import { Params } from "./types/fairyring/ckks/params";
import { MsgUpdateParamsResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound1Response } from "./types/fairyring/ckks/tx";
import { MsgUpdateParams } from "./types/fairyring/ckks/tx";
import { MsgSubmitPkgShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2Response } from "./types/fairyring/ckks/tx";
import { MsgKeySwitchRequest } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitShamirShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitShamirShare } from "./types/fairyring/ckks/tx";
import { GenesisState } from "./types/fairyring/ckks/genesis";
import { QueryAggregatedRkgr1Response } from "./types/fairyring/ckks/query";
import { QueryAggregatedRkgr1Request } from "./types/fairyring/ckks/query";
import { MsgSubmitGkgShare } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound1 } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2 } from "./types/fairyring/ckks/tx";
import { MsgSubmitPkgShare } from "./types/fairyring/ckks/tx";
import { MsgKeySwitchRequestResponse } from "./types/fairyring/ckks/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.ckks.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.ckks.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.ckks.Params", Params],
    ["/fairyring.ckks.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1Response", MsgSubmitRkgShareRound1Response],
    ["/fairyring.ckks.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.ckks.MsgSubmitPkgShareResponse", MsgSubmitPkgShareResponse],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2Response", MsgSubmitRkgShareRound2Response],
    ["/fairyring.ckks.MsgKeySwitchRequest", MsgKeySwitchRequest],
    ["/fairyring.ckks.MsgSubmitGkgShareResponse", MsgSubmitGkgShareResponse],
    ["/fairyring.ckks.MsgSubmitShamirShareResponse", MsgSubmitShamirShareResponse],
    ["/fairyring.ckks.MsgSubmitShamirShare", MsgSubmitShamirShare],
    ["/fairyring.ckks.GenesisState", GenesisState],
    ["/fairyring.ckks.QueryAggregatedRkgr1Response", QueryAggregatedRkgr1Response],
    ["/fairyring.ckks.QueryAggregatedRkgr1Request", QueryAggregatedRkgr1Request],
    ["/fairyring.ckks.MsgSubmitGkgShare", MsgSubmitGkgShare],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1", MsgSubmitRkgShareRound1],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2", MsgSubmitRkgShareRound2],
    ["/fairyring.ckks.MsgSubmitPkgShare", MsgSubmitPkgShare],
    ["/fairyring.ckks.MsgKeySwitchRequestResponse", MsgKeySwitchRequestResponse],
    
];

export { msgTypes }