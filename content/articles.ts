/**
 * Patient-education articles. Each one is generated as a static page at
 * `/[locale]/articles/[slug]/`. Reading time is calculated from the text.
 *
 * These are original, general-information drafts. Please have Dr. Elkasaby
 * review and approve each article before launch.
 */
import type { L10n } from "@/lib/i18n";
import type { MediaKey } from "./media";

export type ArticleBlock =
  | { type: "p"; text: L10n }
  | { type: "h2"; text: L10n }
  | { type: "list"; items: L10n[] }
  | { type: "note"; text: L10n };

export type Article = {
  slug: string;
  category: L10n;
  title: L10n;
  excerpt: L10n;
  image: MediaKey;
  body: ArticleBlock[];
};

const p = (en: string, ar: string): ArticleBlock => ({ type: "p", text: { en, ar } });
const h2 = (en: string, ar: string): ArticleBlock => ({ type: "h2", text: { en, ar } });
const note = (en: string, ar: string): ArticleBlock => ({ type: "note", text: { en, ar } });
const list = (...items: [string, string][]): ArticleBlock => ({ type: "list", items: items.map(([en, ar]) => ({ en, ar })) });

export const articles: Article[] = [
  {
    slug: "understanding-bariatric-surgery",
    category: { en: "Bariatric surgery", ar: "جراحات السمنة" },
    title: { en: "Understanding bariatric surgery", ar: "فهم جراحات السمنة" },
    excerpt: {
      en: "What bariatric surgery is, how the common procedures work, who may be considered and why long-term follow-up matters.",
      ar: "ما جراحات السمنة، وكيف تعمل الإجراءات الشائعة، ومن قد يكون مرشّحًا لها، ولماذا تُعد المتابعة طويلة المدى ضرورية.",
    },
    image: "activeLifestyle",
    body: [
      p(
        "Bariatric surgery — sometimes called weight-loss or metabolic surgery — refers to operations on the stomach and digestive system that help people living with obesity lose weight and, in many cases, improve weight-related health conditions. It is a medical treatment, not a cosmetic one, and it works best as part of a long-term plan.",
        "جراحات السمنة، أو ما يُعرف أحيانًا بجراحات إنقاص الوزن أو الجراحات الأيضية، هي عمليات تُجرى على المعدة والجهاز الهضمي لمساعدة المصابين بالسمنة على فقدان الوزن، وفي حالات كثيرة على تحسّن الأمراض المرتبطة بها. وهي علاج طبي وليست إجراءً تجميليًا، وتحقق أفضل فائدة عندما تكون جزءًا من خطة طويلة المدى.",
      ),
      h2("How it works", "كيف تعمل؟"),
      p(
        "Most procedures reduce the amount of food the stomach can hold, change the route food takes through the intestine, or both. These changes also influence hormones that affect hunger and fullness — one reason surgery can help where diet alone has been difficult to sustain.",
        "تعمل معظم الإجراءات على تقليل كمية الطعام التي تستوعبها المعدة، أو تغيير مسار الطعام داخل الأمعاء، أو الاثنين معًا. كما تؤثر هذه التغييرات في الهرمونات المسؤولة عن الشعور بالجوع والشبع، وهذا أحد أسباب نجاح الجراحة حيث يصعب الاستمرار على الحمية وحدها.",
      ),
      h2("Common procedures", "الإجراءات الشائعة"),
      list(
        [
          "Sleeve gastrectomy: a large part of the stomach is removed, leaving a narrow, tube-shaped stomach.",
          "تكميم المعدة: يُستأصل جزء كبير من المعدة لتبقى على شكل أنبوب ضيق.",
        ],
        [
          "Gastric bypass: a small stomach pouch is created and connected directly to a lower part of the small intestine.",
          "تحويل المسار: يُكوَّن جيب صغير من المعدة ويُوصل مباشرةً بجزء أبعد من الأمعاء الدقيقة.",
        ],
        [
          "Other procedures exist and may be discussed when they are more appropriate for a particular person.",
          "توجد إجراءات أخرى قد تُناقش عندما تكون أنسب لحالة شخص بعينه.",
        ],
      ),
      h2("Who may be considered", "من قد يكون مرشّحًا؟"),
      p(
        "Guidelines generally consider bariatric surgery for adults with severe obesity, or with obesity alongside conditions such as type 2 diabetes, high blood pressure or sleep apnoea — particularly when other approaches have not led to lasting results. Body mass index (BMI) is a starting point, not the whole answer. Overall health, eating patterns, medications, mental wellbeing and readiness for lifelong change are all part of the assessment.",
        "تنظر الإرشادات الطبية عادةً في جراحات السمنة للبالغين المصابين بسمنة شديدة، أو بسمنة مصحوبة بأمراض مثل السكري من النوع الثاني أو ارتفاع ضغط الدم أو انقطاع النفس أثناء النوم، خاصةً عندما لا تحقق الوسائل الأخرى نتائج دائمة. ومؤشر كتلة الجسم نقطة بداية وليس الإجابة الكاملة؛ فالحالة الصحية العامة وأنماط الأكل والأدوية والصحة النفسية والاستعداد لتغيير دائم كلها جزء من التقييم.",
      ),
      h2("Benefits and risks", "الفوائد والمخاطر"),
      p(
        "Many people experience significant weight loss and improvement in related conditions, but results vary and are never guaranteed. Like any operation, bariatric surgery carries risks, including bleeding, leaks, blood clots and nutritional deficiencies. A good consultation explains these clearly and helps you weigh them against the potential benefits.",
        "يحقق كثيرون فقدانًا ملحوظًا للوزن وتحسّنًا في الأمراض المرتبطة بالسمنة، لكن النتائج تختلف ولا يمكن ضمانها. وككل عملية جراحية، تحمل جراحات السمنة مخاطر منها النزيف والتسرّب والجلطات ونقص العناصر الغذائية. والاستشارة الجيدة تشرح هذه المخاطر بوضوح وتساعدك على موازنتها مع الفوائد المحتملة.",
      ),
      h2("Life after surgery", "الحياة بعد الجراحة"),
      p(
        "Eating habits change permanently after bariatric surgery. Portions are smaller, protein becomes a priority and vitamin and mineral supplements are often needed. Regular follow-up — with attention to nutrition, activity and emotional wellbeing — is one of the most important factors in long-term success.",
        "تتغير العادات الغذائية بشكل دائم بعد جراحات السمنة؛ فتصغر الكميات ويصبح البروتين أولوية، وغالبًا ما تلزم مكمّلات الفيتامينات والمعادن. والمتابعة المنتظمة، مع الاهتمام بالتغذية والنشاط والصحة النفسية، من أهم عوامل النجاح على المدى الطويل.",
      ),
      note(
        "This article is general information. Whether bariatric surgery is appropriate for you can only be decided after a personal medical assessment.",
        "هذا المقال معلومات عامة، ولا يمكن تحديد مدى ملاءمة جراحات السمنة لك إلا بعد تقييم طبي شخصي.",
      ),
    ],
  },
  {
    slug: "preparing-for-your-surgical-consultation",
    category: { en: "Consultation", ar: "الاستشارة" },
    title: { en: "Preparing for your surgical consultation", ar: "كيف تستعد لاستشارتك الجراحية" },
    excerpt: {
      en: "A practical guide to what to bring, what to ask and how to get the most from your first appointment.",
      ar: "دليل عملي لما تحضره معك وما تسأل عنه، وكيف تستفيد أقصى استفادة من موعدك الأول.",
    },
    image: "consultation",
    body: [
      p(
        "A first surgical consultation is an opportunity to understand what is happening, what your options are and what each choice involves. A little preparation helps you use that time well and leave with clear answers.",
        "الاستشارة الجراحية الأولى فرصة لتفهم ما يحدث وما الخيارات المتاحة لك وما يتضمنه كل خيار. وقليل من الاستعداد يساعدك على الاستفادة من هذا الوقت والخروج بإجابات واضحة.",
      ),
      h2("What to bring", "ماذا تحضر معك"),
      list(
        ["Previous medical reports and hospital discharge summaries", "التقارير الطبية السابقة وملخصات الخروج من المستشفى"],
        ["Scan images or CDs, together with their written reports", "صور الأشعة أو أقراصها مع تقاريرها المكتوبة"],
        ["Recent blood test results", "نتائج تحاليل الدم الحديثة"],
        ["A list of all medications and supplements, with doses", "قائمة بجميع الأدوية والمكمّلات وجرعاتها"],
        ["Details of previous operations and any reactions to anaesthesia", "تفاصيل العمليات السابقة وأي تفاعلات مع التخدير"],
        [
          "For weight-management consultations: a short history of your weight and previous attempts to lose it",
          "في استشارات السمنة: نبذة عن تاريخ وزنك ومحاولاتك السابقة لإنقاصه",
        ],
      ),
      h2("Think about your symptoms", "فكّر في أعراضك"),
      p(
        "Note when your symptoms started, what makes them better or worse and how they affect your daily life. If symptoms come and go, a short diary in the days before your visit can be very helpful.",
        "دوّن متى بدأت الأعراض، وما الذي يخففها أو يزيدها، وكيف تؤثر في حياتك اليومية. وإذا كانت الأعراض تأتي وتذهب، فإن مفكرة قصيرة في الأيام السابقة للزيارة قد تكون مفيدة جدًا.",
      ),
      h2("Write down your questions", "اكتب أسئلتك"),
      p(
        "It is easy to forget questions during an appointment. Writing them down — and bringing someone you trust, if you would like — helps you leave feeling informed. There are no unimportant questions.",
        "من السهل أن تنسى أسئلتك أثناء الموعد. لذا فإن كتابتها مسبقًا، واصطحاب شخص تثق به إن رغبت، يساعدك على الخروج وأنت على دراية كاملة. ولا يوجد سؤال غير مهم.",
      ),
      h2("What happens during the visit", "ماذا يحدث خلال الزيارة"),
      p(
        "Expect a conversation about your history and goals, a physical examination and a discussion of whether further tests are needed. If surgery is an option, its benefits, risks, alternatives and recovery are explained so you can decide in your own time.",
        "توقّع حوارًا حول تاريخك المرضي وأهدافك، ثم فحصًا سريريًا ونقاشًا حول الحاجة إلى فحوصات إضافية. وإذا كانت الجراحة خيارًا مطروحًا، تُشرح فوائدها ومخاطرها وبدائلها ومرحلة التعافي، لتتخذ قرارك في الوقت الذي يناسبك.",
      ),
      note(
        "If your symptoms suddenly become severe — for example intense pain, persistent vomiting or fever — seek urgent medical care rather than waiting for a scheduled appointment.",
        "إذا اشتدت أعراضك فجأة، كألم شديد أو قيء مستمر أو حمى، فاطلب رعاية طبية عاجلة ولا تنتظر موعدك المحدد.",
      ),
    ],
  },
  {
    slug: "what-is-laparoscopic-surgery",
    category: { en: "Laparoscopic surgery", ar: "جراحة المناظير" },
    title: { en: "What is laparoscopic surgery?", ar: "ما هي جراحة المناظير؟" },
    excerpt: {
      en: "How keyhole surgery works, its potential advantages, and why it is not the right choice for every patient.",
      ar: "كيف تعمل جراحة المناظير، وما مزاياها المحتملة، ولماذا لا تكون الخيار الصحيح لكل مريض.",
    },
    image: "surgicalTeam",
    body: [
      p(
        "Laparoscopic surgery — often called keyhole or minimally invasive surgery — is a way of operating inside the abdomen through several small incisions instead of one larger opening.",
        "جراحة المناظير، أو الجراحة طفيفة التوغل، هي طريقة لإجراء العمليات داخل البطن عبر عدة فتحات صغيرة بدلًا من شق جراحي واحد كبير.",
      ),
      h2("How it works", "كيف تتم؟"),
      p(
        "The abdomen is gently inflated with carbon dioxide gas to create space. A thin camera, the laparoscope, sends a magnified image to a screen, and the surgeon uses long, fine instruments passed through small ports to carry out the operation.",
        "يُنفخ البطن بلطف بغاز ثاني أكسيد الكربون لتوفير مساحة للعمل، ثم تنقل كاميرا رفيعة تُسمى المنظار صورة مكبّرة إلى شاشة، ويستخدم الجرّاح أدوات طويلة ودقيقة تُدخل عبر فتحات صغيرة لإجراء العملية.",
      ),
      h2("Procedures often performed this way", "عمليات تُجرى غالبًا بالمنظار"),
      list(
        ["Gallbladder removal (cholecystectomy)", "استئصال المرارة"],
        ["Many hernia repairs", "كثير من عمليات إصلاح الفتق"],
        ["Appendix removal", "استئصال الزائدة الدودية"],
        ["Most bariatric procedures, such as sleeve gastrectomy", "معظم جراحات السمنة مثل تكميم المعدة"],
      ),
      h2("Potential advantages", "المزايا المحتملة"),
      p(
        "Compared with open surgery, laparoscopic procedures are often associated with less pain after the operation, smaller scars, a shorter hospital stay and a quicker return to normal activities. These are general tendencies; individual experiences differ.",
        "مقارنةً بالجراحة المفتوحة، ترتبط جراحات المناظير غالبًا بألم أقل بعد العملية وندبات أصغر وإقامة أقصر في المستشفى وعودة أسرع إلى الأنشطة المعتادة. وهذه اتجاهات عامة، إذ تختلف التجربة من شخص لآخر.",
      ),
      h2("Why it is not always the right choice", "لماذا لا تكون دائمًا الخيار الصحيح؟"),
      p(
        "Previous abdominal operations, certain medical conditions or findings during surgery can make an open approach safer. Sometimes an operation that starts laparoscopically is converted to open surgery — a safety decision, not a failure. The most suitable approach is discussed with you beforehand.",
        "قد تجعل العمليات السابقة في البطن أو بعض الحالات الطبية أو ما يُكتشف أثناء الجراحة الأسلوبَ المفتوح أكثر أمانًا. وأحيانًا تبدأ العملية بالمنظار ثم تُحوَّل إلى جراحة مفتوحة، وهذا قرار يهدف إلى السلامة وليس فشلًا. ويُناقش معك الأسلوب الأنسب مسبقًا.",
      ),
      note(
        "Your surgeon will explain which approach is recommended in your case, and why.",
        "سيشرح لك الجرّاح الأسلوب الموصى به في حالتك وأسباب اختياره.",
      ),
    ],
  },
  {
    slug: "questions-to-ask-before-surgery",
    category: { en: "Preparation", ar: "الاستعداد" },
    title: { en: "Questions to ask before an operation", ar: "أسئلة تطرحها قبل إجراء العملية" },
    excerpt: {
      en: "Clear questions that help you understand your diagnosis, your options and what recovery will really involve.",
      ar: "أسئلة واضحة تساعدك على فهم تشخيصك وخياراتك وما ستتضمنه مرحلة التعافي فعلًا.",
    },
    image: "stethoscope",
    body: [
      p(
        "Understanding your operation is part of good care. These questions can help guide the conversation with your surgeon — you do not need to ask them all, and you can always ask more.",
        "فهمك لعمليتك جزء من الرعاية الجيدة. وهذه الأسئلة تساعدك على توجيه الحوار مع جرّاحك؛ ولست مضطرًا لطرحها كلها، ويمكنك دائمًا أن تسأل المزيد.",
      ),
      h2("About the diagnosis", "عن التشخيص"),
      list(
        ["What exactly is the problem, and how was it confirmed?", "ما المشكلة بالضبط، وكيف تم تأكيدها؟"],
        ["What happens if I do not have surgery, or if I wait?", "ماذا يحدث إذا لم أُجرِ العملية أو إذا انتظرت؟"],
        ["Are there non-surgical options worth trying first?", "هل توجد خيارات غير جراحية تستحق التجربة أولًا؟"],
      ),
      h2("About the operation", "عن العملية"),
      list(
        ["What does the operation involve — laparoscopic or open?", "ما الذي تتضمنه العملية، وهل ستكون بالمنظار أم مفتوحة؟"],
        ["What are the most common risks, and the most serious ones?", "ما أكثر المخاطر شيوعًا، وما أخطرها؟"],
        ["What type of anaesthesia will be used?", "ما نوع التخدير المستخدم؟"],
        ["How long will I stay in hospital?", "كم سأبقى في المستشفى؟"],
      ),
      h2("About recovery", "عن التعافي"),
      list(
        ["How much pain should I expect, and how will it be managed?", "ما مقدار الألم المتوقع، وكيف ستتم السيطرة عليه؟"],
        ["When can I return to work, drive, exercise or lift?", "متى أعود إلى العمل والقيادة والرياضة وحمل الأشياء؟"],
        ["Will my diet change before or after surgery?", "هل سيتغير نظامي الغذائي قبل العملية أو بعدها؟"],
        ["Which symptoms mean I should get in touch straight away?", "ما الأعراض التي تستدعي التواصل فورًا؟"],
      ),
      h2("About follow-up", "عن المتابعة"),
      list(
        ["When will I be seen again after the operation?", "متى سيكون موعد المتابعة بعد العملية؟"],
        ["Who do I contact if I have a concern?", "بمن أتواصل إذا كان لديّ ما يقلقني؟"],
      ),
      note(
        "Bringing a written list of questions to your appointment helps make sure nothing important is forgotten.",
        "اصطحاب قائمة مكتوبة بأسئلتك إلى الموعد يضمن ألا يُنسى شيء مهم.",
      ),
    ],
  },
  {
    slug: "recovery-and-follow-up-after-surgery",
    category: { en: "Recovery", ar: "التعافي" },
    title: { en: "Recovery and follow-up after surgery", ar: "التعافي والمتابعة بعد الجراحة" },
    excerpt: {
      en: "What usually helps recovery, the warning signs to know, and why follow-up appointments matter.",
      ar: "ما الذي يساعد عادةً على التعافي، وما العلامات التحذيرية التي يجب معرفتها، ولماذا تهمّ مواعيد المتابعة.",
    },
    image: "wardBeds",
    body: [
      p(
        "Recovery begins as soon as an operation ends, and the weeks that follow matter as much as the procedure itself. Every recovery is different, but some principles apply to most patients.",
        "يبدأ التعافي فور انتهاء العملية، والأسابيع التالية لا تقل أهمية عن الإجراء نفسه. ويختلف التعافي من شخص لآخر، لكن بعض المبادئ تنطبق على معظم المرضى.",
      ),
      h2("In the first days", "في الأيام الأولى"),
      p(
        "Follow the instructions you receive at discharge about wound care, medications and activity. Gentle walking is usually encouraged early, as it supports circulation and recovery. Take pain relief as advised, and rest when you need to.",
        "اتبع التعليمات التي تتلقاها عند الخروج بشأن العناية بالجرح والأدوية والنشاط. ويُشجَّع عادةً على المشي الخفيف مبكرًا لأنه يدعم الدورة الدموية والتعافي. تناول المسكنات حسب الإرشادات، واسترح عندما تحتاج إلى ذلك.",
      ),
      h2("Eating and drinking", "الأكل والشرب"),
      p(
        "Many patients return to their usual diet gradually. After bariatric surgery, diet progresses in planned stages — from liquids to soft foods to regular textures — and staying well hydrated is essential.",
        "يعود كثير من المرضى إلى نظامهم الغذائي المعتاد بشكل تدريجي. أما بعد جراحات السمنة، فيتدرّج الغذاء على مراحل مخطّطة، من السوائل إلى الأطعمة اللينة ثم القوام العادي، ويبقى شرب كمية كافية من السوائل أمرًا أساسيًا.",
      ),
      h2("Warning signs", "العلامات التحذيرية"),
      list(
        ["Fever or chills", "حمى أو قشعريرة"],
        ["Increasing pain that your medication does not control", "ألم متزايد لا تسيطر عليه الأدوية"],
        ["Redness, swelling or discharge from a wound", "احمرار أو تورّم أو إفرازات من الجرح"],
        ["Persistent vomiting or being unable to keep fluids down", "قيء مستمر أو عدم القدرة على الاحتفاظ بالسوائل"],
        ["Shortness of breath, chest pain, or a painful, swollen leg", "ضيق في التنفس أو ألم في الصدر أو تورّم مؤلم في الساق"],
      ),
      p(
        "If you notice any of these, contact the clinic promptly or seek urgent medical care.",
        "إذا لاحظت أيًا من هذه العلامات، فتواصل مع العيادة فورًا أو اطلب رعاية طبية عاجلة.",
      ),
      h2("Why follow-up matters", "لماذا تهمّ المتابعة؟"),
      p(
        "Follow-up visits allow healing to be checked, results to be reviewed and concerns to be addressed early. After bariatric surgery, long-term follow-up — including nutritional checks — is an essential part of treatment.",
        "تتيح زيارات المتابعة الاطمئنان على التعافي ومراجعة النتائج ومعالجة أي مخاوف مبكرًا. وبعد جراحات السمنة تُعد المتابعة طويلة المدى، بما فيها فحوصات الحالة الغذائية، جزءًا أساسيًا من العلاج.",
      ),
      note(
        "Your personal recovery plan always takes priority over general advice. If you are unsure, ask.",
        "خطة تعافيك الشخصية مقدّمة دائمًا على النصائح العامة. وإذا لم تكن متأكدًا، فاسأل.",
      ),
    ],
  },
  {
    slug: "understanding-obesity-treatment-options",
    category: { en: "Weight management", ar: "إدارة الوزن" },
    title: { en: "Understanding obesity treatment options", ar: "فهم خيارات علاج السمنة" },
    excerpt: {
      en: "Obesity is a chronic medical condition with several treatment approaches. Here is how they fit together.",
      ar: "السمنة حالة طبية مزمنة لها عدة طرق علاجية، وإليك كيف تتكامل هذه الطرق معًا.",
    },
    image: "wellness",
    body: [
      p(
        "Obesity is a long-term medical condition influenced by genetics, hormones, environment, sleep, stress and many other factors. It is not simply a matter of willpower, and effective treatment often combines more than one approach.",
        "السمنة حالة طبية طويلة المدى تتأثر بالعوامل الوراثية والهرمونات والبيئة والنوم والضغط النفسي وعوامل أخرى كثيرة. وهي ليست مجرد مسألة إرادة، وغالبًا ما يجمع العلاج الفعّال بين أكثر من أسلوب.",
      ),
      h2("Lifestyle and nutrition", "نمط الحياة والتغذية"),
      p(
        "Changes to eating patterns, physical activity and sleep form the foundation of every treatment plan. Support from a dietitian or a structured programme can make these changes more sustainable.",
        "تشكّل التغييرات في أنماط الأكل والنشاط البدني والنوم أساس كل خطة علاجية. ويمكن لدعم أخصائي التغذية أو برنامج منظّم أن يجعل هذه التغييرات أكثر استدامة.",
      ),
      h2("Medication", "الأدوية"),
      p(
        "Some medications can help with weight management for suitable patients when combined with lifestyle changes. They have their own benefits, side effects and costs, and should be prescribed and monitored by a doctor.",
        "قد تساعد بعض الأدوية المرضى المناسبين على إدارة الوزن عند الجمع بينها وبين تغييرات نمط الحياة. ولها فوائدها وآثارها الجانبية وتكاليفها، ويجب أن يصفها الطبيب ويتابعها.",
      ),
      h2("Surgical options", "الخيارات الجراحية"),
      p(
        "For some people — especially those with severe obesity or weight-related health conditions — bariatric surgery may be considered. For many patients it leads to greater and more sustained weight loss than other approaches, but it carries risks and requires a lifelong commitment to follow-up.",
        "قد يُنظر في جراحات السمنة لبعض الأشخاص، خاصةً المصابين بسمنة شديدة أو بأمراض مرتبطة بالوزن. وهي تؤدي لدى كثير من المرضى إلى فقدان وزن أكبر وأكثر استدامة مقارنةً بالطرق الأخرى، لكنها تحمل مخاطر وتتطلب التزامًا بالمتابعة مدى الحياة.",
      ),
      h2("Choosing the right path", "اختيار المسار المناسب"),
      p(
        "The most suitable approach depends on your health, history, goals and preferences. A careful assessment considers every option — not only surgery — and the best plan is the one you understand and feel able to commit to.",
        "يعتمد الأسلوب الأنسب على حالتك الصحية وتاريخك وأهدافك وتفضيلاتك. والتقييم الدقيق يأخذ في الاعتبار كل الخيارات وليس الجراحة فقط، وأفضل خطة هي التي تفهمها وتشعر بقدرتك على الالتزام بها.",
      ),
      note(
        "This article is for general education and does not replace advice tailored to your situation.",
        "هذا المقال للتثقيف العام ولا يُغني عن نصيحة مخصّصة لحالتك.",
      ),
    ],
  },
];

/** Estimated reading time in whole minutes, calculated from the article text. */
export function readingMinutes(article: Article, locale: "en" | "ar"): number {
  const text = article.body
    .flatMap((block) => (block.type === "list" ? block.items.map((i) => i[locale]) : [block.text[locale]]))
    .join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  // Arabic words are longer on average, so they are read at a lower word rate.
  const wordsPerMinute = locale === "ar" ? 160 : 210;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
