import { cx, field } from "../../lib/styles";

interface Props {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

export function Select({ label, value, options, onChange }: Props) {
  return (
    <label className="block">
      <span className="caption-1 mb-2 block text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cx(field, "cursor-pointer")}>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-800">
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
