import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryCurrentPlanRequest } from "./types/cosmos/upgrade/v1beta1/query";
import { QueryUpgradedConsensusStateResponse } from "./types/cosmos/upgrade/v1beta1/query";
import { QueryModuleVersionsRequest } from "./types/cosmos/upgrade/v1beta1/query";
import { MsgCancelUpgradeResponse } from "./types/cosmos/upgrade/v1beta1/tx";
import { ModuleVersion } from "./types/cosmos/upgrade/v1beta1/upgrade";
import { QueryAppliedPlanRequest } from "./types/cosmos/upgrade/v1beta1/query";
import { QueryModuleVersionsResponse } from "./types/cosmos/upgrade/v1beta1/query";
import { CancelSoftwareUpgradeProposal } from "./types/cosmos/upgrade/v1beta1/upgrade";
import { Plan } from "./types/cosmos/upgrade/v1beta1/upgrade";
import { QueryUpgradedConsensusStateRequest } from "./types/cosmos/upgrade/v1beta1/query";
import { QueryAuthorityRequest } from "./types/cosmos/upgrade/v1beta1/query";
import { MsgSoftwareUpgrade } from "./types/cosmos/upgrade/v1beta1/tx";
import { QueryCurrentPlanResponse } from "./types/cosmos/upgrade/v1beta1/query";
import { QueryAppliedPlanResponse } from "./types/cosmos/upgrade/v1beta1/query";
import { QueryAuthorityResponse } from "./types/cosmos/upgrade/v1beta1/query";
import { SoftwareUpgradeProposal } from "./types/cosmos/upgrade/v1beta1/upgrade";
import { MsgSoftwareUpgradeResponse } from "./types/cosmos/upgrade/v1beta1/tx";
import { MsgCancelUpgrade } from "./types/cosmos/upgrade/v1beta1/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmos.upgrade.v1beta1.QueryCurrentPlanRequest", QueryCurrentPlanRequest],
    ["/cosmos.upgrade.v1beta1.QueryUpgradedConsensusStateResponse", QueryUpgradedConsensusStateResponse],
    ["/cosmos.upgrade.v1beta1.QueryModuleVersionsRequest", QueryModuleVersionsRequest],
    ["/cosmos.upgrade.v1beta1.MsgCancelUpgradeResponse", MsgCancelUpgradeResponse],
    ["/cosmos.upgrade.v1beta1.ModuleVersion", ModuleVersion],
    ["/cosmos.upgrade.v1beta1.QueryAppliedPlanRequest", QueryAppliedPlanRequest],
    ["/cosmos.upgrade.v1beta1.QueryModuleVersionsResponse", QueryModuleVersionsResponse],
    ["/cosmos.upgrade.v1beta1.CancelSoftwareUpgradeProposal", CancelSoftwareUpgradeProposal],
    ["/cosmos.upgrade.v1beta1.Plan", Plan],
    ["/cosmos.upgrade.v1beta1.QueryUpgradedConsensusStateRequest", QueryUpgradedConsensusStateRequest],
    ["/cosmos.upgrade.v1beta1.QueryAuthorityRequest", QueryAuthorityRequest],
    ["/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade", MsgSoftwareUpgrade],
    ["/cosmos.upgrade.v1beta1.QueryCurrentPlanResponse", QueryCurrentPlanResponse],
    ["/cosmos.upgrade.v1beta1.QueryAppliedPlanResponse", QueryAppliedPlanResponse],
    ["/cosmos.upgrade.v1beta1.QueryAuthorityResponse", QueryAuthorityResponse],
    ["/cosmos.upgrade.v1beta1.SoftwareUpgradeProposal", SoftwareUpgradeProposal],
    ["/cosmos.upgrade.v1beta1.MsgSoftwareUpgradeResponse", MsgSoftwareUpgradeResponse],
    ["/cosmos.upgrade.v1beta1.MsgCancelUpgrade", MsgCancelUpgrade],
    
];

export { msgTypes }