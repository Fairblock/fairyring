import { GeneratedType } from "@cosmjs/proto-signing";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { Params } from "./types/fairyring/pep/params";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    
];

export { msgTypes }