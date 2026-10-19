import Link from "next/link";
import type { CSSProperties } from "react";
import { home } from "@/content/home";
import { expectations } from "@/content/practice";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { Media } from "../ui/Media";
import styles from "./WhyChoose.module.css";

/** Header bar over three columns: checklist │ framed image │ summary + CTA. */
export function WhyChoose({ locale }: { locale: Locale }) {
  const c = home.expectations;
  return (
    <section className="section" aria-labelledby="why-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--cl" /></div>
      <div className="container">
        <div className={`glass glass--strong ${styles.panel}`} data-reveal>
          <header className={styles.bar}>
            <h2 id="why-title" className={styles.barTitle}>
              {c.title[locale]}
            </h2>
            <span className={`chip chip--green ${styles.barChip}`}>{c.eyebrow[locale]}</span>
          </header>

          <div className={styles.grid}>
            <ul className={styles.list}>
              {expectations.map((item, i) => (
                <li key={item.title.en} data-reveal style={{ "--d": i } as CSSProperties}>
                  <span className={`icon-badge icon-badge--round ${i % 2 ? "icon-badge--green" : ""}`}>
                    <Icon name={item.icon} size={18} />
                  </span>
                  <div>
                    <h3 className={styles.itemTitle}>{item.title[locale]}</h3>
                    <p className={styles.itemText}>{item.text[locale]}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className={styles.visual} data-reveal="scale">
              <Media slot="operatingRoomBright" locale={locale} sizes="(min-width: 1100px) 420px, 100vw" />
              <div className={styles.visualTint} aria-hidden="true" />
              <span className={`glass ${styles.visualBadge}`}>
                <span className="icon-badge icon-badge--round icon-badge--solid">
                  <Icon name="shieldPlus" size={18} />
                </span>
                {locale === "ar" ? "السلامة أولًا" : "Safety first"}
              </span>
            </div>

            <div className={styles.aside}>
              <h3 className="title-card" data-reveal>
                {locale === "ar" ? "قرار مدروس ومشترك" : "A considered, shared decision"}
              </h3>
              <p className="text-muted" data-reveal style={{ "--d": 1 } as CSSProperties}>
                {c.lead[locale]}
              </p>
              <Link href={pageHref(locale, "about")} className="btn btn--primary" data-reveal style={{ "--d": 2 } as CSSProperties}>
                {locale === "ar" ? "تعرّف على نهج الطبيب" : "Meet the doctor"}
                <Icon name="arrow" size={18} directional />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
