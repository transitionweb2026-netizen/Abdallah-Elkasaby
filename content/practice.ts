/**
 * Clinical areas, services, patient journey and approach.
 *
 * TO CONFIRM WITH DR. ELKASABY BEFORE LAUNCH: the service list below describes
 * common general and bariatric surgery topics. Remove or rename any procedure
 * the clinic does not offer (e.g. gastric bypass), and adjust wording freely.
 * Services render in the order listed; add, remove or reorder entries here.
 */
import type { IconName } from "@/components/ui/Icon";
import type { L10n } from "@/lib/i18n";
import type { ImageRef } from "./media";

/* ─────────────── Key specialties (home + about) ─────────────── */

export type Specialty = { slug: string; icon: IconName; image: ImageRef; title: L10n; summary: L10n; service: string };

export const specialties: Specialty[] = [
  {
    slug: "general-surgery",
    icon: "stethoscope",
    image: "stethoscope",
    title: { en: "General Surgery", ar: "الجراحة العامة" },
    summary: {
      en: "Assessment and surgical treatment of common abdominal and soft-tissue conditions, with every option explained.",
      ar: "تقييم وعلاج جراحي لحالات البطن والأنسجة الرخوة الشائعة، مع شرح كل الخيارات المتاحة.",
    },
    service: "general-abdominal-surgery",
  },
  {
    slug: "bariatric-surgery",
    icon: "scale",
    image: "activeLifestyle",
    title: { en: "Bariatric Surgery", ar: "جراحات السمنة" },
    summary: {
      en: "Weight-management surgery considered within a long-term plan that includes nutrition, activity and follow-up.",
      ar: "جراحة لعلاج السمنة ضمن خطة طويلة المدى تشمل التغذية والنشاط البدني والمتابعة.",
    },
    service: "bariatric-surgery",
  },
  {
    slug: "laparoscopic-surgery",
    icon: "focus",
    image: "operatingRoomTeam",
    title: { en: "Laparoscopic Surgery", ar: "جراحة المناظير" },
    summary: {
      en: "Minimally invasive keyhole techniques through small incisions, used where they are suitable.",
      ar: "تقنيات جراحية طفيفة التوغل عبر فتحات صغيرة، تُستخدم حين تكون مناسبة للحالة.",
    },
    service: "laparoscopic-surgery",
  },
  {
    slug: "gallbladder-surgery",
    icon: "droplet",
    image: "operatingRoomBright",
    title: { en: "Gallbladder Surgery", ar: "جراحة المرارة" },
    summary: {
      en: "Evaluation of gallstone symptoms and laparoscopic removal of the gallbladder when it is recommended.",
      ar: "تقييم أعراض حصوات المرارة واستئصال المرارة بالمنظار عندما يكون ذلك موصى به.",
    },
    service: "gallbladder-surgery",
  },
  {
    slug: "hernia-surgery",
    icon: "mesh",
    image: "wardBeds",
    title: { en: "Hernia Surgery", ar: "جراحة الفتق" },
    summary: {
      en: "Repair of inguinal, umbilical and incisional hernias, open or laparoscopic as appropriate.",
      ar: "إصلاح الفتق الإربي والسري والجراحي، بالجراحة المفتوحة أو بالمنظار حسب الحالة.",
    },
    service: "hernia-repair",
  },
];

/* ─────────────── Services ─────────────── */

export type ServiceGroupKey = "bariatric" | "general";

export const serviceGroups: Record<ServiceGroupKey, { title: L10n; short: L10n; intro: L10n; icon: IconName }> = {
  bariatric: {
    icon: "scale",
    title: { en: "Bariatric & weight-management surgery", ar: "جراحات السمنة وإدارة الوزن" },
    short: { en: "Weight management", ar: "جراحات السمنة" },
    intro: {
      en: "Surgery for obesity is a significant, long-term decision. It starts with a full assessment and continues with structured follow-up for years afterwards.",
      ar: "جراحة السمنة قرار مهم وطويل المدى؛ يبدأ بتقييم شامل ويستمر بمتابعة منظّمة لسنوات بعد العملية.",
    },
  },
  general: {
    icon: "stethoscope",
    title: { en: "General & laparoscopic surgery", ar: "الجراحة العامة وجراحات المناظير" },
    short: { en: "General surgery", ar: "الجراحة العامة" },
    intro: {
      en: "Common abdominal conditions assessed carefully, with minimally invasive techniques used where they are the safer, more suitable choice.",
      ar: "تقييم دقيق لحالات البطن الشائعة، مع استخدام التقنيات طفيفة التوغل حين تكون الخيار الأنسب والأكثر أمانًا.",
    },
  },
};

