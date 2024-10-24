import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSubmitDecryptionKey } from "./types/fairyring/pep/tx";
import { ContractDetails } from "./types/fairyring/pep/request_id";
import { Params } from "./types/fairyring/pep/params";
import { MsgRequestGeneralIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllFromHeightRequest } from "./types/fairyring/pep/query";
import { QueryPepNonceRequest } from "./types/fairyring/pep/query";
import { GeneralEncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { IdentityExecutionEntry } from "./types/fairyring/pep/encrypted_tx";
import { MsgRequestGeneralDecryptionKey } from "./types/fairyring/pep/tx";
import { TrustedCounterParty } from "./types/fairyring/pep/params";
import { MsgUpdateParamsResponse } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateIdentity } from "./types/fairyring/pep/tx";
import { RegisteredContract } from "./types/fairyring/pep/request_id";
import { QueryDecryptDataResponse } from "./types/fairyring/pep/query";
import { QueryGeneralIdentityAllRequest } from "./types/fairyring/pep/query";
import { QueryPepNonceAllRequest } from "./types/fairyring/pep/query";
import { MsgUnregisterContract } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateDecryptionKey } from "./types/fairyring/pep/tx";
import { QueryLatestHeightRequest } from "./types/fairyring/pep/query";
import { RequestId } from "./types/fairyring/pep/request_id";
import { GenesisState } from "./types/fairyring/pep/genesis";
import { QueryEncryptedTxResponse } from "./types/fairyring/pep/query";
import { QueryPrivateIdentityResponse } from "./types/fairyring/pep/query";
import { MsgRequestPrivateDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllRequest } from "./types/fairyring/pep/query";
import { QueryPubkeyRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxRequest } from "./types/fairyring/pep/query";
import { ExecuteContractMsg } from "./types/fairyring/pep/request_id";
import { MsgUpdateParams } from "./types/fairyring/pep/tx";
import { QueryParamsRequest } from "./types/fairyring/pep/query";
import { EncryptedTx } from "./types/fairyring/pep/encrypted_tx";
import { QueryPepNonceResponse } from "./types/fairyring/pep/query";
import { QueryPubkeyResponse } from "./types/fairyring/pep/query";
import { QueryDecryptDataRequest } from "./types/fairyring/pep/query";
import { PepNonce } from "./types/fairyring/pep/pep_nonce";
import { MsgSubmitDecryptionKeyResponse } from "./types/fairyring/pep/tx";
import { MsgUnregisterContractResponse } from "./types/fairyring/pep/tx";
import { QueryGeneralIdentityResponse } from "./types/fairyring/pep/query";
import { QueryEncryptedTxAllFromHeightResponse } from "./types/fairyring/pep/query";
import { DecryptionKey } from "./types/fairyring/pep/decryption_key";
import { QueryGeneralIdentityAllResponse } from "./types/fairyring/pep/query";
import { QueryLatestHeightResponse } from "./types/fairyring/pep/query";
import { QueryPrivateIdentityRequest } from "./types/fairyring/pep/query";
import { GeneralEncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitEncryptedTxResponse } from "./types/fairyring/pep/tx";
import { QueryParamsResponse } from "./types/fairyring/pep/query";
import { QueryGeneralIdentityRequest } from "./types/fairyring/pep/query";
import { MsgRequestGeneralIdentity } from "./types/fairyring/pep/tx";
import { PrivateRequest } from "./types/fairyring/pep/request_id";
import { EncryptedTxArray } from "./types/fairyring/pep/encrypted_tx";
import { MsgSubmitEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgSubmitGeneralEncryptedTx } from "./types/fairyring/pep/tx";
import { MsgRegisterContract } from "./types/fairyring/pep/tx";
import { QueryPepNonceAllResponse } from "./types/fairyring/pep/query";
import { MsgRegisterContractResponse } from "./types/fairyring/pep/tx";
import { MsgRequestPrivateIdentityResponse } from "./types/fairyring/pep/tx";
import { QueryEncryptedTxAllResponse } from "./types/fairyring/pep/query";
import { MsgSubmitGeneralEncryptedTxResponse } from "./types/fairyring/pep/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.pep.MsgSubmitDecryptionKey", MsgSubmitDecryptionKey],
    ["/fairyring.pep.ContractDetails", ContractDetails],
    ["/fairyring.pep.Params", Params],
    ["/fairyring.pep.MsgRequestGeneralIdentityResponse", MsgRequestGeneralIdentityResponse],
    ["/fairyring.pep.QueryEncryptedTxAllFromHeightRequest", QueryEncryptedTxAllFromHeightRequest],
    ["/fairyring.pep.QueryPepNonceRequest", QueryPepNonceRequest],
    ["/fairyring.pep.GeneralEncryptedTx", GeneralEncryptedTx],
    ["/fairyring.pep.IdentityExecutionEntry", IdentityExecutionEntry],
    ["/fairyring.pep.MsgRequestGeneralDecryptionKey", MsgRequestGeneralDecryptionKey],
    ["/fairyring.pep.TrustedCounterParty", TrustedCounterParty],
    ["/fairyring.pep.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.pep.MsgRequestPrivateIdentity", MsgRequestPrivateIdentity],
    ["/fairyring.pep.RegisteredContract", RegisteredContract],
    ["/fairyring.pep.QueryDecryptDataResponse", QueryDecryptDataResponse],
    ["/fairyring.pep.QueryGeneralIdentityAllRequest", QueryGeneralIdentityAllRequest],
    ["/fairyring.pep.QueryPepNonceAllRequest", QueryPepNonceAllRequest],
    ["/fairyring.pep.MsgUnregisterContract", MsgUnregisterContract],
    ["/fairyring.pep.MsgRequestPrivateDecryptionKey", MsgRequestPrivateDecryptionKey],
    ["/fairyring.pep.QueryLatestHeightRequest", QueryLatestHeightRequest],
    ["/fairyring.pep.RequestId", RequestId],
    ["/fairyring.pep.GenesisState", GenesisState],
    ["/fairyring.pep.QueryEncryptedTxResponse", QueryEncryptedTxResponse],
    ["/fairyring.pep.QueryPrivateIdentityResponse", QueryPrivateIdentityResponse],
    ["/fairyring.pep.MsgRequestPrivateDecryptionKeyResponse", MsgRequestPrivateDecryptionKeyResponse],
    ["/fairyring.pep.QueryEncryptedTxAllRequest", QueryEncryptedTxAllRequest],
    ["/fairyring.pep.QueryPubkeyRequest", QueryPubkeyRequest],
    ["/fairyring.pep.MsgRequestGeneralDecryptionKeyResponse", MsgRequestGeneralDecryptionKeyResponse],
    ["/fairyring.pep.QueryEncryptedTxRequest", QueryEncryptedTxRequest],
    ["/fairyring.pep.ExecuteContractMsg", ExecuteContractMsg],
    ["/fairyring.pep.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.pep.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.pep.EncryptedTx", EncryptedTx],
    ["/fairyring.pep.QueryPepNonceResponse", QueryPepNonceResponse],
    ["/fairyring.pep.QueryPubkeyResponse", QueryPubkeyResponse],
    ["/fairyring.pep.QueryDecryptDataRequest", QueryDecryptDataRequest],
    ["/fairyring.pep.PepNonce", PepNonce],
    ["/fairyring.pep.MsgSubmitDecryptionKeyResponse", MsgSubmitDecryptionKeyResponse],
    ["/fairyring.pep.MsgUnregisterContractResponse", MsgUnregisterContractResponse],
    ["/fairyring.pep.QueryGeneralIdentityResponse", QueryGeneralIdentityResponse],
    ["/fairyring.pep.QueryEncryptedTxAllFromHeightResponse", QueryEncryptedTxAllFromHeightResponse],
    ["/fairyring.pep.DecryptionKey", DecryptionKey],
    ["/fairyring.pep.QueryGeneralIdentityAllResponse", QueryGeneralIdentityAllResponse],
    ["/fairyring.pep.QueryLatestHeightResponse", QueryLatestHeightResponse],
    ["/fairyring.pep.QueryPrivateIdentityRequest", QueryPrivateIdentityRequest],
    ["/fairyring.pep.GeneralEncryptedTxArray", GeneralEncryptedTxArray],
    ["/fairyring.pep.MsgSubmitEncryptedTxResponse", MsgSubmitEncryptedTxResponse],
    ["/fairyring.pep.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.pep.QueryGeneralIdentityRequest", QueryGeneralIdentityRequest],
    ["/fairyring.pep.MsgRequestGeneralIdentity", MsgRequestGeneralIdentity],
    ["/fairyring.pep.PrivateRequest", PrivateRequest],
    ["/fairyring.pep.EncryptedTxArray", EncryptedTxArray],
    ["/fairyring.pep.MsgSubmitEncryptedTx", MsgSubmitEncryptedTx],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTx", MsgSubmitGeneralEncryptedTx],
    ["/fairyring.pep.MsgRegisterContract", MsgRegisterContract],
    ["/fairyring.pep.QueryPepNonceAllResponse", QueryPepNonceAllResponse],
    ["/fairyring.pep.MsgRegisterContractResponse", MsgRegisterContractResponse],
    ["/fairyring.pep.MsgRequestPrivateIdentityResponse", MsgRequestPrivateIdentityResponse],
    ["/fairyring.pep.QueryEncryptedTxAllResponse", QueryEncryptedTxAllResponse],
    ["/fairyring.pep.MsgSubmitGeneralEncryptedTxResponse", MsgSubmitGeneralEncryptedTxResponse],
    
];

export { msgTypes }