/**
 * Video library.
 *
 * The entries below are PLANNED TOPICS, not published videos: each has
 * `source: null`, so it is shown with a "Coming soon" label and no play button.
 * When a video is published, set its source:
 *   { type: "youtube", id: "VIDEO_ID" }                     → privacy-enhanced embed, loaded on click
 *   { type: "file", src: "/media/videos/name.mp4" }         → self-hosted file in public/media/videos/
 * Never point a source at a video that is not the clinic's own.
 */
import type { L10n } from "@/lib/i18n";
import type { MediaKey } from "./media";

export type VideoSource = { type: "youtube"; id: string } | { type: "file"; src: string };

export type VideoEntry = {
  id: string;
  topic: L10n;
  title: L10n;
  summary: L10n;
  poster: MediaKey;
  source: VideoSource | null;
};

export const videos: VideoEntry[] = [
  {
    id: "bariatric-consultation",
    topic: { en: "Bariatric surgery", ar: "جراحات السمنة" },
    title: { en: "What to expect at a bariatric surgery consultation", ar: "ماذا تتوقع في استشارة جراحات السمنة" },
    summary: {
      en: "How the assessment works, which questions are discussed and how the decision about surgery is made together.",
      ar: "كيف يسير التقييم، وما الأسئلة التي تُناقش، وكيف يُتخذ قرار الجراحة بشكل مشترك.",
    },
    poster: "consultation",
    source: null,
  },
  {
    id: "sleeve-explained",
    topic: { en: "Bariatric surgery", ar: "جراحات السمنة" },
    title: { en: "Sleeve gastrectomy, explained simply", ar: "تكميم المعدة بشرح مبسّط" },
    summary: {
      en: "What the operation involves, how it affects appetite and what life looks like afterwards.",
      ar: "ما الذي تتضمنه العملية، وكيف تؤثر في الشهية، وكيف تبدو الحياة بعدها.",
    },
    poster: "surgicalTeam",
    source: null,
  },
  {
    id: "preparing-for-surgery",
    topic: { en: "Preparation", ar: "الاستعداد" },
    title: { en: "Preparing for your operation", ar: "الاستعداد لعمليتك" },
    summary: {
      en: "Tests, medications, fasting and the practical steps that help the day of surgery go smoothly.",
      ar: "التحاليل والأدوية والصيام والخطوات العملية التي تساعد على أن يمر يوم العملية بسلاسة.",
    },
    poster: "operatingRoomBright",
    source: null,
  },
  {
    id: "laparoscopic-surgery",
    topic: { en: "General surgery", ar: "الجراحة العامة" },
    title: { en: "How keyhole (laparoscopic) surgery works", ar: "كيف تعمل جراحة المناظير" },
    summary: {
      en: "A short look at the camera, the instruments and why small incisions can make a difference.",
      ar: "نظرة سريعة على الكاميرا والأدوات، ولماذا قد تُحدث الفتحات الصغيرة فرقًا.",
    },
    poster: "operatingRoomTeam",
    source: null,
  },
  {
    id: "gallstones",
    topic: { en: "General surgery", ar: "الجراحة العامة" },
    title: { en: "Gallstones: when is surgery needed?", ar: "حصوات المرارة: متى نحتاج إلى الجراحة؟" },
    summary: {
      en: "Common symptoms, the role of ultrasound and when removing the gallbladder is usually recommended.",
      ar: "الأعراض الشائعة ودور الموجات فوق الصوتية، ومتى يُوصى عادةً باستئصال المرارة.",
    },
    poster: "clinicalReview",
    source: null,
  },
  {
    id: "eating-after-bariatric",
    topic: { en: "Recovery", ar: "التعافي" },
    title: { en: "Eating well after bariatric surgery", ar: "التغذية السليمة بعد جراحات السمنة" },
    summary: {
      en: "The stages of the post-operative diet, protein, hydration and supplements.",
      ar: "مراحل النظام الغذائي بعد العملية، والبروتين، وشرب السوائل، والمكمّلات.",
    },
    poster: "healthyBowl",
    source: null,
  },
];
