use crate::{
    error::Result,
    models::Entry,
    services::{
        config::{desktop_dir, game_dir},
        fs::{in_dir, list, move_file},
    },
};
use std::{fs, process::Command};
use tauri::AppHandle;

#[tauri::command]
pub fn list_files(app: AppHandle) -> Result<Vec<Entry>> {
    list(&game_dir(&app)?)
}

#[tauri::command]
pub fn delete_files(app: AppHandle, names: Vec<String>) -> Result<()> {
    let dir = game_dir(&app)?;
    for n in names {
        fs::remove_file(in_dir(&dir, &n)?)?;
    }
    Ok(())
}

#[tauri::command]
pub fn move_to_desktop(app: AppHandle, names: Vec<String>) -> Result<()> {
    let (dir, desk) = (game_dir(&app)?, desktop_dir(&app)?);
    for n in names {
        move_file(&in_dir(&dir, &n)?, &in_dir(&desk, &n)?)?;
    }
    Ok(())
}

#[tauri::command]
pub fn import_from_desktop(app: AppHandle) -> Result<usize> {
    let (dir, desk) = (game_dir(&app)?, desktop_dir(&app)?);
    let mut n = 0;
    for e in fs::read_dir(&desk)?.flatten() {
        let p = e.path();
        let is_ees = p.extension().is_some_and(|x| x.eq_ignore_ascii_case("ees"));
        if is_ees && p.is_file() {
            move_file(&p, &dir.join(e.file_name()))?;
            n += 1;
        }
    }
    Ok(n)
}

#[tauri::command]
pub fn open_dir(app: AppHandle) -> Result<()> {
    Command::new("explorer").arg(game_dir(&app)?).spawn()?;
    Ok(())
}
