import type { CSSProperties } from "react";
import { Icon, type IconName } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./FeatureGrid.module.css";

export type Feature = { icon: IconName; title: string; text: string; tag?: string };

type FeatureGridProps = {
  id: string;
  title: string;
  subtitle?: string;
  features: Feature[];
  /** icon-top: centred cards; icon-side: compact horizontal cards. */
  layout?: "icon-top" | "icon-side";
  columns?: 3 | 4;
  orb?: "teal" | "green";
};

/** Reference FeatureGrid: centred last row, alternating teal / mint glass. */
export function FeatureGrid({ id, title, subtitle, features, layout = "icon-top", columns = 3, orb = "teal" }: FeatureGridProps) {
  return (
    <section className="section" aria-labelledby={id}>
      <div className="orb-layer" aria-hidden="true"><div className={`orb orb--${orb} ${orb === "teal" ? "orb--cl" : "orb--cr"}`} /></div>
      <div className="container">
        <SectionHeading id={id} title={title} subtitle={subtitle} />
        <ul className={`${styles.grid} ${columns === 4 ? styles.four : styles.three}`}>
          {features.map((f, i) => (
            <li key={f.title} className={styles.cell} data-reveal style={{ "--d": i % 4 } as CSSProperties}>
              <div className={`glass glass-hover icon-trigger ${i % 2 ? "glass--mint" : ""} ${layout === "icon-top" ? styles.top : styles.side}`}>
                <span className={`icon-badge ${i % 2 ? "icon-badge--green" : ""} ${styles.badge}`}>
                  <Icon name={f.icon} size={layout === "icon-top" ? 28 : 22} strokeWidth={1.6} />
                </span>
                <div className={styles.body}>
                  <h3 className={styles.title}>{f.title}</h3>
                  <p className={styles.text}>{f.text}</p>
                  {f.tag && <span className="chip chip--sample">{f.tag}</span>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
