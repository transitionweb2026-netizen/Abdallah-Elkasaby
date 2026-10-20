import Link from "next/link";
import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import { hasAddress, hasEmail, hasPhone, hasWhatsapp, isConfigured, mailHref, telHref, whatsappHref } from "@/lib/contact";
import type { Locale } from "@/lib/i18n";
import { pageHref, pageKeys } from "@/lib/routes";
import { Monogram } from "../brand/Logo";
import { Icon } from "../ui/Icon";
import { SocialIcon } from "../ui/SocialIcon";
import styles from "./SiteFooter.module.css";

const footerServices = ["bariatric-surgery", "sleeve-gastrectomy", "laparoscopic-surgery", "gallbladder-surgery", "hernia-repair"];

export function SiteFooter({ locale }: { locale: Locale }) {
  const { practice, site } = getContent();
  const { services } = practice;
  const { contact, doctor, footer, navLabels, socials, ui } = site;
  const year = new Date().getFullYear();
  const reveal = (d: number) => ({ "--d": d }) as CSSProperties;

  return (
    <footer className={styles.footer}>
      <div className={`orb orb--teal ${styles.orbA}`} aria-hidden="true" />
      <div className={`orb orb--green ${styles.orbB}`} aria-hidden="true" />

      <div className="container">
        {/* Branding row */}
        <div className={styles.brandRow} data-reveal>
          <Link href={pageHref(locale, "home")} className={styles.brand} aria-label={ui.homeLink[locale]}>
            <Monogram size={56} />
            <span className={styles.brandName}>{doctor.name[locale]}</span>
          </Link>
          <span className={styles.rule} aria-hidden="true" />
        </div>

        <div className={styles.grid}>
          <div className={styles.about} data-reveal>
            <p className={styles.role}>{doctor.specialty[locale]}</p>
            <p className="text-muted">{footer.intro[locale]}</p>
            <ul className={styles.socials} aria-label={ui.socialProfiles[locale]}>
              {socials.map((s) =>
                isConfigured(s.url) ? (
                  <li key={s.platform}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-badge icon-badge--round"
                      aria-label={`${s.label} (${ui.opensInNewTab[locale]})`}
                    >
                      <SocialIcon platform={s.platform} size={18} />
                    </a>
                  </li>
                ) : (
                  <li key={s.platform}>
                    <span
                      className={`icon-badge icon-badge--round ${styles.pending}`}
                      role="img"
                      aria-label={`${s.label} — ${ui.linkComingSoon[locale]}`}
                      title={`${s.label} — ${ui.linkComingSoon[locale]}`}
                    >
                      <SocialIcon platform={s.platform} size={18} />
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          <nav aria-labelledby="footer-pages" data-reveal style={reveal(1)}>
            <h2 id="footer-pages" className={`micro ${styles.title}`}>
              {footer.pagesTitle[locale]}
            </h2>
            <ul className={styles.links}>
              {pageKeys.map((key) => (
                <li key={key}>
                  <Link href={pageHref(locale, key)}>{navLabels[key][locale]}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-services" data-reveal style={reveal(2)}>
            <h2 id="footer-services" className={`micro ${styles.title}`}>
              {footer.servicesTitle[locale]}
            </h2>
            <ul className={styles.links}>
              {services
                .filter((s) => footerServices.includes(s.slug))
                .map((s) => (
                  <li key={s.slug}>
                    <Link href={pageHref(locale, "services", s.slug)}>{s.title[locale]}</Link>
                  </li>
                ))}
            </ul>
          </nav>

          <div data-reveal style={reveal(3)}>
            <h2 className={`micro ${styles.title}`}>{footer.contactTitle[locale]}</h2>
            <ul className={styles.contact}>
              <li>
                <span className="icon-badge icon-badge--round">
                  <Icon name="phone" size={16} />
                </span>
                {hasPhone ? (
                  <a href={telHref(contact.phone)} className="ltr-run">
                    {contact.phone}
                  </a>
                ) : (
                  <span className={styles.muted}>{ui.phoneComingSoon[locale]}</span>
                )}
              </li>
              {hasWhatsapp && (
                <li>
                  <span className="icon-badge icon-badge--round icon-badge--green">
                    <SocialIcon platform="whatsapp" size={16} />
                  </span>
                  <a href={whatsappHref(contact.whatsapp, contact.whatsappMessage[locale])} target="_blank" rel="noopener noreferrer">
                    {ui.whatsappUs[locale]}
                    <span className="visually-hidden"> ({ui.opensInNewTab[locale]})</span>
                  </a>
                </li>
              )}
              {hasEmail && (
                <li>
                  <span className="icon-badge icon-badge--round">
                    <Icon name="mail" size={16} />
                  </span>
                  <a href={mailHref(contact.email)}>{contact.email}</a>
                </li>
              )}
              <li>
                <span className="icon-badge icon-badge--round icon-badge--green">
                  <Icon name="mapPin" size={16} />
                </span>
                {hasAddress ? <span>{contact.address[locale]}</span> : <span className={styles.muted}>{footer.addressComingSoon[locale]}</span>}
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {year} {doctor.name[locale]}. {footer.rights[locale]}
          </p>
          <p className={styles.disclaimer}>{ui.medicalDisclaimer[locale]}</p>
        </div>
      </div>
    </footer>
  );
}
