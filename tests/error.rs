use neoee::error::AppError;
use std::io;

#[test]
fn messages_are_shown_to_the_user_as_is() {
    assert_eq!(AppError::MissingDir.to_string(), "La carpeta no existe");
    assert_eq!(AppError::InvalidName("a/b".into()).to_string(), "Nombre de archivo no válido: a/b");
}

#[test]
fn io_errors_keep_their_message() {
    let e: AppError = io::Error::new(io::ErrorKind::NotFound, "gone").into();
    assert_eq!(e.to_string(), "gone");
}

#[test]
fn serializes_as_a_plain_string() {
    let json = serde_json::to_string(&AppError::MissingDir).unwrap();
    assert_eq!(json, "\"La carpeta no existe\"");
}
