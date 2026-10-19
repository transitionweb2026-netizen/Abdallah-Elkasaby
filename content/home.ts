/** Section headings and short copy for the homepage (in page order). */
import type { IconName } from "@/components/ui/Icon";
import type { L10n } from "@/lib/i18n";

type Heading = { eyebrow: L10n; title: L10n; lead?: L10n };

export const home = {
  /** Strip under the hero (the reference's stats strip — non-numeric here: no invented statistics). */
  pillars: [
    {
      icon: "clipboard",
      title: { en: "Thorough assessment", ar: "تقييم شامل" },
      text: { en: "History, examination and tests before any recommendation", ar: "التاريخ المرضي والفحص والتحاليل قبل أي توصية" },
    },
    {
      icon: "focus",
      title: { en: "Minimally invasive options", ar: "خيارات طفيفة التوغل" },
      text: { en: "Laparoscopic techniques where they are suitable", ar: "تقنيات المناظير حين تكون مناسبة" },
    },
    {
      icon: "scale",
      title: { en: "Weight-management pathway", ar: "مسار علاج السمنة" },
      text: { en: "From preparation to long-term follow-up", ar: "من الاستعداد حتى المتابعة طويلة المدى" },
    },
    {
      icon: "calendar",
      title: { en: "Structured follow-up", ar: "متابعة منظّمة" },
      text: { en: "Planned reviews after every procedure", ar: "مراجعات مخطّطة بعد كل إجراء" },
    },
  ] satisfies { icon: IconName; title: L10n; text: L10n }[],
  intro: {
    eyebrow: { en: "Introduction", ar: "تعريف" },
    title: { en: "Surgical expertise, explained with clarity", ar: "خبرة جراحية تُشرح بوضوح" },
    text: {
      en: "Dr. Abdullah Elkasaby practises general surgery and bariatric (weight-management) surgery. Consultations focus on understanding your history, examining every reasonable option — surgical and non-surgical — and explaining what each path involves, so you can make a confident, informed decision.",
      ar: "يمارس د. عبدالله القصبي الجراحة العامة وجراحات السمنة. وتركّز الاستشارة على فهم تاريخك الصحي ودراسة كل الخيارات المناسبة، الجراحية وغير الجراحية، وشرح ما يتضمنه كل مسار، لتتخذ قرارك بثقة ووعي.",
    },
    points: [
      { icon: "clipboard", text: { en: "Assessment before any recommendation", ar: "التقييم قبل أي توصية" } },
      { icon: "focus", text: { en: "Minimally invasive techniques where suitable", ar: "تقنيات طفيفة التوغل حين تكون مناسبة" } },
      { icon: "calendar", text: { en: "Follow-up that continues after surgery", ar: "متابعة مستمرة بعد الجراحة" } },
    ] satisfies { icon: IconName; text: L10n }[],
    link: { en: "About Dr. Elkasaby", ar: "عن د. القصبي" },
  },
  specialties: {
    eyebrow: { en: "Key specialties", ar: "التخصصات الرئيسية" },
    title: { en: "Areas of surgical care", ar: "مجالات الرعاية الجراحية" },
    lead: {
      en: "Focused expertise across general surgery and weight-management surgery, with minimally invasive approaches where appropriate.",
      ar: "خبرة مركّزة في الجراحة العامة وجراحات السمنة، مع الأساليب طفيفة التوغل حيثما كان ذلك مناسبًا.",
    },
  } satisfies Heading,
  services: {
    eyebrow: { en: "Surgical services", ar: "الخدمات الجراحية" },
    title: { en: "Procedures, explained before they are planned", ar: "إجراءات تُشرح قبل التخطيط لها" },
    lead: {
      en: "A closer look at the treatments most often discussed in consultation — what they involve and who they may suit.",
      ar: "نظرة أقرب على العلاجات الأكثر نقاشًا في الاستشارة: ما الذي تتضمنه ولمن قد تكون مناسبة.",
    },
    cta: { en: "View all services", ar: "عرض كل الخدمات" },
  },
  results: {
    eyebrow: { en: "Before & After", ar: "قبل وبعد" },
    title: { en: "Progress, shared with consent", ar: "رحلات تقدّم تُعرض بموافقة أصحابها" },
    lead: {
      en: "Drag the divider to compare. Patient photographs are published only with written consent and without identifying details.",
      ar: "اسحب الفاصل للمقارنة. تُنشر صور المرضى فقط بموافقة كتابية ودون أي بيانات تكشف هويتهم.",
    },
    cta: { en: "Open the gallery", ar: "افتح المعرض" },
    panelTitle: { en: "How results are shared", ar: "كيف تُعرض النتائج" },
    points: [
      { en: "Written patient consent for every photograph", ar: "موافقة كتابية من المريض لكل صورة" },
      { en: "No faces, names or identifying marks", ar: "دون وجوه أو أسماء أو علامات مميزة" },
      { en: "Unretouched pairs, matched in pose and light", ar: "صور غير معدّلة بنفس الوضعية والإضاءة" },
      { en: "Individual results always vary", ar: "النتائج تختلف دائمًا من شخص لآخر" },
    ] satisfies L10n[],
    asideTitle: { en: "Compare, then ask", ar: "قارن ثم اسأل" },
    asideText: {
      en: "Drag the divider to compare. Photographs show one person's journey; your consultation explains what is realistic for you.",
      ar: "اسحب الفاصل للمقارنة. تُظهر الصور رحلة شخص واحد، أما استشارتك فتوضح ما هو واقعي بالنسبة لك.",
    },
  },
  journey: {
    eyebrow: { en: "Patient journey", ar: "رحلة المريض" },
    title: { en: "Your care, step by step", ar: "رعايتك خطوة بخطوة" },
    lead: {
      en: "A clear, unhurried sequence — so you always know what comes next.",
      ar: "تسلسل واضح ومتأنٍّ، لتعرف دائمًا ما الخطوة التالية.",
    },
  } satisfies Heading,
  expectations: {
    eyebrow: { en: "Why patients choose this approach", ar: "لماذا يختار المرضى هذا النهج" },
    title: { en: "What you can expect", ar: "ما الذي يمكنك توقّعه" },
    lead: {
      en: "Principles that shape every consultation, every operation and every follow-up visit.",
      ar: "مبادئ تحكم كل استشارة وكل عملية وكل زيارة متابعة.",
    },
  } satisfies Heading,
  reviews: {
    eyebrow: { en: "Patient reviews", ar: "آراء المرضى" },
    title: { en: "In patients' own words", ar: "بكلمات المرضى أنفسهم" },
    lead: {
      en: "Verified feedback, published with permission.",
      ar: "آراء موثّقة تُنشر بإذن أصحابها.",
    },
    cta: { en: "Reviews & questions", ar: "الآراء والأسئلة" },
  },
  articles: {
    eyebrow: { en: "Latest articles", ar: "أحدث المقالات" },
    title: { en: "Read before you decide", ar: "اقرأ قبل أن تقرّر" },
    lead: {
      en: "Clear, carefully written guides to help you understand your options.",
      ar: "أدلة واضحة ومكتوبة بعناية لتساعدك على فهم خياراتك.",
    },
    cta: { en: "All articles", ar: "كل المقالات" },
  },
  finalCta: {
    eyebrow: { en: "Take the first step", ar: "اتخذ الخطوة الأولى" },
    title: { en: "Ready to talk about your options?", ar: "هل أنت مستعد للحديث عن خياراتك؟" },
    text: {
      en: "Book a consultation to discuss your symptoms, your goals and whether surgery is the right step for you.",
      ar: "احجز استشارة لمناقشة أعراضك وأهدافك، ومعرفة ما إذا كانت الجراحة هي الخطوة المناسبة لك.",
    },
  },
};
