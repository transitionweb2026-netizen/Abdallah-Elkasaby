import { CalendarDays } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { MediaKey } from "@/content/media";
import { pages, type HeroCta } from "@/content/pages";
import { contact, navLabels, socials, ui } from "@/content/site";
import { bookingAction, hasPhone, isConfigured, telHref } from "@/lib/contact";
import type { L10n, Locale } from "@/lib/i18n";
import { pageHref, type PageKey } from "@/lib/routes";
import { Icon, type IconName } from "../ui/Icon";
import { Media } from "../ui/Media";
import { SmartLink } from "../ui/SmartLink";
import { HeroContactCard } from "./HeroContactCard";
import styles from "./Hero.module.css";

type Action = { href: string; label: string; external?: boolean };

export type HeroProps = {
  locale: Locale;
  variant?: "home" | "page";
  eyebrow: string;
  /** One or two lines; the second is set in the brand gradient. */
  title: [string, string?];
  lead: string;
  primary: Action;
  secondary?: Action & { icon?: IconName };
  image: MediaKey;
  /** Glass highlight card floating over the photograph. */
  highlight?: { icon: IconName; title: string; text: string };
  /** Small icon stack + caption under the CTAs (home). */
  trust?: { icons: IconName[]; title: string; caption: string };
  breadcrumb?: { label: string; href?: string }[];
};

const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;

/**
 * The one hero used on every page. Full-bleed photograph, directional mist
 * overlays and brand tint, copy set directly on the image, the floating
 * "Connect with us" card, and — on the homepage — ambient decoration.
 * Content changes per page; the structure never does.
 */
