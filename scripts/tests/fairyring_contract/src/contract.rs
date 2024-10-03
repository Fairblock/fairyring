// contract.rs
use cosmwasm_std::{attr, entry_point, to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult};
use prost::Message;
use crate::msg::{ExecuteContractMsg, QueryMsg, QueryResponse, InstantiateMsg, QueryDecryptDataResponse as JsonDcryptData};
use crate::state::STORED_DATA;
use fairblock_proto::fairyring::pep::{QueryDecryptDataRequest, QueryDecryptDataResponse};

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
        &(msg.pubkey.clone(), msg.aggr_keyshare.clone()), // Use `.clone()` to avoid moving the values
    )?;

    // Return a response
    Ok(Response::new().add_attributes(vec![
        attr("action", "store_data"),
        attr("identity", identity),
        attr("pubkey", msg.pubkey),
        attr("aggr_keyshare", msg.aggr_keyshare),
    ]))
}

#[entry_point]
pub fn query(deps: Deps<QueryMsg>, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetStoredData { identity } => {
            if identity.trim().is_empty() {
                return Err(StdError::generic_err("Identity cannot be empty"));
            }
            let stored_data = STORED_DATA.load(deps.storage, &identity)?;
            let response = QueryResponse {
                pubkey: stored_data.0,
                aggr_keyshare: stored_data.1,
            };
            to_json_binary(&response)
        }

        QueryMsg::DecryptData {
            pubkey,
            aggr_keyshare,
            encrypted_data,
        } => {
            if encrypted_data.trim().is_empty() || aggr_keyshare.trim().is_empty() {
                return Err(StdError::generic_err("Invalid input data"));
            }

            // Call the function to query the `pep` module
            let response = query_pep_decrypt(deps, pubkey, aggr_keyshare, encrypted_data)?;

            // Return the decrypted data in binary format
            Ok(response)
        }
    }
}

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    // Add logic to initialize the contract state here

    // For example, store some initial data
    if msg.identity.trim().is_empty() {
        return Err(StdError::generic_err("Identity cannot be empty"));
    }

    STORED_DATA.save(
        deps.storage,
        &msg.identity,
        &(msg.pubkey.clone(), msg.aggr_keyshare.clone()),
    )?;

    Ok(Response::new().add_attribute("method", "instantiate"))
}

// Function to query the `DecryptData` RPC from your `pep` module
pub fn query_pep_decrypt(
    deps: Deps<QueryMsg>,
    pubkey: String,
    aggr_keyshare: String,
    encrypted_data: String,
) -> StdResult<Binary> {
    // Create the request message
    let request = QueryDecryptDataRequest {
        pubkey,
        aggr_keyshare,
        encrypted_data,
    };

    let e = request.encode_to_vec();
    let d = Binary::new(e);

    // Send the query
    let raw_response: Binary = deps.querier.query_grpc("/fairyring.pep.Query/DecryptData".to_string(), d)?;
    
    let vec_res = raw_response.to_vec();
    let x = QueryDecryptDataResponse::decode(&*vec_res)
    .expect("Failed to decode Protobuf message");
    
    let json_data = JsonDcryptData {
        decrypted_data : x.decrypted_data,
    };

    let json_res = to_json_binary(&json_data)?;
    Ok(json_res)
}
