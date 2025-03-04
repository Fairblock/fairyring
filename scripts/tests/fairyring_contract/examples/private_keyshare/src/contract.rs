use std::collections::HashMap;
use cosmwasm_std::{
    entry_point, to_json_binary, AnyMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Reply, Response, StdResult, SubMsg
};
use prost::Message;
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg, IdentityResponse, PepRequestMsg, AllIdentitiesResponse, PrivateDecryptionKey,
};
use crate::state::{IdentityRecord, PendingRequest, LAST_REPLY_ID, PENDING_REQUESTS, PUBKEY, RECORDS, REQUESTER};

// Import your generated request type.
use fairblock_proto::fairyring::pep::{ MsgRequestPrivateIdentity, MsgRequestPrivateIdentityResponse, MsgRequestPrivateDecryptionKey, MsgRequestPrivateDecryptionKeyResponse};

// the instantiate function saves the current master pubkey of the chain on the contract
#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response<PepRequestMsg>, ContractError> {
    LAST_REPLY_ID.save(deps.storage, &0)?;
    PUBKEY.save(deps.storage, &msg.pubkey)?;
    Ok(Response::<PepRequestMsg>::new())
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response<PepRequestMsg>, ContractError> {
    match msg {
        ExecuteMsg::UpdatePubkey { pubkey } => update_pubkey(deps, env, info, pubkey),
        ExecuteMsg::RequestPrivateKeyshare { identity, secp_pubkey } => execute_request_keyshare(deps, env, info, identity, secp_pubkey),
        ExecuteMsg::RequestIdentity { price } => execute_request_identity(deps, env, info, price),
        ExecuteMsg::StoreEncryptedData { identity, data } => store_encrypted_data(deps, env, info, identity, data),
        ExecuteMsg::ExecuteContractPrivateMsg { identity, private_decryption_key } => execute_private_keys(deps, env, info, identity, private_decryption_key),
    }
}

// the update_pubkey execution msg is used to update the master pubkey saved to the contract
fn update_pubkey(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    pubkey: String,
) -> Result<Response<PepRequestMsg>, ContractError> {
    PUBKEY.save(deps.storage, &pubkey)?;
    Ok(Response::<PepRequestMsg>::new())
}

// the execute_private_keys execution msg is called by the pep module
// when the private keyshares toa registered identity is available
fn execute_private_keys(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    identity: String,
    dec_keys: PrivateDecryptionKey,
) -> Result<Response<PepRequestMsg>, ContractError> {

    let mut record = RECORDS.load(deps.storage, identity.as_str())?;
    let requester = REQUESTER.load(deps.storage)?;
    
    record.private_keyshares.insert(requester.clone(), dec_keys.private_keyshares);
    RECORDS.save(deps.storage, identity.as_str(), &record)?;
    Ok(Response::<PepRequestMsg>::new()
        .add_attribute("action", "store_encrypted_keyshares")
        .add_attribute("identity", identity)
        .add_attribute("requester_address", dec_keys.requester))
}

// the execute_request_keyshare execution msg is called by the user
// via a tx to request for a private keyshares to an existing identity
fn execute_request_keyshare(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    identity: String,
    secp_pubkey: String,
) -> Result<Response<PepRequestMsg>, ContractError> {
    // Use the contract's own address as the creator.
    let contract_addr = env.contract.address.to_string();
    
    // Increment our reply id counter.
    let mut reply_id = LAST_REPLY_ID.load(deps.storage)?;
    reply_id += 1;
    LAST_REPLY_ID.save(deps.storage, &reply_id)?;

    // Save the pending request info for use in the reply.
    let pending = PendingRequest {
        creator: info.sender.to_string().clone(),
        price: Coin::new(0u128, "ufairy"),
    };
    PENDING_REQUESTS.save(deps.storage, reply_id, &pending)?;

    let mut record = RECORDS.load(deps.storage, identity.as_str())?;
    record.private_keyshares.insert(info.sender.to_string().clone(), Vec::new());
    RECORDS.save(deps.storage, identity.as_str(), &record)?;

    REQUESTER.save(deps.storage, &info.sender.to_string())?;
    
    let msg = MsgRequestPrivateDecryptionKey {
        creator: contract_addr.to_string(),
        identity,
        secp_pubkey,
    };

    let e = msg.encode_to_vec();
    let d = Binary::new(e);

    let any_msg = AnyMsg {
        type_url: "/fairyring.pep.MsgRequestPrivateDecryptionKey".to_string(),
        value: d,
    };

    // Dispatch as a submessage.
    let cosmos_msg = CosmosMsg::Any(any_msg.clone());
    let sub_msg = SubMsg::reply_on_success(cosmos_msg, reply_id);

    Ok(Response::<PepRequestMsg>::new()
        .add_submessage(sub_msg)
        .add_attribute("action", "request_private_keyshare")
        .add_attribute("pending_reply_id", reply_id.to_string()))
}

