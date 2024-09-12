import { GeneratedType } from "@cosmjs/proto-signing";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryShowPrivateKeyshareReqRequest } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryShowPrivateKeyshareReqResponse } from "./types/fairyring/pep/query";
import { MsgRequestPrivateIdentity } from "./types/fairyring/pep/tx";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { RequestId } from "./types/fairyring/pep/request_id";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgGetPrivateKeyshares } from "./types/fairyring/pep/tx";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { Params } from "./types/fairyring/pep/params";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { MsgGetPrivateKeysharesResponse } from "./types/fairyring/pep/tx";
import { PrivateRequest } from "./types/fairyring/pep/request_id";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryShowPrivateKeyshareReqRequest", QueryShowPrivateKeyshareReqRequest],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.MsgRequestPrivateIdentityResponse", MsgRequestPrivateIdentityResponse],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryShowPrivateKeyshareReqResponse", QueryShowPrivateKeyshareReqResponse],
    ["/fairyring.pep.MsgRequestPrivateIdentity", MsgRequestPrivateIdentity],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.RequestId", RequestId],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.MsgGetPrivateKeyshares", MsgGetPrivateKeyshares],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.MsgGetPrivateKeysharesResponse", MsgGetPrivateKeysharesResponse],
    ["/fairyring.pep.PrivateRequest", PrivateRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    
];

export { msgTypes }