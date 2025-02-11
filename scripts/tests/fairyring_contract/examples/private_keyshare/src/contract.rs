use std::collections::HashMap;
use cosmwasm_std::{
    entry_point, to_json_binary, AnyMsg, Binary, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo, Reply, Response, StdResult, SubMsg
};
use prost::Message;
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg, IdentityResponse, PepRequestMsg, AllIdentitiesResponse, PrivateDecryptionKey,
};
use crate::state::{LAST_REPLY_ID, PENDING_REQUESTS, RECORDS, PendingRequest, IdentityRecord};

// Import your generated request type.
use fairblock_proto::fairyring::pep::{ MsgRequestPrivateIdentity, MsgRequestPrivateIdentityResponse, MsgRequestPrivateDecryptionKey, MsgRequestPrivateDecryptionKeyResponse, QueryPubkeyRequest, QueryPubkeyResponse};

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> Result<Response<PepRequestMsg>, ContractError> {
    LAST_REPLY_ID.save(deps.storage, &0)?;
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
        ExecuteMsg::RequestPrivateKeyshare { identity, secp_pubkey } => execute_request_keyshare(deps, env, info, identity, secp_pubkey),
        ExecuteMsg::RequestIdentity { price } => execute_request_identity(deps, env, info, price),
        ExecuteMsg::StoreEncryptedData { identity, data } => store_encrypted_data(deps, env, info, identity, data),
        ExecuteMsg::ExecuteContractPrivateMsg { identity, private_decryption_key } => execute_private_keys(deps, env, info, identity, private_decryption_key),
    }
}

fn execute_private_keys(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    identity: String,
    dec_keys: PrivateDecryptionKey,
) -> Result<Response<PepRequestMsg>, ContractError> {

    let mut record = RECORDS.load(deps.storage, identity.as_str())?;
    
    record.private_keyshares.insert(dec_keys.requester.clone(), dec_keys.private_keyshares);
    RECORDS.save(deps.storage, identity.as_str(), &record)?;
    Ok(Response::<PepRequestMsg>::new()
        .add_attribute("action", "store_encrypted_keyshares")
        .add_attribute("identity", identity)
        .add_attribute("requester_address", dec_keys.requester))
}

fn execute_request_keyshare(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,
    identity: String,
    secp_pubkey: String,
) -> Result<Response<PepRequestMsg>, ContractError> {
    // Use the contract's own address as the creator.
    let contract_addr = env.contract.address.to_string();
    
    // Increment our reply id counter.
    let mut reply_id = LAST_REPLY_ID.load(deps.storage)?;
    reply_id += 1;
    LAST_REPLY_ID.save(deps.storage, &reply_id)?;

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

    // // Wrap it in our custom request message.
    // let pep_request = PepRequestMsg { inner: inner_msg };

    // Dispatch as a submessage.
    let cosmos_msg = CosmosMsg::Any(any_msg.clone());
    let sub_msg = SubMsg::reply_on_success(cosmos_msg, reply_id);

    Ok(Response::<PepRequestMsg>::new()
        .add_submessage(sub_msg)
        .add_attribute("action", "request_identity")
        .add_attribute("pending_reply_id", reply_id.to_string()))
}

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

    // Attempt to decode both response types
    let identity_result = MsgRequestPrivateIdentityResponse::decode(binary_data.as_slice());
    let keyshare_result = MsgRequestPrivateDecryptionKeyResponse::decode(binary_data.as_slice());

    if let Ok(pep_response) = identity_result {
        // Create the request message
        let request = QueryPubkeyRequest {};
        let e = request.encode_to_vec();
        let d = Binary::new(e);

        // Send the query
        let raw_response: Binary = deps.querier.query_grpc("/fairyring.pep.Query/Pubkey".to_string(), d)?;
        
        let vec_res = raw_response.to_vec();
        let x = QueryPubkeyResponse::decode(&*vec_res)
        .expect("Failed to decode Protobuf message");

        // Process identity response
        let identity = pep_response.identity;

        // Create and store the identity record
        let record = IdentityRecord {
            identity: identity.clone(),
            pubkey: x.active_pubkey.as_ref().unwrap().public_key.clone(),
            creator: pending.creator,
            encrypted_data: "".to_string(), // left blank as specified
            price: pending.price,
            private_keyshares: HashMap::new(),
        };
        RECORDS.save(deps.storage, identity.as_str(), &record)?;
        PENDING_REQUESTS.remove(deps.storage, reply_id);

        return Ok(Response::<PepRequestMsg>::new()
            .add_attribute("action", "store_identity")
            .add_attribute("identity", identity));
    } else if let Ok(_keyshare_response) = keyshare_result {

        // TODO: Define what you want to do with the keyshare response.
        // If you need to store it, create a storage entry and save it.

        return Ok(Response::<PepRequestMsg>::new()
            .add_attribute("action", "request_private_keyshare"));
    }

    Err(ContractError::ReplyError {
        error: "Unknown response type".to_string(),
    })
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetIdentity { identity } => to_json_binary(&query_identity(deps, identity)?),
        QueryMsg::GetAllIdentity {} => to_json_binary(&query_all_identities(deps)?),
    }
}

fn query_identity(deps: Deps, identity: String) -> StdResult<IdentityResponse> {
    let record = RECORDS.load(deps.storage, identity.as_str())?;
    Ok(IdentityResponse { record })
}

fn query_all_identities(deps: Deps) -> StdResult<AllIdentitiesResponse> {
    let records: Vec<IdentityRecord> = RECORDS
        .range(deps.storage, None, None, cosmwasm_std::Order::Ascending)
        .map(|item| item.map(|(_, record)| record))
        .collect::<StdResult<Vec<_>>>()?;

    Ok(AllIdentitiesResponse { records })
}