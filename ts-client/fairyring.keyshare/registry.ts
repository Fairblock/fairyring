import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { Params } from "./types/fairyring/keyshare/params";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { NoData } from "./types/fairyring/keyshare/packet";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    
];

export { msgTypes }