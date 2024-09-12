import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { ValidatorEncryptedKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { GetPrivateKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { RequestPrivateKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { Params } from "./types/fairyring/keyshare/params";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { PrivateKeyshareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryVerifiableRandomnessQuery } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { EncryptedKeysharesPacketData } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { EncryptedKeyShare } from "./types/fairyring/keyshare/pub_key";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgSubmitEncryptedKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { GetPrivateKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { MsgOverrideLatestPubKey } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgSubmitEncryptedKeyshare } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { RequestPrivateKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { EncryptedKeysharesPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.ValidatorEncryptedKeyShare", ValidatorEncryptedKeyShare],
    ["/fairyring.keyshare.GetPrivateKeysharePacketAck", GetPrivateKeysharePacketAck],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestPrivateKeysharePacketData", RequestPrivateKeysharePacketData],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.PrivateKeyshareRequest", PrivateKeyshareRequest],
    ["/fairyring.keyshare.QueryVerifiableRandomnessQuery", QueryVerifiableRandomnessQuery],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.EncryptedKeysharesPacketData", EncryptedKeysharesPacketData],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.EncryptedKeyShare", EncryptedKeyShare],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshareResponse", MsgSubmitEncryptedKeyshareResponse],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.GetPrivateKeysharePacketData", GetPrivateKeysharePacketData],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.MsgOverrideLatestPubKey", MsgOverrideLatestPubKey],
    ["/fairyring.keyshare.MsgOverrideLatestPubKeyResponse", MsgOverrideLatestPubKeyResponse],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshare", MsgSubmitEncryptedKeyshare],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.RequestPrivateKeysharePacketAck", RequestPrivateKeysharePacketAck],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.EncryptedKeysharesPacketAck", EncryptedKeysharesPacketAck],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    
];

export { msgTypes }