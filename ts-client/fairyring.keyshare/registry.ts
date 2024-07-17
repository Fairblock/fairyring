import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { NoData } from "./types/fairyring/keyshare/packet";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { Params } from "./types/fairyring/keyshare/params";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    
];

export { msgTypes }