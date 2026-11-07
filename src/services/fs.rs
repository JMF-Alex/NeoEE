use crate::{
    error::{AppError, Result},
    models::Entry,
};
use std::{
    ffi::OsStr,
    fs,
    path::{Path, PathBuf},
    time::UNIX_EPOCH,
};

pub fn in_dir(dir: &Path, name: &str) -> Result<PathBuf> {
    if Path::new(name).file_name() != Some(OsStr::new(name)) {
        return Err(AppError::InvalidName(name.into()));
    }
    Ok(dir.join(name))
}

pub fn move_file(from: &Path, to: &Path) -> Result<()> {
    if fs::rename(from, to).is_ok() {
        return Ok(());
    }
    fs::copy(from, to)?;
    fs::remove_file(from)?;
    Ok(())
}

pub fn list(dir: &Path) -> Result<Vec<Entry>> {
    let mut out = Vec::new();
    for e in fs::read_dir(dir)?.flatten() {
        let Ok(m) = e.metadata() else { continue };
        if !m.is_file() {
            continue;
        }
        let modified = m
            .modified()
            .ok()
            .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
            .map_or(0, |d| d.as_millis() as u64);
        out.push(Entry { name: e.file_name().to_string_lossy().into(), size: m.len(), modified });
    }
    out.sort_by(|a, b| b.modified.cmp(&a.modified));
    Ok(out)
}
