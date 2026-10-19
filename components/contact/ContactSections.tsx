import type { CSSProperties, ReactNode } from "react";
import { contact, footer, socials, ui } from "@/content/site";
import { hasAddress, hasEmail, hasMap, hasPhone, hasWhatsapp, isConfigured, mailHref, telHref, whatsappHref } from "@/lib/contact";
import type { L10n, Locale } from "@/lib/i18n";
import { Icon, type IconName } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { SocialIcon } from "../ui/SocialIcon";
import styles from "./ContactSections.module.css";

const copy = {
  title: { en: "Ways to reach the clinic", ar: "طرق التواصل مع العيادة" },
  subtitle: {
    en: "Consultations are arranged by phone or WhatsApp. Details not yet published are marked “coming soon”.",
    ar: "تُرتّب الاستشارات عبر الهاتف أو واتساب. والبيانات التي لم تُنشر بعد مُشار إليها بعبارة «قريبًا».",
  },
  phone: { en: "Call to book or ask a question", ar: "اتصل للحجز أو للاستفسار" },
  whatsapp: { en: "Message us, or send photos of reports", ar: "راسلنا أو أرسل صور التقارير" },
  email: { en: "For non-urgent questions and documents", ar: "للاستفسارات غير العاجلة والمستندات" },
  social: { en: "Follow for patient-education updates", ar: "تابع المحتوى التوعوي" },
  location: { en: "Clinic location", ar: "موقع العيادة" },
  hours: { en: "Opening hours", ar: "مواعيد العمل" },
  directions: { en: "Get directions", ar: "احصل على الاتجاهات" },
  mapSoon: { en: "Map will appear once the address is confirmed", ar: "ستظهر الخريطة بعد تأكيد العنوان" },
  privacy: {
    en: "For your privacy, please avoid posting medical details in public comments. Use WhatsApp or the phone, or bring reports to your appointment.",
    ar: "حفاظًا على خصوصيتك، تجنّب نشر التفاصيل الطبية في التعليقات العامة. استخدم واتساب أو الهاتف، أو أحضر تقاريرك إلى الموعد.",
  },
  emergency: {
    en: "In an emergency — severe pain, heavy bleeding, difficulty breathing — go to the nearest emergency department.",
    ar: "في الطوارئ، مثل الألم الشديد أو النزيف الغزير أو صعوبة التنفس، توجّه إلى أقرب قسم طوارئ.",
  },
  prepare: {
    title: { en: "Helpful to share when you get in touch", ar: "معلومات مفيدة عند التواصل" },
    subtitle: { en: "A little information in advance helps the clinic arrange the right appointment.", ar: "تساعد بعض المعلومات المسبقة العيادة على ترتيب الموعد المناسب." },
    steps: [
      { icon: "user", text: { en: "Your name and a phone number we can reach", ar: "اسمك ورقم هاتف يمكن التواصل معك عليه" } },
      { icon: "clipboardList", text: { en: "A short description of your symptoms or the procedure you are asking about", ar: "وصف مختصر لأعراضك أو للإجراء الذي تستفسر عنه" } },
      { icon: "fileHeart", text: { en: "Previous reports, scans and recent blood tests, if you have them", ar: "التقارير والأشعة وتحاليل الدم الحديثة إن وُجدت" } },
      { icon: "calendar", text: { en: "The days and times that suit you best", ar: "الأيام والأوقات الأنسب لك" } },
    ] satisfies { icon: IconName; text: L10n }[],
  },
};

function Channel({ icon, title, hint, children, index, green }: { icon: ReactNode; title: string; hint: string; children: ReactNode; index: number; green?: boolean }) {
  return (
    <li className={styles.cell} data-reveal style={{ "--d": index } as CSSProperties}>
      <div className={`glass glass-hover icon-trigger ${green ? "glass--mint" : ""} ${styles.channel}`}>
        <span className={`icon-badge ${green ? "icon-badge--green" : ""} ${styles.channelIcon}`}>{icon}</span>
        <h3 className="title-card">{title}</h3>
        <p className={styles.hint}>{hint}</p>
        <div className={styles.value}>{children}</div>
      </div>
    </li>
  );
}

