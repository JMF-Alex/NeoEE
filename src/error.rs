use serde::{Serialize, Serializer};
use std::{fmt, io};

#[derive(Debug)]
pub enum AppError {
    Io(io::Error),
    Tauri(tauri::Error),
    InvalidName(String),
    MissingDir,
}

pub type Result<T> = std::result::Result<T, AppError>;

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Io(e) => e.fmt(f),
            Self::Tauri(e) => e.fmt(f),
            Self::InvalidName(n) => write!(f, "Nombre de archivo no válido: {n}"),
            Self::MissingDir => f.write_str("La carpeta no existe"),
        }
    }
}

impl std::error::Error for AppError {}

impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self {
        Self::Io(e)
    }
}

impl From<tauri::Error> for AppError {
    fn from(e: tauri::Error) -> Self {
        Self::Tauri(e)
    }
}

impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, s: S) -> std::result::Result<S::Ok, S::Error> {
        s.collect_str(self)
    }
}