export type Service = {
  slug: string;
  group: ServiceGroupKey;
  icon: IconName;
  image: ImageRef;
  title: L10n;
  summary: L10n;
  body: L10n;
  points: L10n[];
};

export const services: Service[] = [
  {
    slug: "bariatric-surgery",
    group: "bariatric",
    icon: "scale",
    image: "activeLifestyle",
    title: { en: "Bariatric & Metabolic Surgery", ar: "جراحات السمنة والتمثيل الغذائي" },
    summary: {
      en: "Surgery for obesity, considered when other approaches have not been enough and the expected benefits outweigh the risks.",
      ar: "جراحة لعلاج السمنة يُنظر فيها عندما لا تكفي الوسائل الأخرى، وحين تفوق الفوائد المتوقعة المخاطر المحتملة.",
    },
    body: {
      en: "Bariatric surgery changes how the stomach and digestive system handle food, which can support significant weight loss and improvement in some weight-related conditions. It is not a quick fix: suitability depends on your health, history and readiness for long-term changes in eating and follow-up.",
      ar: "تُحدث جراحات السمنة تغييرًا في طريقة تعامل المعدة والجهاز الهضمي مع الطعام، مما قد يساعد على فقدان وزن ملحوظ وتحسّن بعض الأمراض المرتبطة بالسمنة. وهي ليست حلًا سريعًا؛ إذ تعتمد ملاءمتها على حالتك الصحية وتاريخك واستعدادك لتغييرات طويلة المدى في التغذية والمتابعة.",
    },
    points: [
      { en: "Detailed assessment of weight history and related conditions", ar: "تقييم مفصّل لتاريخ الوزن والأمراض المرتبطة به" },
      { en: "Discussion of surgical and non-surgical options", ar: "مناقشة الخيارات الجراحية وغير الجراحية" },
      { en: "Preparation, nutrition guidance and long-term follow-up", ar: "الاستعداد والإرشاد الغذائي والمتابعة طويلة المدى" },
    ],
  },
  {
    slug: "sleeve-gastrectomy",
    group: "bariatric",
    icon: "activity",
    image: "surgicalTeam",
    title: { en: "Sleeve Gastrectomy", ar: "تكميم المعدة" },
    summary: {
      en: "A laparoscopic procedure that reduces the size of the stomach — one of the most commonly performed weight-management operations.",
      ar: "إجراء بالمنظار لتصغير حجم المعدة، ويُعدّ من أكثر عمليات علاج السمنة شيوعًا.",
    },
    body: {
      en: "In a sleeve gastrectomy, a large portion of the stomach is removed, leaving a narrow, tube-shaped stomach. This limits portion size and affects hunger-related hormones. Like every operation it carries risks, and lifelong eating habits and follow-up remain essential.",
      ar: "في عملية التكميم يُستأصل جزء كبير من المعدة لتبقى على شكل أنبوب ضيق، مما يحدّ من كمية الطعام ويؤثر في الهرمونات المرتبطة بالجوع. وككل عملية جراحية، لها مخاطرها، ويظل الالتزام بالعادات الغذائية والمتابعة مدى الحياة أمرًا أساسيًا.",
    },
    points: [
      { en: "Usually performed laparoscopically", ar: "تُجرى عادةً بالمنظار" },
      { en: "Structured diet progression after surgery", ar: "تدرّج غذائي منظّم بعد العملية" },
      { en: "Regular follow-up, including nutritional monitoring", ar: "متابعة منتظمة تشمل مراقبة الحالة الغذائية" },
    ],
  },
  {
    slug: "gastric-bypass",
    group: "bariatric",
    icon: "route",
    image: "surgeonsOverhead",
    title: { en: "Gastric Bypass", ar: "تحويل مسار المعدة" },
    summary: {
      en: "Creates a small stomach pouch and reroutes part of the small intestine; discussed when it is the more appropriate option.",
      ar: "يُكوّن جيبًا صغيرًا من المعدة ويعيد توجيه جزء من الأمعاء الدقيقة، ويُناقش عندما يكون الخيار الأنسب.",
    },
    body: {
      en: "Gastric bypass combines a smaller stomach pouch with a change in the route food takes through the intestine. It may be considered in specific situations — for example alongside significant reflux or certain metabolic concerns. Whether it is suitable, and how it compares with other options, is discussed individually.",
      ar: "يجمع تحويل المسار بين جيب معدي صغير وتغيير مسار الطعام داخل الأمعاء. وقد يُنظر فيه في حالات معيّنة، مثل وجود ارتجاع شديد أو بعض المشكلات الأيضية. وتُناقش ملاءمته ومقارنته بالخيارات الأخرى بشكل فردي.",
    },
    points: [
      { en: "Considered case by case", ar: "يُقيَّم لكل حالة على حدة" },
      { en: "Long-term vitamin and mineral supplements are usually needed", ar: "عادةً ما يلزم تناول مكمّلات الفيتامينات والمعادن على المدى الطويل" },
      { en: "Lifelong follow-up", ar: "متابعة مدى الحياة" },
    ],
  },
  {
    slug: "weight-management-assessment",
    group: "bariatric",
    icon: "clipboard",
    image: "clinicalReview",
    title: { en: "Weight-Management Assessment & Follow-up", ar: "تقييم السمنة والمتابعة" },
    summary: {
      en: "A structured evaluation before any decision is made, and continued follow-up after treatment.",
      ar: "تقييم منظّم قبل اتخاذ أي قرار، ومتابعة مستمرة بعد العلاج.",
    },
    body: {
      en: "Before surgery is considered, a full assessment looks at weight history, previous attempts, medical conditions and medications, and may include blood tests or other investigations. After any procedure, follow-up visits monitor recovery, nutrition and progress over time.",
      ar: "قبل التفكير في الجراحة، يشمل التقييم الشامل تاريخ الوزن والمحاولات السابقة والأمراض المصاحبة والأدوية، وقد يتضمن تحاليل دم أو فحوصات أخرى. وبعد أي إجراء، تتابع الزيارات الدورية التعافي والحالة الغذائية والتقدّم مع مرور الوقت.",
    },
    points: [
      { en: "Medical history and examination", ar: "التاريخ المرضي والفحص الطبي" },
      { en: "Tests and input from other specialties where needed", ar: "التحاليل واستشارة التخصصات الأخرى عند الحاجة" },
      { en: "Scheduled follow-up after treatment", ar: "متابعة مجدولة بعد العلاج" },
    ],
  },
  {
    slug: "laparoscopic-surgery",
    group: "general",
    icon: "focus",
    image: "operatingRoomTeam",
    title: { en: "Laparoscopic Surgery", ar: "جراحة المناظير" },
    summary: {
      en: "Keyhole surgery through small incisions using a camera and fine instruments, used where it is suitable.",
      ar: "جراحة عبر فتحات صغيرة باستخدام كاميرا وأدوات دقيقة، تُستخدم حين تكون مناسبة.",
    },
    body: {
      en: "Laparoscopic surgery uses a small camera and specialised instruments inserted through small incisions. Compared with open surgery it is often associated with less pain and a shorter hospital stay, but it is not suitable for every patient or every condition. The right approach is decided after assessment.",
      ar: "تعتمد جراحة المناظير على كاميرا صغيرة وأدوات متخصصة تُدخل عبر فتحات صغيرة. وغالبًا ما ترتبط مقارنةً بالجراحة المفتوحة بألم أقل ومدة إقامة أقصر في المستشفى، لكنها لا تناسب كل المرضى أو كل الحالات، ويُحدَّد الأسلوب الأنسب بعد التقييم.",
    },
    points: [
      { en: "Smaller incisions", ar: "فتحات جراحية أصغر" },
      { en: "Often a shorter hospital stay", ar: "غالبًا إقامة أقصر في المستشفى" },
      { en: "Open surgery remains an option when it is safer", ar: "تبقى الجراحة المفتوحة خيارًا عندما تكون أكثر أمانًا" },
    ],
  },
  {
    slug: "gallbladder-surgery",
    group: "general",
    icon: "droplet",
    image: "operatingRoomBright",
    title: { en: "Gallbladder Surgery", ar: "جراحة المرارة" },
    summary: {
      en: "Assessment of gallstone symptoms and laparoscopic removal of the gallbladder when it is recommended.",
      ar: "تقييم أعراض حصوات المرارة واستئصال المرارة بالمنظار عندما يكون ذلك موصى به.",
    },
    body: {
      en: "Gallstones are common and do not always need treatment. When they cause repeated pain or complications, removing the gallbladder — usually laparoscopically — may be recommended. Your symptoms, scan results and overall health guide that decision.",
      ar: "حصوات المرارة شائعة ولا تحتاج دائمًا إلى علاج. وعندما تسبب ألمًا متكررًا أو مضاعفات، قد يُوصى باستئصال المرارة، وغالبًا ما يتم ذلك بالمنظار. وتوجّه الأعراض ونتائج الأشعة والحالة الصحية العامة هذا القرار.",
    },
    points: [
      { en: "Review of symptoms and ultrasound findings", ar: "مراجعة الأعراض ونتائج الموجات فوق الصوتية" },
      { en: "Usually performed laparoscopically", ar: "يُجرى عادةً بالمنظار" },
      { en: "Guidance on diet and recovery afterwards", ar: "إرشادات حول الغذاء والتعافي بعد العملية" },
    ],
  },
  {
    slug: "hernia-repair",
    group: "general",
    icon: "mesh",
    image: "wardBeds",
    title: { en: "Hernia Repair", ar: "إصلاح الفتق" },
    summary: {
      en: "Repair of inguinal, umbilical and incisional hernias, open or laparoscopic depending on the hernia and the patient.",
      ar: "إصلاح الفتق الإربي والسري والجراحي، بالجراحة المفتوحة أو بالمنظار حسب نوع الفتق وحالة المريض.",
    },
    body: {
      en: "A hernia occurs when tissue pushes through a weak area in the abdominal wall. Many hernias are repaired to relieve symptoms and reduce the risk of complications, often with a mesh to reinforce the repair. The technique depends on the hernia's type and size and on your general health.",
      ar: "يحدث الفتق عندما تبرز أنسجة عبر منطقة ضعيفة في جدار البطن. ويُصلح كثير من حالات الفتق لتخفيف الأعراض وتقليل خطر المضاعفات، وغالبًا ما تُستخدم شبكة طبية لتقوية الإصلاح. ويعتمد الأسلوب على نوع الفتق وحجمه وحالتك الصحية العامة.",
    },
    points: [
      { en: "Inguinal, umbilical and incisional hernias", ar: "الفتق الإربي والسري والجراحي" },
      { en: "Open or laparoscopic repair", ar: "إصلاح بالجراحة المفتوحة أو بالمنظار" },
      { en: "Advice on activity and lifting during recovery", ar: "إرشادات حول النشاط وحمل الأشياء خلال التعافي" },
    ],
  },
  {
    slug: "general-abdominal-surgery",
    group: "general",
    icon: "stethoscope",
    image: "stethoscope",
    title: { en: "General Abdominal Surgery", ar: "الجراحة العامة للبطن" },
    summary: {
      en: "Evaluation and surgical management of a range of common abdominal and soft-tissue conditions.",
      ar: "تقييم وعلاج جراحي لمجموعة من حالات البطن والأنسجة الرخوة الشائعة.",
    },
    body: {
      en: "General surgery covers many conditions of the abdomen and soft tissues, such as appendicitis and some skin and under-the-skin lumps. Each case starts with an examination and the investigations needed to confirm the diagnosis, followed by a clear discussion of whether surgery is needed and what it involves.",
      ar: "تشمل الجراحة العامة كثيرًا من حالات البطن والأنسجة الرخوة، مثل التهاب الزائدة الدودية وبعض الكتل الجلدية وتحت الجلد. وتبدأ كل حالة بالفحص والتحاليل اللازمة لتأكيد التشخيص، ثم نقاش واضح حول الحاجة إلى الجراحة وما تتضمنه.",
    },
    points: [
      { en: "Diagnosis first", ar: "التشخيص أولًا" },
      { en: "Surgical and non-surgical options explained", ar: "شرح الخيارات الجراحية وغير الجراحية" },
      { en: "Clear explanation of risks and recovery", ar: "توضيح المخاطر ومراحل التعافي" },
    ],
  },
];

