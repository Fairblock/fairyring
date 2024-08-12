import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { Params } from "./types/fairyring/pep/params";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    
];

export { msgTypes }