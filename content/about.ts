/**
 * About-page content.
 *
 * TO SUPPLY BEFORE LAUNCH (never invent these):
 *  - `portrait`: the doctor's official photograph (until then a monogram plate is shown).
 *  - `credentials`: real degrees, training and memberships, with institutions and years.
 *  - `timeline`: real career milestones.
 *  - `certificates`: scans of real certificates (add files to `public/media/certificates/`).
 * Entries marked `sample: true` are rendered with a visible "Sample" label and
 * are hidden entirely when `settings.showSampleContent` is false.
 */
import type { IconName } from "@/components/ui/Icon";
import type { L10n } from "@/lib/i18n";

export const portrait: { src: string | null; alt: L10n; width: number; height: number } = {
  /** e.g. "/media/doctor/portrait.webp" — leave null to show the monogram plate. */
  src: null,
  alt: { en: "Portrait of Dr. Abdullah Elkasaby", ar: "صورة د. عبدالله القصبي" },
  width: 1200,
  height: 1500,
};

export const biography = {
  eyebrow: { en: "Meet the doctor", ar: "تعرّف على الطبيب" } satisfies L10n,
  title: { en: "Careful surgery begins with careful listening", ar: "الجراحة الدقيقة تبدأ بالإصغاء الدقيق" } satisfies L10n,
  paragraphs: [
    {
      en: "Dr. Abdullah Elkasaby works in general surgery and bariatric (weight-management) surgery, using minimally invasive laparoscopic techniques where they are suitable.",
      ar: "يعمل د. عبدالله القصبي في مجال الجراحة العامة وجراحات السمنة، مستخدمًا تقنيات المناظير طفيفة التوغل حين تكون مناسبة للحالة.",
    },
    {
      en: "Patients arrive with very different needs — a painful gallbladder, a hernia, or a long struggle with weight. In every case the aim is the same: a careful assessment, an honest explanation of the options and a plan that fits the person, followed by attentive aftercare.",
      ar: "يأتي المرضى باحتياجات مختلفة تمامًا؛ من ألم المرارة أو الفتق إلى رحلة طويلة مع الوزن. وفي كل حالة يبقى الهدف واحدًا: تقييم دقيق، وشرح صادق للخيارات، وخطة تناسب الشخص، تتبعها رعاية حريصة بعد العلاج.",
    },
  ] satisfies L10n[],
};

export type Credential = { icon: IconName; title: L10n; detail: L10n; sample?: boolean };

export const credentials: Credential[] = [
  {
    icon: "graduation",
    title: { en: "Medical education", ar: "التعليم الطبي" },
    detail: { en: "Degree, university and year to be added.", ar: "تُضاف الدرجة والجامعة وسنة التخرج." },
    sample: true,
  },
  {
    icon: "award",
    title: { en: "Surgical training", ar: "التدريب الجراحي" },
    detail: { en: "Training programme and institution to be added.", ar: "يُضاف برنامج التدريب والجهة المانحة." },
    sample: true,
  },
  {
    icon: "badge",
    title: { en: "Specialist qualifications", ar: "المؤهلات التخصصية" },
    detail: { en: "Specialist degrees or fellowships to be added.", ar: "تُضاف الدرجات التخصصية أو الزمالات." },
    sample: true,
  },
  {
    icon: "briefcase",
    title: { en: "Professional memberships", ar: "العضويات المهنية" },
    detail: { en: "Memberships of surgical societies to be added.", ar: "تُضاف العضويات في الجمعيات الجراحية." },
    sample: true,
  },
];

export type TimelineEntry = { period: L10n; title: L10n; detail: L10n; sample?: boolean };

export const timeline: TimelineEntry[] = [
  {
    period: { en: "Year", ar: "السنة" },
    title: { en: "Medical education", ar: "الدراسة الطبية" },
    detail: { en: "Institution and details to be added.", ar: "تُضاف الجهة والتفاصيل." },
    sample: true,
  },
  {
    period: { en: "Year", ar: "السنة" },
    title: { en: "Surgical residency & training", ar: "الإقامة والتدريب الجراحي" },
    detail: { en: "Hospital and training details to be added.", ar: "يُضاف المستشفى وتفاصيل التدريب." },
    sample: true,
  },
  {
    period: { en: "Year", ar: "السنة" },
    title: { en: "Specialisation in bariatric surgery", ar: "التخصص في جراحات السمنة" },
    detail: { en: "Fellowship or specialist training to be added.", ar: "تُضاف الزمالة أو التدريب التخصصي." },
    sample: true,
  },
  {
    period: { en: "Today", ar: "اليوم" },
    title: { en: "Current practice", ar: "الممارسة الحالية" },
    detail: { en: "Current hospital or clinic affiliations to be added.", ar: "تُضاف المستشفيات أو العيادات الحالية." },
    sample: true,
  },
];

export type Certificate = {
  /** e.g. "/media/certificates/fellowship.webp" — null renders a neutral sample frame. */
  src: string | null;
  width: number;
  height: number;
  alt: L10n;
};

/** Image-only gallery. Use each certificate's real pixel size so nothing is distorted. */
export const certificates: Certificate[] = Array.from({ length: 6 }, (_, i) => ({
  src: null,
  width: i % 3 === 1 ? 1100 : 1400,
  height: i % 3 === 1 ? 1400 : 1000,
  alt: { en: `Certificate ${i + 1} (placeholder)`, ar: `الشهادة ${i + 1} (عنصر مؤقت)` },
}));
