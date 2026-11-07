import { invoke } from "@tauri-apps/api/core";

export interface Info {
  gamePath: string;
  desktop: string;
}
export interface Entry {
  name: string;
  size: number;
  modified: number;
}

export const api = {
  info: () => invoke<Info>("get_info"),
  setGamePath: (path: string) => invoke<void>("set_game_path", { path }),
  list: () => invoke<Entry[]>("list_files"),
  remove: (names: string[]) => invoke<void>("delete_files", { names }),
  toDesktop: (names: string[]) => invoke<void>("move_to_desktop", { names }),
  fromDesktop: () => invoke<number>("import_from_desktop"),
  openDir: () => invoke<void>("open_dir"),
};
