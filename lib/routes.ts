import type { Locale } from "./i18n";

export const pageKeys = ["home", "about", "services", "results", "videos", "reviews", "articles", "contact"] as const;
export type PageKey = (typeof pageKeys)[number];

/** URL segment of every top-level page (identical in both languages). */
export const pagePaths: Record<PageKey, string> = {
  home: "",
  about: "about",
  services: "services",
  results: "before-after",
  videos: "videos",
  reviews: "reviews",
  articles: "articles",
  contact: "contact",
};

/** `/en/`, `/ar/about/` … — always with a trailing slash to match the export. */
export function localeHref(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `/${locale}/${clean}/` : `/${locale}/`;
}

export function pageHref(locale: Locale, page: PageKey, hash?: string): string {
  return `${localeHref(locale, pagePaths[page])}${hash ? `#${hash}` : ""}`;
}

export function articlePath(slug: string): string {
  return `${pagePaths.articles}/${slug}`;
}

export function articleHref(locale: Locale, slug: string): string {
  return localeHref(locale, articlePath(slug));
}

/** Strips the locale prefix and slashes: `/en/about/` → `about`. */
export function pathWithoutLocale(pathname: string): string {
  return pathname.replace(/^\/(ar|en)(?=\/|$)/, "").replace(/^\/+|\/+$/g, "");
}
