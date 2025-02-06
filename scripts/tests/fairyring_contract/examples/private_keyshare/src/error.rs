use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Reply error: {error}")]
    ReplyError { error: String },

    #[error("Missing reply data")]
    ReplyMissingData {},

    #[error("Pending request with id {id} not found")]
    PendingRequestNotFound { id: u64 },
}
