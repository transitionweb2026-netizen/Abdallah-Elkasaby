import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Media } from "../ui/Media";
import type { ProcedureItem } from "./ProcedureGrid";

/** Services from the content layer as procedure cards (server-rendered images). */
export function procedureItems(locale: Locale, filter: (slug: string, group: string) => boolean = () => true): ProcedureItem[] {
  const { serviceGroups, services } = getContent().practice;
  return services
    .filter((s) => filter(s.slug, s.group))
    .map((s) => ({
      id: s.slug,
      // Falls back to the raw slug if a service references a group that
      // isn't published yet — never crashes the page over it.
      group: serviceGroups[s.group]?.short[locale] ?? s.group,
      title: s.title[locale],
      summary: s.summary[locale],
      body: s.body[locale],
      points: s.points.map((p) => p[locale]),
      image: <Media slot={s.image} locale={locale} sizes="(min-width: 1100px) 300px, (min-width: 640px) 50vw, 100vw" />,
      modalImage: <Media slot={s.image} locale={locale} sizes="(min-width: 700px) 672px, 100vw" decorative />,
    }));
}
