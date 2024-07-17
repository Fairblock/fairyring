import { GeneratedType } from "@cosmjs/proto-signing";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { Params } from "./types/fairyring/pep/params";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    
];

export { msgTypes }