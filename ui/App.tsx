import { useEffect, useState } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { SettingsDialog } from "./components/layout/SettingsDialog";
import { TABS, type TabId } from "./components/layout/nav";
import FilesPage from "./features/files/FilesPage";
import GamePage from "./features/game/GamePage";
import RoulettePage from "./features/roulette/RoulettePage";
import { useToast } from "./hooks/useToast";
import { useI18n } from "./i18n";
import { api, type Info } from "./lib/api";
import { cx, ring } from "./lib/styles";

export default function App() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabId>("files");
  const [info, setInfo] = useState<Info | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { notify, toast } = useToast();

  useEffect(() => void api.info().then(setInfo), []);

  const savePath = async (path: string) => {
    try {
      await api.setGamePath(path);
      setInfo(await api.info());
      setSettingsOpen(false);
    } catch (e) {
      notify(String(e), true);
    }
  };

  const current = TABS.find((x) => x.id === tab)!;

  return (
    <div className="flex h-full">
      <a
        href="#main"
        className={cx("button-sm sr-only rounded-lg bg-violet-500 px-3 py-2 focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-70", ring)}
      >
        {t("app.skip")}
      </a>
      <Sidebar tab={tab} onTab={setTab} onSettings={() => setSettingsOpen(true)} />

      <main id="main" tabIndex={-1} className="min-w-0 grow overflow-y-auto p-6 outline-none">
        <header className="mb-6 flex items-baseline gap-3">
          <h1 className="heading-5">{t(current.label)}</h1>
          {tab === "files" && <span className="caption-1 truncate text-muted">{info?.gamePath}</span>}
        </header>
        <div className="h-[calc(100%-4.5rem)] animate-fade" key={tab}>
          {tab === "files" && <FilesPage notify={notify} reloadKey={info?.gamePath} />}
          {tab === "game" && <GamePage notify={notify} />}
          {tab === "roulette" && <RoulettePage />}
        </div>
      </main>

      {settingsOpen && <SettingsDialog initialPath={info?.gamePath ?? ""} onSave={savePath} onClose={() => setSettingsOpen(false)} />}
      {toast}
    </div>
  );
}