export const servicesNote: L10n = {
  en: "The procedures above describe areas of practice. Whether a procedure is offered for your situation — and whether it is suitable for you — is confirmed during your consultation.",
  ar: "تصف الإجراءات السابقة مجالات الممارسة، ويُؤكَّد توفّر الإجراء المناسب لحالتك ومدى ملاءمته لك خلال الاستشارة.",
};

/* ─────────────── Patient journey ─────────────── */

export const journey: { icon: IconName; title: L10n; text: L10n }[] = [
  {
    icon: "messages",
    title: { en: "Initial consultation", ar: "الاستشارة الأولى" },
    text: {
      en: "A focused conversation about your symptoms, history, goals and concerns.",
      ar: "حوار مركّز حول أعراضك وتاريخك المرضي وأهدافك ومخاوفك.",
    },
  },
  {
    icon: "clipboardList",
    title: { en: "Medical assessment", ar: "التقييم الطبي" },
    text: {
      en: "Examination and, where needed, tests or imaging to build a complete picture.",
      ar: "فحص سريري، مع تحاليل أو أشعة عند الحاجة، لتكوين صورة متكاملة.",
    },
  },
  {
    icon: "route",
    title: { en: "Personalised treatment plan", ar: "خطة علاج مخصّصة" },
    text: {
      en: "Options are explained — including non-surgical ones — with their benefits, risks and preparation.",
      ar: "شرح الخيارات المتاحة، بما فيها غير الجراحية، مع فوائدها ومخاطرها وطريقة الاستعداد لها.",
    },
  },
  {
    icon: "heart",
    title: { en: "Procedure & recovery", ar: "الإجراء والتعافي" },
    text: {
      en: "If surgery is chosen, you are prepared beforehand and guided through recovery afterwards.",
      ar: "إذا تقرّر إجراء الجراحة، يتم تجهيزك مسبقًا وإرشادك خلال مرحلة التعافي.",
    },
  },
  {
    icon: "calendar",
    title: { en: "Follow-up care", ar: "المتابعة" },
    text: {
      en: "Scheduled reviews to monitor healing and support your long-term health.",
      ar: "زيارات متابعة مجدولة لمراقبة التعافي ودعم صحتك على المدى الطويل.",
    },
  },
];

