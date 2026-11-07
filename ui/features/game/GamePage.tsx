import { ClipboardText, Shuffle } from "@phosphor-icons/react";
import { useState } from "react";
import { Button, Panel, Select } from "../../components/ui";
import { OPTIONS, type Group } from "../../lib/options";
import type { Notify } from "../../hooks/useToast";
import { useI18n, type Key } from "../../i18n";

const FIELDS: { name: "MapSize" | "Difficulty" | "MapType" | "GameType"; group: Group; label: Key }[] = [
  { name: "MapSize", group: "size", label: "game.size" },
  { name: "Difficulty", group: "diff", label: "game.difficulty" },
  { name: "MapType", group: "mtype", label: "game.mapType" },
  { name: "GameType", group: "game", label: "game.gameType" },
];

const pick = (a: readonly string[]) => a[Math.floor(Math.random() * a.length)];
const initial = () => Object.fromEntries(FIELDS.map((f) => [f.name, OPTIONS[f.group][0]])) as Record<string, string>;

export default function Game({ notify }: { notify: Notify }) {
  const { t, label } = useI18n();
  const [v, setV] = useState(initial);

  const copy = () =>
    navigator.clipboard.writeText(JSON.stringify(v)).then(
      () => notify(t("game.copied")),
      () => notify(t("game.copyFailed"), true),
    );

  return (
    <Panel title={t("game.title")} className="max-w-xl">
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map((f) => (
          <Select
            key={f.name}
            label={t(f.label)}
            value={v[f.name]}
            options={OPTIONS[f.group].map((id) => ({ value: id, label: label(f.group, id) }))}
            onChange={(x) => setV((s) => ({ ...s, [f.name]: x }))}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-2">
        <Button icon={Shuffle} onClick={() => setV(Object.fromEntries(FIELDS.map((f) => [f.name, pick(OPTIONS[f.group])])))}>
          {t("game.random")}
        </Button>
        <Button tone="primary" icon={ClipboardText} onClick={copy}>
          {t("game.copy")}
        </Button>
      </div>
    </Panel>
  );
}
