import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { Params } from "./types/fairyring/keyshare/params";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    
];

export { msgTypes }