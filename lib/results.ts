import type { VisualData } from "@/components/results/ResultVisual";
import type { ResultCase } from "@/content/results";
import { getContent } from "@/lib/content";
import type { Locale } from "./i18n";

/** A before/after case with every string resolved for one language. */
export type ResolvedCase = {
  id: string;
  category: string;
  title: string;
  caption: string;
  aspect: number;
  placeholder: boolean;
  before: VisualData;
  after: VisualData;
};

const placeholderNote = { en: "Sample placeholder — not a patient photograph", ar: "عنصر نموذجي — ليس صورة لمريض" };

function visual(item: ResultCase, side: "before" | "after", locale: Locale, ui: ReturnType<typeof getContent>["site"]["ui"]): VisualData {
  const image = item[side];
  if (image && !item.placeholder) return { kind: "image", src: image.src, alt: image.alt[locale] };
  return { kind: "placeholder", state: side, title: ui[side][locale], note: placeholderNote[locale] };
}

/** Real cases always; sample placeholders only while `settings.showSampleContent` is on. */
export function visibleCases(locale: Locale): ResolvedCase[] {
  const { results, site } = getContent();
  return results.cases
    .filter((item) => !item.placeholder || site.settings.showSampleContent)
    .map((item) => ({
      id: item.id,
      category: item.category[locale],
      title: item.title[locale],
      caption: item.caption[locale],
      aspect: item.aspect,
      placeholder: item.placeholder,
      before: visual(item, "before", locale, site.ui),
      after: visual(item, "after", locale, site.ui),
    }));
}

export function resultLabels(locale: Locale) {
  const { ui } = getContent().site;
  return {
    before: ui.before[locale],
    after: ui.after[locale],
    slider: locale === "ar" ? "مقارنة قبل وبعد: حرّك الفاصل" : "Before and after comparison: move the divider",
  };
}
