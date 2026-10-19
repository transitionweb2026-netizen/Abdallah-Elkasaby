import type { Metadata } from "next";
import { pages } from "@/content/pages";
import { doctor } from "@/content/site";
import { isLocale, localeSettings, locales, otherLocale, type Locale } from "./i18n";
import { localeHref, pagePaths, type PageKey } from "./routes";

/** `generateMetadata` for a top-level page, from content/pages.ts. */
export function topLevelMetadata(page: PageKey) {
  return async ({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> => {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    const { meta } = pages[page];
    return pageMetadata({ locale, path: pagePaths[page], title: meta.title[locale], description: meta.description[locale] });
  };
}

type PageMetaInput = {
  locale: Locale;
  /** Path below the locale, e.g. "about" or "articles/understanding-bariatric-surgery". */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  /** Use the title as-is instead of applying the "| Dr. …" template. */
  absoluteTitle?: boolean;
};

/**
 * Per-page metadata: canonical URL, reciprocal hreflang links (both language
 * versions of every page exist), Open Graph and Twitter cards.
 */
export function pageMetadata({ locale, path, title, description, type = "website", absoluteTitle }: PageMetaInput): Metadata {
  const url = localeHref(locale, path);
  const image = { url: `/og/og-${locale}.png`, width: 1200, height: 630, alt: doctor.name[locale] };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(locales.map((l) => [l, localeHref(l, path)])),
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: doctor.name[locale],
      locale: localeSettings[locale].ogLocale,
      alternateLocale: [localeSettings[otherLocale(locale)].ogLocale],
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
