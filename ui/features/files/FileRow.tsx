import { memo } from "react";
import type { Entry } from "../../lib/api";
import { cx } from "../../lib/styles";

export const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(1)} MB`);

interface Props {
  file: Entry;
  selected: boolean;
  date: string;
  onToggle: (name: string) => void;
}

export const FileRow = memo(function FileRow({ file, selected, date, onToggle }: Props) {
  return (
    <li>
      <label
        className={cx(
          "body-6 flex cursor-pointer items-center gap-3 px-6 py-3 transition duration-300 ease-base hover:bg-ink-700",
          selected && "bg-ink-600 hover:bg-ink-600",
        )}
      >
        <input type="checkbox" className="size-4 accent-violet-500" checked={selected} onChange={() => onToggle(file.name)} />
        <span className="grow truncate">{file.name}</span>
        <span className="w-20 text-right text-muted tabular-nums">{fmtSize(file.size)}</span>
        <span className="w-48 text-right text-muted tabular-nums">{date}</span>
      </label>
    </li>
  );
});

export const FileRowsSkeleton = () => (
  <ul aria-hidden className="p-6">
    {Array.from({ length: 6 }, (_, i) => (
      <li key={i} className="mb-3 h-5 animate-[shimmer_1.6s_infinite] rounded-md bg-ink-700" />
    ))}
  </ul>
);
