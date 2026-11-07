import { Archive, ArrowsClockwise, Desktop, DownloadSimple, Eraser, FolderOpen, Trash } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api, type Entry } from "../../lib/api";
import { Button, Panel } from "../../components/ui";
import { useConfirm } from "../../hooks/useConfirm";
import type { Notify } from "../../hooks/useToast";
import { cx } from "../../lib/styles";
import { FileRow, FileRowsSkeleton } from "./FileRow";
import { useI18n } from "../../i18n";

export default function Files({ notify, reloadKey }: { notify: Notify; reloadKey: unknown }) {
  const { t, locale } = useI18n();
  const [files, setFiles] = useState<Entry[] | null>(null); // null while loading
  const [sel, setSel] = useState<Set<string>>(new Set());
  const { ask, dialog } = useConfirm();

  const load = useCallback(async () => {
    try {
      setFiles(await api.list());
      setSel(new Set());
    } catch (e) {
      setFiles([]);
      notify(String(e), true);
    }
  }, [notify]);
  useEffect(() => void load(), [load, reloadKey]);

  const list = files ?? [];
  const autos = useMemo(() => list.filter((f) => f.name.startsWith("AutoSave")), [files]); // eslint-disable-line react-hooks/exhaustive-deps
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }), [locale]);

  const run = async (action: () => Promise<unknown>, ok: string) => {
    try {
      await action();
      notify(ok);
    } catch (e) {
      notify(String(e), true);
    }
    load();
  };

  const toggle = useCallback(
    (name: string) =>
      setSel((s) => {
        const n = new Set(s);
        if (!n.delete(name)) n.add(name);
        return n;
      }),
    [],
  );
  const all = list.length > 0 && sel.size === list.length;
  const picked = [...sel];

  const remove = async (names: string[], what: string) => {
    if (await ask(t("files.confirm", { what }))) run(() => api.remove(names), t("files.okDeleted", { n: names.length }));
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button icon={ArrowsClockwise} onClick={load}>{t("files.reload")}</Button>
        <Button icon={FolderOpen} onClick={() => run(api.openDir, t("files.okOpened"))}>{t("files.openFolder")}</Button>
        <Button
          icon={DownloadSimple}
          onClick={() =>
            run(async () => {
              if (!(await api.fromDesktop())) throw t("files.noEes");
            }, t("files.okImported"))
          }
        >
          {t("files.fromDesktop")}
        </Button>
        <div className="grow" />
        <Button
          icon={Eraser}
          disabled={!autos.length}
          onClick={() => remove(autos.map((f) => f.name), t("files.whatAutos", { n: autos.length }))}
        >
          {t("files.autosaves", { n: autos.length })}
        </Button>
        <Button tone="danger" icon={Trash} disabled={!list.length} onClick={() => remove(list.map((f) => f.name), t("files.whatAll"))}>
          {t("files.deleteAll")}
        </Button>
      </div>

      <Panel className="flex min-h-0 grow flex-col overflow-hidden p-0!">
        <div className="caption-3 flex items-center gap-3 border-b border-ink-600 px-6 py-3 text-muted">
          <input
            type="checkbox"
            className="size-4 accent-violet-500"
            checked={all}
            onChange={() => setSel(all ? new Set() : new Set(list.map((f) => f.name)))}
            aria-label={t("files.selectAll")}
          />
          <span className="grow">{t("files.colFile")}</span>
          <span className="w-20 text-right">{t("files.colSize")}</span>
          <span className="w-48 text-right">{t("files.colModified")}</span>
        </div>
        {files === null ? (
          <FileRowsSkeleton />
        ) : list.length ? (
          <ul className="min-h-0 grow overflow-y-auto">
            {list.map((f) => (
              <FileRow key={f.name} file={f} selected={sel.has(f.name)} date={fmt.format(f.modified)} onToggle={toggle} />
            ))}
          </ul>
        ) : (
          <div className="grid grow place-items-center p-6 text-center">
            <div className="flex max-w-sm flex-col items-center gap-2">
              <Archive className="size-10 text-muted" weight="duotone" aria-hidden />
              <p className="title-3">{t("files.emptyTitle")}</p>
              <p className="body-6 text-muted">{t("files.emptyHint")}</p>
            </div>
          </div>
        )}
      </Panel>

      <div className={cx("flex items-center gap-2 transition duration-300 ease-base", !sel.size && "pointer-events-none opacity-40")}>
        <span className="body-6 grow text-muted" aria-live="polite">{t("files.selected", { n: sel.size })}</span>
        <Button icon={Desktop} disabled={!sel.size} onClick={() => run(() => api.toDesktop(picked), t("files.okMoved"))}>
          {t("files.toDesktop")}
        </Button>
        <Button tone="danger" icon={Trash} disabled={!sel.size} onClick={() => remove(picked, t("files.whatSel", { n: picked.length }))}>
          {t("files.delete")}
        </Button>
      </div>
      {dialog}
    </div>
  );
}
