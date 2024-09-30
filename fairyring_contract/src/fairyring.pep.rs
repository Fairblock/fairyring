// @generated
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct AggregatedKeyShare {
    #[prost(uint64, tag="1")]
    pub height: u64,
    #[prost(string, tag="2")]
    pub data: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub creator: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct EncryptedTx {
    #[prost(uint64, tag="1")]
    pub target_height: u64,
    #[prost(uint64, tag="2")]
    pub index: u64,
    #[prost(string, tag="3")]
    pub data: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub creator: ::prost::alloc::string::String,
    #[prost(message, optional, tag="5")]
    pub charged_gas: ::core::option::Option<cosmos_sdk_proto::cosmos::base::v1beta1::Coin>,
    #[prost(uint64, tag="6")]
    pub processed_at_chain_height: u64,
    #[prost(bool, tag="7")]
    pub expired: bool,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct EncryptedTxArray {
    #[prost(message, repeated, tag="1")]
    pub encrypted_tx: ::prost::alloc::vec::Vec<EncryptedTx>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GeneralEncryptedTx {
    #[prost(string, tag="1")]
    pub identity: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub index: u64,
    #[prost(string, tag="3")]
    pub data: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub creator: ::prost::alloc::string::String,
    #[prost(message, optional, tag="5")]
    pub charged_gas: ::core::option::Option<cosmos_sdk_proto::cosmos::base::v1beta1::Coin>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GeneralEncryptedTxArray {
    #[prost(message, repeated, tag="1")]
    pub encrypted_tx: ::prost::alloc::vec::Vec<GeneralEncryptedTx>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GenEncTxExecutionQueue {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub request_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub identity: ::prost::alloc::string::String,
    #[prost(string, tag="4")]
    pub pubkey: ::prost::alloc::string::String,
    #[prost(message, optional, tag="5")]
    pub tx_list: ::core::option::Option<GeneralEncryptedTxArray>,
    #[prost(string, tag="6")]
    pub aggr_keyshare: ::prost::alloc::string::String,
}
/// Params defines the parameters for the module.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Params {
    #[prost(string, tag="1")]
    pub keyshare_channel_id: ::prost::alloc::string::String,
    #[prost(bool, tag="2")]
    pub is_source_chain: bool,
    #[prost(message, repeated, tag="3")]
    pub trusted_counter_parties: ::prost::alloc::vec::Vec<TrustedCounterParty>,
    #[prost(string, repeated, tag="4")]
    pub trusted_addresses: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(message, optional, tag="5")]
    pub min_gas_price: ::core::option::Option<cosmos_sdk_proto::cosmos::base::v1beta1::Coin>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct TrustedCounterParty {
    #[prost(string, tag="1")]
    pub client_id: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub connection_id: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub channel_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct PepNonce {
    #[prost(string, tag="1")]
    pub address: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub nonce: u64,
}
/// GenesisState defines the pep module's genesis state.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GenesisState {
    /// params defines all the parameters of the module.
    #[prost(message, optional, tag="1")]
    pub params: ::core::option::Option<Params>,
    #[prost(string, tag="2")]
    pub port_id: ::prost::alloc::string::String,
    #[prost(message, repeated, tag="3")]
    pub encrypted_tx_array: ::prost::alloc::vec::Vec<EncryptedTxArray>,
    #[prost(message, repeated, tag="4")]
    pub pep_nonce_list: ::prost::alloc::vec::Vec<PepNonce>,
    /// this line is used by starport scaffolding # genesis/proto/state
    #[prost(message, repeated, tag="6")]
    pub aggregated_key_share_list: ::prost::alloc::vec::Vec<AggregatedKeyShare>,
    #[prost(message, optional, tag="7")]
    pub active_pub_key: ::core::option::Option<super::common::ActivePublicKey>,
    #[prost(message, optional, tag="8")]
    pub queued_pub_key: ::core::option::Option<super::common::QueuedPublicKey>,
    #[prost(uint64, tag="9")]
    pub request_count: u64,
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
pub struct QueryKeyshareRequest {
    #[prost(string, tag="1")]
    pub req_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryKeyshareResponse {
    #[prost(message, optional, tag="1")]
    pub keyshare: ::core::option::Option<GenEncTxExecutionQueue>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllKeyshareRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllKeyshareResponse {
    #[prost(message, repeated, tag="1")]
    pub keyshares: ::prost::alloc::vec::Vec<GenEncTxExecutionQueue>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetEncryptedTxRequest {
    #[prost(uint64, tag="1")]
    pub target_height: u64,
    #[prost(uint64, tag="2")]
    pub index: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetEncryptedTxResponse {
    #[prost(message, optional, tag="1")]
    pub encrypted_tx: ::core::option::Option<EncryptedTx>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllEncryptedTxRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllEncryptedTxResponse {
    #[prost(message, repeated, tag="1")]
    pub encrypted_tx_array: ::prost::alloc::vec::Vec<EncryptedTxArray>,
    #[prost(message, optional, tag="2")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageResponse>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllEncryptedTxFromHeightRequest {
    #[prost(uint64, tag="1")]
    pub target_height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllEncryptedTxFromHeightResponse {
    #[prost(message, optional, tag="1")]
    pub encrypted_tx_array: ::core::option::Option<EncryptedTxArray>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryLatestHeightRequest {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryLatestHeightResponse {
    #[prost(uint64, tag="1")]
    pub height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetPepNonceRequest {
    #[prost(string, tag="1")]
    pub address: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryGetPepNonceResponse {
    #[prost(message, optional, tag="1")]
    pub pep_nonce: ::core::option::Option<PepNonce>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllPepNonceRequest {
    #[prost(message, optional, tag="1")]
    pub pagination: ::core::option::Option<cosmos_sdk_proto::cosmos::base::query::v1beta1::PageRequest>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryAllPepNonceResponse {
    #[prost(message, repeated, tag="1")]
    pub pep_nonce: ::prost::alloc::vec::Vec<PepNonce>,
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
    pub active_pub_key: ::core::option::Option<super::common::ActivePublicKey>,
    #[prost(message, optional, tag="2")]
    pub queued_pub_key: ::core::option::Option<super::common::QueuedPublicKey>,
}
/// MsgUpdateParams is the Msg/UpdateParams request type.
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgUpdateParams {
    /// authority is the address that controls the module (defaults to x/gov unless overwritten).
    #[prost(string, tag="1")]
    pub authority: ::prost::alloc::string::String,
    /// params defines the module parameters to update.
    ///
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
pub struct MsgSubmitEncryptedTx {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub data: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub target_block_height: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgSubmitGeneralEncryptedTx {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub data: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub req_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgSubmitEncryptedTxResponse {
}
/// this line is used by starport scaffolding # proto/tx/message
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateAggregatedKeyShare {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(uint64, tag="2")]
    pub height: u64,
    #[prost(string, tag="3")]
    pub data: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgCreateAggregatedKeyShareResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgRequestGeneralKeyshare {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(message, optional, tag="2")]
    pub estimated_delay: ::core::option::Option<::prost_types::Duration>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgRequestGeneralKeyshareResponse {
    #[prost(string, tag="1")]
    pub req_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgGetGeneralKeyshare {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub req_id: ::prost::alloc::string::String,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct MsgGetGeneralKeyshareResponse {
}
include!("fairyring.pep.tonic.rs");
// @@protoc_insertion_point(module)