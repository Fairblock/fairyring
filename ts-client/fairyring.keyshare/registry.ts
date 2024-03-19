import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryGetAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { IBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { ActivePubKey } from "./types/fairyring/keyshare/pub_key";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { QueryPubKeyRequest } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_keyshare";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueuedPubKey } from "./types/fairyring/keyshare/pub_key";
import { QueryGetKeyShareResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryAllAggregatedKeyShareResponse } from "./types/fairyring/keyshare/query";
import { Params } from "./types/fairyring/keyshare/params";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { KeyShareRequest } from "./types/fairyring/keyshare/requested_keyshare";
import { QueryGetValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareRequest } from "./types/fairyring/keyshare/query";
import { AggrKeyshareDataPacketData } from "./types/fairyring/keyshare/packet";
import { GetAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { RequestAggrKeysharePacketData } from "./types/fairyring/keyshare/packet";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { AggregatedKeyShare } from "./types/fairyring/keyshare/aggregated_key_share";
import { MsgCreateLatestPubKey } from "./types/fairyring/keyshare/tx";
import { GetAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubKeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryAllValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryPubKeyResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateGeneralKeyShare } from "./types/fairyring/keyshare/tx";
import { MsgCreateGeneralKeyShareResponse } from "./types/fairyring/keyshare/tx";
import { QueryGetKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryAllKeyShareRequest } from "./types/fairyring/keyshare/query";
import { KeyShare } from "./types/fairyring/keyshare/key_share";
import { NoData } from "./types/fairyring/keyshare/packet";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { QueryGetValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { GeneralKeyShare } from "./types/fairyring/keyshare/general_key_share";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueryGetAggregatedKeyShareRequest } from "./types/fairyring/keyshare/query";
import { QueryAllGeneralKeyShareResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { RequestAggrKeysharePacketAck } from "./types/fairyring/keyshare/packet";
import { AggrKeyshareDataPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { QueryAllValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGetAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryAllKeyShareResponse } from "./types/fairyring/keyshare/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareResponse", QueryGetAggregatedKeyShareResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressResponse", QueryAllAuthorizedAddressResponse],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.ActivePubKey", ActivePubKey],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareRequest", QueryGetGeneralKeyShareRequest],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareRequest", QueryAllAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryGetGeneralKeyShareResponse", QueryGetGeneralKeyShareResponse],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.QueuedPubKey", QueuedPubKey],
    ["/fairyring.keyshare.QueryGetKeyShareResponse", QueryGetKeyShareResponse],
    ["/fairyring.keyshare.QueryAllAuthorizedAddressRequest", QueryAllAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryAllAggregatedKeyShareResponse", QueryAllAggregatedKeyShareResponse],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.KeyShareRequest", KeyShareRequest],
    ["/fairyring.keyshare.QueryGetValidatorSetRequest", QueryGetValidatorSetRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareRequest", QueryAllGeneralKeyShareRequest],
    ["/fairyring.keyshare.AggrKeyshareDataPacketData", AggrKeyshareDataPacketData],
    ["/fairyring.keyshare.GetAggrKeysharePacketData", GetAggrKeysharePacketData],
    ["/fairyring.keyshare.RequestAggrKeysharePacketData", RequestAggrKeysharePacketData],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.keyshare.MsgCreateLatestPubKey", MsgCreateLatestPubKey],
    ["/fairyring.keyshare.GetAggrKeysharePacketAck", GetAggrKeysharePacketAck],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubKeyResponse", MsgCreateLatestPubKeyResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.QueryAllValidatorSetResponse", QueryAllValidatorSetResponse],
    ["/fairyring.keyshare.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShare", MsgCreateGeneralKeyShare],
    ["/fairyring.keyshare.MsgCreateGeneralKeyShareResponse", MsgCreateGeneralKeyShareResponse],
    ["/fairyring.keyshare.QueryGetKeyShareRequest", QueryGetKeyShareRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressResponse", QueryGetAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.QueryAllKeyShareRequest", QueryAllKeyShareRequest],
    ["/fairyring.keyshare.KeyShare", KeyShare],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryGetValidatorSetResponse", QueryGetValidatorSetResponse],
    ["/fairyring.keyshare.GeneralKeyShare", GeneralKeyShare],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueryGetAggregatedKeyShareRequest", QueryGetAggregatedKeyShareRequest],
    ["/fairyring.keyshare.QueryAllGeneralKeyShareResponse", QueryAllGeneralKeyShareResponse],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.RequestAggrKeysharePacketAck", RequestAggrKeysharePacketAck],
    ["/fairyring.keyshare.AggrKeyshareDataPacketAck", AggrKeyshareDataPacketAck],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.QueryAllValidatorSetRequest", QueryAllValidatorSetRequest],
    ["/fairyring.keyshare.QueryGetAuthorizedAddressRequest", QueryGetAuthorizedAddressRequest],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryAllKeyShareResponse", QueryAllKeyShareResponse],
    
];

export { msgTypes }