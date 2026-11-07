#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use neoee::commands::{saves, settings};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            settings::get_info,
            settings::set_game_path,
            saves::list_files,
            saves::delete_files,
            saves::move_to_desktop,
            saves::import_from_desktop,
            saves::open_dir,
        ])
        .run(tauri::generate_context!())
        .expect("error while running NeoEE");
}
