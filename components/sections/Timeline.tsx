import type { CSSProperties } from "react";
import { ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./Timeline.module.css";

type Entry = { period: string; title: string; detail: string; sample?: boolean };

/** Reference timeline: one centred glass card, vertical brand line, fading entries. */
export function Timeline({ locale, id, title, subtitle, entries }: { locale: Locale; id: string; title: string; subtitle?: string; entries: Entry[] }) {
  return (
    <section className="section" aria-labelledby={id}>
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--cr" /></div>
      <div className="container">
        <SectionHeading id={id} title={title} subtitle={subtitle} />
        <div className={`glass glass--teal ${styles.card}`} data-reveal>
          <ol className={styles.list}>
            {entries.map((entry, i) => (
              <li key={entry.title} className={styles.item} data-reveal style={{ "--d": i } as CSSProperties}>
                <span className={styles.dot} aria-hidden="true" />
                <p className={styles.period}>{entry.period}</p>
                <h3 className={styles.title}>{entry.title}</h3>
                <p className={styles.detail}>{entry.detail}</p>
                {entry.sample && <span className="chip chip--sample">{ui.sample[locale]}</span>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