export function Hero({ locale, variant = "page", eyebrow, title, lead, primary, secondary, image, highlight, trust, breadcrumb }: HeroProps) {
  const home = variant === "home";

  return (
    <section className={`${styles.hero} ${home ? styles.home : styles.page}`} aria-labelledby="page-title">
      {/* Photo + overlays, alpha-masked at the bottom so the hero dissolves into the page's brand mesh */}
      <div className={styles.backdrop}>
        <div className={styles.media}>
          <Media slot={image} locale={locale} sizes="100vw" priority />
        </div>
        <div className={styles.tint} aria-hidden="true" />
        <div className={styles.overlaySide} aria-hidden="true" />
        <div className={styles.overlayTop} aria-hidden="true" />
      </div>
      <div className="dot-grid" aria-hidden="true" />
      <div className={`orb orb--teal orb--lg ${styles.orbA}`} aria-hidden="true" />
      <div className={`orb orb--green ${styles.orbB}`} aria-hidden="true" />

      {home && (
        <div className={styles.decor} aria-hidden="true">
          <span className={`${styles.ring} ${styles.ringA}`} />
          <span className={`${styles.ring} ${styles.ringB}`} />
          <span className={`icon-badge icon-badge--round ${styles.float} ${styles.floatA}`}>
            <Icon name="heart" size={24} />
          </span>
          <span className={`icon-badge icon-badge--round icon-badge--green ${styles.float} ${styles.floatB}`}>
            <Icon name="activity" size={24} />
          </span>
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} className={styles.particle} style={{ "--i": i } as CSSProperties} />
          ))}
        </div>
      )}

      <div className={`container ${styles.inner}`}>
        <div className={styles.content}>
          {breadcrumb && (
            <nav aria-label={ui.breadcrumb[locale]} className={styles.crumbs} style={delay(0)}>
              <ol>
                <li>
                  <Link href={pageHref(locale, "home")}>{navLabels.home[locale]}</Link>
                </li>
                {breadcrumb.map((crumb) => (
                  <li key={crumb.label}>
                    <Icon name="chevronRight" size={14} directional />
                    {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span aria-current="page">{crumb.label}</span>}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <span className={`eyebrow-pill ${styles.enter}`} style={delay(0.05)}>
            {eyebrow}
          </span>
          <h1 id="page-title" className={`${styles.title} ${styles.enter}`} style={delay(0.1)}>
            <span className={styles.titleLine}>{title[0]}</span>
            {title[1] && (
              <>
                {" "}
                <span className={`${styles.titleLine} text-gradient`}>{title[1]}</span>
              </>
            )}
          </h1>
          <p className={`${styles.lead} ${styles.enter}`} style={delay(0.2)}>
            {lead}
          </p>
          <div className={`${styles.actions} ${styles.enter}`} style={delay(0.3)}>
            <SmartLink href={primary.href} locale={locale} external={primary.external} className="btn btn--primary btn--lg">
              <CalendarDays size={19} aria-hidden="true" />
              {primary.label}
            </SmartLink>
            {secondary && (
              <SmartLink href={secondary.href} locale={locale} external={secondary.external} className="btn btn--ghost btn--lg icon-trigger">
                <Icon name={secondary.icon ?? "playCircle"} size={19} className="icon-glow" />
                {secondary.label}
              </SmartLink>
            )}
          </div>
          {trust && (
            <div className={`${styles.trust} ${styles.enter}`} style={delay(0.4)}>
              <div className={styles.trustIcons} aria-hidden="true">
                {trust.icons.map((icon, i) => (
                  <span key={icon} className={`icon-badge icon-badge--round ${i % 2 ? "icon-badge--green" : ""}`}>
                    <Icon name={icon} size={19} />
                  </span>
                ))}
              </div>
              <div>
                <p className={styles.trustTitle}>{trust.title}</p>
                <p className={styles.trustCaption}>{trust.caption}</p>
              </div>
            </div>
          )}
        </div>

        {highlight && (
          <div className={`glass glass--strong ${styles.highlight}`}>
            <span className="icon-badge icon-badge--round">
              <Icon name={highlight.icon} size={22} />
            </span>
            <p className={styles.highlightTitle}>{highlight.title}</p>
            <p className={styles.highlightText}>{highlight.text}</p>
          </div>
        )}
      </div>

      <div className={`container ${styles.contactSlot}`}>
        <div className={styles.contactAnchor}>
          <HeroContactCard
            socials={socials.map((s) => ({ platform: s.platform, label: s.label, url: isConfigured(s.url) ? s.url : null }))}
            phone={hasPhone ? { href: telHref(contact.phone), display: contact.phone } : null}
            text={{
              heading: locale === "ar" ? "تواصل معنا" : "Connect with us",
              socialProfiles: ui.socialProfiles[locale],
              callClinic: ui.callClinic[locale],
              phoneComingSoon: ui.phoneComingSoon[locale],
              comingSoon: ui.comingSoon[locale],
              linkComingSoon: ui.linkComingSoon[locale],
              opensInNewTab: ui.opensInNewTab[locale],
            }}
          />
        </div>
      </div>
    </section>
  );
}

function resolveCta(cta: HeroCta, locale: Locale): Action {
  if (cta.target === "booking") {
    const action = bookingAction(locale);
    return { href: action.href, external: action.external, label: cta.label[locale] };
  }
  return { href: pageHref(locale, cta.target, cta.hash), label: cta.label[locale] };
}

/** Builds hero props for a top-level page from `content/pages.ts`. */
export function heroProps(page: PageKey, locale: Locale): HeroProps {
  const { hero } = pages[page];
  const t = (v: L10n) => v[locale];
  const home = page === "home";
  return {
    locale,
    variant: home ? "home" : "page",
    eyebrow: t(hero.eyebrow),
    title: [t(hero.title[0]), t(hero.title[1])],
    lead: t(hero.lead),
    primary: resolveCta(hero.primary, locale),
    secondary: hero.secondary ? { ...resolveCta(hero.secondary, locale), icon: hero.secondaryIcon } : undefined,
    image: hero.image,
    highlight: home
      ? {
          icon: "scale",
          title: locale === "ar" ? "جراحات السمنة والتمثيل الغذائي" : "Bariatric & metabolic surgery",
          text: locale === "ar" ? "تقييم · جراحة · متابعة طويلة المدى" : "Assessment · Surgery · Long-term follow-up",
        }
      : undefined,
    trust: home
      ? {
          icons: hero.badge.items.map((i) => i.icon),
          title: t(hero.badge.label),
          caption: hero.badge.items.map((i) => t(i.text)).join(" · "),
        }
      : undefined,
    breadcrumb: home ? undefined : [{ label: navLabels[page][locale] }],
  };
}
