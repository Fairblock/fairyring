// msg.rs
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_std::CustomQuery;

// This is the message to execute the contract
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ExecuteContractMsg {
    pub identity: String,
    pub pubkey: String,
    pub aggr_keyshare: String,
}

// Query message
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetStoredData { identity: String },
    DecryptData {
        pubkey: String,
        aggr_keyshare: String,
        encrypted_data: String,
    },
}

impl CustomQuery for QueryMsg{}

// Response type for querying stored data
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct QueryResponse {
    pub pubkey: String,
    pub aggr_keyshare: String,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct QueryDecryptDataRequest {
    #[prost(string, tag="1")]
    pub pubkey: ::prost::alloc::string::String,
    #[prost(string, tag="2")]
    pub aggr_keyshare: ::prost::alloc::string::String,
    #[prost(string, tag="3")]
    pub encrypted_data: ::prost::alloc::string::String,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message, Serialize, Deserialize)]
pub struct QueryDecryptDataResponse {
    #[prost(string, tag="1")]
    pub decrypted_data: ::prost::alloc::string::String,
}

// Instantiate message
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub identity: String,
    pub pubkey: String,
    pub aggr_keyshare: String,
}
