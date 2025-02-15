use std::collections::HashMap;
use crate::msg::IndexedEncryptedKeyshare;
use cosmwasm_std::Coin;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct IdentityRecord {
    pub identity: String,
    pub pubkey: String,
    pub creator: String,
    pub encrypted_data: String,
    pub price: Coin,
    pub private_keyshares: HashMap<String, Vec<IndexedEncryptedKeyshare>>,
}


// Storage for identity records (keyed by the identity string)
pub const RECORDS: Map<&str, IdentityRecord> = Map::new("records");

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PendingRequest {
    pub creator: String,
    pub price: Coin,
}
pub const PENDING_REQUESTS: Map<u64, PendingRequest> = Map::new("pending_requests");

// A counter to generate unique reply IDs.
pub const LAST_REPLY_ID: Item<u64> = Item::new("last_reply_id");

// Save Pubkey
pub const PUBKEY: Item<String> = Item::new("pubkey");

pub const REQUESTER: Item<String> = Item::new("requester");