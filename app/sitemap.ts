import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content";
import { locales } from "@/lib/i18n";
import { articlePath, localeHref, pageKeys, pagePaths } from "@/lib/routes";
import { hasProductionUrl, siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

/**
 * Every page in both languages, with reciprocal hreflang alternates.
 * `getContent().articles` only ever contains published CMS content merged
 * over the bundled defaults — a draft can never reach the sitemap.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Without a production domain the URLs would be wrong, so publish an empty sitemap.
  if (!hasProductionUrl) return [];

  const paths = [...pageKeys.map((key) => pagePaths[key]), ...getContent().articles.map((a) => articlePath(a.slug))];
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(locales.map((locale) => [locale, `${siteUrl}${localeHref(locale, path)}`]));
    return locales.map((locale) => ({
      url: `${siteUrl}${localeHref(locale, path)}`,
      alternates: { languages },
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.includes("/") ? 0.6 : 0.8,
    }));
  });
}
