import { Archive, DiceFive, Sword, type Icon } from "@phosphor-icons/react";
import type { Key } from "../../i18n";

export const TABS = [
  { id: "files", label: "nav.files", icon: Archive },
  { id: "game", label: "nav.game", icon: Sword },
  { id: "roulette", label: "nav.roulette", icon: DiceFive },
] as const satisfies readonly { id: string; label: Key; icon: Icon }[];

export type TabId = (typeof TABS)[number]["id"];
