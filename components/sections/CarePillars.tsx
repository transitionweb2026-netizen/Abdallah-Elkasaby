import type { CSSProperties } from "react";
import { home } from "@/content/home";
import type { Locale } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import styles from "./CarePillars.module.css";

/** Glass strip under the hero — the reference's stats strip, without invented numbers. */
export function CarePillars({ locale }: { locale: Locale }) {
  return (
    <section className={styles.section} aria-label={locale === "ar" ? "ركائز الرعاية" : "Pillars of care"}>
      <div className="container">
        <ul className={`glass glass--strong ${styles.strip}`}>
          {home.pillars.map((pillar, i) => (
            <li key={pillar.title.en} className={styles.item} data-reveal style={{ "--d": i } as CSSProperties}>
              <span className={`icon-badge ${i % 2 ? "icon-badge--green" : ""} ${styles.badge}`}>
                <Icon name={pillar.icon} size={26} strokeWidth={1.6} />
              </span>
              <p className={styles.title}>{pillar.title[locale]}</p>
              <p className={styles.text}>{pillar.text[locale]}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
