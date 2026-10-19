/**
 * Hero copy and search metadata for every page. All pages render the same
 * `Hero` component; only the wording, image and highlights change here.
 */
import type { IconName } from "@/components/ui/Icon";
import type { L10n } from "@/lib/i18n";
import type { PageKey } from "@/lib/routes";
import type { MediaKey } from "./media";

export type HeroCta = { label: L10n; target: "booking" | PageKey; hash?: string };

export type PageContent = {
  meta: { title: L10n; description: L10n };
  hero: {
    eyebrow: L10n;
    /** Two lines: the second is set in the brand ink gradient. */
    title: [L10n, L10n];
    lead: L10n;
    primary: HeroCta;
    secondary?: HeroCta;
    /** Icon on the secondary (ghost) button. */
    secondaryIcon?: IconName;
    image: MediaKey;
    /** Small glass card over the image: a label and up to three highlights. */
    badge: { label: L10n; items: { icon: IconName; text: L10n }[] };
  };
};

export const pages: Record<PageKey, PageContent> = {
  home: {
    meta: {
      title: {
        en: "Dr. Abdullah Elkasaby | General & Bariatric Surgery",
        ar: "د. عبدالله القصبي | الجراحة العامة وجراحات السمنة",
      },
      description: {
        en: "General and bariatric surgery with Dr. Abdullah Elkasaby: careful assessment, clear explanation of every option and structured follow-up care.",
        ar: "الجراحة العامة وجراحات السمنة مع د. عبدالله القصبي: تقييم دقيق وشرح واضح لكل خيار ومتابعة منظّمة بعد العلاج.",
      },
    },
    hero: {
      eyebrow: { en: "General & Bariatric Surgery", ar: "الجراحة العامة وجراحات السمنة" },
      title: [
        { en: "Expert surgical care.", ar: "رعاية جراحية متخصصة" },
        { en: "A healthier tomorrow.", ar: "لغدٍ أكثر صحة" },
      ],
      lead: {
        en: "Dr. Abdullah Elkasaby offers general and bariatric surgical care built on careful assessment, clear explanation and structured follow-up — so every decision about surgery is one you understand and share.",
        ar: "يقدّم د. عبدالله القصبي رعاية في الجراحة العامة وجراحات السمنة تقوم على تقييم دقيق وشرح واضح ومتابعة منظّمة، ليكون كل قرار جراحي قرارًا تفهمه وتشارك فيه.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "Explore services", ar: "تعرّف على الخدمات" }, target: "services" },
      secondaryIcon: "stethoscope",
      image: "heroHome",
      badge: {
        label: { en: "Areas of care", ar: "مجالات الرعاية" },
        items: [
          { icon: "stethoscope", text: { en: "General surgery", ar: "الجراحة العامة" } },
          { icon: "scale", text: { en: "Bariatric surgery", ar: "جراحات السمنة" } },
          { icon: "scan", text: { en: "Laparoscopic techniques", ar: "تقنيات المناظير" } },
        ],
      },
    },
  },

  about: {
    meta: {
      title: { en: "About the Doctor", ar: "عن الطبيب" },
      description: {
        en: "Meet Dr. Abdullah Elkasaby — general and bariatric surgery with an approach built on listening, thorough assessment and honest guidance.",
        ar: "تعرّف على د. عبدالله القصبي — الجراحة العامة وجراحات السمنة بنهج يقوم على الإصغاء والتقييم الشامل والإرشاد الصادق.",
      },
    },
    hero: {
      eyebrow: { en: "About the doctor", ar: "عن الطبيب" },
      title: [
        { en: "Dr. Abdullah Elkasaby", ar: "د. عبدالله القصبي" },
        { en: "Surgery with a human focus", ar: "جراحة محورها الإنسان" },
      ],
      lead: {
        en: "Good surgical care begins long before the operating room — with listening, a careful assessment and honest guidance about every option.",
        ar: "تبدأ الرعاية الجراحية الجيدة قبل غرفة العمليات بوقت طويل؛ بالإصغاء والتقييم الدقيق والإرشاد الصادق حول كل الخيارات.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "View services", ar: "عرض الخدمات" }, target: "services" },
      secondaryIcon: "stethoscope",
      image: "heroAbout",
      badge: {
        label: { en: "Practice", ar: "مجال الممارسة" },
        items: [
          { icon: "stethoscope", text: { en: "General surgery", ar: "الجراحة العامة" } },
          { icon: "scale", text: { en: "Bariatric surgery", ar: "جراحات السمنة" } },
        ],
      },
    },
  },

  services: {
    meta: {
      title: { en: "Surgical Services", ar: "الخدمات الجراحية" },
      description: {
        en: "Bariatric surgery, sleeve gastrectomy, laparoscopic gallbladder and hernia surgery and general abdominal surgery — explained clearly, with suitability assessed individually.",
        ar: "جراحات السمنة وتكميم المعدة وجراحات المرارة والفتق بالمنظار والجراحة العامة للبطن — بشرح واضح وتقييم فردي لمدى الملاءمة.",
      },
    },
    hero: {
      eyebrow: { en: "Surgical services", ar: "الخدمات الجراحية" },
      title: [
        { en: "Surgical care,", ar: "خدمات جراحية" },
        { en: "planned around you", ar: "مخطّطة حول احتياجك" },
      ],
      lead: {
        en: "From weight-management surgery to common general and laparoscopic procedures, every treatment begins with an honest assessment of whether surgery is right for you.",
        ar: "من جراحات السمنة إلى العمليات العامة الشائعة وجراحات المناظير، يبدأ كل علاج بتقييم صادق لمدى ملاءمة الجراحة لك.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "How care works", ar: "كيف تسير الرعاية" }, target: "services", hash: "approach" },
      secondaryIcon: "route",
      image: "heroServices",
      badge: {
        label: { en: "Two areas of care", ar: "مجالان للرعاية" },
        items: [
          { icon: "scale", text: { en: "Bariatric & weight management", ar: "السمنة وإدارة الوزن" } },
          { icon: "scan", text: { en: "General & laparoscopic", ar: "الجراحة العامة والمناظير" } },
        ],
      },
    },
  },

  results: {
    meta: {
      title: { en: "Before & After", ar: "قبل وبعد" },
      description: {
        en: "Before-and-after photographs shared only with written patient consent. Every patient is different and individual results vary.",
        ar: "صور قبل وبعد تُنشر فقط بموافقة كتابية من المرضى. لكل مريض ظروفه، وتختلف النتائج من شخص لآخر.",
      },
    },
    hero: {
      eyebrow: { en: "Before & After", ar: "قبل وبعد" },
      title: [
        { en: "Progress, shared", ar: "رحلات تقدّم" },
        { en: "with consent and care", ar: "تُعرض بموافقة ومسؤولية" },
      ],
      lead: {
        en: "Patient photographs appear here only with written consent and without identifying details. Every body is different, and individual results vary.",
        ar: "تُعرض صور المرضى هنا فقط بموافقة كتابية ودون أي بيانات تكشف هويتهم. لكل جسم طبيعته، وتختلف النتائج من شخص لآخر.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "Read about bariatric surgery", ar: "اقرأ عن جراحات السمنة" }, target: "articles" },
      secondaryIcon: "book",
      image: "heroResults",
      badge: {
        label: { en: "Our standard", ar: "معاييرنا" },
        items: [
          { icon: "shield", text: { en: "Written patient consent", ar: "موافقة كتابية من المريض" } },
          { icon: "lock", text: { en: "No identifying details", ar: "دون بيانات تكشف الهوية" } },
        ],
      },
    },
  },

  videos: {
    meta: {
      title: { en: "Educational Videos", ar: "فيديوهات توعوية" },
      description: {
        en: "Short educational videos about bariatric surgery, general surgery, preparing for a consultation and recovering after an operation.",
        ar: "فيديوهات توعوية قصيرة عن جراحات السمنة والجراحة العامة والاستعداد للاستشارة والتعافي بعد العملية.",
      },
    },
    hero: {
      eyebrow: { en: "Video library", ar: "مكتبة الفيديو" },
      title: [
        { en: "Watch, learn,", ar: "شاهد وتعلّم" },
        { en: "and feel prepared", ar: "واستعد بثقة" },
      ],
      lead: {
        en: "Short educational videos on surgery, weight-management treatment and recovery — made to help you arrive at your consultation informed.",
        ar: "فيديوهات تثقيفية قصيرة عن الجراحة وعلاج السمنة والتعافي، لتصل إلى استشارتك وأنت على دراية كاملة.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "Read the articles", ar: "اقرأ المقالات" }, target: "articles" },
      secondaryIcon: "book",
      image: "heroVideos",
      badge: {
        label: { en: "Patient education", ar: "تثقيف المرضى" },
        items: [
          { icon: "play", text: { en: "Short, clear explanations", ar: "شرح قصير وواضح" } },
          { icon: "book", text: { en: "Before and after surgery", ar: "قبل الجراحة وبعدها" } },
        ],
      },
    },
  },

  reviews: {
    meta: {
      title: { en: "Patient Reviews & Questions", ar: "آراء المرضى والأسئلة الشائعة" },
      description: {
        en: "Patient feedback and clear answers to common questions about surgical consultations, bariatric surgery, preparation and recovery.",
        ar: "آراء المرضى وإجابات واضحة عن الأسئلة الشائعة حول الاستشارة الجراحية وجراحات السمنة والاستعداد للعملية والتعافي.",
      },
    },
    hero: {
      eyebrow: { en: "Reviews & questions", ar: "الآراء والأسئلة" },
      title: [
        { en: "Patient voices", ar: "أصوات المرضى" },
        { en: "and clear answers", ar: "وإجابات واضحة" },
      ],
      lead: {
        en: "Read feedback from patients and find straightforward answers to the questions people most often ask before surgery.",
        ar: "اطّلع على آراء المرضى واعثر على إجابات مباشرة عن الأسئلة الأكثر شيوعًا قبل الجراحة.",
      },
      primary: { label: { en: "Ask your question", ar: "اطرح سؤالك" }, target: "booking" },
      secondary: { label: { en: "Jump to questions", ar: "انتقل إلى الأسئلة" }, target: "reviews", hash: "faq" },
      secondaryIcon: "help",
      image: "heroReviews",
      badge: {
        label: { en: "On this page", ar: "في هذه الصفحة" },
        items: [
          { icon: "quote", text: { en: "Patient feedback", ar: "آراء المرضى" } },
          { icon: "help", text: { en: "Common questions", ar: "الأسئلة الشائعة" } },
        ],
      },
    },
  },

  articles: {
    meta: {
      title: { en: "Articles & Patient Education", ar: "المقالات والتثقيف الصحي" },
      description: {
        en: "Educational articles on bariatric surgery, laparoscopic surgery, preparing for a consultation and recovering well after an operation.",
        ar: "مقالات تثقيفية عن جراحات السمنة وجراحات المناظير والاستعداد للاستشارة والتعافي الجيد بعد العملية.",
      },
    },
    hero: {
      eyebrow: { en: "Patient education", ar: "التثقيف الصحي" },
      title: [
        { en: "Articles that help you", ar: "مقالات تساعدك" },
        { en: "understand your options", ar: "على فهم خياراتك" },
      ],
      lead: {
        en: "Clear, carefully written guides to surgical treatment, weight-management surgery and recovery — general information to support, not replace, a personal consultation.",
        ar: "أدلة واضحة ومكتوبة بعناية عن العلاج الجراحي وجراحات السمنة والتعافي؛ معلومات عامة تدعم الاستشارة الشخصية ولا تحلّ محلها.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "Common questions", ar: "الأسئلة الشائعة" }, target: "reviews", hash: "faq" },
      secondaryIcon: "help",
      image: "heroArticles",
      badge: {
        label: { en: "Topics", ar: "الموضوعات" },
        items: [
          { icon: "scale", text: { en: "Weight-management surgery", ar: "جراحات السمنة" } },
          { icon: "heart", text: { en: "Preparation & recovery", ar: "الاستعداد والتعافي" } },
        ],
      },
    },
  },

  contact: {
    meta: {
      title: { en: "Contact the Clinic", ar: "تواصل مع العيادة" },
      description: {
        en: "Contact Dr. Abdullah Elkasaby's clinic to arrange a consultation for general or bariatric surgery.",
        ar: "تواصل مع عيادة د. عبدالله القصبي لترتيب استشارة في الجراحة العامة أو جراحات السمنة.",
      },
    },
    hero: {
      eyebrow: { en: "Contact the clinic", ar: "تواصل مع العيادة" },
      title: [
        { en: "Every treatment journey", ar: "كل رحلة علاج" },
        { en: "starts with a conversation", ar: "تبدأ بمحادثة" },
      ],
      lead: {
        en: "Reach the clinic to arrange a consultation, ask about a procedure or share previous reports before your visit.",
        ar: "تواصل مع العيادة لترتيب استشارة أو للاستفسار عن إجراء جراحي أو لإرسال تقاريرك السابقة قبل الزيارة.",
      },
      primary: { label: { en: "Book a consultation", ar: "احجز استشارة" }, target: "booking" },
      secondary: { label: { en: "Before you visit", ar: "قبل زيارتك" }, target: "contact", hash: "prepare" },
      secondaryIcon: "clipboardList",
      image: "heroContact",
      badge: {
        label: { en: "Reach us by", ar: "تواصل عبر" },
        items: [
          { icon: "phone", text: { en: "Phone", ar: "الهاتف" } },
          { icon: "message", text: { en: "WhatsApp", ar: "واتساب" } },
        ],
      },
    },
  },
};
