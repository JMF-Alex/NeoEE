import { useCallback, useEffect, useState } from "react";
import { cx } from "../lib/styles";

export type Notify = (message: string, error?: boolean) => void;

export function useToast() {
  const [state, setState] = useState<{ m: string; error: boolean } | null>(null);

  useEffect(() => {
    if (!state) return;
    const id = setTimeout(() => setState(null), 3500);
    return () => clearTimeout(id);
  }, [state]);

  const notify = useCallback<Notify>((m, error = false) => setState({ m, error }), []);
  const toast = state && (
    <div
      role={state.error ? "alert" : "status"}
      className={cx(
        "body-5 fixed right-6 bottom-6 z-60 max-w-sm animate-pop rounded-xl border bg-ink-700 px-4 py-3",
        state.error ? "border-rose-500 text-rose-300" : "border-ink-600 text-white",
      )}
    >
      {state.m}
    </div>
  );
  return { notify, toast };
}
