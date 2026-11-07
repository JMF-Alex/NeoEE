import type { Icon } from "@phosphor-icons/react";
import type { ButtonHTMLAttributes } from "react";
import { cx, ring } from "../../lib/styles";

const tones = {
  primary: "bg-violet-500 text-white hover:bg-violet-400",
  danger: "bg-rose-500 text-white hover:bg-rose-400",
  secondary: "bg-ink-700 text-white hover:bg-ink-600",
  ghost: "text-muted hover:bg-ink-700 hover:text-white",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { tone?: keyof typeof tones; icon?: Icon };

export function Button({ tone = "secondary", icon: Icon, className, children, ...p }: Props) {
  return (
    <button
      type="button"
      {...p}
      className={cx(
        "button-md inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 whitespace-nowrap",
        "transition duration-300 ease-base active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
        ring,
        tones[tone],
        className,
      )}
    >
      {Icon && <Icon className="size-5" weight="bold" aria-hidden />}
      {children}
    </button>
  );
}