// the execute_request_identity execution msg is called
// by an user via a tx to request a private identity
fn execute_request_identity(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    price: Coin,
) -> Result<Response<PepRequestMsg>, ContractError> {
    // Increment our reply id counter.
    let mut reply_id = LAST_REPLY_ID.load(deps.storage)?;
    reply_id += 1;
    LAST_REPLY_ID.save(deps.storage, &reply_id)?;

    // Use the contract's own address as the creator.
    let contract_addr = env.contract.address.to_string();
    
    // Save the pending request info for use in the reply.
    let pending = PendingRequest {
        creator: info.sender.to_string().clone(),
        price: price.clone(),
    };
    PENDING_REQUESTS.save(deps.storage, reply_id, &pending)?;

    // Create a unique request id.
    let req_id = format!("req-{}-{}", info.sender.to_string(), reply_id);

    // Build the inner generated message.
    let inner_msg = MsgRequestPrivateIdentity {
        creator: contract_addr.clone(),
        req_id,
    };

    let e = inner_msg.encode_to_vec();
    let d = Binary::new(e);

    let any_msg = AnyMsg {
        type_url: "/fairyring.pep.MsgRequestPrivateIdentity".to_string(),
        value: d,
    };

    // Dispatch as a submessage.
    let cosmos_msg = CosmosMsg::Any(any_msg.clone());
    let sub_msg = SubMsg::reply_on_success(cosmos_msg, reply_id);

    Ok(Response::<PepRequestMsg>::new()
        .add_submessage(sub_msg)
        .add_attribute("action", "request_identity")
        .add_attribute("pending_reply_id", reply_id.to_string()))
}

// the store_encrypted_data execution msg is called by an user via tx
// to store encrypted data (encrypted locally using a private identity and the master pubkey)
// on the contract
fn store_encrypted_data(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    identity: String,
    data: String,
) -> Result<Response<PepRequestMsg>, ContractError> {
    let mut record = RECORDS.load(deps.storage, identity.as_str())?;
    
    record.encrypted_data = data.clone();
    RECORDS.save(deps.storage, identity.as_str(), &record)?;
    Ok(Response::<PepRequestMsg>::new()
        .add_attribute("action", "store_data")
        .add_attribute("identity", identity)
        .add_attribute("data", data))
}

// the reply function takes care of the responses of the txs made by the contract to the chain.
// two types of responses are expected from the chain:
// 1. response for requesting an identity
// 2. response for requesting private decryption key
#[entry_point]
pub fn reply(
    deps: DepsMut,
    _env: Env,
    msg: Reply,
) -> Result<Response<PepRequestMsg>, ContractError> {
    let reply_id = msg.id;

    // Retrieve the pending request info.
    let pending = PENDING_REQUESTS.load(deps.storage, reply_id)
        .map_err(|_| ContractError::PendingRequestNotFound { id: reply_id })?;

    let submsg_result = msg
        .result
        .into_result()
        .map_err(|e| ContractError::ReplyError { error: e.to_string() })?;

    // Extract the binary response data
    let binary_data = submsg_result
        .msg_responses
        .get(0)
        .map(|resp| resp.value.clone())
        .ok_or(ContractError::ReplyMissingData {})?;

    // Try decoding as identity response first.
    let identity_result = MsgRequestPrivateIdentityResponse::decode(binary_data.as_slice());
    let keyshare_result = MsgRequestPrivateDecryptionKeyResponse::decode(binary_data.as_slice());

    if let Ok(pep_response) = identity_result {
        // Check if identity is valid (non-empty)
        if !pep_response.identity.is_empty() {
            let pubkey = PUBKEY.load(deps.storage)?;
            let identity = pep_response.identity;
            let record = IdentityRecord {
                identity: identity.clone(),
                pubkey,
                creator: pending.creator,
                encrypted_data: "".to_string(),
                price: pending.price,
                private_keyshares: HashMap::new(),
            };
            RECORDS.save(deps.storage, identity.as_str(), &record)?;
            PENDING_REQUESTS.remove(deps.storage, reply_id);
            return Ok(Response::<PepRequestMsg>::new()
                .add_attribute("action", "store_identity")
                .add_attribute("identity", identity));
        }
        // If identity is empty, fall through to try keyshare.
    }

    if let Ok(_keyshare_response) = keyshare_result {
        // Process keyshare response here.
        // For now, simply return a response indicating a keyshare was processed.
        return Ok(Response::<PepRequestMsg>::new()
            .add_attribute("action", "request_private_keyshare"));
    }

    Err(ContractError::ReplyError {
        error: "Unknown response type".to_string(),
    })
}

// the contract allows for 2 queries
#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetIdentity { identity } => to_json_binary(&query_identity(deps, identity)?),
        QueryMsg::GetAllIdentity {} => to_json_binary(&query_all_identities(deps)?),
    }
}

// the query_identity msg queries the state of a particular identity entry
fn query_identity(deps: Deps, identity: String) -> StdResult<IdentityResponse> {
    let record = RECORDS.load(deps.storage, identity.as_str())?;
    Ok(IdentityResponse { record })
}

// the query_all_identities msg queries the state of all identity entries
fn query_all_identities(deps: Deps) -> StdResult<AllIdentitiesResponse> {
    let records: Vec<IdentityRecord> = RECORDS
        .range(deps.storage, None, None, cosmwasm_std::Order::Ascending)
        .map(|item| item.map(|(_, record)| record))
        .collect::<StdResult<Vec<_>>>()?;

    Ok(AllIdentitiesResponse { records })
}