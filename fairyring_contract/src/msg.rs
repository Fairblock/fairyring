// msg.rs
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// This is the message to execute the contract
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct ExecuteContractMsg {
    pub identity: String,
    pub pubkey: String,
    pub aggr_keyshare: String,
}

// Query message
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct QueryMsg {
    pub identity: String,
}

// Response type for querying stored data
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct QueryResponse {
    pub pubkey: String,
    pub aggr_keyshare: String,
}
