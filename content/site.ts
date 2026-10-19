/**
 * ───────────────────────────────────────────────────────────────────────────
 *  SITE-WIDE CONTENT — the single place for the doctor's identity, contact
 *  details, social links, navigation labels and interface wording.
 *
 *  Anything still set to `REPLACE_WITH_…` is treated as "not supplied yet":
 *  it is never rendered as a working link (see `lib/contact.ts`). Run
 *  `npm run check:content` to list every value that still needs replacing.
 * ───────────────────────────────────────────────────────────────────────────
 */
import type { L10n } from "@/lib/i18n";
import type { PageKey } from "@/lib/routes";

export const doctor = {
  name: { en: "Dr. Abdullah Elkasaby", ar: "د. عبدالله القصبي" } satisfies L10n,
  shortName: { en: "Dr. Elkasaby", ar: "د. القصبي" } satisfies L10n,
  /** Shown under the name in the navbar, footer and metadata. Not a rank or title claim. */
  specialty: { en: "General & Bariatric Surgery", ar: "الجراحة العامة وجراحات السمنة" } satisfies L10n,
  description: {
    en: "General and bariatric surgical care built on careful assessment, clear explanation and structured follow-up.",
    ar: "رعاية في الجراحة العامة وجراحات السمنة تقوم على تقييم دقيق وشرح واضح ومتابعة منظّمة.",
  } satisfies L10n,
};

export const contact = {
  /** International format, e.g. "+20 100 000 0000". Used for display and `tel:` links. */
  phone: "REPLACE_WITH_REAL_PHONE",
  /** Country code + number, digits only, e.g. "201000000000". Used for wa.me links. */
  whatsapp: "REPLACE_WITH_REAL_WHATSAPP",
  whatsappMessage: {
    en: "Hello, I would like to book a consultation with Dr. Abdullah Elkasaby.",
    ar: "مرحبًا، أرغب في حجز استشارة مع د. عبدالله القصبي.",
  } satisfies L10n,
  email: "REPLACE_WITH_REAL_EMAIL",
  address: { en: "REPLACE_WITH_CLINIC_ADDRESS", ar: "REPLACE_WITH_CLINIC_ADDRESS" } satisfies L10n,
  /** Google Maps "Embed a map" iframe src for the clinic. */
  mapEmbedUrl: "REPLACE_WITH_MAP_EMBED_URL",
  /** Google Maps share link for "Get directions". */
  mapLink: "REPLACE_WITH_MAP_LINK",
  /** Opening hours, e.g. { en: "Sat–Thu · 5–10 pm", ar: "السبت–الخميس · ٥–١٠ مساءً" }. `null` hides the row. */
  hours: null as L10n | null,
};

export type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok" | "x" | "linkedin";

/** Order here is the order shown. Remove a row to hide that platform entirely. */
export const socials: { platform: SocialPlatform; label: string; url: string }[] = [
  { platform: "facebook", label: "Facebook", url: "REPLACE_WITH_REAL_SOCIAL_URL" },
  { platform: "instagram", label: "Instagram", url: "REPLACE_WITH_REAL_SOCIAL_URL" },
  { platform: "youtube", label: "YouTube", url: "REPLACE_WITH_REAL_SOCIAL_URL" },
  { platform: "tiktok", label: "TikTok", url: "REPLACE_WITH_REAL_SOCIAL_URL" },
];

export const settings = {
  /**
   * While real reviews, before/after photos, credentials and certificates are
   * being collected, the site shows clearly labelled sample layouts. Set to
   * `false` to hide every sample block and show a neutral "coming soon" note.
   */
  showSampleContent: true,
};

export const navLabels: Record<PageKey, L10n> = {
  home: { en: "Home", ar: "الرئيسية" },
  about: { en: "About", ar: "عن الطبيب" },
  services: { en: "Services", ar: "الخدمات" },
  results: { en: "Before & After", ar: "قبل وبعد" },
  videos: { en: "Videos", ar: "الفيديوهات" },
  reviews: { en: "Reviews & FAQ", ar: "الآراء والأسئلة" },
  articles: { en: "Articles", ar: "المقالات" },
  contact: { en: "Contact", ar: "تواصل معنا" },
};