export function ContactChannels({ locale }: { locale: Locale }) {
  const soon = <span className={styles.pending}>{ui.comingSoon[locale]}</span>;
  return (
    <section className="section" aria-labelledby="channels-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--tl" /></div>
      <div className="container">
        <SectionHeading id="channels-title" title={copy.title[locale]} subtitle={copy.subtitle[locale]} />
        <ul className={styles.channels}>
          <Channel index={0} icon={<Icon name="phone" size={26} strokeWidth={1.6} />} title={ui.phone[locale]} hint={copy.phone[locale]}>
            {hasPhone ? (
              <a href={telHref(contact.phone)} className="btn btn--primary btn--sm">
                <span className="ltr-run">{contact.phone}</span>
              </a>
            ) : (
              soon
            )}
          </Channel>
          <Channel index={1} green icon={<SocialIcon platform="whatsapp" size={26} />} title="WhatsApp" hint={copy.whatsapp[locale]}>
            {hasWhatsapp ? (
              <a href={whatsappHref(contact.whatsapp, contact.whatsappMessage[locale])} className="btn btn--primary btn--sm" target="_blank" rel="noopener noreferrer">
                {ui.whatsappUs[locale]}
                <span className="visually-hidden"> ({ui.opensInNewTab[locale]})</span>
              </a>
            ) : (
              soon
            )}
          </Channel>
          <Channel index={2} icon={<Icon name="mail" size={26} strokeWidth={1.6} />} title={locale === "ar" ? "البريد الإلكتروني" : "Email"} hint={copy.email[locale]}>
            {hasEmail ? (
              <a href={mailHref(contact.email)} className="link-underline">
                {contact.email}
              </a>
            ) : (
              soon
            )}
          </Channel>
          <Channel index={3} green icon={<Icon name="sparkles" size={26} strokeWidth={1.6} />} title={ui.followUs[locale]} hint={copy.social[locale]}>
            <ul className={styles.socials} aria-label={ui.socialProfiles[locale]}>
              {socials.map((s) => (
                <li key={s.platform}>
                  {isConfigured(s.url) ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="icon-badge icon-badge--round" aria-label={`${s.label} (${ui.opensInNewTab[locale]})`}>
                      <SocialIcon platform={s.platform} size={17} />
                    </a>
                  ) : (
                    <span className={`icon-badge icon-badge--round ${styles.pendingIcon}`} role="img" aria-label={`${s.label} — ${ui.linkComingSoon[locale]}`} title={`${s.label} — ${ui.linkComingSoon[locale]}`}>
                      <SocialIcon platform={s.platform} size={17} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Channel>
        </ul>

        <div className={styles.locationRow}>
          <div className={`glass glass--teal ${styles.location}`} data-reveal>
            <div className={styles.locationText}>
              <span className="icon-badge icon-badge--round icon-badge--solid">
                <Icon name="mapPin" size={20} />
              </span>
              <div>
                <h3 className="title-card">{copy.location[locale]}</h3>
                <p className={hasAddress ? undefined : "text-muted"}>{hasAddress ? contact.address[locale] : footer.addressComingSoon[locale]}</p>
                {contact.hours && (
                  <p className={styles.hours}>
                    <Icon name="clock" size={16} />
                    {copy.hours[locale]}: {contact.hours[locale]}
                  </p>
                )}
                {isConfigured(contact.mapLink) && (
                  <a href={contact.mapLink} className="link-underline" target="_blank" rel="noopener noreferrer">
                    {copy.directions[locale]}
                    <span className="visually-hidden"> ({ui.opensInNewTab[locale]})</span>
                  </a>
                )}
              </div>
            </div>
            {hasMap ? (
              <iframe src={contact.mapEmbedUrl} title={copy.location[locale]} className={styles.map} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className={`line-grid ${styles.mapPlaceholder}`}>
                <span className={styles.pin} aria-hidden="true">
                  <Icon name="mapPin" size={26} />
                </span>
                <span>{copy.mapSoon[locale]}</span>
              </div>
            )}
          </div>
          <div className={styles.notes}>
            <p className={`glass ${styles.note}`} data-reveal style={{ "--d": 1 } as CSSProperties}>
              <span className="icon-badge icon-badge--round">
                <Icon name="lock" size={17} />
              </span>
              <span>{copy.privacy[locale]}</span>
            </p>
            <p className={`glass glass--mint ${styles.note}`} data-reveal style={{ "--d": 2 } as CSSProperties}>
              <span className={`icon-badge icon-badge--round ${styles.alert}`}>
                <Icon name="info" size={17} />
              </span>
              <span>{copy.emergency[locale]}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PrepareSection({ locale }: { locale: Locale }) {
  const c = copy.prepare;
  return (
    <section id="prepare" className="section" aria-labelledby="prepare-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--cr" /></div>
      <div className="container">
        <SectionHeading id="prepare-title" title={c.title[locale]} subtitle={c.subtitle[locale]} />
        <ol className={styles.steps}>
          {c.steps.map((step, i) => (
            <li key={step.text.en} className={`glass ${i % 2 ? "glass--mint" : "glass--teal"} ${styles.step}`} data-reveal style={{ "--d": i } as CSSProperties}>
              <span className={styles.stepNo} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`icon-badge ${i % 2 ? "icon-badge--green" : ""}`}>
                <Icon name={step.icon} size={22} />
              </span>
              <p>{step.text[locale]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
