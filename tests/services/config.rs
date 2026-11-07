#[path = "../common/mod.rs"]
mod common;

use common::TempDir;
use neoee::{
    error::AppError,
    services::config::{pick_default, read_game_path, write_game_path},
};
use std::path::PathBuf;

#[test]
fn write_then_read_round_trips() {
    let tmp = TempDir::new();
    let saves = tmp.path().join("saves");
    std::fs::create_dir(&saves).unwrap();
    let cfg = tmp.path().join("nested").join("config.json");

    write_game_path(&cfg, saves.to_str().unwrap()).unwrap();

    assert_eq!(read_game_path(&cfg), Some(saves));
}

#[test]
fn write_rejects_a_folder_that_does_not_exist() {
    let tmp = TempDir::new();
    let cfg = tmp.path().join("config.json");

    let err = write_game_path(&cfg, tmp.path().join("nope").to_str().unwrap()).unwrap_err();

    assert!(matches!(err, AppError::MissingDir));
    assert!(!cfg.exists(), "nothing is saved for an invalid folder");
}

#[test]
fn write_rejects_a_file_path() {
    let tmp = TempDir::new();
    let file = tmp.file("a.txt", "");
    assert!(write_game_path(&tmp.path().join("config.json"), file.to_str().unwrap()).is_err());
}

#[test]
fn read_ignores_missing_or_broken_config() {
    let tmp = TempDir::new();
    assert_eq!(read_game_path(&tmp.path().join("missing.json")), None);
    assert_eq!(read_game_path(&tmp.file("bad.json", "{ not json")), None);
    assert_eq!(read_game_path(&tmp.file("other.json", r#"{"gamePath": 5}"#)), None);
    assert_eq!(read_game_path(&tmp.file("empty.json", "{}")), None);
}

#[test]
fn pick_default_prefers_the_first_existing_folder() {
    let tmp = TempDir::new();
    let missing = tmp.path().join("missing");
    let existing = tmp.path().to_path_buf();

    assert_eq!(pick_default(&[missing.clone(), existing.clone()]), Some(existing.clone()));
    assert_eq!(pick_default(&[existing.clone(), missing]), Some(existing));
}

#[test]
fn pick_default_falls_back_to_the_last_candidate() {
    let a = PathBuf::from(r"Z:\neoee-a");
    let b = PathBuf::from(r"Z:\neoee-b");
    assert_eq!(pick_default(&[a, b.clone()]), Some(b));
    assert_eq!(pick_default(&[]), None);
}