/** Interface wording shared by many components. */
export const ui = {
  skipToContent: { en: "Skip to main content", ar: "انتقل إلى المحتوى الرئيسي" },
  mainNavigation: { en: "Main navigation", ar: "التنقل الرئيسي" },
  breadcrumb: { en: "Breadcrumb", ar: "مسار التنقل" },
  openMenu: { en: "Open menu", ar: "فتح القائمة" },
  closeMenu: { en: "Close menu", ar: "إغلاق القائمة" },
  menu: { en: "Menu", ar: "القائمة" },
  switchLanguage: { en: "العربية", ar: "English" },
  switchLanguageLabel: { en: "Switch to Arabic", ar: "التبديل إلى الإنجليزية" },
  homeLink: { en: "Dr. Abdullah Elkasaby — home", ar: "د. عبدالله القصبي — الصفحة الرئيسية" },
  bookConsultation: { en: "Book a consultation", ar: "احجز استشارة" },
  bookShort: { en: "Book", ar: "احجز" },
  callClinic: { en: "Call the clinic", ar: "اتصل بالعيادة" },
  whatsappUs: { en: "Message on WhatsApp", ar: "راسلنا عبر واتساب" },
  emailUs: { en: "Send an email", ar: "أرسل بريدًا إلكترونيًا" },
  contactPage: { en: "Contact details", ar: "بيانات التواصل" },
  phone: { en: "Phone", ar: "الهاتف" },
  phoneComingSoon: { en: "Number coming soon", ar: "الرقم قريبًا" },
  linkComingSoon: { en: "link coming soon", ar: "الرابط قريبًا" },
  comingSoon: { en: "Coming soon", ar: "قريبًا" },
  followUs: { en: "Follow", ar: "تابعنا" },
  socialProfiles: { en: "Social media profiles", ar: "حسابات التواصل الاجتماعي" },
  opensInNewTab: { en: "opens in a new tab", ar: "يفتح في نافذة جديدة" },
  readMore: { en: "Read more", ar: "اقرأ المزيد" },
  readArticle: { en: "Read article", ar: "اقرأ المقال" },
  learnMore: { en: "Learn more", ar: "اعرف المزيد" },
  minRead: { en: "min read", ar: "دقائق قراءة" },
  sample: { en: "Sample", ar: "نموذج" },
  sampleContent: { en: "Sample layout — real content to be added", ar: "تصميم نموذجي — سيُضاف المحتوى الحقيقي" },
  placeholder: { en: "Placeholder", ar: "عنصر مؤقت" },
  before: { en: "Before", ar: "قبل" },
  after: { en: "After", ar: "بعد" },
  previous: { en: "Previous", ar: "السابق" },
  next: { en: "Next", ar: "التالي" },
  close: { en: "Close", ar: "إغلاق" },
  medicalDisclaimer: {
    en: "The information on this website is general and educational. It does not replace a personal medical consultation.",
    ar: "المعلومات في هذا الموقع عامة وتثقيفية، ولا تُغني عن الاستشارة الطبية الشخصية.",
  },
  floatingContact: { en: "Contact the clinic", ar: "تواصل مع العيادة" },
};

export const footer = {
  intro: {
    en: "General and bariatric surgery with a focus on careful assessment, honest guidance and follow-up that continues after the operation.",
    ar: "الجراحة العامة وجراحات السمنة مع تركيز على التقييم الدقيق والإرشاد الصادق والمتابعة المستمرة بعد العملية.",
  },
  pagesTitle: { en: "Pages", ar: "الصفحات" },
  servicesTitle: { en: "Services", ar: "الخدمات" },
  contactTitle: { en: "Contact", ar: "التواصل" },
  addressComingSoon: { en: "Clinic address will be published soon.", ar: "سيُعلن عن عنوان العيادة قريبًا." },
  rights: { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
};
