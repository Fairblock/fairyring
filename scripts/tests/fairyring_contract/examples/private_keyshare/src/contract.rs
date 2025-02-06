use cosmwasm_std::{
    entry_point, from_json, to_json_binary, Binary, Coin, CosmosMsg, Deps, DepsMut, Env, MessageInfo,
    Reply, Response, StdResult, SubMsg,
};
use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg, IdentityResponse, PepRequestMsg, PepResponseWrapper,
};
use crate::state::{LAST_REPLY_ID, PENDING_REQUESTS, RECORDS, PendingRequest, IdentityRecord};

// Import your generated request type.
use fairblock_proto::fairyring::pep::MsgRequestPrivateIdentity;

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
        ExecuteMsg::RequestIdentity { price } => execute_request_identity(deps, env, info, price),
    }
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

    // Save the pending request info for use in the reply.
    let pending = PendingRequest {
        creator: info.sender.to_string(),
        price: price.clone(),
    };
    PENDING_REQUESTS.save(deps.storage, reply_id, &pending)?;

    // Create a unique request id.
    let req_id = format!("req-{}-{}", env.block.height, reply_id);

    // Build the inner generated message.
    let inner_msg = MsgRequestPrivateIdentity {
        creator: info.sender.to_string(),
        req_id,
    };

    // Wrap it in our custom request message.
    let pep_request = PepRequestMsg { inner: inner_msg };

    // Dispatch as a submessage.
    let cosmos_msg = CosmosMsg::Custom(pep_request.clone());
    let sub_msg = SubMsg::reply_on_success(cosmos_msg, reply_id);

    Ok(Response::<PepRequestMsg>::new()
        .add_submessage(sub_msg)
        .add_attribute("action", "request_identity")
        .add_attribute("pending_reply_id", reply_id.to_string()))
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

    // Use CosmWasm 2.0's msg_responses (the field is now named `value`).
    let binary_data = submsg_result
        .msg_responses
        .get(0)
        .map(|resp| resp.value.clone())
        .ok_or(ContractError::ReplyMissingData {})?;

    // Deserialize the response into our response wrapper.
    let pep_response_wrapper: PepResponseWrapper = from_json(&binary_data)?;
    let identity = pep_response_wrapper.identity;

    // Create and store the identity record.
    let record = IdentityRecord {
        identity: identity.clone(),
        creator: pending.creator,
        encrypted_data: "".to_string(), // left blank as specified
        price: pending.price,
    };
    RECORDS.save(deps.storage, identity.as_str(), &record)?;
    PENDING_REQUESTS.remove(deps.storage, reply_id);

    Ok(Response::<PepRequestMsg>::new()
        .add_attribute("action", "store_identity")
        .add_attribute("identity", identity))
}

#[entry_point]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetIdentity { identity } => to_json_binary(&query_identity(deps, identity)?),
    }
}

fn query_identity(deps: Deps, identity: String) -> StdResult<IdentityResponse> {
    let record = RECORDS.load(deps.storage, identity.as_str())?;
    Ok(IdentityResponse { record })
}
