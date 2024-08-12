import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { NoData } from "./types/fairyring/keyshare/packet";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { Params } from "./types/fairyring/keyshare/params";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    
];

export { msgTypes }