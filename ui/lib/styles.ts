export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export const ring = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400";

export const field =
  "body-5 w-full rounded-lg bg-ink-900 px-3 py-2 text-white border border-ink-600 outline-none transition duration-300 ease-base focus:border-violet-400";
