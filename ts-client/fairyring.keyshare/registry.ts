import { GeneratedType } from "@cosmjs/proto-signing";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { Params } from "./types/fairyring/keyshare/params";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    
];

export { msgTypes }