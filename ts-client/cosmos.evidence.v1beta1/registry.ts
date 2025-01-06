import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryAllEvidenceRequest } from "./types/cosmos/evidence/v1beta1/query";
import { GenesisState } from "./types/cosmos/evidence/v1beta1/genesis";
import { Equivocation } from "./types/cosmos/evidence/v1beta1/evidence";
import { QueryAllEvidenceResponse } from "./types/cosmos/evidence/v1beta1/query";
import { QueryEvidenceResponse } from "./types/cosmos/evidence/v1beta1/query";
import { QueryEvidenceRequest } from "./types/cosmos/evidence/v1beta1/query";
import { MsgSubmitEvidenceResponse } from "./types/cosmos/evidence/v1beta1/tx";
import { MsgSubmitEvidence } from "./types/cosmos/evidence/v1beta1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.evidence.v1beta1.QueryAllEvidenceRequest", QueryAllEvidenceRequest],
    ["/cosmos.evidence.v1beta1.GenesisState", GenesisState],
    ["/cosmos.evidence.v1beta1.Equivocation", Equivocation],
    ["/cosmos.evidence.v1beta1.QueryAllEvidenceResponse", QueryAllEvidenceResponse],
    ["/cosmos.evidence.v1beta1.QueryEvidenceResponse", QueryEvidenceResponse],
    ["/cosmos.evidence.v1beta1.QueryEvidenceRequest", QueryEvidenceRequest],
    ["/cosmos.evidence.v1beta1.MsgSubmitEvidenceResponse", MsgSubmitEvidenceResponse],
    ["/cosmos.evidence.v1beta1.MsgSubmitEvidence", MsgSubmitEvidence],
    
];

export { msgTypes }