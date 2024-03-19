import { GeneratedType } from "@cosmjs/proto-signing";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { PepPacketData } from "./types/fairyring/pep/packet";
import { NoData } from "./types/fairyring/pep/packet";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { CurrentKeysPacketData } from "./types/fairyring/pep/packet";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { Params } from "./types/fairyring/pep/params";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { QueuedPubKey } from "./types/fairyring/pep/pub_key";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { CurrentKeysPacketAck } from "./types/fairyring/pep/packet";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { ActivePubKey } from "./types/fairyring/pep/pub_key";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.PepPacketData", PepPacketData],
    ["/fairyring.pep.NoData", NoData],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.QueuedPubKey", QueuedPubKey],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.ActivePubKey", ActivePubKey],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    
];

export { msgTypes }