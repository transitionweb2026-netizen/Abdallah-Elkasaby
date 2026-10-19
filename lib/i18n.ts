export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

/** Used when neither a saved choice nor the browser language matches. */
export const defaultLocale: Locale = "ar";

/** localStorage key holding the visitor's explicit language choice. */
export const LOCALE_STORAGE_KEY = "ae-locale";

export const localeSettings: Record<Locale, { dir: "rtl" | "ltr"; label: string; ogLocale: string }> = {
  ar: { dir: "rtl", label: "العربية", ogLocale: "ar_AR" },
  en: { dir: "ltr", label: "English", ogLocale: "en_US" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** A string written in both site languages. */
export type L10n = Record<Locale, string>;