/* ─────────────── What patients can expect ─────────────── */

export const expectations: { icon: IconName; title: L10n; text: L10n }[] = [
  {
    icon: "user",
    title: { en: "Individual assessment", ar: "تقييم فردي" },
    text: {
      en: "Recommendations are based on your history, examination and results — never on a standard package.",
      ar: "تُبنى التوصيات على تاريخك المرضي وفحصك ونتائجك، لا على باقة علاجية موحّدة.",
    },
  },
  {
    icon: "messages",
    title: { en: "Clear communication", ar: "تواصل واضح" },
    text: {
      en: "Diagnosis, options, risks and recovery explained in plain language, with time for your questions.",
      ar: "شرح التشخيص والخيارات والمخاطر والتعافي بلغة بسيطة، مع وقت كافٍ لأسئلتك.",
    },
  },
  {
    icon: "route",
    title: { en: "Appropriate procedure selection", ar: "اختيار الإجراء المناسب" },
    text: {
      en: "Surgery is recommended only when it is the right option, and non-surgical paths are always discussed.",
      ar: "لا يُوصى بالجراحة إلا عندما تكون الخيار الصحيح، مع مناقشة البدائل غير الجراحية دائمًا.",
    },
  },
  {
    icon: "shieldPlus",
    title: { en: "Safety & preparation", ar: "السلامة والاستعداد" },
    text: {
      en: "Pre-operative checks and clear preparation instructions help reduce avoidable risks.",
      ar: "فحوصات ما قبل العملية وتعليمات استعداد واضحة تساعد على تقليل المخاطر التي يمكن تجنّبها.",
    },
  },
  {
    icon: "calendar",
    title: { en: "Structured follow-up", ar: "متابعة منظّمة" },
    text: {
      en: "Planned reviews after treatment, with guidance on what to watch for and when to get in touch.",
      ar: "مراجعات مخطّطة بعد العلاج، مع إرشادات حول ما يجب ملاحظته ومتى يجب التواصل.",
    },
  },
];

