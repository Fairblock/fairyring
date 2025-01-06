import { GeneratedType } from "@cosmjs/proto-signing";
import { RegisteredContract } from "./types/fairyring/pep/request_id";
import { MsgUnregisterContractResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { QueryPubkeyRequest } from "./types/fairyring/pep/query";
import { QueryDecryptDataResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralIdentity } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryGeneralIdentityRequest } from "./types/fairyring/pep/query";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { Params } from "./types/fairyring/pep/params";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateIdentity } from "./types/fairyring/pep/tx";
import { QueryGeneralIdentityAllResponse } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { DecryptionKey } from "./types/fairyring/pep/decryption_key";
import { MsgSubmitDecryptionKey } from "./types/fairyring/pep/tx";
import { MsgSubmitDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { QueryPrivateIdentityResponse } from "./types/fairyring/pep/query";
import { RequestId } from "./types/fairyring/pep/request_id";
import { MsgRequestPrivateDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { QueryGeneralIdentityAllRequest } from "./types/fairyring/pep/query";
import { QueryPepNonceAllRequest } from "./types/fairyring/pep/query";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { IdentityExecutionEntry } from "./types/fairyring/pep/encrypted_tx";
import { ContractDetails } from "./types/fairyring/pep/request_id";
import { MsgUnregisterContract } from "./types/fairyring/pep/tx";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { QueryPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { MsgRegisterContractResponse } from "./types/fairyring/pep/tx";
import { QueryPepNonceRequest } from "./types/fairyring/pep/query";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitGeneralEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryEncryptedTxAllFromHeightResponse } from "./types/fairyring/pep/query";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryGeneralIdentityResponse } from "./types/fairyring/pep/query";
import { QueryEncryptedTxRequest } from "./types/fairyring/pep/query";
import { ExecuteContractMsg } from "./types/fairyring/pep/request_id";
import { MsgRequestGeneralDecryptionKey } from "./types/fairyring/pep/tx";
import { MsgRequestGeneralDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryPepNonceAllResponse } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { PrivateRequest } from "./types/fairyring/pep/request_id";
import { MsgRequestPrivateIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryPrivateIdentityRequest } from "./types/fairyring/pep/query";
import { QueryEncryptedTxAllResponse } from "./types/fairyring/pep/query";
import { QueryPubkeyResponse } from "./types/fairyring/pep/query";
import { QueryDecryptDataRequest } from "./types/fairyring/pep/query";
import { MsgRequestPrivateDecryptionKey } from "./types/fairyring/pep/tx";
import { MsgRegisterContract } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.RegisteredContract", RegisteredContract],
    ["/fairyring.pep.MsgUnregisterContractResponse", MsgUnregisterContractResponse],
    ["/fairyring.pep.QueryEncryptedTxAllRequest", QueryEncryptedTxAllRequest],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.QueryPubkeyRequest", QueryPubkeyRequest],
    ["/fairyring.pep.QueryDecryptDataResponse", QueryDecryptDataResponse],
    ["/fairyring.pep.MsgRequestGeneralIdentity", MsgRequestGeneralIdentity],
    ["/fairyring.pep.MsgRequestGeneralIdentityResponse", MsgRequestGeneralIdentityResponse],
    ["/fairyring.pep.QueryGeneralIdentityRequest", QueryGeneralIdentityRequest],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.MsgRequestPrivateIdentity", MsgRequestPrivateIdentity],
    ["/fairyring.pep.QueryGeneralIdentityAllResponse", QueryGeneralIdentityAllResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.DecryptionKey", DecryptionKey],
    ["/fairyring.pep.MsgSubmitDecryptionKey", MsgSubmitDecryptionKey],
    ["/fairyring.pep.MsgSubmitDecryptionKeyResponse", MsgSubmitDecryptionKeyResponse],
    ["/fairyring.pep.QueryPrivateIdentityResponse", QueryPrivateIdentityResponse],
    ["/fairyring.pep.RequestId", RequestId],
    ["/fairyring.pep.MsgRequestPrivateDecryptionKeyResponse", MsgRequestPrivateDecryptionKeyResponse],
    ["/fairyring.pep.QueryGeneralIdentityAllRequest", QueryGeneralIdentityAllRequest],
    ["/fairyring.pep.QueryPepNonceAllRequest", QueryPepNonceAllRequest],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.IdentityExecutionEntry", IdentityExecutionEntry],
    ["/fairyring.pep.ContractDetails", ContractDetails],
    ["/fairyring.pep.MsgUnregisterContract", MsgUnregisterContract],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.QueryPepNonceResponse", QueryPepNonceResponse],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.MsgRegisterContractResponse", MsgRegisterContractResponse],
    ["/fairyring.pep.QueryPepNonceRequest", QueryPepNonceRequest],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTxResponse", MsgSubmitGeneralEncryptedTxResponse],
    ["/fairyring.pep.QueryEncryptedTxAllFromHeightRequest", QueryEncryptedTxAllFromHeightRequest],
    ["/fairyring.pep.QueryEncryptedTxAllFromHeightResponse", QueryEncryptedTxAllFromHeightResponse],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryGeneralIdentityResponse", QueryGeneralIdentityResponse],
    ["/fairyring.pep.QueryEncryptedTxRequest", QueryEncryptedTxRequest],
    ["/fairyring.pep.ExecuteContractMsg", ExecuteContractMsg],
    ["/fairyring.pep.MsgRequestGeneralDecryptionKey", MsgRequestGeneralDecryptionKey],
    ["/fairyring.pep.MsgRequestGeneralDecryptionKeyResponse", MsgRequestGeneralDecryptionKeyResponse],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryPepNonceAllResponse", QueryPepNonceAllResponse],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.PrivateRequest", PrivateRequest],
    ["/fairyring.pep.MsgRequestPrivateIdentityResponse", MsgRequestPrivateIdentityResponse],
    ["/fairyring.pep.QueryPrivateIdentityRequest", QueryPrivateIdentityRequest],
    ["/fairyring.pep.QueryEncryptedTxAllResponse", QueryEncryptedTxAllResponse],
    ["/fairyring.pep.QueryPubkeyResponse", QueryPubkeyResponse],
    ["/fairyring.pep.QueryDecryptDataRequest", QueryDecryptDataRequest],
    ["/fairyring.pep.MsgRequestPrivateDecryptionKey", MsgRequestPrivateDecryptionKey],
    ["/fairyring.pep.MsgRegisterContract", MsgRegisterContract],
    ["/fairyring.pep.QueryEncryptedTxResponse", QueryEncryptedTxResponse],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    
];

export { msgTypes }