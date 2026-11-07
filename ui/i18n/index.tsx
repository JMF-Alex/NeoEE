import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import en from "./en";
import es from "./es";

export type Lang = "en" | "es";
type Full = keyof typeof en;
type Base<K> = K extends `${infer B}_one` | `${infer B}_other` ? B : never;
export type Key = Full | Base<Full>;
type Vars = Record<string, string | number>;

const DICTS: Record<Lang, Record<string, string>> = { en, es };
const STORAGE_KEY = "neoee.lang";

const initialLang = (): Lang => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
  } catch {
    // storage can be unavailable, fall through to the system language
  }
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
};

function useI18nValue() {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // the choice just won't persist
    }
  }, []);

  return useMemo(() => {
    const dict = DICTS[lang];
    const plural = new Intl.PluralRules(lang);
    // a numeric `n` in vars picks the `key_one` / `key_other` variant when it exists
    const t = (key: Key, vars?: Vars) => {
      const form = typeof vars?.n === "number" ? (dict[`${key}_${plural.select(vars.n)}`] ?? dict[`${key}_other`]) : undefined;
      const text = form ?? dict[key] ?? key;
      return vars ? text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? "")) : text;
    };
    // game types (2v2, 3v3...) are universal; the other groups have translated labels
    const label = (group: string, id: string) => (group === "game" ? id : (dict[`${group}.${id}`] ?? id));
    return { lang, setLang, t, label, locale: lang === "es" ? "es-ES" : "en-US" };
  }, [lang, setLang]);
}

const Ctx = createContext<ReturnType<typeof useI18nValue> | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useI18nValue()}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside I18nProvider");
  return v;
}
