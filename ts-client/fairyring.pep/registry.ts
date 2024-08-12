import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { Params } from "./types/fairyring/pep/params";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    
];

export { msgTypes }