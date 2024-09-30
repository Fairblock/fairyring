// @generated
/// RequestAggrKeyshare defines a struct for the data payload
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RequestAggrKeyshare {
    #[prost(string, tag="1")]
    pub creator: ::prost::alloc::string::String,
    #[prost(message, optional, tag="4")]
    pub estimated_delay: ::core::option::Option<::prost_types::Duration>,
    #[prost(oneof="request_aggr_keyshare::Id", tags="2, 3")]
    pub id: ::core::option::Option<request_aggr_keyshare::Id>,
}
/// Nested message and enum types in `RequestAggrKeyshare`.
pub mod request_aggr_keyshare {
    #[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Id {
        #[prost(string, tag="2")]
        ProposalId(::prost::alloc::string::String),
        #[prost(string, tag="3")]
        RequestId(::prost::alloc::string::String),
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct RequestAggrKeyshareResponse {
    #[prost(string, tag="1")]
    pub identity: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub pubkey: ::prost::alloc::string::String,
}
/// GetAggrKeyshare defines a struct for the data payload
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetAggrKeyshare {
    #[prost(string, tag="3")]
    pub identity: ::prost::alloc::string::String,
    #[prost(oneof="get_aggr_keyshare::Id", tags="1, 2")]
    pub id: ::core::option::Option<get_aggr_keyshare::Id>,
}
/// Nested message and enum types in `GetAggrKeyshare`.
pub mod get_aggr_keyshare {
    #[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Oneof)]
    pub enum Id {
        #[prost(string, tag="1")]
        ProposalId(::prost::alloc::string::String),
        #[prost(string, tag="2")]
        RequestId(::prost::alloc::string::String),
    }
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct GetAggrKeyshareResponse {
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct ActivePublicKey {
    #[prost(string, tag="1")]
    pub public_key: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub creator: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub expiry: u64,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueuedPublicKey {
    #[prost(string, tag="1")]
    pub public_key: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub creator: ::prost::alloc::string::String,
    #[prost(uint64, tag="3")]
    pub expiry: u64,
}
// @@protoc_insertion_point(module)
