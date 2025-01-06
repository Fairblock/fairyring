import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubkey } from "./types/fairyring/keyshare/tx";
import { QueryDecryptionKeyAllRequest } from "./types/fairyring/keyshare/query";
import { Params } from "./types/fairyring/keyshare/params";
import { QueuedPubkey } from "./types/fairyring/keyshare/pubkey";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubkeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryKeyshareRequest } from "./types/fairyring/keyshare/query";
import { QueryPubkeyRequest } from "./types/fairyring/keyshare/query";
import { GetDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { DecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryKeyshareAllRequest } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareResponse } from "./types/fairyring/keyshare/query";
import { PrivateDecryptionKeyDataPacketData } from "./types/fairyring/keyshare/packet";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { DecryptionKey } from "./types/fairyring/keyshare/decryption_key";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubkeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgSubmitGeneralKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { IBCInfo } from "./types/fairyring/keyshare/requested_decryption_key";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_decryption_key";
import { QueryAuthorizedAddressAllRequest } from "./types/fairyring/keyshare/query";
import { DecryptionKeyDataPacketData } from "./types/fairyring/keyshare/packet";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { QueryValidatorSetAllRequest } from "./types/fairyring/keyshare/query";
import { QueryKeyshareResponse } from "./types/fairyring/keyshare/query";
import { QueryDecryptionKeyResponse } from "./types/fairyring/keyshare/query";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { MsgSubmitEncryptedKeyshare } from "./types/fairyring/keyshare/tx";
import { DecryptionKeyRequest } from "./types/fairyring/keyshare/requested_decryption_key";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgCreateLatestPubkey } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { QueryVerifiableRandomnessRequest } from "./types/fairyring/keyshare/query";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { Keyshare } from "./types/fairyring/keyshare/keyshare";
import { GetPrivateDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { GeneralKeyshare } from "./types/fairyring/keyshare/keyshare";
import { ValidatorEncryptedKeyshare } from "./types/fairyring/keyshare/keyshare";
import { RequestPrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgSubmitGeneralKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgSubmitEncryptedKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { QueryGeneralKeyshareAllRequest } from "./types/fairyring/keyshare/query";
import { ActivePubkey } from "./types/fairyring/keyshare/pubkey";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryValidatorSetAllResponse } from "./types/fairyring/keyshare/query";
import { EncryptedKeyshare } from "./types/fairyring/keyshare/pubkey";
import { PrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryKeyshareAllResponse } from "./types/fairyring/keyshare/query";
import { QueryPubkeyResponse } from "./types/fairyring/keyshare/query";
import { RequestDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { RequestPrivateDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { GetDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryDecryptionKeyAllResponse } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressAllResponse } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareAllResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryDecryptionKeyRequest } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareRequest } from "./types/fairyring/keyshare/query";
import { PrivateDecryptionKeyRequest } from "./types/fairyring/keyshare/requested_decryption_key";
import { QueryAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { RequestDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { GetPrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubkey", MsgOverrideLatestPubkey],
    ["/fairyring.keyshare.QueryDecryptionKeyAllRequest", QueryDecryptionKeyAllRequest],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueuedPubkey", QueuedPubkey],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.MsgCreateLatestPubkeyResponse", MsgCreateLatestPubkeyResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryValidatorSetResponse", QueryValidatorSetResponse],
    ["/fairyring.keyshare.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.keyshare.QueryPubkeyRequest", QueryPubkeyRequest],
    ["/fairyring.keyshare.GetDecryptionKeyPacketData", GetDecryptionKeyPacketData],
    ["/fairyring.keyshare.DecryptionKeyPacketAck", DecryptionKeyPacketAck],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.QueryKeyshareAllRequest", QueryKeyshareAllRequest],
    ["/fairyring.keyshare.QueryAuthorizedAddressResponse", QueryAuthorizedAddressResponse],
    ["/fairyring.keyshare.QueryGeneralKeyshareResponse", QueryGeneralKeyshareResponse],
    ["/fairyring.keyshare.PrivateDecryptionKeyDataPacketData", PrivateDecryptionKeyDataPacketData],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.DecryptionKey", DecryptionKey],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubkeyResponse", MsgOverrideLatestPubkeyResponse],
    ["/fairyring.keyshare.MsgSubmitGeneralKeyshareResponse", MsgSubmitGeneralKeyshareResponse],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.QueryAuthorizedAddressAllRequest", QueryAuthorizedAddressAllRequest],
    ["/fairyring.keyshare.DecryptionKeyDataPacketData", DecryptionKeyDataPacketData],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.QueryValidatorSetAllRequest", QueryValidatorSetAllRequest],
    ["/fairyring.keyshare.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.keyshare.QueryDecryptionKeyResponse", QueryDecryptionKeyResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshare", MsgSubmitEncryptedKeyshare],
    ["/fairyring.keyshare.DecryptionKeyRequest", DecryptionKeyRequest],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.MsgCreateLatestPubkey", MsgCreateLatestPubkey],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.QueryVerifiableRandomnessRequest", QueryVerifiableRandomnessRequest],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.Keyshare", Keyshare],
    ["/fairyring.keyshare.GetPrivateDecryptionKeyPacketData", GetPrivateDecryptionKeyPacketData],
    ["/fairyring.keyshare.GeneralKeyshare", GeneralKeyshare],
    ["/fairyring.keyshare.ValidatorEncryptedKeyshare", ValidatorEncryptedKeyshare],
    ["/fairyring.keyshare.RequestPrivateDecryptionKeyPacketAck", RequestPrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgSubmitGeneralKeyshare", MsgSubmitGeneralKeyshare],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshareResponse", MsgSubmitEncryptedKeyshareResponse],
    ["/fairyring.keyshare.QueryGeneralKeyshareAllRequest", QueryGeneralKeyshareAllRequest],
    ["/fairyring.keyshare.ActivePubkey", ActivePubkey],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryValidatorSetAllResponse", QueryValidatorSetAllResponse],
    ["/fairyring.keyshare.EncryptedKeyshare", EncryptedKeyshare],
    ["/fairyring.keyshare.PrivateDecryptionKeyPacketAck", PrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryKeyshareAllResponse", QueryKeyshareAllResponse],
    ["/fairyring.keyshare.QueryPubkeyResponse", QueryPubkeyResponse],
    ["/fairyring.keyshare.RequestDecryptionKeyPacketData", RequestDecryptionKeyPacketData],
    ["/fairyring.keyshare.RequestPrivateDecryptionKeyPacketData", RequestPrivateDecryptionKeyPacketData],
    ["/fairyring.keyshare.GetDecryptionKeyPacketAck", GetDecryptionKeyPacketAck],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.QueryValidatorSetRequest", QueryValidatorSetRequest],
    ["/fairyring.keyshare.QueryDecryptionKeyAllResponse", QueryDecryptionKeyAllResponse],
    ["/fairyring.keyshare.QueryAuthorizedAddressAllResponse", QueryAuthorizedAddressAllResponse],
    ["/fairyring.keyshare.QueryGeneralKeyshareAllResponse", QueryGeneralKeyshareAllResponse],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.QueryDecryptionKeyRequest", QueryDecryptionKeyRequest],
    ["/fairyring.keyshare.QueryGeneralKeyshareRequest", QueryGeneralKeyshareRequest],
    ["/fairyring.keyshare.PrivateDecryptionKeyRequest", PrivateDecryptionKeyRequest],
    ["/fairyring.keyshare.QueryAuthorizedAddressRequest", QueryAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.RequestDecryptionKeyPacketAck", RequestDecryptionKeyPacketAck],
    ["/fairyring.keyshare.GetPrivateDecryptionKeyPacketAck", GetPrivateDecryptionKeyPacketAck],
    
];

export { msgTypes }