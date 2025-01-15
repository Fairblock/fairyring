import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgSendKeyshare } from "./types/fairyring/keyshare/tx";
import { MsgCreateLatestPubkeyResponse } from "./types/fairyring/keyshare/tx";
import { DecryptionKeyDataPacketData } from "./types/fairyring/keyshare/packet";
import { QueryDecryptionKeyResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateParamsResponse } from "./types/fairyring/keyshare/tx";
import { QueryGeneralKeyshareAllResponse } from "./types/fairyring/keyshare/query";
import { MsgCreateLatestPubkey } from "./types/fairyring/keyshare/tx";
import { EncryptedKeyshare } from "./types/fairyring/keyshare/pubkey";
import { CurrentKeysPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryParamsResponse } from "./types/fairyring/keyshare/query";
import { QueryKeyshareAllResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgUpdateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { DecryptionKey } from "./types/fairyring/keyshare/decryption_key";
import { ActivePubkey } from "./types/fairyring/keyshare/pubkey";
import { AuthorizedAddress } from "./types/fairyring/keyshare/authorized_address";
import { QueryDecryptionKeyAllRequest } from "./types/fairyring/keyshare/query";
import { MsgSubmitGeneralKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { PrivateDecryptionKeyDataPacketData } from "./types/fairyring/keyshare/packet";
import { GetDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { GetPrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryCommitmentsResponse } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressAllRequest } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidator } from "./types/fairyring/keyshare/tx";
import { MsgDeleteAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { Keyshare } from "./types/fairyring/keyshare/keyshare";
import { QueryKeyshareRequest } from "./types/fairyring/keyshare/query";
import { QueryKeyshareResponse } from "./types/fairyring/keyshare/query";
import { MsgRegisterValidator } from "./types/fairyring/keyshare/tx";
import { QueryKeyshareAllRequest } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressAllResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateParams } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddressResponse } from "./types/fairyring/keyshare/tx";
import { DecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryValidatorSetResponse } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareAllRequest } from "./types/fairyring/keyshare/query";
import { PrivateDecryptionKeyRequest } from "./types/fairyring/keyshare/requested_decryption_key";
import { GetDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { RequestPrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryValidatorSetAllRequest } from "./types/fairyring/keyshare/query";
import { QueryDecryptionKeyAllResponse } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareResponse } from "./types/fairyring/keyshare/query";
import { MsgUpdateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgSubmitEncryptedKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { NoData } from "./types/fairyring/keyshare/packet";
import { QueryParamsRequest } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressRequest } from "./types/fairyring/keyshare/query";
import { MsgDeleteAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { DecryptionKeyRequest } from "./types/fairyring/keyshare/requested_decryption_key";
import { GetPrivateDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { RequestDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { QueryVerifiableRandomnessRequest } from "./types/fairyring/keyshare/query";
import { QueryPubkeyResponse } from "./types/fairyring/keyshare/query";
import { ValidatorEncryptedKeyshare } from "./types/fairyring/keyshare/keyshare";
import { PrivateDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { ValidatorSet } from "./types/fairyring/keyshare/validator_set";
import { QueryPubkeyRequest } from "./types/fairyring/keyshare/query";
import { GeneralKeyshare } from "./types/fairyring/keyshare/keyshare";
import { Commitments } from "./types/fairyring/keyshare/commitments";
import { QueryVerifiableRandomnessResponse } from "./types/fairyring/keyshare/query";
import { QueryAuthorizedAddressResponse } from "./types/fairyring/keyshare/query";
import { MsgDeRegisterValidatorResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubkeyResponse } from "./types/fairyring/keyshare/tx";
import { RequestPrivateDecryptionKeyPacketData } from "./types/fairyring/keyshare/packet";
import { RequestDecryptionKeyPacketAck } from "./types/fairyring/keyshare/packet";
import { QueryValidatorSetRequest } from "./types/fairyring/keyshare/query";
import { QueryGeneralKeyshareRequest } from "./types/fairyring/keyshare/query";
import { CounterPartyIBCInfo } from "./types/fairyring/keyshare/requested_decryption_key";
import { KeysharePacketData } from "./types/fairyring/keyshare/packet";
import { MsgSubmitGeneralKeyshare } from "./types/fairyring/keyshare/tx";
import { Params } from "./types/fairyring/keyshare/params";
import { QueryDecryptionKeyRequest } from "./types/fairyring/keyshare/query";
import { MsgSendKeyshareResponse } from "./types/fairyring/keyshare/tx";
import { MsgOverrideLatestPubkey } from "./types/fairyring/keyshare/tx";
import { MsgCreateAuthorizedAddress } from "./types/fairyring/keyshare/tx";
import { MsgSubmitEncryptedKeyshare } from "./types/fairyring/keyshare/tx";
import { CurrentKeysPacketData } from "./types/fairyring/keyshare/packet";
import { QueryValidatorSetAllResponse } from "./types/fairyring/keyshare/query";
import { GenesisState } from "./types/fairyring/keyshare/genesis";
import { IBCInfo } from "./types/fairyring/keyshare/requested_decryption_key";
import { QueuedPubkey } from "./types/fairyring/keyshare/pubkey";
import { QueryCommitmentsRequest } from "./types/fairyring/keyshare/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/fairyring.keyshare.MsgSendKeyshare", MsgSendKeyshare],
    ["/fairyring.keyshare.MsgCreateLatestPubkeyResponse", MsgCreateLatestPubkeyResponse],
    ["/fairyring.keyshare.DecryptionKeyDataPacketData", DecryptionKeyDataPacketData],
    ["/fairyring.keyshare.QueryDecryptionKeyResponse", QueryDecryptionKeyResponse],
    ["/fairyring.keyshare.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/fairyring.keyshare.QueryGeneralKeyshareAllResponse", QueryGeneralKeyshareAllResponse],
    ["/fairyring.keyshare.MsgCreateLatestPubkey", MsgCreateLatestPubkey],
    ["/fairyring.keyshare.EncryptedKeyshare", EncryptedKeyshare],
    ["/fairyring.keyshare.CurrentKeysPacketAck", CurrentKeysPacketAck],
    ["/fairyring.keyshare.QueryParamsResponse", QueryParamsResponse],
    ["/fairyring.keyshare.QueryKeyshareAllResponse", QueryKeyshareAllResponse],
    ["/fairyring.keyshare.MsgRegisterValidatorResponse", MsgRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddressResponse", MsgUpdateAuthorizedAddressResponse],
    ["/fairyring.keyshare.DecryptionKey", DecryptionKey],
    ["/fairyring.keyshare.ActivePubkey", ActivePubkey],
    ["/fairyring.keyshare.AuthorizedAddress", AuthorizedAddress],
    ["/fairyring.keyshare.QueryDecryptionKeyAllRequest", QueryDecryptionKeyAllRequest],
    ["/fairyring.keyshare.MsgSubmitGeneralKeyshareResponse", MsgSubmitGeneralKeyshareResponse],
    ["/fairyring.keyshare.PrivateDecryptionKeyDataPacketData", PrivateDecryptionKeyDataPacketData],
    ["/fairyring.keyshare.GetDecryptionKeyPacketAck", GetDecryptionKeyPacketAck],
    ["/fairyring.keyshare.GetPrivateDecryptionKeyPacketAck", GetPrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryCommitmentsResponse", QueryCommitmentsResponse],
    ["/fairyring.keyshare.QueryAuthorizedAddressAllRequest", QueryAuthorizedAddressAllRequest],
    ["/fairyring.keyshare.MsgDeRegisterValidator", MsgDeRegisterValidator],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddressResponse", MsgDeleteAuthorizedAddressResponse],
    ["/fairyring.keyshare.Keyshare", Keyshare],
    ["/fairyring.keyshare.QueryKeyshareRequest", QueryKeyshareRequest],
    ["/fairyring.keyshare.QueryKeyshareResponse", QueryKeyshareResponse],
    ["/fairyring.keyshare.MsgRegisterValidator", MsgRegisterValidator],
    ["/fairyring.keyshare.QueryKeyshareAllRequest", QueryKeyshareAllRequest],
    ["/fairyring.keyshare.QueryAuthorizedAddressAllResponse", QueryAuthorizedAddressAllResponse],
    ["/fairyring.keyshare.MsgUpdateParams", MsgUpdateParams],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddressResponse", MsgCreateAuthorizedAddressResponse],
    ["/fairyring.keyshare.DecryptionKeyPacketAck", DecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryValidatorSetResponse", QueryValidatorSetResponse],
    ["/fairyring.keyshare.QueryGeneralKeyshareAllRequest", QueryGeneralKeyshareAllRequest],
    ["/fairyring.keyshare.PrivateDecryptionKeyRequest", PrivateDecryptionKeyRequest],
    ["/fairyring.keyshare.GetDecryptionKeyPacketData", GetDecryptionKeyPacketData],
    ["/fairyring.keyshare.RequestPrivateDecryptionKeyPacketAck", RequestPrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryValidatorSetAllRequest", QueryValidatorSetAllRequest],
    ["/fairyring.keyshare.QueryDecryptionKeyAllResponse", QueryDecryptionKeyAllResponse],
    ["/fairyring.keyshare.QueryGeneralKeyshareResponse", QueryGeneralKeyshareResponse],
    ["/fairyring.keyshare.MsgUpdateAuthorizedAddress", MsgUpdateAuthorizedAddress],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshareResponse", MsgSubmitEncryptedKeyshareResponse],
    ["/fairyring.keyshare.NoData", NoData],
    ["/fairyring.keyshare.QueryParamsRequest", QueryParamsRequest],
    ["/fairyring.keyshare.QueryAuthorizedAddressRequest", QueryAuthorizedAddressRequest],
    ["/fairyring.keyshare.MsgDeleteAuthorizedAddress", MsgDeleteAuthorizedAddress],
    ["/fairyring.keyshare.DecryptionKeyRequest", DecryptionKeyRequest],
    ["/fairyring.keyshare.GetPrivateDecryptionKeyPacketData", GetPrivateDecryptionKeyPacketData],
    ["/fairyring.keyshare.RequestDecryptionKeyPacketData", RequestDecryptionKeyPacketData],
    ["/fairyring.keyshare.QueryVerifiableRandomnessRequest", QueryVerifiableRandomnessRequest],
    ["/fairyring.keyshare.QueryPubkeyResponse", QueryPubkeyResponse],
    ["/fairyring.keyshare.ValidatorEncryptedKeyshare", ValidatorEncryptedKeyshare],
    ["/fairyring.keyshare.PrivateDecryptionKeyPacketAck", PrivateDecryptionKeyPacketAck],
    ["/fairyring.keyshare.ValidatorSet", ValidatorSet],
    ["/fairyring.keyshare.QueryPubkeyRequest", QueryPubkeyRequest],
    ["/fairyring.keyshare.GeneralKeyshare", GeneralKeyshare],
    ["/fairyring.keyshare.Commitments", Commitments],
    ["/fairyring.keyshare.QueryVerifiableRandomnessResponse", QueryVerifiableRandomnessResponse],
    ["/fairyring.keyshare.QueryAuthorizedAddressResponse", QueryAuthorizedAddressResponse],
    ["/fairyring.keyshare.MsgDeRegisterValidatorResponse", MsgDeRegisterValidatorResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubkeyResponse", MsgOverrideLatestPubkeyResponse],
    ["/fairyring.keyshare.RequestPrivateDecryptionKeyPacketData", RequestPrivateDecryptionKeyPacketData],
    ["/fairyring.keyshare.RequestDecryptionKeyPacketAck", RequestDecryptionKeyPacketAck],
    ["/fairyring.keyshare.QueryValidatorSetRequest", QueryValidatorSetRequest],
    ["/fairyring.keyshare.QueryGeneralKeyshareRequest", QueryGeneralKeyshareRequest],
    ["/fairyring.keyshare.CounterPartyIBCInfo", CounterPartyIBCInfo],
    ["/fairyring.keyshare.KeysharePacketData", KeysharePacketData],
    ["/fairyring.keyshare.MsgSubmitGeneralKeyshare", MsgSubmitGeneralKeyshare],
    ["/fairyring.keyshare.Params", Params],
    ["/fairyring.keyshare.QueryDecryptionKeyRequest", QueryDecryptionKeyRequest],
    ["/fairyring.keyshare.MsgSendKeyshareResponse", MsgSendKeyshareResponse],
    ["/fairyring.keyshare.MsgOverrideLatestPubkey", MsgOverrideLatestPubkey],
    ["/fairyring.keyshare.MsgCreateAuthorizedAddress", MsgCreateAuthorizedAddress],
    ["/fairyring.keyshare.MsgSubmitEncryptedKeyshare", MsgSubmitEncryptedKeyshare],
    ["/fairyring.keyshare.CurrentKeysPacketData", CurrentKeysPacketData],
    ["/fairyring.keyshare.QueryValidatorSetAllResponse", QueryValidatorSetAllResponse],
    ["/fairyring.keyshare.GenesisState", GenesisState],
    ["/fairyring.keyshare.IBCInfo", IBCInfo],
    ["/fairyring.keyshare.QueuedPubkey", QueuedPubkey],
    ["/fairyring.keyshare.QueryCommitmentsRequest", QueryCommitmentsRequest],
    
];

export { msgTypes }