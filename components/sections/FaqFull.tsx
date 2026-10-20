import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Accordion } from "../ui/Accordion";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./FaqFull.module.css";

/** Every FAQ group: a sticky glass topic index beside animated accordions. */
export function FaqFull({ locale }: { locale: Locale }) {
  const { faq: faqGroups, site } = getContent();
  const { ui } = site;
  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--cl" /></div>
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--br" /></div>
      <div className="container">
        <SectionHeading
          id="faq-title"
          title={locale === "ar" ? "إجابات عن أكثر الأسئلة شيوعًا" : "Answers to common questions"}
          subtitle={ui.medicalDisclaimer[locale]}
        />
        <div className={styles.layout}>
          <nav className={`glass glass--teal ${styles.index}`} aria-label={locale === "ar" ? "موضوعات الأسئلة" : "Question topics"} data-reveal="left">
            <ul>
              {faqGroups.map((group, i) => (
                <li key={group.id}>
                  <a href={`#faq-${group.id}`} className="icon-trigger">
                    <span className={`icon-badge icon-badge--round ${i % 2 ? "icon-badge--green" : ""}`}>
                      <Icon name={group.icon} size={17} />
                    </span>
                    <span className={styles.indexLabel}>{group.title[locale]}</span>
                    <span className={styles.count}>{group.items.length.toLocaleString(locale === "ar" ? "ar-EG" : "en")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.groups}>
            {faqGroups.map((group, i) => (
              <div key={group.id} id={`faq-${group.id}`} className={styles.group} data-reveal style={{ "--d": i } as CSSProperties}>
                <h3 className={styles.groupTitle}>
                  <span className={`hex ${styles.hex}`}>
                    <Icon name={group.icon} size={20} />
                  </span>
                  {group.title[locale]}
                </h3>
                <Accordion items={group.items.map((item) => ({ question: item.q[locale], answer: item.a[locale] }))} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
