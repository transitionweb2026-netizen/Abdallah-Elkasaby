import Link from "next/link";
import { home } from "@/content/home";
import { contact, footer, ui } from "@/content/site";
import { bookingAction, hasAddress, hasPhone, hasWhatsapp, telHref, whatsappHref } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon, type IconName } from "../ui/Icon";
import { SmartLink } from "../ui/SmartLink";
import { SocialIcon } from "../ui/SocialIcon";
import styles from "./FinalCta.module.css";

type FinalCtaProps = {
  locale: Locale;
  title?: string;
  text?: string;
  icon?: IconName;
  /** "contact" adds a third column with the clinic's contact details. */
  variant?: "default" | "contact";
};

/**
 * Closing call to action: a vivid teal-to-green glass panel with a large
 * pulsing icon badge. WhatsApp / phone actions appear only when configured.
 */
export function FinalCta({ locale, title, text, icon = "handshake", variant = "default" }: FinalCtaProps) {
  const c = home.finalCta;
  const booking = bookingAction(locale);

  return (
    <section className={`section ${styles.section} on-deep`} aria-labelledby="final-cta-title">
      <div className="container">
        <div className={`glass glass--deep ${styles.panel} ${variant === "contact" ? styles.three : ""}`} data-reveal="scale">
          <div className={styles.dots} aria-hidden="true" />
          <div className={styles.badgeWrap} data-reveal="scale">
            <span className={styles.badge}>
              <Icon name={icon} size={88} strokeWidth={1.1} />
            </span>
          </div>

          <div className={styles.copy}>
            <h2 id="final-cta-title" className={`title-section ${styles.title}`}>
              {title ?? c.title[locale]}
            </h2>
            <p className={styles.text}>{text ?? c.text[locale]}</p>
            <div className={styles.actions}>
              <SmartLink href={booking.href} locale={locale} external={booking.external} className="btn btn--white btn--lg">
                <Icon name="calendarDays" size={19} />
                {ui.bookConsultation[locale]}
              </SmartLink>
              {hasWhatsapp ? (
                <a
                  href={whatsappHref(contact.whatsapp, contact.whatsappMessage[locale])}
                  className="btn btn--glass-light btn--lg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SocialIcon platform="whatsapp" size={19} />
                  {ui.whatsappUs[locale]}
                  <span className="visually-hidden"> ({ui.opensInNewTab[locale]})</span>
                </a>
              ) : (
                <Link href={pageHref(locale, "services")} className="btn btn--glass-light btn--lg">
                  {home.services.cta[locale]}
                </Link>
              )}
            </div>
          </div>

          {variant === "contact" && (
            <ul className={styles.info}>
              <li>
                <Icon name="phone" size={22} />
                <div>
                  {hasPhone ? (
                    <a href={telHref(contact.phone)} className="ltr-run">
                      {contact.phone}
                    </a>
                  ) : (
                    <strong>{ui.phoneComingSoon[locale]}</strong>
                  )}
                  <span>{ui.callClinic[locale]}</span>
                </div>
              </li>
              <li>
                <Icon name="mapPin" size={22} />
                <div>
                  <strong>{hasAddress ? contact.address[locale] : footer.addressComingSoon[locale]}</strong>
                  <span>{locale === "ar" ? "موقع العيادة" : "Clinic location"}</span>
                </div>
              </li>
              <li>
                <Icon name="messages" size={22} />
                <div>
                  <Link href={pageHref(locale, "contact")}>{ui.contactPage[locale]}</Link>
                  <span>{locale === "ar" ? "كل طرق التواصل" : "Every way to reach us"}</span>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
