/**
 * Image slots used across the site. `name` refers to a processed photo in
 * `content/media-variants.generated.json` (source files live in `assets-src/`).
 *
 * TEMPORARY IMAGERY: every photo below is licensed stock photography
 * (Unsplash) chosen to illustrate a medical environment. None of them shows
 * Dr. Abdullah Elkasaby, his clinic, his team or his patients, and the alt text
 * never claims otherwise. Replace with the clinic's own photography before
 * launch: add the file to `assets-src/`, update `name` here, run `npm run images`.
 */
import type { L10n } from "@/lib/i18n";

export type MediaSlot = {
  name: string;
  alt: L10n;
  /** CSS object-position for wide layouts, e.g. "70% 40%". */
  position?: string;
  /** CSS object-position on narrow screens. */
  positionMobile?: string;
  /** Mirror the photo in this text direction so its subject faces the copy. */
  flipIn?: "ltr" | "rtl";
  /** Stock imagery standing in for clinic photography. */
  stock?: boolean;
};

const slot = (s: MediaSlot): MediaSlot => ({ stock: true, ...s });

export const media = {
  heroHome: slot({
    name: "hero-home",
    alt: { en: "Surgeon in blue scrubs operating under theatre lights", ar: "جرّاح بملابس العمليات الزرقاء أثناء إجراء جراحة" },
    position: "38% 40%",
    positionMobile: "34% 35%",
    flipIn: "ltr",
  }),
  heroAbout: slot({
    name: "hero-about",
    alt: { en: "Doctor in a white coat holding a stethoscope", ar: "طبيب بالمعطف الأبيض يحمل سماعة طبية" },
    position: "50% 35%",
    positionMobile: "55% 30%",
  }),
  heroServices: slot({
    name: "hero-services",
    alt: { en: "Modern operating theatre with surgical lights and equipment", ar: "غرفة عمليات حديثة بأضوائها وتجهيزاتها الجراحية" },
    position: "60% 45%",
    positionMobile: "55% 40%",
  }),
  heroResults: slot({
    name: "hero-results",
    alt: { en: "Person in running shoes climbing outdoor steps", ar: "شخص بحذاء رياضي يصعد درجات سلّم في الهواء الطلق" },
    position: "50% 55%",
    positionMobile: "45% 60%",
  }),
  heroVideos: slot({
    name: "hero-videos",
    alt: { en: "Two clinicians reviewing medical images on screens", ar: "طبيبان يراجعان صورًا طبية على الشاشات" },
    position: "62% 40%",
    positionMobile: "70% 40%",
  }),
  heroReviews: slot({
    name: "hero-reviews",
    alt: { en: "Two people holding hands in reassurance", ar: "يدان متشابكتان في لحظة طمأنينة" },
    position: "55% 50%",
    positionMobile: "50% 50%",
  }),
  heroArticles: slot({
    name: "hero-articles",
    alt: { en: "Balanced meal of vegetables, eggs and avocado", ar: "وجبة متوازنة من الخضروات والبيض والأفوكادو" },
    position: "62% 50%",
    positionMobile: "62% 40%",
  }),
  heroContact: slot({
    name: "hero-contact",
    alt: { en: "Stethoscope resting on an examination bed", ar: "سماعة طبية على سرير الفحص" },
    position: "62% 50%",
    positionMobile: "65% 50%",
  }),
  surgicalTeam: slot({
    name: "surgical-team",
    alt: { en: "Surgical team working under operating lights", ar: "فريق جراحي يعمل تحت أضواء غرفة العمليات" },
    position: "50% 40%",
  }),
  operatingRoomBright: slot({
    name: "operating-room-bright",
    alt: { en: "Clean, bright operating room", ar: "غرفة عمليات نظيفة ومشرقة" },
    position: "50% 50%",
  }),
  operatingRoomTeam: slot({
    name: "operating-room-team",
    alt: { en: "Theatre team preparing for a procedure", ar: "فريق غرفة العمليات يستعد لإجراء جراحي" },
    position: "45% 50%",
  }),
  healthyBowl: slot({
    name: "healthy-bowl",
    alt: { en: "Bowl of vegetables, legumes and fresh salad", ar: "طبق من الخضروات والبقوليات والسلطة الطازجة" },
    position: "50% 50%",
  }),
  healthyTable: slot({
    name: "hero-articles",
    alt: { en: "Balanced meal with vegetables, eggs and avocado", ar: "وجبة متوازنة من الخضروات والبيض والأفوكادو" },
    position: "50% 50%",
  }),
  activeLifestyle: slot({
    name: "active-lifestyle",
    alt: { en: "Woman exercising on a mat in a bright room", ar: "امرأة تمارس الرياضة على بساط في غرفة مشرقة" },
    position: "50% 60%",
  }),
  consultation: slot({
    name: "reassurance",
    alt: { en: "Two people holding hands in reassurance", ar: "يدان متشابكتان في لحظة طمأنينة" },
    position: "50% 50%",
  }),
  surgeonsOverhead: slot({
    name: "surgeons-overhead",
    alt: { en: "Surgical team seen from below the operating light", ar: "فريق جراحي يظهر من أسفل ضوء غرفة العمليات" },
    position: "50% 50%",
  }),
  wellness: slot({
    name: "wellness",
    alt: { en: "Person meditating in warm morning light", ar: "شخص يتأمل في ضوء الصباح الدافئ" },
    position: "50% 45%",
  }),
  stethoscope: slot({
    name: "stethoscope",
    alt: { en: "Stethoscope resting on a white surface", ar: "سماعة طبية على سطح أبيض" },
    position: "50% 50%",
  }),
  clinicalReview: slot({
    name: "clinical-review",
    alt: { en: "Clinicians discussing scan results at a workstation", ar: "طبيبان يناقشان نتائج الأشعة أمام الشاشة" },
    position: "50% 40%",
  }),
  wardBeds: slot({
    name: "ward-beds",
    alt: { en: "Clean hospital recovery ward", ar: "جناح تعافٍ نظيف في المستشفى" },
    position: "50% 50%",
  }),
} satisfies Record<string, MediaSlot>;

export type MediaKey = keyof typeof media;
