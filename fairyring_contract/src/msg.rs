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


// Instantiate message
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {
    pub identity: String,
    pub pubkey: String,
    pub aggr_keyshare: String,
}
