// state.rs
use cw_storage_plus::Map;

pub const STORED_DATA: Map<&str, (String, String)> = Map::new("stored_data");
