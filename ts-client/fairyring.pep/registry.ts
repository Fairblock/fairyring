import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { RequestId } from "./types/fairyring/pep/request_id";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { Params } from "./types/fairyring/pep/params";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.RequestId", RequestId],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    
];

export { msgTypes }