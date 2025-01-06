import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParamsResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitShamirShare } from "./types/fairyring/ckks/tx";
import { QueryParamsRequest } from "./types/fairyring/ckks/query";
import { QueryAggregatedRkgr1Response } from "./types/fairyring/ckks/query";
import { GenesisState } from "./types/fairyring/ckks/genesis";
import { MsgSubmitRkgShareRound1 } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShare } from "./types/fairyring/ckks/tx";
import { QueryParamsResponse } from "./types/fairyring/ckks/query";
import { MsgSubmitPkgShare } from "./types/fairyring/ckks/tx";
import { MsgUpdateParams } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound1Response } from "./types/fairyring/ckks/tx";
import { MsgSubmitShamirShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShareResponse } from "./types/fairyring/ckks/tx";
import { QueryAggregatedRkgr1Request } from "./types/fairyring/ckks/query";
import { Params } from "./types/fairyring/ckks/params";
import { MsgSubmitPkgShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2 } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2Response } from "./types/fairyring/ckks/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.ckks.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.ckks.MsgSubmitShamirShare", MsgSubmitShamirShare],
    ["/fairyring.ckks.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.ckks.QueryAggregatedRkgr1Response", QueryAggregatedRkgr1Response],
    ["/fairyring.ckks.GenesisState", GenesisState],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1", MsgSubmitRkgShareRound1],
    ["/fairyring.ckks.MsgSubmitGkgShare", MsgSubmitGkgShare],
    ["/fairyring.ckks.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.ckks.MsgSubmitPkgShare", MsgSubmitPkgShare],
    ["/fairyring.ckks.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1Response", MsgSubmitRkgShareRound1Response],
    ["/fairyring.ckks.MsgSubmitShamirShareResponse", MsgSubmitShamirShareResponse],
    ["/fairyring.ckks.MsgSubmitGkgShareResponse", MsgSubmitGkgShareResponse],
    ["/fairyring.ckks.QueryAggregatedRkgr1Request", QueryAggregatedRkgr1Request],
    ["/fairyring.ckks.Params", Params],
    ["/fairyring.ckks.MsgSubmitPkgShareResponse", MsgSubmitPkgShareResponse],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2", MsgSubmitRkgShareRound2],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2Response", MsgSubmitRkgShareRound2Response],
    
];

export { msgTypes }