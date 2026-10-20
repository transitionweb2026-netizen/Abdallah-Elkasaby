import Link from "next/link";
import { getContent } from "@/lib/content";
import { bookingAction, hasWhatsapp, whatsappHref } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { SmartLink } from "../ui/SmartLink";
import { SocialIcon } from "../ui/SocialIcon";
import styles from "./FinalCta.module.css";

/**
 * The one closing call to action, identical on every page: a vivid
 * teal-to-green glass panel with a large pulsing icon badge. The WhatsApp
 * button appears only once a real number is configured; otherwise the
 * secondary action leads to the services page.
 */
export function FinalCta({ locale }: { locale: Locale }) {
  const { global, home, site } = getContent();
  const c = global.finalCta;
  const { contact, ui } = site;
  const booking = bookingAction(locale);

  return (
    <section className={`section ${styles.section} on-deep`} aria-labelledby="final-cta-title">
      <div className="container">
        <div className={`glass glass--deep ${styles.panel}`} data-reveal="scale">
          <div className={styles.dots} aria-hidden="true" />
          <div className={styles.badgeWrap} data-reveal="scale">
            <span className={styles.badge}>
              <Icon name="handshake" size={88} strokeWidth={1.1} />
            </span>
          </div>

          <div className={styles.copy}>
            <h2 id="final-cta-title" className={`title-section ${styles.title}`}>
              {c.title[locale]}
            </h2>
            <p className={styles.text}>{c.text[locale]}</p>
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
        </div>
      </div>
    </section>
  );
}
