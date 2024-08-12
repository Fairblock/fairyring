import { GeneratedType } from "@cosmjs/proto-signing";
import { InstantiateContractProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { UpdateAdminProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { GenesisState } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/genesis";
import { CombinedLimit } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { MsgIBCSend } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/ibc";
import { QueryParamsRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgStoreCode } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { ContractExecutionAuthorization } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { ContractGrant } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { ContractMigrationAuthorization } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { MsgStoreAndMigrateContract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { CodeGrant } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { CodeInfoResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { QueryPinnedCodesRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { QueryContractsByCreatorRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { QueryBuildAddressRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgUpdateInstantiateConfigResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { StoreCodeProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { PinCodesProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { QueryContractsByCodeResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { Sequence } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/genesis";
import { QueryContractsByCreatorResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgUpdateAdmin } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MaxCallsLimit } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { QueryBuildAddressResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { QueryRawContractStateResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { UnpinCodesProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { QueryContractInfoResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgStoreAndInstantiateContract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgUpdateContractLabel } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { StoreAndInstantiateContractProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { QueryContractHistoryRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgUnpinCodes } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgInstantiateContractResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QueryRawContractStateRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { Params } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { ExecuteContractProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { MsgAddCodeUploadParamsAddressesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QueryCodesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgPinCodesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QueryContractInfoRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgClearAdmin } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgStoreAndInstantiateContractResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgRemoveCodeUploadParamsAddressesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MaxFundsLimit } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { QuerySmartContractStateResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { AllowAllMessagesFilter } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { MsgExecuteContractResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgUpdateParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgSudoContract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MigrateContractProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { UpdateInstantiateConfigProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { AccessConfigUpdate } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { MsgIBCSendResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/ibc";
import { MsgMigrateContractResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgStoreAndMigrateContractResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgUpdateContractLabelResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { Contract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/genesis";
import { MsgIBCCloseChannel } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/ibc";
import { AccessTypeParam } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { AcceptedMessagesFilter } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { QueryAllContractStateResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgStoreCodeResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgExecuteContract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgUpdateAdminResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { AcceptedMessageKeysFilter } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { QueryParamsResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { ContractInfo } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { QueryContractHistoryResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { ContractCodeHistoryEntry } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { AbsoluteTxPosition } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { Model } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { MsgUpdateInstantiateConfig } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgUpdateParams } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgAddCodeUploadParamsAddresses } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { Code } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/genesis";
import { QueryContractsByCodeRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgMigrateContract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgClearAdminResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { MsgSudoContractResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { SudoContractProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { MsgInstantiateContract2Response } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { CodeInfo } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { QueryAllContractStateRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgInstantiateContract2 } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { InstantiateContract2Proposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { MsgInstantiateContract } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QueryCodeRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgPinCodes } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QuerySmartContractStateRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { StoreCodeAuthorization } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/authz";
import { ClearAdminProposal } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/proposal_legacy";
import { MsgUnpinCodesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QueryCodesRequest } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { AccessConfig } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/types";
import { QueryCodeResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";
import { MsgRemoveCodeUploadParamsAddresses } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/tx";
import { QueryPinnedCodesResponse } from "./types/../../../go/pkg/mod/github.com/!fairblock/wasmd@v0.50.6-fairyring/proto/cosmwasm/wasm/v1/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/cosmwasm.wasm.v1.InstantiateContractProposal", InstantiateContractProposal],
    ["/cosmwasm.wasm.v1.UpdateAdminProposal", UpdateAdminProposal],
    ["/cosmwasm.wasm.v1.GenesisState", GenesisState],
    ["/cosmwasm.wasm.v1.CombinedLimit", CombinedLimit],
    ["/cosmwasm.wasm.v1.MsgIBCSend", MsgIBCSend],
    ["/cosmwasm.wasm.v1.QueryParamsRequest", QueryParamsRequest],
    ["/cosmwasm.wasm.v1.MsgStoreCode", MsgStoreCode],
    ["/cosmwasm.wasm.v1.ContractExecutionAuthorization", ContractExecutionAuthorization],
    ["/cosmwasm.wasm.v1.ContractGrant", ContractGrant],
    ["/cosmwasm.wasm.v1.ContractMigrationAuthorization", ContractMigrationAuthorization],
    ["/cosmwasm.wasm.v1.MsgStoreAndMigrateContract", MsgStoreAndMigrateContract],
    ["/cosmwasm.wasm.v1.CodeGrant", CodeGrant],
    ["/cosmwasm.wasm.v1.CodeInfoResponse", CodeInfoResponse],
    ["/cosmwasm.wasm.v1.QueryPinnedCodesRequest", QueryPinnedCodesRequest],
    ["/cosmwasm.wasm.v1.QueryContractsByCreatorRequest", QueryContractsByCreatorRequest],
    ["/cosmwasm.wasm.v1.QueryBuildAddressRequest", QueryBuildAddressRequest],
    ["/cosmwasm.wasm.v1.MsgUpdateInstantiateConfigResponse", MsgUpdateInstantiateConfigResponse],
    ["/cosmwasm.wasm.v1.StoreCodeProposal", StoreCodeProposal],
    ["/cosmwasm.wasm.v1.PinCodesProposal", PinCodesProposal],
    ["/cosmwasm.wasm.v1.QueryContractsByCodeResponse", QueryContractsByCodeResponse],
    ["/cosmwasm.wasm.v1.Sequence", Sequence],
    ["/cosmwasm.wasm.v1.QueryContractsByCreatorResponse", QueryContractsByCreatorResponse],
    ["/cosmwasm.wasm.v1.MsgUpdateAdmin", MsgUpdateAdmin],
    ["/cosmwasm.wasm.v1.MaxCallsLimit", MaxCallsLimit],
    ["/cosmwasm.wasm.v1.QueryBuildAddressResponse", QueryBuildAddressResponse],
    ["/cosmwasm.wasm.v1.QueryRawContractStateResponse", QueryRawContractStateResponse],
    ["/cosmwasm.wasm.v1.UnpinCodesProposal", UnpinCodesProposal],
    ["/cosmwasm.wasm.v1.QueryContractInfoResponse", QueryContractInfoResponse],
    ["/cosmwasm.wasm.v1.MsgStoreAndInstantiateContract", MsgStoreAndInstantiateContract],
    ["/cosmwasm.wasm.v1.MsgUpdateContractLabel", MsgUpdateContractLabel],
    ["/cosmwasm.wasm.v1.StoreAndInstantiateContractProposal", StoreAndInstantiateContractProposal],
    ["/cosmwasm.wasm.v1.QueryContractHistoryRequest", QueryContractHistoryRequest],
    ["/cosmwasm.wasm.v1.MsgUnpinCodes", MsgUnpinCodes],
    ["/cosmwasm.wasm.v1.MsgInstantiateContractResponse", MsgInstantiateContractResponse],
    ["/cosmwasm.wasm.v1.QueryRawContractStateRequest", QueryRawContractStateRequest],
    ["/cosmwasm.wasm.v1.Params", Params],
    ["/cosmwasm.wasm.v1.ExecuteContractProposal", ExecuteContractProposal],
    ["/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddressesResponse", MsgAddCodeUploadParamsAddressesResponse],
    ["/cosmwasm.wasm.v1.QueryCodesResponse", QueryCodesResponse],
    ["/cosmwasm.wasm.v1.MsgPinCodesResponse", MsgPinCodesResponse],
    ["/cosmwasm.wasm.v1.QueryContractInfoRequest", QueryContractInfoRequest],
    ["/cosmwasm.wasm.v1.MsgClearAdmin", MsgClearAdmin],
    ["/cosmwasm.wasm.v1.MsgStoreAndInstantiateContractResponse", MsgStoreAndInstantiateContractResponse],
    ["/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddressesResponse", MsgRemoveCodeUploadParamsAddressesResponse],
    ["/cosmwasm.wasm.v1.MaxFundsLimit", MaxFundsLimit],
    ["/cosmwasm.wasm.v1.QuerySmartContractStateResponse", QuerySmartContractStateResponse],
    ["/cosmwasm.wasm.v1.AllowAllMessagesFilter", AllowAllMessagesFilter],
    ["/cosmwasm.wasm.v1.MsgExecuteContractResponse", MsgExecuteContractResponse],
    ["/cosmwasm.wasm.v1.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/cosmwasm.wasm.v1.MsgSudoContract", MsgSudoContract],
    ["/cosmwasm.wasm.v1.MigrateContractProposal", MigrateContractProposal],
    ["/cosmwasm.wasm.v1.UpdateInstantiateConfigProposal", UpdateInstantiateConfigProposal],
    ["/cosmwasm.wasm.v1.AccessConfigUpdate", AccessConfigUpdate],
    ["/cosmwasm.wasm.v1.MsgIBCSendResponse", MsgIBCSendResponse],
    ["/cosmwasm.wasm.v1.MsgMigrateContractResponse", MsgMigrateContractResponse],
    ["/cosmwasm.wasm.v1.MsgStoreAndMigrateContractResponse", MsgStoreAndMigrateContractResponse],
    ["/cosmwasm.wasm.v1.MsgUpdateContractLabelResponse", MsgUpdateContractLabelResponse],
    ["/cosmwasm.wasm.v1.Contract", Contract],
    ["/cosmwasm.wasm.v1.MsgIBCCloseChannel", MsgIBCCloseChannel],
    ["/cosmwasm.wasm.v1.AccessTypeParam", AccessTypeParam],
    ["/cosmwasm.wasm.v1.AcceptedMessagesFilter", AcceptedMessagesFilter],
    ["/cosmwasm.wasm.v1.QueryAllContractStateResponse", QueryAllContractStateResponse],
    ["/cosmwasm.wasm.v1.MsgStoreCodeResponse", MsgStoreCodeResponse],
    ["/cosmwasm.wasm.v1.MsgExecuteContract", MsgExecuteContract],
    ["/cosmwasm.wasm.v1.MsgUpdateAdminResponse", MsgUpdateAdminResponse],
    ["/cosmwasm.wasm.v1.AcceptedMessageKeysFilter", AcceptedMessageKeysFilter],
    ["/cosmwasm.wasm.v1.QueryParamsResponse", QueryParamsResponse],
    ["/cosmwasm.wasm.v1.ContractInfo", ContractInfo],
    ["/cosmwasm.wasm.v1.QueryContractHistoryResponse", QueryContractHistoryResponse],
    ["/cosmwasm.wasm.v1.ContractCodeHistoryEntry", ContractCodeHistoryEntry],
    ["/cosmwasm.wasm.v1.AbsoluteTxPosition", AbsoluteTxPosition],
    ["/cosmwasm.wasm.v1.Model", Model],
    ["/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig", MsgUpdateInstantiateConfig],
    ["/cosmwasm.wasm.v1.MsgUpdateParams", MsgUpdateParams],
    ["/cosmwasm.wasm.v1.MsgAddCodeUploadParamsAddresses", MsgAddCodeUploadParamsAddresses],
    ["/cosmwasm.wasm.v1.Code", Code],
    ["/cosmwasm.wasm.v1.QueryContractsByCodeRequest", QueryContractsByCodeRequest],
    ["/cosmwasm.wasm.v1.MsgMigrateContract", MsgMigrateContract],
    ["/cosmwasm.wasm.v1.MsgClearAdminResponse", MsgClearAdminResponse],
    ["/cosmwasm.wasm.v1.MsgSudoContractResponse", MsgSudoContractResponse],
    ["/cosmwasm.wasm.v1.SudoContractProposal", SudoContractProposal],
    ["/cosmwasm.wasm.v1.MsgInstantiateContract2Response", MsgInstantiateContract2Response],
    ["/cosmwasm.wasm.v1.CodeInfo", CodeInfo],
    ["/cosmwasm.wasm.v1.QueryAllContractStateRequest", QueryAllContractStateRequest],
    ["/cosmwasm.wasm.v1.MsgInstantiateContract2", MsgInstantiateContract2],
    ["/cosmwasm.wasm.v1.InstantiateContract2Proposal", InstantiateContract2Proposal],
    ["/cosmwasm.wasm.v1.MsgInstantiateContract", MsgInstantiateContract],
    ["/cosmwasm.wasm.v1.QueryCodeRequest", QueryCodeRequest],
    ["/cosmwasm.wasm.v1.MsgPinCodes", MsgPinCodes],
    ["/cosmwasm.wasm.v1.QuerySmartContractStateRequest", QuerySmartContractStateRequest],
    ["/cosmwasm.wasm.v1.StoreCodeAuthorization", StoreCodeAuthorization],
    ["/cosmwasm.wasm.v1.ClearAdminProposal", ClearAdminProposal],
    ["/cosmwasm.wasm.v1.MsgUnpinCodesResponse", MsgUnpinCodesResponse],
    ["/cosmwasm.wasm.v1.QueryCodesRequest", QueryCodesRequest],
    ["/cosmwasm.wasm.v1.AccessConfig", AccessConfig],
    ["/cosmwasm.wasm.v1.QueryCodeResponse", QueryCodeResponse],
    ["/cosmwasm.wasm.v1.MsgRemoveCodeUploadParamsAddresses", MsgRemoveCodeUploadParamsAddresses],
    ["/cosmwasm.wasm.v1.QueryPinnedCodesResponse", QueryPinnedCodesResponse],
    
];

export { msgTypes }