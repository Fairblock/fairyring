import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParamsResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound1Response } from "./types/fairyring/ckks/tx";
import { MsgSubmitShamirShareResponse } from "./types/fairyring/ckks/tx";
import { QueryParamsResponse } from "./types/fairyring/ckks/query";
import { MsgSubmitPkgShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound1 } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2Response } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShare } from "./types/fairyring/ckks/tx";
import { MsgUpdateParams } from "./types/fairyring/ckks/tx";
import { MsgSubmitShamirShare } from "./types/fairyring/ckks/tx";
import { MsgSubmitPkgShare } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShareResponse } from "./types/fairyring/ckks/tx";
import { GenesisState } from "./types/fairyring/ckks/genesis";
import { MsgSubmitRkgShareRound2 } from "./types/fairyring/ckks/tx";
import { QueryParamsRequest } from "./types/fairyring/ckks/query";
import { Params } from "./types/fairyring/ckks/params";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.ckks.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1Response", MsgSubmitRkgShareRound1Response],
    ["/fairyring.ckks.MsgSubmitShamirShareResponse", MsgSubmitShamirShareResponse],
    ["/fairyring.ckks.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.ckks.MsgSubmitPkgShareResponse", MsgSubmitPkgShareResponse],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1", MsgSubmitRkgShareRound1],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2Response", MsgSubmitRkgShareRound2Response],
    ["/fairyring.ckks.MsgSubmitGkgShare", MsgSubmitGkgShare],
    ["/fairyring.ckks.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.ckks.MsgSubmitShamirShare", MsgSubmitShamirShare],
    ["/fairyring.ckks.MsgSubmitPkgShare", MsgSubmitPkgShare],
    ["/fairyring.ckks.MsgSubmitGkgShareResponse", MsgSubmitGkgShareResponse],
    ["/fairyring.ckks.GenesisState", GenesisState],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2", MsgSubmitRkgShareRound2],
    ["/fairyring.ckks.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.ckks.Params", Params],
    
];

export { msgTypes }