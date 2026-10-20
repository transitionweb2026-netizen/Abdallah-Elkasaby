/**
 * The field tree for every document and catalog — the single place that
 * describes what editors see and what `validateField` checks. The admin
 * dashboard renders forms entirely from this file; it has no bespoke form
 * per content type.
 *
 * Two different ways an "image" field is handled, on purpose:
 *  - `hybridImage()` — hero/specialty/service/article/video-poster images.
 *    These already have a bundled stock photo (see content/media.ts) and
 *    nothing breaks if one is never replaced, so the editor can either pick
 *    a different *existing* photo (bundled or already uploaded) or upload a
 *    brand-new one — see `components/admin/MediaPicker.tsx`.
 *  - `upload()` — the doctor's portrait, certificate scans and before/after
 *    photos. These have no bundled fallback (they already render a neutral
 *    placeholder frame when absent), so they are a real Media Library
 *    upload/pick with no "use the stock photo" option.
 */
import { media } from "@/content/media";
import { pageKeys } from "@/lib/routes";
import type { CatalogKey, DocumentKey } from "./model";
import type { Field, Label } from "./schema";

const mediaKeyOptions = Object.keys(media).map((key) => ({ value: key, label: { en: key, ar: key } }));

const L = (en: string, ar: string): Label => ({ en, ar });

// ---- small reusable field builders -------------------------------------------------------

const text = (label: Label, opts: Partial<Field & { kind: "text" }> = {}): Field => ({ kind: "text", bilingual: true, label, ...opts });
const plain = (label: Label, opts: Partial<Field & { kind: "text" }> = {}): Field => ({ kind: "text", label, ...opts });
const num = (label: Label, opts: Partial<Field & { kind: "number" }> = {}): Field => ({ kind: "number", label, ...opts });
const bool = (label: Label): Field => ({ kind: "boolean", label });
const icon = (label: Label = L("Icon", "الأيقونة"), required = true): Field => ({ kind: "icon", label, required });
const upload = (label: Label, required = false): Field => ({ kind: "image", label, required });
const hybridImage = (label: Label = L("Photo", "الصورة")): Field => ({ kind: "image", label, bundledOptions: mediaKeyOptions });
const video = (label: Label = L("Video", "الفيديو")): Field => ({ kind: "video", label });
const cta = (label: Label, required = false): Field => ({ kind: "cta", label, required });
const note = (label: Label): Field => ({ kind: "note", label });

const iconText = (): Field => ({
  kind: "group",
  label: L("Item", "عنصر"),
  fields: { icon: icon(), text: text(L("Text", "النص"), { required: true }) },
});

const heading = (withCta = false): Field => ({
  kind: "group",
  label: L("Section heading", "عنوان القسم"),
  fields: {
    eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
    title: text(L("Title", "العنوان"), { required: true }),
    lead: text(L("Lead text", "النص التمهيدي"), { multiline: true }),
    ...(withCta ? { cta: text(L("Button label", "نص الزر"), { required: true }) } : {}),
  },
});

/** Identical hero shape on every top-level page (content/pages.ts). */
function pageHeroField(): Field {
  return {
    kind: "group",
    label: L("Page", "الصفحة"),
    fields: {
      meta: {
        kind: "group",
        label: L("SEO", "تحسين محركات البحث"),
        fields: {
          title: text(L("Meta title", "عنوان الصفحة (SEO)"), { required: true, maxLength: 70 }),
          description: text(L("Meta description", "وصف الصفحة (SEO)"), { required: true, multiline: true, maxLength: 160 }),
        },
      },
      hero: {
        kind: "group",
        label: L("Hero", "البانر الرئيسي"),
        fields: {
          eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
          title: { kind: "list", label: L("Title (two lines)", "العنوان (سطران)"), item: text(L("Line", "سطر"), { required: true }), minItems: 2, maxItems: 2 },
          lead: text(L("Lead text", "النص التمهيدي"), { required: true, multiline: true }),
          primary: cta(L("Primary button", "الزر الأساسي"), true),
          secondary: cta(L("Secondary button", "الزر الثانوي")),
          secondaryIcon: icon(L("Secondary button icon", "أيقونة الزر الثانوي"), false),
          image: hybridImage(L("Hero photo", "صورة البانر")),
          badge: {
            kind: "group",
            label: L("Highlight card", "بطاقة الإبراز"),
            fields: {
              label: text(L("Badge label", "عنوان البطاقة"), { required: true }),
              items: { kind: "list", label: L("Highlights", "النقاط"), item: iconText(), minItems: 1, maxItems: 3 },
            },
          },
        },
      },
    },
  };
}

