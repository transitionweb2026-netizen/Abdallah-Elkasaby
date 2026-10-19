import Link from "next/link";
import type { CSSProperties } from "react";
import { specialties } from "@/content/practice";
import { ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./SpecialtyHexGrid.module.css";

/** Five centred glass cards with hexagonal icon badges that fill with the brand gradient on hover. */
export function SpecialtyHexGrid({ locale, title, subtitle }: { locale: Locale; title: string; subtitle: string }) {
  return (
    <section className="section" aria-labelledby="specialties-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--tr" /></div>
      <div className="container">
        <SectionHeading id="specialties-title" title={title} subtitle={subtitle} />
        <ul className={styles.grid}>
          {specialties.map((item, i) => (
            <li key={item.slug} className={styles.cell} data-reveal style={{ "--d": i } as CSSProperties}>
              <article className={`glass glass-hover icon-trigger ${i % 2 ? "glass--mint" : ""} ${styles.card}`}>
                <span className="hex">
                  <Icon name={item.icon} size={34} strokeWidth={1.5} />
                </span>
                <h3 className="title-card">{item.title[locale]}</h3>
                <p className={styles.text}>{item.summary[locale]}</p>
                <Link href={pageHref(locale, "services", item.service)} className={`btn btn--outline btn--sm ${styles.cta}`}>
                  {ui.learnMore[locale]}
                  <span className="visually-hidden">: {item.title[locale]}</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
