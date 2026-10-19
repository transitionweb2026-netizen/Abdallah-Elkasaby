/**
 * Patient reviews.
 *
 * Publish only genuine reviews, with the patient's permission. Do not add star
 * ratings or review counts unless they come from a verifiable source.
 *
 * The three entries below are SAMPLE LAYOUT CONTENT (`sample: true`). Their
 * text describes the review policy instead of imitating a testimonial, they are
 * labelled "Sample" on the page, and they disappear when
 * `settings.showSampleContent` is false. Replace them with real reviews and
 * remove the `sample` flag.
 */
import type { L10n } from "@/lib/i18n";

export type Review = {
  id: string;
  /** Initials or a first name only, unless the patient agreed to more. */
  author: L10n;
  /** Optional context, e.g. "Laparoscopic gallbladder surgery". */
  context?: L10n;
  text: L10n;
  sample?: boolean;
};

export const reviews: Review[] = [
  {
    id: "sample-1",
    author: { en: "Sample review", ar: "مراجعة نموذجية" },
    context: { en: "Verified patient review — to be added", ar: "مراجعة موثّقة من مريض — تُضاف لاحقًا" },
    text: {
      en: "This card shows where a patient's own words will appear, once they have given written permission for their review to be published.",
      ar: "تُظهر هذه البطاقة المكان الذي ستظهر فيه كلمات المريض نفسه، بعد حصولنا على إذنه الكتابي بنشر مراجعته.",
    },
    sample: true,
  },
  {
    id: "sample-2",
    author: { en: "Sample review", ar: "مراجعة نموذجية" },
    context: { en: "Verified patient review — to be added", ar: "مراجعة موثّقة من مريض — تُضاف لاحقًا" },
    text: {
      en: "Reviews are published as patients write them, with names shortened or hidden to protect their privacy.",
      ar: "تُنشر المراجعات كما يكتبها المرضى، مع اختصار الأسماء أو إخفائها حفاظًا على خصوصيتهم.",
    },
    sample: true,
  },
  {
    id: "sample-3",
    author: { en: "Sample review", ar: "مراجعة نموذجية" },
    context: { en: "Verified patient review — to be added", ar: "مراجعة موثّقة من مريض — تُضاف لاحقًا" },
    text: {
      en: "Each review reflects one person's experience. Treatment and recovery differ from patient to patient.",
      ar: "تعكس كل مراجعة تجربة شخص واحد، ويختلف العلاج والتعافي من مريض لآخر.",
    },
    sample: true,
  },
];
