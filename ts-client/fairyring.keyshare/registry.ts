import { GeneratedType } from "@cosmjs/proto-signing";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { Params } from "./types/fairyring/keyshare/params";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.Params", Params],
    
];

export { msgTypes }