import Link from "next/link";
import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { resultLabels, visibleCases } from "@/lib/results";
import { pageHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import { CompareSlider } from "./CompareSlider";
import styles from "./ResultsShowcase.module.css";

/** Homepage Before & After: consent checklist │ framed comparison │ copy + gallery link. */
export function ResultsShowcase({ locale }: { locale: Locale }) {
  const { home, results, site } = getContent();
  const c = home.results;
  const resultsDisclaimer = results.disclaimer;
  const { ui } = site;
  const [featured] = visibleCases(locale);

  return (
    <section className="section" aria-labelledby="results-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--lg orb--cr" /></div>
      <div className="container">
        <SectionHeading id="results-title" title={c.title[locale]} subtitle={c.lead[locale]} />
        <div className={`glass glass--strong ${styles.panel}`} data-reveal>
          <header className={styles.bar}>
            <span className="icon-badge icon-badge--round icon-badge--green">
              <Icon name="shield" size={18} />
            </span>
            <h3 className={styles.barTitle}>{c.panelTitle[locale]}</h3>
          </header>
          <div className={styles.grid}>
            <ul className={styles.points}>
              {c.points.map((point, i) => (
                <li key={point.en} data-reveal style={{ "--d": i } as CSSProperties}>
                  <Icon name="checkCircle" size={20} className="icon-glow" />
                  {point[locale]}
                </li>
              ))}
            </ul>

            <figure className={styles.visual} data-reveal="scale">
              {featured ? (
                <>
                  <CompareSlider before={featured.before} after={featured.after} labels={resultLabels(locale)} aspect={4 / 3.3} />
                  <figcaption className={styles.caption}>
                    {featured.placeholder && <span className="chip chip--sample">{ui.sample[locale]}</span>}
                    <span>{featured.caption}</span>
                  </figcaption>
                </>
              ) : (
                <p className="text-muted">{resultsDisclaimer[locale]}</p>
              )}
            </figure>

            <div className={styles.aside}>
              <h3 className="title-card" data-reveal>
                {c.asideTitle[locale]}
              </h3>
              <p className="text-muted" data-reveal style={{ "--d": 1 } as CSSProperties}>
                {c.asideText[locale]}
              </p>
              <Link href={pageHref(locale, "results")} className="btn btn--primary" data-reveal style={{ "--d": 2 } as CSSProperties}>
                {c.cta[locale]}
                <Icon name="arrow" size={18} directional />
              </Link>
            </div>
          </div>
          <p className={styles.disclaimer}>
            <Icon name="info" size={16} />
            {resultsDisclaimer[locale]}
          </p>
        </div>
      </div>
    </section>
  );
}
