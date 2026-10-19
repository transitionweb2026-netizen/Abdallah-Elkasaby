import type { VisualData } from "@/components/results/ResultVisual";
import { resultCases, type ResultCase } from "@/content/results";
import { settings, ui } from "@/content/site";
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

function visual(item: ResultCase, side: "before" | "after", locale: Locale): VisualData {
  const image = item[side];
  if (image && !item.placeholder) return { kind: "image", src: image.src, alt: image.alt[locale] };
  return { kind: "placeholder", state: side, title: ui[side][locale], note: placeholderNote[locale] };
}

/** Real cases always; sample placeholders only while `settings.showSampleContent` is on. */
export function visibleCases(locale: Locale): ResolvedCase[] {
  return resultCases
    .filter((item) => !item.placeholder || settings.showSampleContent)
    .map((item) => ({
      id: item.id,
      category: item.category[locale],
      title: item.title[locale],
      caption: item.caption[locale],
      aspect: item.aspect,
      placeholder: item.placeholder,
      before: visual(item, "before", locale),
      after: visual(item, "after", locale),
    }));
}

export function resultLabels(locale: Locale) {
  return {
    before: ui.before[locale],
    after: ui.after[locale],
    slider: locale === "ar" ? "مقارنة قبل وبعد: حرّك الفاصل" : "Before and after comparison: move the divider",
  };
}
