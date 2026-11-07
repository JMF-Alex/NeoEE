import type { ReactNode } from "react";
import { cx } from "../../lib/styles";

export function Panel({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-2xl border border-ink-600 bg-ink-800 p-6", className)}>
      {title && <h2 className="title-3 mb-4">{title}</h2>}
      {children}
    </section>
  );
}
