import { serviceGroups, services } from "@/content/practice";
import type { Locale } from "@/lib/i18n";
import { Media } from "../ui/Media";
import type { ProcedureItem } from "./ProcedureGrid";

/** Services from content/practice.ts as procedure cards (server-rendered images). */
export function procedureItems(locale: Locale, filter: (slug: string, group: string) => boolean = () => true): ProcedureItem[] {
  return services
    .filter((s) => filter(s.slug, s.group))
    .map((s) => ({
      id: s.slug,
      group: serviceGroups[s.group].short[locale],
      title: s.title[locale],
      summary: s.summary[locale],
      body: s.body[locale],
      points: s.points.map((p) => p[locale]),
      image: <Media slot={s.image} locale={locale} sizes="(min-width: 1100px) 300px, (min-width: 640px) 50vw, 100vw" />,
      modalImage: <Media slot={s.image} locale={locale} sizes="(min-width: 700px) 672px, 100vw" decorative />,
    }));
}
