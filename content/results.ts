/**
 * Before & after gallery.
 *
 * RULES FOR REAL CASES
 *  - Only publish photographs with the patient's written consent for web use.
 *  - Remove faces, tattoos, jewellery and anything else that could identify the patient.
 *  - Do not retouch, re-light or crop the two photos differently: same pose,
 *    framing and lighting wherever possible.
 *  - Only pair images you are certain belong to the same patient and case.
 *  - Captions describe the procedure and time since surgery; never promise results.
 *
 * Put the files in `public/media/results/` (e.g. `case-01-before.webp`,
 * `case-01-after.webp`, both with the same aspect ratio), then add an entry
 * with `placeholder: false`.
 *
 * The entries below are PLACEHOLDERS: no images, rendered as neutral frames
 * that are clearly labelled "Sample placeholder — not a patient photograph".
 */
import type { L10n } from "@/lib/i18n";

export type ResultImage = { src: string; alt: L10n };

export type ResultCase = {
  id: string;
  category: L10n;
  title: L10n;
  /** e.g. "Sleeve gastrectomy · 12 months after surgery". */
  caption: L10n;
  before: ResultImage | null;
  after: ResultImage | null;
  /** Width / height of both photos, e.g. 4 / 5. */
  aspect: number;
  placeholder: boolean;
};

const sampleCaption: L10n = {
  en: "Sample layout — consented, non-identifying patient photographs will appear here.",
  ar: "تصميم نموذجي — ستظهر هنا صور المرضى بموافقتهم ودون ما يكشف هويتهم.",
};

export const resultCases: ResultCase[] = [1, 2, 3, 4].map((n) => ({
  id: `sample-${n}`,
  category: { en: "Weight-management surgery", ar: "جراحات السمنة" },
  title: { en: `Sample case ${n}`, ar: `حالة نموذجية ${n}` },
  caption: sampleCaption,
  before: null,
  after: null,
  aspect: 4 / 5,
  placeholder: true,
}));

export const resultsDisclaimer: L10n = {
  en: "Results differ from patient to patient and depend on many factors, including health before surgery, adherence to follow-up and lifestyle. These images do not guarantee a similar result. Photographs are published only with the patient's written consent.",
  ar: "تختلف النتائج من مريض لآخر وتعتمد على عوامل عديدة، منها الحالة الصحية قبل الجراحة والالتزام بالمتابعة ونمط الحياة. ولا تضمن هذه الصور الحصول على نتيجة مماثلة. وتُنشر الصور فقط بموافقة كتابية من المريض.",
};
