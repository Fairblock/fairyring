import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { Params } from "./types/fairyring/pep/params";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    
];

export { msgTypes }