// ---- documents ----------------------------------------------------------------------------

export type DocumentDef = { label: Label; group: Label; field: Field };

const PAGE_LABELS: Record<string, Label> = {
  home: L("Home", "الرئيسية"),
  about: L("About", "عن الطبيب"),
  services: L("Services", "الخدمات"),
  results: L("Before & After", "قبل وبعد"),
  videos: L("Videos", "الفيديوهات"),
  reviews: L("Reviews & FAQ", "الآراء والأسئلة"),
  articles: L("Articles", "المقالات"),
  contact: L("Contact", "تواصل معنا"),
};

const UI_STRING_KEYS: [string, Label][] = [
  ["skipToContent", L("Skip to content (a11y)", "تجاوز إلى المحتوى")],
  ["mainNavigation", L("Main navigation (a11y)", "التنقل الرئيسي")],
  ["breadcrumb", L("Breadcrumb (a11y)", "مسار التنقل")],
  ["openMenu", L("Open menu", "فتح القائمة")],
  ["closeMenu", L("Close menu", "إغلاق القائمة")],
  ["menu", L("Menu", "القائمة")],
  ["switchLanguage", L("Switch-language button text", "نص تبديل اللغة")],
  ["switchLanguageLabel", L("Switch-language button label (a11y)", "وصف زر تبديل اللغة")],
  ["homeLink", L("Logo link label (a11y)", "وصف رابط الشعار")],
  ["bookConsultation", L("Book consultation (long)", "احجز استشارة (طويل)")],
  ["bookShort", L("Book consultation (short)", "احجز استشارة (مختصر)")],
  ["callClinic", L("Call the clinic", "اتصل بالعيادة")],
  ["whatsappUs", L("Message on WhatsApp", "راسلنا عبر واتساب")],
  ["emailUs", L("Send an email", "أرسل بريدًا إلكترونيًا")],
  ["contactPage", L("Contact details heading", "عنوان بيانات التواصل")],
  ["phone", L("Phone (label)", "الهاتف")],
  ["phoneComingSoon", L("Phone number coming soon", "الرقم قريبًا")],
  ["linkComingSoon", L("Link coming soon", "الرابط قريبًا")],
  ["comingSoon", L("Coming soon", "قريبًا")],
  ["followUs", L("Follow us", "تابعنا")],
  ["socialProfiles", L("Social profiles (a11y)", "حسابات التواصل")],
  ["opensInNewTab", L("Opens in a new tab (a11y)", "يفتح في نافذة جديدة")],
  ["readMore", L("Read more", "اقرأ المزيد")],
  ["readArticle", L("Read article", "اقرأ المقال")],
  ["learnMore", L("Learn more", "اعرف المزيد")],
  ["minRead", L("\"min read\" suffix", "دقائق قراءة")],
  ["sample", L("Sample chip", "شارة نموذج")],
  ["sampleContent", L("Sample content note", "ملاحظة المحتوى النموذجي")],
  ["placeholder", L("Placeholder chip", "شارة عنصر مؤقت")],
  ["before", L("\"Before\" label", "قبل")],
  ["after", L("\"After\" label", "بعد")],
  ["previous", L("Previous", "السابق")],
  ["next", L("Next", "التالي")],
  ["close", L("Close", "إغلاق")],
  ["medicalDisclaimer", L("Medical disclaimer", "تنويه طبي")],
  ["floatingContact", L("Floating contact button (a11y)", "زر التواصل العائم")],
];

