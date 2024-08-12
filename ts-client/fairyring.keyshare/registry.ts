import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { Params } from "./types/fairyring/keyshare/params";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    
];

export { msgTypes }