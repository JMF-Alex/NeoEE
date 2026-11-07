import { useState } from "react";
import { useI18n } from "../../i18n";
import { cx, field } from "../../lib/styles";
import { Button, Modal } from "../ui";

interface Props {
  initialPath: string;
  onSave: (path: string) => Promise<void>;
  onClose: () => void;
}

export function SettingsDialog({ initialPath, onSave, onClose }: Props) {
  const { t } = useI18n();
  const [path, setPath] = useState(initialPath);
  return (
    <Modal title={t("settings.title")} onClose={onClose}>
      <input
        value={path}
        onChange={(e) => setPath(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSave(path)}
        spellCheck={false}
        autoFocus
        aria-label={t("settings.title")}
        className={cx(field, "mb-6")}
      />
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button tone="primary" onClick={() => onSave(path)}>
          {t("common.save")}
        </Button>
      </div>
    </Modal>
  );
}