export const documents: Record<DocumentKey, DocumentDef> = {
  "settings.identity": {
    label: L("Doctor identity", "بيانات الطبيب"),
    group: L("Global settings", "الإعدادات العامة"),
    field: {
      kind: "group",
      label: L("Identity", "الهوية"),
      fields: {
        name: text(L("Full name", "الاسم الكامل"), { required: true }),
        shortName: text(L("Short name", "الاسم المختصر"), { required: true }),
        specialty: text(L("Specialty line", "التخصص"), { required: true }),
        description: text(L("Description", "الوصف"), { required: true, multiline: true }),
      },
    },
  },
  "settings.contact": {
    label: L("Contact details", "بيانات التواصل"),
    group: L("Global settings", "الإعدادات العامة"),
    field: {
      kind: "group",
      label: L("Contact", "التواصل"),
      fields: {
        phone: plain(L("Phone (international format)", "الهاتف (صيغة دولية)"), { format: "phone" }),
        whatsapp: plain(L("WhatsApp number (digits only)", "رقم واتساب (أرقام فقط)"), { format: "whatsapp" }),
        whatsappMessage: text(L("WhatsApp pre-filled message", "رسالة واتساب الجاهزة"), { multiline: true }),
        email: plain(L("Email", "البريد الإلكتروني"), { format: "email" }),
        address: text(L("Clinic address", "عنوان العيادة"), { multiline: true }),
        mapEmbedUrl: plain(L("Google Maps embed URL", "رابط تضمين خرائط جوجل"), { format: "url" }),
        mapLink: plain(L("Google Maps share link", "رابط خرائط جوجل للمشاركة"), { format: "url" }),
        hours: text(L("Opening hours (leave both empty to hide)", "ساعات العمل (اتركها فارغة لإخفاء السطر)")),
      },
    },
  },
  "settings.socials": {
    label: L("Social links", "روابط التواصل الاجتماعي"),
    group: L("Global settings", "الإعدادات العامة"),
    field: {
      kind: "list",
      label: L("Social platforms, in display order", "منصات التواصل بترتيب العرض"),
      item: {
        kind: "group",
        label: L("Platform", "منصة"),
        fields: {
          platform: { kind: "select", label: L("Platform", "المنصة"), required: true, options: ["facebook", "instagram", "youtube", "tiktok", "x", "linkedin"].map((v) => ({ value: v, label: L(v, v) })) },
          label: plain(L("Display label", "النص المعروض"), { required: true }),
          url: plain(L("URL", "الرابط"), { format: "url" }),
        },
      },
    },
  },
  "settings.general": {
    label: L("Sample-content toggle", "تبديل المحتوى النموذجي"),
    group: L("Global settings", "الإعدادات العامة"),
    field: {
      kind: "group",
      label: L("General", "عام"),
      fields: {
        showSampleContent: bool(L("Show sample/placeholder blocks site-wide", "إظهار العناصر النموذجية في الموقع")),
      },
    },
  },
  "settings.nav": {
    label: L("Navigation labels", "تسميات التنقل"),
    group: L("Global settings", "الإعدادات العامة"),
    field: { kind: "group", label: L("Navigation", "التنقل"), fields: Object.fromEntries(pageKeys.map((k) => [k, text(PAGE_LABELS[k], { required: true })])) },
  },
  "settings.ui": {
    label: L("Interface strings", "نصوص الواجهة"),
    group: L("Global settings", "الإعدادات العامة"),
    field: { kind: "group", label: L("Interface text", "نصوص الواجهة"), fields: Object.fromEntries(UI_STRING_KEYS.map(([k, l]) => [k, text(l, { required: true })])) },
  },
  "settings.footer": {
    label: L("Footer", "التذييل"),
    group: L("Global settings", "الإعدادات العامة"),
    field: {
      kind: "group",
      label: L("Footer", "التذييل"),
      fields: {
        intro: text(L("Intro text", "نص التعريف"), { required: true, multiline: true }),
        pagesTitle: text(L("\"Pages\" column title", "عنوان عمود الصفحات"), { required: true }),
        servicesTitle: text(L("\"Services\" column title", "عنوان عمود الخدمات"), { required: true }),
        contactTitle: text(L("\"Contact\" column title", "عنوان عمود التواصل"), { required: true }),
        addressComingSoon: text(L("Address-pending note", "ملاحظة العنوان قريبًا"), { required: true }),
        rights: text(L("Rights line", "سطر الحقوق"), { required: true }),
      },
    },
  },
  "global.finalCta": {
    label: L("Closing call-to-action (every page)", "دعوة الإجراء الختامية (كل الصفحات)"),
    group: L("Global settings", "الإعدادات العامة"),
    field: {
      kind: "group",
      label: L("Final CTA", "الدعوة الختامية"),
      fields: {
        eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
        title: text(L("Title", "العنوان"), { required: true }),
        text: text(L("Text", "النص"), { required: true, multiline: true }),
      },
    },
  },

  "home.stats": {
    label: L("Stats strip", "شريط الإحصائيات"),
    group: L("Home page", "الصفحة الرئيسية"),
    field: {
      kind: "list",
      label: L("Stats (animated count-up)", "الإحصائيات (عدّاد متحرك)"),
      maxItems: 4,
      item: {
        kind: "group",
        label: L("Stat", "إحصائية"),
        fields: {
          icon: icon(),
          value: num(L("Value", "القيمة"), { required: true, min: 0 }),
          suffix: plain(L("Suffix (e.g. \"+\", \"%\")", "الرمز اللاحق (مثل + أو %)")),
          label: text(L("Label", "التسمية"), { required: true }),
          sample: bool(L("Mark as sample (hidden when sample content is off)", "علّمها كنموذج (تُخفى عند إيقاف المحتوى النموذجي)")),
        },
      },
    },
  },
  "home.intro": {
    label: L("Introduction section", "قسم التعريف"),
    group: L("Home page", "الصفحة الرئيسية"),
    field: {
      kind: "group",
      label: L("Introduction", "التعريف"),
      fields: {
        eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
        title: text(L("Title", "العنوان"), { required: true }),
        text: text(L("Text", "النص"), { required: true, multiline: true }),
        points: { kind: "list", label: L("Points", "النقاط"), item: iconText(), minItems: 1, maxItems: 4 },
        link: text(L("Link label", "نص الرابط"), { required: true }),
        image: hybridImage(L("Photo", "الصورة")),
        caption: text(L("Caption chip on the photo", "التعليق على الصورة"), { required: true }),
      },
    },
  },
  "home.specialties": { label: L("Specialties heading", "عنوان التخصصات"), group: L("Home page", "الصفحة الرئيسية"), field: heading() },
  "home.services": { label: L("Services heading", "عنوان الخدمات"), group: L("Home page", "الصفحة الرئيسية"), field: heading(true) },
  "home.results": {
    label: L("Before/after teaser", "معاينة قبل وبعد"),
    group: L("Home page", "الصفحة الرئيسية"),
    field: {
      kind: "group",
      label: L("Before/after teaser", "معاينة قبل وبعد"),
      fields: {
        eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
        title: text(L("Title", "العنوان"), { required: true }),
        lead: text(L("Lead text", "النص التمهيدي"), { multiline: true }),
        cta: text(L("Button label", "نص الزر"), { required: true }),
        panelTitle: text(L("Side panel title", "عنوان اللوحة الجانبية"), { required: true }),
        points: { kind: "list", label: L("Side panel points", "نقاط اللوحة الجانبية"), item: text(L("Point", "نقطة"), { required: true }), minItems: 1 },
        asideTitle: text(L("Aside title", "عنوان جانبي"), { required: true }),
        asideText: text(L("Aside text", "نص جانبي"), { required: true, multiline: true }),
      },
    },
  },
  "home.journey": { label: L("Patient-journey heading", "عنوان رحلة المريض"), group: L("Home page", "الصفحة الرئيسية"), field: heading() },
  "home.expectations": {
    label: L("\"What to expect\" heading", "عنوان ما يمكن توقعه"),
    group: L("Home page", "الصفحة الرئيسية"),
    field: {
      kind: "group",
      label: L("\"What to expect\"", "ما يمكن توقعه"),
      fields: {
        eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
        title: text(L("Title", "العنوان"), { required: true }),
        lead: text(L("Lead text", "النص التمهيدي"), { multiline: true }),
        image: hybridImage(L("Photo", "الصورة")),
        caption: text(L("Caption chip on the photo", "التعليق على الصورة"), { required: true }),
      },
    },
  },
  "home.reviews": { label: L("Reviews teaser heading", "عنوان معاينة المراجعات"), group: L("Home page", "الصفحة الرئيسية"), field: heading(true) },
  "home.articles": { label: L("Articles teaser heading", "عنوان معاينة المقالات"), group: L("Home page", "الصفحة الرئيسية"), field: heading(true) },

  "pages.home": { label: PAGE_LABELS.home, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.about": { label: PAGE_LABELS.about, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.services": { label: PAGE_LABELS.services, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.results": { label: PAGE_LABELS.results, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.videos": { label: PAGE_LABELS.videos, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.reviews": { label: PAGE_LABELS.reviews, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.articles": { label: PAGE_LABELS.articles, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },
  "pages.contact": { label: PAGE_LABELS.contact, group: L("Page heroes", "بانرات الصفحات"), field: pageHeroField() },

  "services.note": {
    label: L("Services list disclaimer", "تنويه قائمة الخدمات"),
    group: L("Services page", "صفحة الخدمات"),
    field: text(L("Disclaimer", "التنويه"), { required: true, multiline: true }),
  },
  "services.journey": {
    label: L("Patient-journey steps", "خطوات رحلة المريض"),
    group: L("Services page", "صفحة الخدمات"),
    field: { kind: "list", label: L("Steps, in order", "الخطوات بالترتيب"), minItems: 1, item: { kind: "group", label: L("Step", "خطوة"), fields: { icon: icon(), title: text(L("Title", "العنوان"), { required: true }), text: text(L("Text", "النص"), { required: true, multiline: true }) } } },
  },
  "services.expectations": {
    label: L("\"What to expect\" points", "نقاط ما يمكن توقعه"),
    group: L("Services page", "صفحة الخدمات"),
    field: { kind: "list", label: L("Points", "النقاط"), minItems: 1, item: { kind: "group", label: L("Point", "نقطة"), fields: { icon: icon(), title: text(L("Title", "العنوان"), { required: true }), text: text(L("Text", "النص"), { required: true, multiline: true }) } } },
  },
  "services.approach": {
    label: L("Philosophy of care", "فلسفة الرعاية"),
    group: L("Services page", "صفحة الخدمات"),
    field: {
      kind: "group",
      label: L("Approach", "النهج"),
      fields: {
        eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
        title: text(L("Title", "العنوان"), { required: true }),
        paragraphs: { kind: "lines", label: L("Paragraphs", "الفقرات"), minItems: 1 },
        principles: { kind: "list", label: L("Principles", "المبادئ"), minItems: 1, maxItems: 4, item: { kind: "group", label: L("Principle", "مبدأ"), fields: { icon: icon(), title: text(L("Title", "العنوان"), { required: true }) } } },
      },
    },
  },

  "about.portrait": {
    label: L("Doctor's portrait", "صورة الطبيب"),
    group: L("About page", "صفحة عن الطبيب"),
    field: {
      kind: "group",
      label: L("Portrait", "الصورة الشخصية"),
      fields: {
        src: upload(L("Photo (leave empty to show the monogram plate)", "الصورة (اتركها فارغة لعرض لوحة الأحرف)")),
        alt: text(L("Alt text", "النص البديل"), { required: true }),
        width: num(L("Width (px)", "العرض (بكسل)"), { required: true, min: 1 }),
        height: num(L("Height (px)", "الارتفاع (بكسل)"), { required: true, min: 1 }),
      },
    },
  },
  "about.biography": {
    label: L("Biography", "السيرة الذاتية"),
    group: L("About page", "صفحة عن الطبيب"),
    field: {
      kind: "group",
      label: L("Biography", "السيرة"),
      fields: {
        eyebrow: text(L("Eyebrow", "الشريط العلوي"), { required: true }),
        title: text(L("Title", "العنوان"), { required: true }),
        paragraphs: { kind: "lines", label: L("Paragraphs", "الفقرات"), minItems: 1 },
        image: hybridImage(L("Photo", "الصورة")),
        caption: text(L("Caption chip on the photo", "التعليق على الصورة"), { required: true }),
      },
    },
  },

  "results.gallery": {
    label: L("Before/after disclaimer", "تنويه معرض قبل وبعد"),
    group: L("Before & After page", "صفحة قبل وبعد"),
    field: text(L("Disclaimer", "التنويه"), { required: true, multiline: true }),
  },

  "videos.library": {
    label: L("Library section heading", "عنوان قسم المكتبة"),
    group: L("Videos page", "صفحة الفيديوهات"),
    field: {
      kind: "group",
      label: L("Library heading", "عنوان المكتبة"),
      fields: {
        title: text(L("Title (shown once videos are published)", "العنوان (يظهر عند نشر فيديوهات)"), { required: true }),
        subtitle: text(L("Subtitle", "العنوان الفرعي"), { required: true, multiline: true }),
        emptyTitle: text(L("Title (shown while no video is published yet)", "العنوان (يظهر قبل نشر أي فيديو)"), { required: true }),
        emptySubtitle: text(L("Subtitle (empty state)", "العنوان الفرعي (حالة عدم وجود فيديوهات)"), { required: true, multiline: true }),
      },
    },
  },
};

// ---- catalogs -----------------------------------------------------------------------------

export type CatalogDef = { itemLabel: Label; group: Label; fields: Record<string, Field> };

export const catalogRegistry: Record<CatalogKey, CatalogDef> = {
  serviceGroups: {
    itemLabel: L("Service group", "فئة خدمات"),
    group: L("Services page", "صفحة الخدمات"),
    fields: {
      icon: icon(),
      title: text(L("Title", "العنوان"), { required: true }),
      short: text(L("Short label (used in filters)", "تسمية مختصرة"), { required: true }),
      intro: text(L("Intro text", "نص التعريف"), { required: true, multiline: true }),
    },
  },
  services: {
    itemLabel: L("Service", "خدمة"),
    group: L("Services page", "صفحة الخدمات"),
    fields: {
      icon: icon(),
      image: hybridImage(),
      title: text(L("Title", "العنوان"), { required: true }),
      summary: text(L("Summary", "الملخص"), { required: true }),
      body: text(L("Full description", "الوصف الكامل"), { required: true, multiline: true }),
      points: { kind: "list", label: L("Key points", "النقاط الأساسية"), minItems: 1, item: text(L("Point", "نقطة"), { required: true }) },
    },
  },
  specialties: {
    itemLabel: L("Specialty", "تخصص"),
    group: L("Home & About pages", "الصفحة الرئيسية وصفحة عن الطبيب"),
    fields: {
      icon: icon(),
      image: hybridImage(),
      title: text(L("Title", "العنوان"), { required: true }),
      summary: text(L("Summary", "الملخص"), { required: true, multiline: true }),
      service: { kind: "reference", label: L("Linked service", "الخدمة المرتبطة"), catalog: "services", required: true },
    },
  },
  videos: {
    itemLabel: L("Video", "فيديو"),
    group: L("Videos page", "صفحة الفيديوهات"),
    fields: {
      topic: text(L("Topic tag", "الوسم"), { required: true }),
      title: text(L("Title", "العنوان"), { required: true }),
      summary: text(L("Summary", "الملخص"), { required: true, multiline: true }),
      poster: hybridImage(L("Poster image", "صورة الغلاف")),
      source: video(L("Source (leave the type empty for \"coming soon\")", "المصدر (اتركه فارغًا لعرض \"قريبًا\")")),
    },
  },
  reviews: {
    itemLabel: L("Review", "مراجعة"),
    group: L("Reviews & FAQ page", "صفحة الآراء والأسئلة"),
    fields: {
      author: text(L("Author (initials or first name only, unless agreed otherwise)", "الكاتب (أحرف أولى أو اسم أول فقط إلا بموافقة)"), { required: true }),
      context: text(L("Context (e.g. procedure)", "السياق (مثل اسم العملية)")),
      text: text(L("Review text", "نص المراجعة"), { required: true, multiline: true }),
      isPlaceholder: bool(L("This is sample layout content, not a real review", "هذا محتوى نموذجي وليس مراجعة حقيقية")),
    },
  },
  faqCategories: {
    itemLabel: L("FAQ category", "فئة أسئلة"),
    group: L("Reviews & FAQ page", "صفحة الآراء والأسئلة"),
    fields: { icon: icon(), title: text(L("Title", "العنوان"), { required: true }) },
  },
  faqs: {
    itemLabel: L("FAQ item", "سؤال شائع"),
    group: L("Reviews & FAQ page", "صفحة الآراء والأسئلة"),
    fields: {
      q: text(L("Question", "السؤال"), { required: true }),
      a: text(L("Answer", "الإجابة"), { required: true, multiline: true }),
    },
  },
  articles: {
    itemLabel: L("Article", "مقال"),
    group: L("Articles", "المقالات"),
    fields: {
      category: text(L("Category", "التصنيف"), { required: true }),
      title: text(L("Title", "العنوان"), { required: true }),
      excerpt: text(L("Excerpt", "المقتطف"), { required: true, multiline: true }),
      image: hybridImage(),
      body: { kind: "blocks", label: L("Article body", "نص المقال"), required: true },
      reviewedBy: plain(L("Medically reviewed by (required to publish)", "راجعه طبيًا (مطلوب للنشر)")),
      isPlaceholder: bool(L("This is a demo draft, not reviewed content", "هذه مسودة نموذجية وليست محتوى تمت مراجعته")),
    },
  },
  beforeAfterCases: {
    itemLabel: L("Before/after case", "حالة قبل وبعد"),
    group: L("Before & After page", "صفحة قبل وبعد"),
    fields: {
      category: text(L("Category", "التصنيف"), { required: true }),
      title: text(L("Title", "العنوان"), { required: true }),
      caption: text(L("Caption", "التعليق"), { required: true }),
      before: {
        kind: "group",
        label: L("Before photo", "صورة قبل"),
        fields: { asset: upload(L("Photo", "الصورة")), alt: text(L("Alt text", "النص البديل")) },
      },
      after: {
        kind: "group",
        label: L("After photo", "صورة بعد"),
        fields: { asset: upload(L("Photo", "الصورة")), alt: text(L("Alt text", "النص البديل")) },
      },
      aspect: num(L("Aspect ratio (width ÷ height, e.g. 0.8)", "نسبة العرض إلى الارتفاع"), { required: true, min: 0.1, max: 3 }),
      isPlaceholder: bool(L("This is a sample placeholder, not a patient photo", "هذا عنصر نموذجي وليس صورة مريض حقيقية")),
    },
  },
  credentials: {
    itemLabel: L("Credential", "مؤهل"),
    group: L("About page", "صفحة عن الطبيب"),
    fields: {
      icon: icon(),
      title: text(L("Title", "العنوان"), { required: true }),
      detail: text(L("Detail", "التفاصيل"), { required: true }),
      sample: bool(L("Mark as sample", "علّمها كنموذج")),
    },
  },
  timeline: {
    itemLabel: L("Timeline entry", "عنصر المسار المهني"),
    group: L("About page", "صفحة عن الطبيب"),
    fields: {
      period: text(L("Period (e.g. a year)", "الفترة (مثل سنة)"), { required: true }),
      title: text(L("Title", "العنوان"), { required: true }),
      detail: text(L("Detail", "التفاصيل"), { required: true }),
      sample: bool(L("Mark as sample", "علّمها كنموذج")),
    },
  },
  certificates: {
    itemLabel: L("Certificate", "شهادة"),
    group: L("About page", "صفحة عن الطبيب"),
    fields: {
      src: upload(L("Scan (leave empty for a neutral placeholder frame)", "صورة الشهادة (اتركها فارغة لعرض إطار مؤقت)")),
      width: num(L("Width (px)", "العرض (بكسل)"), { required: true, min: 1 }),
      height: num(L("Height (px)", "الارتفاع (بكسل)"), { required: true, min: 1 }),
      alt: text(L("Alt text", "النص البديل"), { required: true }),
    },
  },
};

export { note };
