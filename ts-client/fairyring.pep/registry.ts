import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { Params } from "./types/fairyring/pep/params";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    
];

export { msgTypes }