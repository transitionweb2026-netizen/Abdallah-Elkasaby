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
import type { ImageRef } from "./media";

export type VideoSource = { type: "youtube"; id: string } | { type: "file"; src: string };

export type VideoEntry = {
  id: string;
  topic: L10n;
  title: L10n;
  summary: L10n;
  poster: ImageRef;
  source: VideoSource | null;
};

/** The library section's own heading — shown above the video grid (see app/[locale]/videos/page.tsx). */
export type VideosLibraryHeading = { title: L10n; subtitle: L10n; emptyTitle: L10n; emptySubtitle: L10n };

export const videosLibraryHeading: VideosLibraryHeading = {
  title: { en: "Educational videos", ar: "فيديوهات تثقيفية" },
  subtitle: {
    en: "Short explanations to help you understand your options and prepare for your consultation.",
    ar: "شروحات قصيرة تساعدك على فهم خياراتك والاستعداد لاستشارتك.",
  },
  emptyTitle: { en: "Upcoming topics", ar: "موضوعات قادمة" },
  emptySubtitle: {
    en: "These are the topics being prepared — videos will be published here as soon as they are ready.",
    ar: "هذه هي الموضوعات المخطّط لها؛ ستُنشر الفيديوهات هنا فور جاهزيتها.",
  },
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
  {
    id: "hernia-repair-explained",
    topic: { en: "General surgery", ar: "الجراحة العامة" },
    title: { en: "Hernia repair, explained simply", ar: "إصلاح الفتق بشرح مبسّط" },
    summary: {
      en: "The different types of hernia, when repair is usually recommended, and the difference between open and laparoscopic technique.",
      ar: "أنواع الفتق المختلفة، ومتى يُوصى عادةً بالإصلاح، والفرق بين الجراحة المفتوحة وجراحة المناظير.",
    },
    poster: "wardBeds",
    source: null,
  },
  {
    id: "returning-to-activity",
    topic: { en: "Recovery", ar: "التعافي" },
    title: { en: "Returning to activity after surgery", ar: "العودة إلى النشاط بعد الجراحة" },
    summary: {
      en: "General guidance on walking, driving and lifting — and how the timeline can differ between procedures.",
      ar: "إرشادات عامة حول المشي والقيادة وحمل الأشياء، وكيف يختلف الجدول الزمني باختلاف الإجراء.",
    },
    poster: "wellness",
    source: null,
  },
  {
    id: "life-after-sleeve",
    topic: { en: "Bariatric surgery", ar: "جراحات السمنة" },
    title: { en: "Life after sleeve gastrectomy", ar: "الحياة بعد عملية تكميم المعدة" },
    summary: {
      en: "Adjusting daily eating habits, the follow-up schedule, and why vitamin supplements often become part of the routine.",
      ar: "التكيّف مع العادات الغذائية اليومية، وجدول المتابعة، ولماذا تصبح مكمّلات الفيتامينات غالبًا جزءًا من الروتين.",
    },
    poster: "healthyTable",
    source: null,
  },
];
