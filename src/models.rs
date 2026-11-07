use serde::Serialize;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Info {
    pub game_path: String,
    pub desktop: String,
}

#[derive(Serialize)]
pub struct Entry {
    pub name: String,
    pub size: u64,
    pub modified: u64,
}
