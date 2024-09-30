// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AggregatedKeyShare {
    #[prost(uint64, tag="1")]
    pub height: u64,
    #[prost(string, tag="2")]
    pub data: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AuthorizedAddress {
    #[prost(string, tag="1")]
    pub target: ::prost::alloc::string::String,
    #[prost(bool, tag="2")]
    pub is_authorized: bool,
    #[prost(string, tag="3")]
    pub authorized_by: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Commitments {
    #[prost(string, repeated, tag="1")]
    pub commitments: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GeneralKeyShare {
    #[prost(string, tag="1")]
    pub validator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub id_type: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub id_value: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub key_share: ::prost::alloc::string::String,
    #[prost(uint64, tag="5")]
    pub key_share_index: u64,
    #[prost(uint64, tag="6")]
    pub received_timestamp: u64,
    #[prost(uint64, tag="7")]
    pub received_block_height: u64,
}
/// Params defines the parameters for the module.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Params {
    #[prost(uint64, tag="1")]
    pub key_expiry: u64,
    #[prost(uint64, tag="2")]
    pub minimum_bonded: u64,
    #[prost(uint64, tag="3")]
    pub max_idled_block: u64,
    #[prost(string, repeated, tag="4")]
    pub trusted_addresses: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(bytes="vec", tag="5")]
    pub slash_fraction_no_keyshare: ::prost::alloc::vec::Vec<u8>,
    #[prost(bytes="vec", tag="6")]
    pub slash_fraction_wrong_keyshare: ::prost::alloc::vec::Vec<u8>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ValidatorSet {
    #[prost(string, tag="1")]
    pub index: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub validator: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub cons_addr: ::prost::alloc::string::String,
    #[prost(bool, tag="4")]
    pub is_active: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct KeyShare {
    #[prost(string, tag="1")]
    pub validator: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub block_height: u64,
    #[prost(string, tag="3")]
    pub key_share: ::prost::alloc::string::String,
    #[prost(uint64, tag="4")]
    pub key_share_index: u64,
    #[prost(uint64, tag="5")]
    pub received_timestamp: u64,
    #[prost(uint64, tag="6")]
    pub received_block_height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct EncryptedKeyShare {
    #[prost(string, tag="1")]
    pub data: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub validator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ActivePubKey {
    #[prost(string, tag="1")]
    pub public_key: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub creator: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub expiry: u64,
    #[prost(uint64, tag="4")]
    pub number_of_validators: u64,
    #[prost(message, repeated, tag="5")]
    pub encrypted_key_shares: ::prost::alloc::vec::Vec<EncryptedKeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueuedPubKey {
    #[prost(string, tag="1")]
    pub public_key: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub creator: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub expiry: u64,
    #[prost(uint64, tag="4")]
    pub number_of_validators: u64,
    #[prost(message, repeated, tag="5")]
    pub encrypted_key_shares: ::prost::alloc::vec::Vec<EncryptedKeyShare>,
}
/// GenesisState defines the keyshare module's genesis state.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GenesisState {
    /// params defines all the parameters of the module.
    #[prost(message, optional, tag="1")]
    pub params: ::core::option::Option<Params>,
    #[prost(string, tag="2")]
    pub port_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="3")]
    pub validator_set_list: ::prost::alloc::vec::Vec<ValidatorSet>,
    #[prost(message, repeated, tag="4")]
    pub key_share_list: ::prost::alloc::vec::Vec<KeyShare>,
    /// this line is used by starport scaffolding # genesis/proto/state
    #[prost(message, repeated, tag="5")]
    pub aggregated_key_share_list: ::prost::alloc::vec::Vec<AggregatedKeyShare>,
    #[prost(message, optional, tag="6")]
    pub active_pub_key: ::core::option::Option<ActivePubKey>,
    #[prost(message, optional, tag="7")]
    pub queued_pub_key: ::core::option::Option<QueuedPubKey>,
    #[prost(message, repeated, tag="8")]
    pub authorized_address_list: ::prost::alloc::vec::Vec<AuthorizedAddress>,
    #[prost(uint64, tag="9")]
    pub request_count: u64,
    #[prost(message, repeated, tag="10")]
    pub general_key_share_list: ::prost::alloc::vec::Vec<GeneralKeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct KeysharePacketData {
    #[prost(oneof="keyshare_packet_data::Packet", tags="1, 2, 3, 4, 5")]
    pub packet: ::core::option::Option<keyshare_packet_data::Packet>,
}
/// Nested message and enum types in `KeysharePacketData`.
pub mod keyshare_packet_data {
    #[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Packet {
        #[prost(message, tag="1")]
        NoData(super::NoData),
        #[prost(message, tag="2")]
        RequestAggrKeysharePacket(super::RequestAggrKeysharePacketData),
        #[prost(message, tag="3")]
        GetAggrKeysharePacket(super::GetAggrKeysharePacketData),
        #[prost(message, tag="4")]
        AggrKeyshareDataPacket(super::AggrKeyshareDataPacketData),
        #[prost(message, tag="5")]
        CurrentKeysPacket(super::CurrentKeysPacketData),
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct NoData {
}
/// RequestAggrKeysharePacketData defines a struct for the packet payload
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RequestAggrKeysharePacketData {
    #[prost(string, tag="1")]
    pub requester: ::prost::alloc::string::String,
    #[prost(message, optional, tag="4")]
    pub estimated_delay: ::core::option::Option<::prost_types::Duration>,
    #[prost(oneof="request_aggr_keyshare_packet_data::Id", tags="2, 3")]
    pub id: ::core::option::Option<request_aggr_keyshare_packet_data::Id>,
}
/// Nested message and enum types in `RequestAggrKeysharePacketData`.
pub mod request_aggr_keyshare_packet_data {
    #[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Id {
        #[prost(string, tag="2")]
        ProposalId(::prost::alloc::string::String),
        #[prost(string, tag="3")]
        RequestId(::prost::alloc::string::String),
    }
}
/// RequestAggrKeysharePacketAck defines a struct for the packet acknowledgment
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RequestAggrKeysharePacketAck {
    #[prost(string, tag="1")]
    pub identity: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub pubkey: ::prost::alloc::string::String,
}
/// GetAggrKeysharePacketData defines a struct for the packet payload
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetAggrKeysharePacketData {
    #[prost(string, tag="1")]
    pub identity: ::prost::alloc::string::String,
}
/// GetAggrKeysharePacketAck defines a struct for the packet acknowledgment
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetAggrKeysharePacketAck {
}
/// AggrKeyshareDataPacketData defines a struct for the packet payload
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AggrKeyshareDataPacketData {
    #[prost(string, tag="1")]
    pub identity: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub pubkey: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub aggr_keyshare: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub aggr_height: ::prost::alloc::string::String,
    /// used for private governance
    #[prost(string, tag="5")]
    pub proposal_id: ::prost::alloc::string::String,
    /// might be useful to destination chains to sort out the response
    #[prost(string, tag="6")]
    pub request_id: ::prost::alloc::string::String,
    #[prost(uint64, tag="7")]
    pub retries: u64,
}
/// AggrKeyshareDataPacketAck defines a struct for the packet acknowledgment
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AggrKeyshareDataPacketAck {
}
/// CurrentKeysPacketData defines a struct for the packet payload
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CurrentKeysPacketData {
}
/// CurrentKeysPacketAck defines a struct for the packet acknowledgment
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CurrentKeysPacketAck {
    #[prost(message, optional, tag="1")]
    pub active_key: ::core::option::Option<super::common::ActivePublicKey>,
    #[prost(message, optional, tag="2")]
    pub queued_key: ::core::option::Option<super::common::QueuedPublicKey>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryVerifiableRandomnessQuery {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryVerifiableRandomnessResponse {
    #[prost(string, tag="1")]
    pub randomness: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub round: u64,
}
/// QueryParamsRequest is request type for the Query/Params RPC method.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryParamsRequest {
}
/// QueryParamsResponse is response type for the Query/Params RPC method.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryParamsResponse {
    /// params holds all the parameters of this module.
    #[prost(message, optional, tag="1")]
    pub params: ::core::option::Option<Params>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryCommitmentsRequest {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryCommitmentsResponse {
    #[prost(message, optional, tag="1")]
    pub active_commitments: ::core::option::Option<Commitments>,
    #[prost(message, optional, tag="2")]
    pub queued_commitments: ::core::option::Option<Commitments>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetValidatorSetRequest {
    #[prost(string, tag="1")]
    pub index: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetValidatorSetResponse {
    #[prost(message, optional, tag="1")]
    pub validator_set: ::core::option::Option<ValidatorSet>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllValidatorSetRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllValidatorSetResponse {
    #[prost(message, repeated, tag="1")]
    pub validator_set: ::prost::alloc::vec::Vec<ValidatorSet>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetKeyShareRequest {
    #[prost(string, tag="1")]
    pub validator: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub block_height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetKeyShareResponse {
    #[prost(message, optional, tag="1")]
    pub key_share: ::core::option::Option<KeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllKeyShareRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllKeyShareResponse {
    #[prost(message, repeated, tag="1")]
    pub key_share: ::prost::alloc::vec::Vec<KeyShare>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
/// this line is used by starport scaffolding # 3
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetAggregatedKeyShareRequest {
    #[prost(uint64, tag="1")]
    pub height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetAggregatedKeyShareResponse {
    #[prost(message, optional, tag="1")]
    pub aggregated_key_share: ::core::option::Option<AggregatedKeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllAggregatedKeyShareRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllAggregatedKeyShareResponse {
    #[prost(message, repeated, tag="1")]
    pub aggregated_key_share: ::prost::alloc::vec::Vec<AggregatedKeyShare>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryPubKeyRequest {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryPubKeyResponse {
    #[prost(message, optional, tag="1")]
    pub active_pub_key: ::core::option::Option<ActivePubKey>,
    #[prost(message, optional, tag="2")]
    pub queued_pub_key: ::core::option::Option<QueuedPubKey>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetAuthorizedAddressRequest {
    #[prost(string, tag="1")]
    pub target: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetAuthorizedAddressResponse {
    #[prost(message, optional, tag="1")]
    pub authorized_address: ::core::option::Option<AuthorizedAddress>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllAuthorizedAddressRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllAuthorizedAddressResponse {
    #[prost(message, repeated, tag="1")]
    pub authorized_address: ::prost::alloc::vec::Vec<AuthorizedAddress>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetGeneralKeyShareRequest {
    #[prost(string, tag="1")]
    pub validator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub id_type: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub id_value: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetGeneralKeyShareResponse {
    #[prost(message, optional, tag="1")]
    pub general_key_share: ::core::option::Option<GeneralKeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllGeneralKeyShareRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllGeneralKeyShareResponse {
    #[prost(message, repeated, tag="1")]
    pub general_key_share: ::prost::alloc::vec::Vec<GeneralKeyShare>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct KeyShareRequest {
    #[prost(string, tag="1")]
    pub identity: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub pubkey: ::prost::alloc::string::String,
    /// Used only when the request is made via IBC
    #[prost(message, optional, tag="3")]
    pub ibc_info: ::core::option::Option<IbcInfo>,
    /// Used only when the request is made via IBC
    #[prost(message, optional, tag="4")]
    pub counterparty: ::core::option::Option<CounterPartyIbcInfo>,
    #[prost(string, tag="5")]
    pub aggr_keyshare: ::prost::alloc::string::String,
    /// This is only used when the request is for private governance
    #[prost(string, tag="6")]
    pub proposal_id: ::prost::alloc::string::String,
    /// might be useful to destination chains to sort out the response
    #[prost(string, tag="7")]
    pub request_id: ::prost::alloc::string::String,
    #[prost(bool, tag="8")]
    pub sent: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct IbcInfo {
    #[prost(string, tag="1")]
    pub client_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub connection_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub channel_id: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub port_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct CounterPartyIbcInfo {
    #[prost(string, tag="1")]
    pub client_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub connection_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub channel_id: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub port_id: ::prost::alloc::string::String,
}
/// MsgUpdateParams is the Msg/UpdateParams request type.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgUpdateParams {
    /// authority is the address that controls the module (defaults to x/gov unless overwritten).
    #[prost(string, tag="1")]
    pub authority: ::prost::alloc::string::String,
    // params defines the module parameters to update.

    /// NOTE: All parameters must be supplied.
    #[prost(message, optional, tag="2")]
    pub params: ::core::option::Option<Params>,
}
/// MsgUpdateParamsResponse defines the response structure for executing a
/// MsgUpdateParams message.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgUpdateParamsResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgRegisterValidator {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgRegisterValidatorResponse {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgDeRegisterValidator {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgDeRegisterValidatorResponse {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgSendKeyshare {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub message: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub key_share_index: u64,
    #[prost(uint64, tag="4")]
    pub block_height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgSendKeyshareResponse {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub keyshare: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub keyshare_index: u64,
    #[prost(uint64, tag="4")]
    pub block_height: u64,
    #[prost(uint64, tag="5")]
    pub received_block_height: u64,
    #[prost(bool, tag="6")]
    pub success: bool,
    #[prost(string, tag="7")]
    pub error_message: ::prost::alloc::string::String,
}
/// this line is used by starport scaffolding # proto/tx/message
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateLatestPubKey {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub public_key: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="3")]
    pub commitments: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint64, tag="4")]
    pub number_of_validators: u64,
    #[prost(message, repeated, tag="5")]
    pub encrypted_key_shares: ::prost::alloc::vec::Vec<EncryptedKeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateLatestPubKeyResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgOverrideLatestPubKey {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub public_key: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="3")]
    pub commitments: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(uint64, tag="4")]
    pub number_of_validators: u64,
    #[prost(message, repeated, tag="5")]
    pub encrypted_key_shares: ::prost::alloc::vec::Vec<EncryptedKeyShare>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgOverrideLatestPubKeyResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateAuthorizedAddress {
    #[prost(string, tag="1")]
    pub target: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateAuthorizedAddressResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgUpdateAuthorizedAddress {
    #[prost(string, tag="1")]
    pub target: ::prost::alloc::string::String,
    #[prost(bool, tag="2")]
    pub is_authorized: bool,
    #[prost(string, tag="3")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgUpdateAuthorizedAddressResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgDeleteAuthorizedAddress {
    #[prost(string, tag="1")]
    pub target: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgDeleteAuthorizedAddressResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateGeneralKeyShare {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub id_type: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub id_value: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub key_share: ::prost::alloc::string::String,
    #[prost(uint64, tag="5")]
    pub key_share_index: u64,
    #[prost(uint64, tag="6")]
    pub received_timestamp: u64,
    #[prost(uint64, tag="7")]
    pub received_block_height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateGeneralKeyShareResponse {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub id_type: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub id_value: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub key_share: ::prost::alloc::string::String,
    #[prost(uint64, tag="5")]
    pub key_share_index: u64,
    #[prost(uint64, tag="6")]
    pub received_block_height: u64,
    #[prost(bool, tag="7")]
    pub success: bool,
    #[prost(string, tag="8")]
    pub error_message: ::prost::alloc::string::String,
}
include!("fairyring.keyshare.tonic.rs");
// @@protoc_insertion_point(module)