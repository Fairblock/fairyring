import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryDecryptionKeyAllRequest } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareResponse } from "./types/fairyring/keyshare/query";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { RequestPrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryDecryptionKeyResponse } from "./types/fairyring/keyshare/query";
import { DecryptionKey } from "./types/fairyring/keyshare/decryption_key";
import { PrivateDecryptionKeyRequest } from "./types/fairyring/keyshare/requested_decryption_key";
import { QueryKeyshareRequest } from "./types/fairyring/keyshare/query";
import { QueryKeyshareResponse } from "./types/fairyring/keyshare/query";
import { QueryPubkeyResponse } from "./types/fairyring/keyshare/query";
import { GetDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { MsgOverrideLatestPubkey } from "./types/fairyring/keyshare/tx";
import { PrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryGeneralKeyshareAllResponse } from "./types/fairyring/keyshare/query";
import { GeneralKeyshare } from "./types/fairyring/keyshare/keyshare";
import { RequestPrivateDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { MsgSubmitGeneralKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { EncryptedKeyshare } from "./types/fairyring/keyshare/pubkey";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueryVerifiableRandomnessRequest } from "./types/fairyring/keyshare/query";
import { QueryKeyshareAllRequest } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { GetPrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { MsgSubmitEncryptedKeyshare } from "./types/fairyring/keyshare/tx";
import { QueryGeneralKeyshareRequest } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareAllRequest } from "./types/fairyring/keyshare/query";
import { PrivateDecryptionKeyDataPacketData } from "./types/fairyring/keyshare/packet";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubkey } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { QueryValidatorSetAllResponse } from "./types/fairyring/keyshare/query";
import { QueryPubkeyRequest } from "./types/fairyring/keyshare/query";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { Params } from "./types/fairyring/keyshare/params";
import { QueryAuthorizedAddressAllResponse } from "./types/fairyring/keyshare/query";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { ValidatorEncryptedKeyshare } from "./types/fairyring/keyshare/keyshare";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { ActivePubkey } from "./types/fairyring/keyshare/pubkey";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_decryption_key";
import { QueryValidatorSetAllRequest } from "./types/fairyring/keyshare/query";
import { QueryKeyshareAllResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { DecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";
import { QueryDecryptionKeyRequest } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { RequestDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { DecryptionKeyRequest } from "./types/fairyring/keyshare/requested_decryption_key";
import { IBCInfo } from "./types/fairyring/keyshare/requested_decryption_key";
import { MsgSubmitGeneralKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgSubmitEncryptedKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { Keyshare } from "./types/fairyring/keyshare/keyshare";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubkeyResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubkeyResponse } from "./types/fairyring/keyshare/tx";
import { QueuedPubkey } from "./types/fairyring/keyshare/pubkey";
import { GetDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryDecryptionKeyAllResponse } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressAllRequest } from "./types/fairyring/keyshare/query";
import { RequestDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { NoData } from "./types/fairyring/keyshare/packet";
import { DecryptionKeyDataPacketData } from "./types/fairyring/keyshare/packet";
import { GetPrivateDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.QueryValidatorSetRequest", QueryValidatorSetRequest],
    ["/fairyring.keyshare.QueryValidatorSetResponse", QueryValidatorSetResponse],
    ["/fairyring.keyshare.QueryDecryptionKeyAllRequest", QueryDecryptionKeyAllRequest],
    ["/fairyring.keyshare.QueryGeneralKeyshareResponse", QueryGeneralKeyshareResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestPrivateDecryptionKeyPacketAck", RequestPrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryDecryptionKeyResponse", QueryDecryptionKeyResponse],
    ["/fairyring.keyshare.DecryptionKey", DecryptionKey],
    ["/fairyring.keyshare.PrivateDecryptionKeyRequest", PrivateDecryptionKeyRequest],
    ["/fairyring.keyshare.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.keyshare.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.keyshare.QueryPubkeyResponse", QueryPubkeyResponse],
    ["/fairyring.keyshare.GetDecryptionKeyPacketData", GetDecryptionKeyPacketData],
    ["/fairyring.keyshare.MsgOverrideLatestPubkey", MsgOverrideLatestPubkey],
    ["/fairyring.keyshare.PrivateDecryptionKeyPacketAck", PrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.QueryGeneralKeyshareAllResponse", QueryGeneralKeyshareAllResponse],
    ["/fairyring.keyshare.GeneralKeyshare", GeneralKeyshare],
    ["/fairyring.keyshare.RequestPrivateDecryptionKeyPacketData", RequestPrivateDecryptionKeyPacketData],
    ["/fairyring.keyshare.MsgSubmitGeneralKeyshareResponse", MsgSubmitGeneralKeyshareResponse],
    ["/fairyring.keyshare.EncryptedKeyshare", EncryptedKeyshare],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueryVerifiableRandomnessRequest", QueryVerifiableRandomnessRequest],
    ["/fairyring.keyshare.QueryKeyshareAllRequest", QueryKeyshareAllRequest],
    ["/fairyring.keyshare.QueryAuthorizedAddressResponse", QueryAuthorizedAddressResponse],
    ["/fairyring.keyshare.GetPrivateDecryptionKeyPacketAck", GetPrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshare", MsgSubmitEncryptedKeyshare],
    ["/fairyring.keyshare.QueryGeneralKeyshareRequest", QueryGeneralKeyshareRequest],
    ["/fairyring.keyshare.QueryGeneralKeyshareAllRequest", QueryGeneralKeyshareAllRequest],
    ["/fairyring.keyshare.PrivateDecryptionKeyDataPacketData", PrivateDecryptionKeyDataPacketData],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.MsgCreateLatestPubkey", MsgCreateLatestPubkey],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.QueryValidatorSetAllResponse", QueryValidatorSetAllResponse],
    ["/fairyring.keyshare.QueryPubkeyRequest", QueryPubkeyRequest],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueryAuthorizedAddressAllResponse", QueryAuthorizedAddressAllResponse],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.ValidatorEncryptedKeyshare", ValidatorEncryptedKeyshare],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.ActivePubkey", ActivePubkey],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.QueryValidatorSetAllRequest", QueryValidatorSetAllRequest],
    ["/fairyring.keyshare.QueryKeyshareAllResponse", QueryKeyshareAllResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.DecryptionKeyPacketAck", DecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    ["/fairyring.keyshare.QueryDecryptionKeyRequest", QueryDecryptionKeyRequest],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.RequestDecryptionKeyPacketAck", RequestDecryptionKeyPacketAck],
    ["/fairyring.keyshare.DecryptionKeyRequest", DecryptionKeyRequest],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.MsgSubmitGeneralKeyshare", MsgSubmitGeneralKeyshare],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshareResponse", MsgSubmitEncryptedKeyshareResponse],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.Keyshare", Keyshare],
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubkeyResponse", MsgCreateLatestPubkeyResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubkeyResponse", MsgOverrideLatestPubkeyResponse],
    ["/fairyring.keyshare.QueuedPubkey", QueuedPubkey],
    ["/fairyring.keyshare.GetDecryptionKeyPacketAck", GetDecryptionKeyPacketAck],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryDecryptionKeyAllResponse", QueryDecryptionKeyAllResponse],
    ["/fairyring.keyshare.QueryAuthorizedAddressRequest", QueryAuthorizedAddressRequest],
    ["/fairyring.keyshare.QueryAuthorizedAddressAllRequest", QueryAuthorizedAddressAllRequest],
    ["/fairyring.keyshare.RequestDecryptionKeyPacketData", RequestDecryptionKeyPacketData],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.DecryptionKeyDataPacketData", DecryptionKeyDataPacketData],
    ["/fairyring.keyshare.GetPrivateDecryptionKeyPacketData", GetPrivateDecryptionKeyPacketData],
    
];

export { msgTypes }