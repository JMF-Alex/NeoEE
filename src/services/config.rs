use crate::error::{AppError, Result};
use std::{
    fs,
    path::{Path, PathBuf},
};
use tauri::{AppHandle, Manager};

const DEFAULT_DIRS: [&str; 2] = [
    r"E:\Neo Empire Earth\Empire Earth\Data\Saved Games",
    r"C:\Program Files (x86)\Neo Empire Earth\Empire Earth\Data\Saved Games",
];

fn config_file(app: &AppHandle) -> Result<PathBuf> {
    Ok(app.path().app_config_dir()?.join("config.json"))
}

/// The folder stored in the config file at `file`, if it exists and is readable.
pub fn read_game_path(file: &Path) -> Option<PathBuf> {
    let text = fs::read_to_string(file).ok()?;
    let json = serde_json::from_str::<serde_json::Value>(&text).ok()?;
    json["gamePath"].as_str().map(PathBuf::from)
}

/// Validates `path` as an existing folder and stores it in the config file at `file`.
pub fn write_game_path(file: &Path, path: &str) -> Result<()> {
    if !Path::new(path).is_dir() {
        return Err(AppError::MissingDir);
    }
    if let Some(parent) = file.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(file, serde_json::json!({ "gamePath": path }).to_string())?;
    Ok(())
}

/// The first of `candidates` that exists, or the last one when none does.
pub fn pick_default(candidates: &[PathBuf]) -> Option<PathBuf> {
    candidates.iter().find(|p| p.exists()).or(candidates.last()).cloned()
}

/// The folder chosen in settings, else the first default install location that exists.
pub fn game_dir(app: &AppHandle) -> Result<PathBuf> {
    if let Some(saved) = read_game_path(&config_file(app)?) {
        return Ok(saved);
    }
    let defaults = DEFAULT_DIRS.map(PathBuf::from);
    Ok(pick_default(&defaults).expect("DEFAULT_DIRS is not empty"))
}

pub fn desktop_dir(app: &AppHandle) -> Result<PathBuf> {
    Ok(app.path().desktop_dir()?)
}

pub fn save_game_path(app: &AppHandle, path: &str) -> Result<()> {
    write_game_path(&config_file(app)?, path)
}
