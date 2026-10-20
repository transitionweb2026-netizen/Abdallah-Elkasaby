import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Counter } from "../ui/Counter";
import { Icon } from "../ui/Icon";
import styles from "./StatsStrip.module.css";

/**
 * Glass strip under the hero with animated count-up statistics. Entries
 * flagged `sample: true` in content/home.ts are placeholder figures for
 * layout review — tagged visibly and gated by `settings.showSampleContent`,
 * so the site can never go live with an unverified number (see the
 * "TO SUPPLY BEFORE LAUNCH" note in content/home.ts).
 */
export function StatsStrip({ locale }: { locale: Locale }) {
  const { home, site } = getContent();
  const { settings, ui } = site;
  const items = home.stats.filter((s) => !s.sample || settings.showSampleContent);
  if (items.length === 0) return null;

  return (
    <section className={styles.section} aria-label={locale === "ar" ? "إحصاءات العيادة" : "Clinic statistics"}>
      <div className="container">
        <ul className={`glass glass--strong ${styles.strip}`}>
          {items.map((stat, i) => (
            <li key={stat.label.en} className={styles.item} data-reveal style={{ "--d": i } as CSSProperties}>
              <span className={`icon-badge icon-badge--round ${i % 2 ? "icon-badge--green" : ""} ${styles.badge}`}>
                <Icon name={stat.icon} size={24} strokeWidth={1.6} />
              </span>
              <p className={`${styles.value} text-gradient`}>
                <Counter target={stat.value} suffix={stat.suffix} locale={locale} />
              </p>
              <p className={styles.label}>
                <span>{stat.label[locale]}</span>
                {stat.sample && <span className="chip chip--sample">{ui.sample[locale]}</span>}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
