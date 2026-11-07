use crate::{
    error::Result,
    models::Info,
    services::config::{desktop_dir, game_dir, save_game_path},
};
use tauri::AppHandle;

#[tauri::command]
pub fn get_info(app: AppHandle) -> Result<Info> {
    Ok(Info {
        game_path: game_dir(&app)?.to_string_lossy().into(),
        desktop: desktop_dir(&app)?.to_string_lossy().into(),
    })
}

#[tauri::command]
pub fn set_game_path(app: AppHandle, path: String) -> Result<()> {
    save_game_path(&app, &path)
}
