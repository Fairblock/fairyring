import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { NoData } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { Params } from "./types/fairyring/keyshare/params";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    
];

export { msgTypes }