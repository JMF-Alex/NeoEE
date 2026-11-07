use neoee::models::{Entry, Info};

#[test]
fn info_uses_camel_case_keys() {
    let info = Info { game_path: r"C:\Saves".into(), desktop: r"C:\Desktop".into() };
    let v = serde_json::to_value(info).unwrap();
    assert_eq!(v["gamePath"], r"C:\Saves");
    assert_eq!(v["desktop"], r"C:\Desktop");
    assert!(v.get("game_path").is_none());
}

#[test]
fn entry_keeps_its_fields() {
    let v = serde_json::to_value(Entry { name: "a.ees".into(), size: 3, modified: 9 }).unwrap();
    assert_eq!(v["name"], "a.ees");
    assert_eq!(v["size"], 3);
    assert_eq!(v["modified"], 9);
}
