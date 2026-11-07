import { useCallback, useRef, useState } from "react";
import { Button, Modal } from "../components/ui";
import { useI18n } from "../i18n";

export function useConfirm() {
  const { t } = useI18n();
  const [msg, setMsg] = useState<string | null>(null);
  const resolve = useRef<(v: boolean) => void>(null);
  const ask = useCallback(
    (m: string) =>
      new Promise<boolean>((r) => {
        resolve.current = r;
        setMsg(m);
      }),
    [],
  );
  const done = (v: boolean) => {
    resolve.current?.(v);
    setMsg(null);
  };
  const dialog = msg && (
    <Modal title={t("common.confirm")} onClose={() => done(false)}>
      <p className="body-6 mb-6 text-muted">{msg}</p>
      <div className="flex justify-end gap-2">
        <Button onClick={() => done(false)}>{t("common.cancel")}</Button>
        <Button tone="danger" onClick={() => done(true)} autoFocus>
          {t("common.continue")}
        </Button>
      </div>
    </Modal>
  );
  return { ask, dialog };
}
