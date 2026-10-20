import Link from "next/link";
import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { Media } from "../ui/Media";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./SpecialtyGrid.module.css";

/** Five image-led cards for the doctor's principal practice areas. */
export function SpecialtyGrid({ locale, title, subtitle }: { locale: Locale; title: string; subtitle: string }) {
  const { practice, site } = getContent();
  const { specialties } = practice;
  const { ui } = site;
  return (
    <section className="section" aria-labelledby="specialties-title">
      <div className="orb-layer" aria-hidden="true">
        <div className="orb orb--green orb--tr" />
      </div>
      <div className="container">
        <SectionHeading id="specialties-title" title={title} subtitle={subtitle} />
        <ul className={styles.grid}>
          {specialties.map((item, i) => (
            <li key={item.slug} className={styles.cell} data-reveal style={{ "--d": i } as CSSProperties}>
              <article className={`glass glass-hover icon-trigger ${i % 2 ? "glass--mint" : ""} ${styles.card}`}>
                <div className={styles.media}>
                  <Media
                    slot={item.image}
                    locale={locale}
                    sizes="(min-width: 1440px) 18vw, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
                    className="zoom-on-hover"
                  />
                  <span className="img-fade" aria-hidden="true" />
                  <span className={`icon-badge icon-badge--round ${i % 2 ? "icon-badge--green" : ""} ${styles.icon}`}>
                    <Icon name={item.icon} size={19} strokeWidth={1.7} />
                  </span>
                </div>
                <div className={styles.body}>
                  <h3 className="title-card">{item.title[locale]}</h3>
                  <p className={styles.text}>{item.summary[locale]}</p>
                  <Link href={pageHref(locale, "services", item.service)} className={`btn btn--outline btn--sm ${styles.cta}`}>
                    {ui.learnMore[locale]}
                    <span className="visually-hidden">: {item.title[locale]}</span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
