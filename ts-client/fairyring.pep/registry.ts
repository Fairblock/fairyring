import { GeneratedType } from "@cosmjs/proto-signing";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { MsgRequestPrivateIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryAllPepNonceResponse } from "./types/fairyring/pep/query";
import { PrivateRequest } from "./types/fairyring/pep/request_id";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { MsgGetPrivateKeysharesResponse } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxFromHeightRequest } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { GenEncTxExecutionQueue } from "./types/fairyring/pep/encrypted_tx";
import { MsgGetPrivateKeyshares } from "./types/fairyring/pep/tx";
import { QueryGetPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgGetGeneralKeyshare } from "./types/fairyring/pep/tx";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryAllKeyshareResponse } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryGetEncryptedTxResponse } from "./types/fairyring/pep/query";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { Params } from "./types/fairyring/pep/params";
import { QueryAllKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { MsgGetGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { QueryAllEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralKeyshareResponse } from "./types/fairyring/pep/tx";
import { AggregatedKeyShare } from "./types/fairyring/pep/aggregated_key_share";
import { MsgCreateAggregatedKeyShare } from "./types/fairyring/pep/tx";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateIdentity } from "./types/fairyring/pep/tx";
import { MsgCreateAggregatedKeyShareResponse } from "./types/fairyring/pep/tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryKeyshareRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryPubKeyRequest } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralKeyshare } from "./types/fairyring/pep/tx";
import { QueryPubKeyResponse } from "./types/fairyring/pep/query";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { RequestId } from "./types/fairyring/pep/request_id";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryAllEncryptedTxFromHeightResponse } from "./types/fairyring/pep/query";
import { QueryGetPepNonceRequest } from "./types/fairyring/pep/query";
import { QueryAllPepNonceRequest } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.MsgRequestPrivateIdentityResponse", MsgRequestPrivateIdentityResponse],
    ["/fairyring.pep.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.pep.QueryAllPepNonceResponse", QueryAllPepNonceResponse],
    ["/fairyring.pep.PrivateRequest", PrivateRequest],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.MsgGetPrivateKeysharesResponse", MsgGetPrivateKeysharesResponse],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightRequest", QueryAllEncryptedTxFromHeightRequest],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.GenEncTxExecutionQueue", GenEncTxExecutionQueue],
    ["/fairyring.pep.MsgGetPrivateKeyshares", MsgGetPrivateKeyshares],
    ["/fairyring.pep.QueryGetPepNonceResponse", QueryGetPepNonceResponse],
    ["/fairyring.pep.MsgGetGeneralKeyshare", MsgGetGeneralKeyshare],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryAllKeyshareResponse", QueryAllKeyshareResponse],
    ["/fairyring.pep.QueryGetEncryptedTxRequest", QueryGetEncryptedTxRequest],
    ["/fairyring.pep.QueryGetEncryptedTxResponse", QueryGetEncryptedTxResponse],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.QueryAllKeyshareRequest", QueryAllKeyshareRequest],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.MsgGetGeneralKeyshareResponse", MsgGetGeneralKeyshareResponse],
    ["/fairyring.pep.QueryAllEncryptedTxResponse", QueryAllEncryptedTxResponse],
    ["/fairyring.pep.MsgRequestGeneralKeyshareResponse", MsgRequestGeneralKeyshareResponse],
    ["/fairyring.pep.AggregatedKeyShare", AggregatedKeyShare],
    ["/fairyring.pep.MsgCreateAggregatedKeyShare", MsgCreateAggregatedKeyShare],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.MsgRequestPrivateIdentity", MsgRequestPrivateIdentity],
    ["/fairyring.pep.MsgCreateAggregatedKeyShareResponse", MsgCreateAggregatedKeyShareResponse],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.pep.QueryAllEncryptedTxRequest", QueryAllEncryptedTxRequest],
    ["/fairyring.pep.QueryPubKeyRequest", QueryPubKeyRequest],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgRequestGeneralKeyshare", MsgRequestGeneralKeyshare],
    ["/fairyring.pep.QueryPubKeyResponse", QueryPubKeyResponse],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.RequestId", RequestId],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryAllEncryptedTxFromHeightResponse", QueryAllEncryptedTxFromHeightResponse],
    ["/fairyring.pep.QueryGetPepNonceRequest", QueryGetPepNonceRequest],
    ["/fairyring.pep.QueryAllPepNonceRequest", QueryAllPepNonceRequest],
    
];

export { msgTypes }