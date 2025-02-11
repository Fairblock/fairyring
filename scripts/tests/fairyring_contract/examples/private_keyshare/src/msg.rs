use cosmwasm_std::CustomMsg;
use schemars::JsonSchema;
use serde::{Deserialize, Deserializer, Serialize, Serializer};
use serde::ser::SerializeStruct;

// Import your generated type.
use fairblock_proto::fairyring::pep::MsgRequestPrivateIdentity;
// use fairblock_proto::fairyring::common::PrivateDecryptionKey;

/// Instantiate message (empty for this example)
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InstantiateMsg {}

/// Execute message – supports requesting an identity.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    RequestPrivateKeyshare { identity: String, secp_pubkey: String },
    RequestIdentity { price: cosmwasm_std::Coin },
    StoreEncryptedData {identity: String, data: String},
    ExecuteContractPrivateMsg {identity: String, private_decryption_key: PrivateDecryptionKey},
}

// This is the message to execute the contract
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct PrivateDecryptionKey {
    pub requester: String,
    pub private_keyshares: Vec<IndexedEncryptedKeyshare>,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct IndexedEncryptedKeyshare {
    pub encrypted_keyshare_value: String,
    pub encrypted_keyshare_index: i64,
}

/// Query message – fetch a record by its identity.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    GetIdentity { identity: String },
    GetAllIdentity {},
}

/// Query response containing the stored identity record.
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct IdentityResponse {
    pub record: crate::state::IdentityRecord,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct AllIdentitiesResponse {
    pub records: Vec<crate::state::IdentityRecord>,
}

///
/// Custom Request Wrapper
///
/// Wrap your generated `MsgRequestPrivateIdentity` so that it implements
/// Serialize and Deserialize. This is what you'll use as the custom message.
///
#[derive(Debug, Clone, PartialEq)]
pub struct PepRequestMsg {
    pub inner: MsgRequestPrivateIdentity,
}

// Implement the required CustomMsg trait for our wrapper.
impl CustomMsg for PepRequestMsg {}

impl JsonSchema for PepRequestMsg {
    fn schema_name() -> String {
        "PepRequestMsg".to_string()
    }
    fn json_schema(_gen: &mut schemars::gen::SchemaGenerator) -> schemars::schema::Schema {
        use schemars::schema::{Schema, SchemaObject, InstanceType, ObjectValidation};
        Schema::Object(SchemaObject {
            instance_type: Some(InstanceType::Object.into()),
            object: Some(Box::new(ObjectValidation {
                properties: [
                    (
                        "creator".to_string(),
                        Schema::Object(SchemaObject {
                            instance_type: Some(InstanceType::String.into()),
                            ..Default::default()
                        }),
                    ),
                    (
                        "req_id".to_string(),
                        Schema::Object(SchemaObject {
                            instance_type: Some(InstanceType::String.into()),
                            ..Default::default()
                        }),
                    ),
                ]
                .iter()
                .cloned()
                .collect(),
                required: {
                    let mut req = std::collections::BTreeSet::new();
                    req.insert("creator".to_string());
                    req.insert("req_id".to_string());
                    req
                },
                ..Default::default()
            })),
            ..Default::default()
        })
    }
}


// Manual Serialize implementation for PepRequestMsg.
impl Serialize for PepRequestMsg {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        // We serialize as a JSON object with fields "creator" and "req_id".
        let mut state = serializer.serialize_struct("PepRequestMsg", 2)?;
        state.serialize_field("creator", &self.inner.creator)?;
        state.serialize_field("req_id", &self.inner.req_id)?;
        state.end()
    }
}

// Manual Deserialize implementation for PepRequestMsg.
impl<'de> Deserialize<'de> for PepRequestMsg {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        // Define a helper struct matching the fields.
        #[derive(Deserialize)]
        struct Helper {
            creator: String,
            req_id: String,
        }
        let helper = Helper::deserialize(deserializer)?;
        Ok(PepRequestMsg {
            inner: MsgRequestPrivateIdentity {
                creator: helper.creator,
                req_id: helper.req_id,
            },
        })
    }
}

///
/// Custom Response Wrapper
///
/// For responses, we can keep a simple wrapper that the contract uses.
///
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct PepResponseWrapper {
    pub identity: String,
}
