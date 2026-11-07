import { Play } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Panel } from "../../components/ui";
import { cx, field, ring } from "../../lib/styles";
import { Wheel } from "./Wheel";
import { OPTIONS, type Group } from "../../lib/options";
import { useI18n, type Key } from "../../i18n";

const SOURCES: { group: Group; label: Key }[] = [
  { group: "size", label: "roulette.src.size" },
  { group: "diff", label: "roulette.src.diff" },
  { group: "mtype", label: "roulette.src.mtype" },
  { group: "game", label: "roulette.src.game" },
];
const SPIN_MS = 4500;

export default function Roulette() {
  const { t, label } = useI18n();
  const [source, setSource] = useState<Group | "">("size");
  const [custom, setCustom] = useState("");
  const [rot, setRot] = useState(0);
  const [spinMs, setSpinMs] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const timer = useRef<number>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  // presets are derived so they follow the active language
  const text = source ? OPTIONS[source].map((id) => label(source, id)).join("\n") : custom;
  const slots = useMemo(() => text.split("\n").map((s) => s.trim()).filter(Boolean), [text]);
  const spinning = spinMs > 0;

  const spin = () => {
    const step = 360 / slots.length;
    const i = Math.floor(Math.random() * slots.length);
    // land the centre of slice i under the pointer, after at least 5 full turns
    const delta = (((-(i + 0.5) * step - rot) % 360) + 360) % 360;
    const ms = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : SPIN_MS;
    setRot(rot + 360 * 5 + delta);
    setSpinMs(ms);
    setWinner(null);
    timer.current = window.setTimeout(() => {
      setSpinMs(0);
      setWinner(slots[i]);
    }, ms);
  };

  return (
    <div className="grid h-full grid-cols-[1fr_20rem] gap-4">
      <Panel className="grid place-items-center">
        <div className="relative w-full max-w-104">
          <Wheel slots={slots} rot={rot} ms={spinMs} title={t("roulette.wheel")} />
        </div>
      </Panel>

      <div className="flex min-h-0 flex-col gap-4">
        <Panel title={t("roulette.options")} className="flex min-h-0 grow flex-col">
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={t("roulette.options")}>
            {SOURCES.map((s) => (
              <button
                key={s.group}
                type="button"
                aria-pressed={source === s.group}
                onClick={() => setSource(s.group)}
                className={cx(
                  "caption-3 cursor-pointer rounded-md px-3 py-2 transition duration-300 ease-base active:scale-[0.98]",
                  ring,
                  source === s.group ? "bg-ink-600 text-white" : "text-muted hover:bg-ink-700 hover:text-white",
                )}
              >
                {t(s.label)}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={(e) => (setCustom(e.target.value), setSource(""))}
            spellCheck={false}
            aria-label={t("roulette.options")}
            placeholder={t("roulette.placeholder")}
            className={cx(field, "min-h-0 grow resize-none")}
          />
        </Panel>
        <Button tone="primary" icon={Play} disabled={spinning || !slots.length} onClick={spin}>
          {t("roulette.spin")}
        </Button>
        <div className="heading-4 h-12 truncate text-center text-violet-400" aria-live="polite">
          {winner}
        </div>
      </div>
    </div>
  );
}
