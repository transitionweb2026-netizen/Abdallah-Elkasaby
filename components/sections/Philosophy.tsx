import Link from "next/link";
import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { PortraitPlate } from "./PortraitPlate";
import styles from "./Philosophy.module.css";

/** Editorial statement on a mint-tinted panel, beside the portrait inside slow orbit rings. */
export function Philosophy({ locale, showLink = true }: { locale: Locale; showLink?: boolean }) {
  const { approach } = getContent().practice;
  return (
    <section className="section" aria-labelledby="philosophy-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--br" /></div>
      <div className="container">
        <div className={`glass glass--mint ${styles.panel}`}>
          <div className={styles.copy}>
            <span className="eyebrow-pill" data-reveal>
              {approach.eyebrow[locale]}
            </span>
            <h2 id="philosophy-title" className="title-section" data-reveal style={{ "--d": 1 } as CSSProperties}>
              {approach.title[locale]}
            </h2>
            <div className={styles.statement} data-reveal style={{ "--d": 2 } as CSSProperties}>
              <span className={`icon-badge icon-badge--solid ${styles.quote}`} aria-hidden="true">
                <Icon name="quote" size={22} />
              </span>
              <p className={styles.lead}>{approach.paragraphs[0][locale]}</p>
            </div>
            <p className="text-muted" data-reveal style={{ "--d": 3 } as CSSProperties}>
              {approach.paragraphs[1][locale]}
            </p>
            <ul className={styles.principles}>
              {approach.principles.map((p, i) => (
                <li key={p.title.en} className={`glass ${styles.principle}`} data-reveal style={{ "--d": 3 + i } as CSSProperties}>
                  <span className={`icon-badge icon-badge--round ${i === 1 ? "icon-badge--green" : ""}`}>
                    <Icon name={p.icon} size={18} />
                  </span>
                  {p.title[locale]}
                </li>
              ))}
            </ul>
            {showLink && (
              <Link href={pageHref(locale, "about")} className="link-arrow" data-reveal style={{ "--d": 6 } as CSSProperties}>
                {locale === "ar" ? "تعرّف أكثر على الطبيب" : "More about the doctor"}
                <Icon name="arrow" size={18} directional />
              </Link>
            )}
          </div>

          <div className={styles.visual} data-reveal="scale">
            <span className={`${styles.ring} ${styles.ringA}`} aria-hidden="true" />
            <span className={`${styles.ring} ${styles.ringB}`} aria-hidden="true" />
            <PortraitPlate locale={locale} className={styles.portrait} />
          </div>
        </div>
      </div>
    </section>
  );
}
