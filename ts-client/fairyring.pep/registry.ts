import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { QueryGeneralIdentityRequest } from "./types/fairyring/pep/query";
import { QueryEncryptedTxRequest } from "./types/fairyring/pep/query";
import { QueryPrivateIdentityRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllResponse } from "./types/fairyring/pep/query";
import { QueryPepNonceAllRequest } from "./types/fairyring/pep/query";
import { QueryPubkeyRequest } from "./types/fairyring/pep/query";
import { ExecuteContractMsg } from "./types/fairyring/pep/request_id";
import { MsgRequestGeneralIdentityResponse } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { QueryPepNonceRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralDecryptionKey } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { MsgRegisterContract } from "./types/fairyring/pep/tx";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { QueryGeneralIdentityResponse } from "./types/fairyring/pep/query";
import { QueryGeneralIdentityAllRequest } from "./types/fairyring/pep/query";
import { QueryEncryptedTxResponse } from "./types/fairyring/pep/query";
import { RegisteredContract } from "./types/fairyring/pep/request_id";
import { QueryPrivateIdentityResponse } from "./types/fairyring/pep/query";
import { RequestId } from "./types/fairyring/pep/request_id";
import { MsgSubmitDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { MsgRegisterContractResponse } from "./types/fairyring/pep/tx";
import { DecryptionKey } from "./types/fairyring/pep/decryption_key";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { QueryPubkeyResponse } from "./types/fairyring/pep/query";
import { QueryPepNonceAllResponse } from "./types/fairyring/pep/query";
import { ContractDetails } from "./types/fairyring/pep/request_id";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryEncryptedTxAllFromHeightResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryDecryptDataResponse } from "./types/fairyring/pep/query";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { QueryGeneralIdentityAllResponse } from "./types/fairyring/pep/query";
import { MsgRequestGeneralIdentity } from "./types/fairyring/pep/tx";
import { QueryDecryptDataRequest } from "./types/fairyring/pep/query";
import { MsgRequestPrivateIdentity } from "./types/fairyring/pep/tx";
import { Params } from "./types/fairyring/pep/params";
import { MsgRequestPrivateDecryptionKey } from "./types/fairyring/pep/tx";
import { QueryPepNonceResponse } from "./types/fairyring/pep/query";
import { MsgSubmitGeneralEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { PrivateRequest } from "./types/fairyring/pep/request_id";
import { MsgUnregisterContract } from "./types/fairyring/pep/tx";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { IdentityExecutionEntry } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitDecryptionKey } from "./types/fairyring/pep/tx";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryEncryptedTxAllRequest } from "./types/fairyring/pep/query";
import { MsgUnregisterContractResponse } from "./types/fairyring/pep/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.MsgRequestPrivateIdentityResponse", MsgRequestPrivateIdentityResponse],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.QueryGeneralIdentityRequest", QueryGeneralIdentityRequest],
    ["/fairyring.pep.QueryEncryptedTxRequest", QueryEncryptedTxRequest],
    ["/fairyring.pep.QueryPrivateIdentityRequest", QueryPrivateIdentityRequest],
    ["/fairyring.pep.MsgRequestGeneralDecryptionKeyResponse", MsgRequestGeneralDecryptionKeyResponse],
    ["/fairyring.pep.QueryEncryptedTxAllResponse", QueryEncryptedTxAllResponse],
    ["/fairyring.pep.QueryPepNonceAllRequest", QueryPepNonceAllRequest],
    ["/fairyring.pep.QueryPubkeyRequest", QueryPubkeyRequest],
    ["/fairyring.pep.ExecuteContractMsg", ExecuteContractMsg],
    ["/fairyring.pep.MsgRequestGeneralIdentityResponse", MsgRequestGeneralIdentityResponse],
    ["/fairyring.pep.MsgRequestPrivateDecryptionKeyResponse", MsgRequestPrivateDecryptionKeyResponse],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.QueryPepNonceRequest", QueryPepNonceRequest],
    ["/fairyring.pep.MsgRequestGeneralDecryptionKey", MsgRequestGeneralDecryptionKey],
    ["/fairyring.pep.QueryEncryptedTxAllFromHeightRequest", QueryEncryptedTxAllFromHeightRequest],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.MsgRegisterContract", MsgRegisterContract],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.QueryGeneralIdentityResponse", QueryGeneralIdentityResponse],
    ["/fairyring.pep.QueryGeneralIdentityAllRequest", QueryGeneralIdentityAllRequest],
    ["/fairyring.pep.QueryEncryptedTxResponse", QueryEncryptedTxResponse],
    ["/fairyring.pep.RegisteredContract", RegisteredContract],
    ["/fairyring.pep.QueryPrivateIdentityResponse", QueryPrivateIdentityResponse],
    ["/fairyring.pep.RequestId", RequestId],
    ["/fairyring.pep.MsgSubmitDecryptionKeyResponse", MsgSubmitDecryptionKeyResponse],
    ["/fairyring.pep.MsgRegisterContractResponse", MsgRegisterContractResponse],
    ["/fairyring.pep.DecryptionKey", DecryptionKey],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.QueryPubkeyResponse", QueryPubkeyResponse],
    ["/fairyring.pep.QueryPepNonceAllResponse", QueryPepNonceAllResponse],
    ["/fairyring.pep.ContractDetails", ContractDetails],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryEncryptedTxAllFromHeightResponse", QueryEncryptedTxAllFromHeightResponse],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryDecryptDataResponse", QueryDecryptDataResponse],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.QueryGeneralIdentityAllResponse", QueryGeneralIdentityAllResponse],
    ["/fairyring.pep.MsgRequestGeneralIdentity", MsgRequestGeneralIdentity],
    ["/fairyring.pep.QueryDecryptDataRequest", QueryDecryptDataRequest],
    ["/fairyring.pep.MsgRequestPrivateIdentity", MsgRequestPrivateIdentity],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgRequestPrivateDecryptionKey", MsgRequestPrivateDecryptionKey],
    ["/fairyring.pep.QueryPepNonceResponse", QueryPepNonceResponse],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTxResponse", MsgSubmitGeneralEncryptedTxResponse],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.PrivateRequest", PrivateRequest],
    ["/fairyring.pep.MsgUnregisterContract", MsgUnregisterContract],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.IdentityExecutionEntry", IdentityExecutionEntry],
    ["/fairyring.pep.MsgSubmitDecryptionKey", MsgSubmitDecryptionKey],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.QueryEncryptedTxAllRequest", QueryEncryptedTxAllRequest],
    ["/fairyring.pep.MsgUnregisterContractResponse", MsgUnregisterContractResponse],
    
];

export { msgTypes }