// contract.rs
use cosmwasm_std::{attr, entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult};
use crate::msg::{ExecuteContractMsg, QueryMsg, QueryResponse};
use crate::state::STORED_DATA;

#[entry_point]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteContractMsg,
) -> StdResult<Response> {
    // Store the data
    
    // Check if identity is a non-empty string
    if msg.identity.trim().is_empty() {
        return Err(StdError::generic_err("Identity cannot be empty"));
    }

    // Use the identity directly
    let identity = msg.identity;

    STORED_DATA.save(
        deps.storage, 
        &identity, 
        &(msg.pubkey.clone(), msg.aggr_keyshare.clone()),  // Use `.clone()` to avoid moving the values
    )?;
    
    // Return a response
    Ok(Response::new()
        .add_attributes(vec![
            attr("action", "store_data"),
            attr("identity", identity),
            attr("pubkey", msg.pubkey),
            attr("aggr_keyshare", msg.aggr_keyshare),
        ])
    )
}


#[entry_point]
pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    // Load the stored data for the given identity

    // Check if identity is a non-empty string
    if msg.identity.trim().is_empty() {
        return Err(StdError::generic_err("Identity cannot be empty"));
    }

    // Use the identity directly
    let identity = msg.identity;

    let stored_data = STORED_DATA.load(deps.storage, &identity)?;

    // Create the response
    let response = QueryResponse {
        pubkey: stored_data.0,
        aggr_keyshare: stored_data.1,
    };

    // Serialize the response to binary and return it
    to_json_binary(&response)
}