pub mod contract;
pub mod msg;
pub mod state;
pub mod error;


// use cosmwasm_std::{entry_point, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdError, StdResult};

// #[entry_point]
// pub fn instantiate(deps: DepsMut, env: Env, info: MessageInfo, msg: InstantiateMsg) -> StdResult<Response> {
//     contract::instantiate(deps, env, info, msg)
// }

// #[entry_point]
// pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
//     contract::execute(deps, env, info, msg)
// }

// #[entry_point]
// pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
//     contract::query(deps, env, msg)
// }