/* ─────────────── Approach / philosophy ─────────────── */

export const approach = {
  eyebrow: { en: "Philosophy of care", ar: "فلسفة الرعاية" } satisfies L10n,
  title: { en: "A considered approach to surgery", ar: "نهج مدروس في الجراحة" } satisfies L10n,
  paragraphs: [
    {
      en: "Surgery is one part of a wider plan. The right decision comes from understanding the whole person — medical history, daily life, expectations and concerns — and from taking the time to explain each option honestly.",
      ar: "الجراحة جزء من خطة علاجية أشمل. ويأتي القرار الصحيح من فهم الإنسان بكامله: تاريخه الصحي وحياته اليومية وتوقعاته ومخاوفه، ومن تخصيص الوقت لشرح كل خيار بصدق.",
    },
    {
      en: "That is why consultations make room for questions, why non-surgical options are always part of the conversation, and why care continues well after the operation.",
      ar: "لهذا تتسع الاستشارة للأسئلة، وتبقى الخيارات غير الجراحية جزءًا من النقاش دائمًا، وتستمر الرعاية لما بعد العملية بوقت طويل.",
    },
  ] satisfies L10n[],
  principles: [
    { icon: "messages", title: { en: "Listen first", ar: "الإصغاء أولًا" } },
    { icon: "idea", title: { en: "Explain honestly", ar: "الشرح بصدق" } },
    { icon: "handshake", title: { en: "Follow through", ar: "المتابعة حتى النهاية" } },
  ] satisfies { icon: IconName; title: L10n }[],
};
