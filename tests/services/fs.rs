#[path = "../common/mod.rs"]
mod common;

use common::TempDir;
use neoee::{
    error::AppError,
    services::fs::{in_dir, list, move_file},
};
use std::{
    fs,
    path::Path,
    time::{Duration, SystemTime},
};

#[test]
fn in_dir_joins_plain_names() {
    assert_eq!(in_dir(Path::new("x"), "a.ees").unwrap(), Path::new("x").join("a.ees"));
}

#[test]
fn in_dir_rejects_anything_that_could_escape() {
    for bad in [r"..\a.ees", "../a.ees", r"C:\a.ees", "sub/a.ees", "", ".."] {
        assert!(matches!(in_dir(Path::new("x"), bad), Err(AppError::InvalidName(_))), "{bad}");
    }
}

#[test]
fn move_file_moves_content() {
    let tmp = TempDir::new();
    let from = tmp.file("a.ees", "data");
    let to = tmp.path().join("b.ees");

    move_file(&from, &to).unwrap();

    assert!(!from.exists());
    assert_eq!(fs::read_to_string(to).unwrap(), "data");
}

#[test]
fn move_file_fails_for_a_missing_source() {
    let tmp = TempDir::new();
    assert!(move_file(&tmp.path().join("nope"), &tmp.path().join("b")).is_err());
}

#[test]
fn list_returns_files_only_with_sizes() {
    let tmp = TempDir::new();
    tmp.file("a.ees", "12345");
    fs::create_dir(tmp.path().join("folder")).unwrap();

    let out = list(tmp.path()).unwrap();

    assert_eq!(out.len(), 1);
    assert_eq!((out[0].name.as_str(), out[0].size), ("a.ees", 5));
}

#[test]
fn list_sorts_newest_first() {
    let tmp = TempDir::new();
    let old = tmp.file("old.ees", "");
    tmp.file("new.ees", "");
    let long_ago = SystemTime::now() - Duration::from_secs(3600);
    fs::File::options().write(true).open(old).unwrap().set_modified(long_ago).unwrap();

    let names: Vec<_> = list(tmp.path()).unwrap().into_iter().map(|e| e.name).collect();

    assert_eq!(names, ["new.ees", "old.ees"]);
}

#[test]
fn list_fails_for_a_missing_folder() {
    let tmp = TempDir::new();
    assert!(list(&tmp.path().join("nope")).is_err());
}
