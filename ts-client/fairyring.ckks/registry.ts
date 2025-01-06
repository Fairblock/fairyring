import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsRequest } from "./types/fairyring/ckks/query";
import { MsgSubmitRkgShareRound1Response } from "./types/fairyring/ckks/tx";
import { MsgUpdateParamsResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitPkgShare } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2 } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShareResponse } from "./types/fairyring/ckks/tx";
import { QueryParamsResponse } from "./types/fairyring/ckks/query";
import { GenesisState } from "./types/fairyring/ckks/genesis";
import { MsgUpdateParams } from "./types/fairyring/ckks/tx";
import { MsgSubmitPkgShareResponse } from "./types/fairyring/ckks/tx";
import { MsgSubmitGkgShare } from "./types/fairyring/ckks/tx";
import { Params } from "./types/fairyring/ckks/params";
import { MsgSubmitRkgShareRound1 } from "./types/fairyring/ckks/tx";
import { MsgSubmitRkgShareRound2Response } from "./types/fairyring/ckks/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.ckks.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1Response", MsgSubmitRkgShareRound1Response],
    ["/fairyring.ckks.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.ckks.MsgSubmitPkgShare", MsgSubmitPkgShare],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2", MsgSubmitRkgShareRound2],
    ["/fairyring.ckks.MsgSubmitGkgShareResponse", MsgSubmitGkgShareResponse],
    ["/fairyring.ckks.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.ckks.GenesisState", GenesisState],
    ["/fairyring.ckks.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.ckks.MsgSubmitPkgShareResponse", MsgSubmitPkgShareResponse],
    ["/fairyring.ckks.MsgSubmitGkgShare", MsgSubmitGkgShare],
    ["/fairyring.ckks.Params", Params],
    ["/fairyring.ckks.MsgSubmitRkgShareRound1", MsgSubmitRkgShareRound1],
    ["/fairyring.ckks.MsgSubmitRkgShareRound2Response", MsgSubmitRkgShareRound2Response],
    
];

export { msgTypes }