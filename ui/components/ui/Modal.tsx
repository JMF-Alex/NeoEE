import { useEffect, useId, useRef, type ReactNode } from "react";

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 grid animate-fade place-items-center bg-black/70"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-104 max-w-[90vw] animate-pop rounded-2xl border border-ink-600 bg-ink-800 p-6"
      >
        <h3 id={titleId} className="heading-6 mb-4">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}
