/**
 * Frequently asked questions. Educational and deliberately general — please
 * have Dr. Elkasaby review the wording before launch and adapt it to the
 * clinic's own practice.
 */
import type { IconName } from "@/components/ui/Icon";
import type { L10n } from "@/lib/i18n";

export type FaqGroup = { id: string; icon: IconName; title: L10n; items: { q: L10n; a: L10n }[] };

export const faqGroups: FaqGroup[] = [
  {
    id: "consultation",
    icon: "messages",
    title: { en: "Consultation", ar: "الاستشارة" },
    items: [
      {
        q: { en: "When should I see a surgeon?", ar: "متى يجب أن أستشير جرّاحًا؟" },
        a: {
          en: "A surgical consultation can help if you have been told you may need an operation, if you have a symptom such as a lump, recurring abdominal pain or a bulge in the groin or abdomen, or if you are considering weight-management surgery. Sudden severe pain, vomiting with a painful bulge, or fever with abdominal pain should be assessed urgently at an emergency department.",
          ar: "قد تفيدك الاستشارة الجراحية إذا قيل لك إنك قد تحتاج إلى عملية، أو إذا كان لديك عرض مثل كتلة أو ألم متكرر في البطن أو بروز في الأربية أو البطن، أو إذا كنت تفكر في جراحة لعلاج السمنة. أما الألم الشديد المفاجئ، أو القيء مع بروز مؤلم، أو الحمى مع ألم البطن، فيجب تقييمها بشكل عاجل في قسم الطوارئ.",
        },
      },
      {
        q: { en: "What happens at the first consultation?", ar: "ماذا يحدث في الاستشارة الأولى؟" },
        a: {
          en: "Expect a conversation about your symptoms, medical history, medications and goals, followed by an examination. You may be asked to have tests or scans. The options — including non-surgical ones — are explained with their benefits and risks, and you are welcome to take time before deciding.",
          ar: "تبدأ الاستشارة بحوار حول أعراضك وتاريخك المرضي وأدويتك وأهدافك، يليه الفحص السريري، وقد يُطلب منك إجراء تحاليل أو أشعة. ثم تُشرح الخيارات، بما فيها غير الجراحية، مع فوائدها ومخاطرها، ولك أن تأخذ وقتك قبل اتخاذ القرار.",
        },
      },
      {
        q: { en: "What should I bring to my appointment?", ar: "ماذا أحضر معي إلى الموعد؟" },
        a: {
          en: "Bring previous medical reports, scan images and their written reports, recent blood tests, a list of your medications and doses, and details of past operations. Writing your questions down beforehand also helps.",
          ar: "أحضر التقارير الطبية السابقة وصور الأشعة وتقاريرها المكتوبة والتحاليل الحديثة وقائمة بأدويتك وجرعاتها وتفاصيل العمليات السابقة. ومن المفيد أيضًا أن تكتب أسئلتك مسبقًا.",
        },
      },
    ],
  },
  {
    id: "bariatric",
    icon: "scale",
    title: { en: "Bariatric surgery", ar: "جراحات السمنة" },
    items: [
      {
        q: { en: "Who might be considered for bariatric surgery?", ar: "من قد يكون مرشّحًا لجراحات السمنة؟" },
        a: {
          en: "Bariatric surgery is generally considered for adults with severe obesity, or with obesity together with weight-related conditions such as type 2 diabetes, especially when other approaches have not achieved lasting results. Body mass index (BMI) is only one part of the picture: overall health, history and readiness for long-term change matter just as much. Suitability can only be decided after a personal assessment.",
          ar: "يُنظر عادةً في جراحات السمنة للبالغين المصابين بسمنة شديدة، أو بسمنة مصحوبة بأمراض مرتبطة بها مثل السكري من النوع الثاني، خاصةً عندما لا تحقق الوسائل الأخرى نتائج دائمة. ومؤشر كتلة الجسم جزء واحد فقط من الصورة؛ فالحالة الصحية العامة والتاريخ المرضي والاستعداد للتغيير طويل المدى لا تقل أهمية. ولا يمكن تحديد الملاءمة إلا بعد تقييم شخصي.",
        },
      },
      {
        q: { en: "Is weight-loss surgery a quick fix?", ar: "هل جراحة السمنة حلّ سريع؟" },
        a: {
          en: "No. Surgery can be a powerful tool, but lasting results depend on long-term changes in eating habits and physical activity, and on regular follow-up that includes nutritional monitoring. Results vary from person to person.",
          ar: "لا. قد تكون الجراحة أداة فعّالة، لكن النتائج الدائمة تعتمد على تغييرات طويلة المدى في العادات الغذائية والنشاط البدني، وعلى متابعة منتظمة تشمل مراقبة الحالة الغذائية. وتختلف النتائج من شخص لآخر.",
        },
      },
      {
        q: { en: "Which bariatric procedure is right for me?", ar: "أي عملية سمنة تناسبني؟" },
        a: {
          en: "The choice depends on factors such as your weight history, medical conditions, reflux symptoms, medications and personal preferences. The options — and the reasons one may suit you better than another — are discussed during consultation.",
          ar: "يعتمد الاختيار على عوامل مثل تاريخ وزنك وأمراضك المصاحبة وأعراض الارتجاع والأدوية التي تتناولها وتفضيلاتك الشخصية. وتُناقش الخيارات وأسباب ملاءمة أحدها لك أكثر من غيره خلال الاستشارة.",
        },
      },
    ],
  },
  {
    id: "recovery",
    icon: "heart",
    title: { en: "Preparation & recovery", ar: "الاستعداد والتعافي" },
    items: [
      {
        q: { en: "How do I prepare for surgery?", ar: "كيف أستعد للعملية؟" },
        a: {
          en: "Preparation depends on the procedure and may include blood tests, an anaesthetic assessment, changes to some medications and fasting instructions. Before bariatric surgery a specific diet is often recommended. You will receive instructions that apply to you personally.",
          ar: "يعتمد الاستعداد على نوع العملية، وقد يشمل تحاليل دم وتقييمًا من طبيب التخدير وتعديل بعض الأدوية وتعليمات الصيام. وقبل جراحات السمنة يُوصى غالبًا بنظام غذائي خاص. وستحصل على تعليمات تخص حالتك أنت.",
        },
      },
      {
        q: { en: "How long does recovery take?", ar: "كم تستغرق فترة التعافي؟" },
        a: {
          en: "Recovery differs with the type of operation, the technique used and each person's health. Laparoscopic procedures often allow a quicker return to light activity than open surgery, but your own timeline — including when to return to work, drive or lift — is discussed with you individually.",
          ar: "تختلف فترة التعافي باختلاف نوع العملية والتقنية المستخدمة والحالة الصحية لكل شخص. وغالبًا ما تسمح جراحات المناظير بعودة أسرع إلى النشاط الخفيف مقارنةً بالجراحة المفتوحة، لكن جدولك الزمني الخاص، بما في ذلك العودة إلى العمل والقيادة وحمل الأشياء، يُناقش معك بشكل فردي.",
        },
      },
      {
        q: { en: "When should I get in touch after surgery?", ar: "متى يجب أن أتواصل بعد العملية؟" },
        a: {
          en: "Contact the clinic or seek urgent care if you develop fever, increasing pain, redness or discharge from a wound, persistent vomiting, difficulty breathing, a painful swollen leg, or anything else that worries you.",
          ar: "تواصل مع العيادة أو اطلب رعاية عاجلة إذا ظهرت لديك حمى، أو ألم متزايد، أو احمرار أو إفرازات من الجرح، أو قيء مستمر، أو صعوبة في التنفس، أو تورّم مؤلم في الساق، أو أي أمر آخر يقلقك.",
        },
      },
      {
        q: { en: "Will I need follow-up visits?", ar: "هل سأحتاج إلى زيارات متابعة؟" },
        a: {
          en: "Yes. Follow-up allows healing and progress to be checked and concerns to be addressed early. After bariatric surgery, follow-up continues over the long term.",
          ar: "نعم. تتيح المتابعة الاطمئنان على التعافي والتقدّم ومعالجة أي مخاوف مبكرًا. وبعد جراحات السمنة تستمر المتابعة على المدى الطويل.",
        },
      },
    ],
  },
];
