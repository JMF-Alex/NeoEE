import { GearSix } from "@phosphor-icons/react";
import { useI18n, type Lang } from "../../i18n";
import { cx, ring } from "../../lib/styles";
import { Button } from "../ui";
import { TABS, type TabId } from "./nav";

const LANGS: Lang[] = ["es", "en"];

interface Props {
  tab: TabId;
  onTab: (id: TabId) => void;
  onSettings: () => void;
}

export function Sidebar({ tab, onTab, onSettings }: Props) {
  const { t, lang, setLang } = useI18n();
  return (
    <nav aria-label={t("nav.main")} className="flex w-56 shrink-0 flex-col gap-1 border-r border-ink-600 bg-ink-900 p-3">
      <div className="heading-6 mb-4 px-3 pt-2">
        Neo<span className="text-violet-400">EE</span>
      </div>
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTab(id)}
          aria-current={tab === id ? "page" : undefined}
          className={cx(
            "button-sm flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 transition duration-300 ease-base active:scale-[0.98]",
            ring,
            tab === id ? "bg-ink-600 text-white" : "text-muted hover:bg-ink-700 hover:text-white",
          )}
        >
          <Icon className="size-5" weight={tab === id ? "fill" : "bold"} aria-hidden />
          {t(label)}
        </button>
      ))}
      <div className="grow" />
      <div role="group" aria-label={t("lang.label")} className="mb-2 flex gap-1 rounded-lg bg-ink-950 p-1">
        {LANGS.map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={lang === l}
            onClick={() => setLang(l)}
            className={cx(
              "caption-3 grow cursor-pointer rounded-md py-2 uppercase transition duration-300 ease-base",
              ring,
              lang === l ? "bg-ink-600 text-white" : "text-muted hover:text-white",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <Button tone="ghost" icon={GearSix} onClick={onSettings} className="justify-start">
        {t("nav.settings")}
      </Button>
    </nav>
  );
}
