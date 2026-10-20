import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { ImageRef } from "@/content/media";
import type { IconName } from "../ui/Icon";
import type { Locale } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { Media } from "../ui/Media";
import { PortraitPlate } from "./PortraitPlate";
import styles from "./AboutPreview.module.css";

type AboutPreviewProps = {
  locale: Locale;
  title: string;
  paragraphs: string[];
  image: ImageRef;
  caption: string;
  points?: { icon: IconName; text: string }[];
  link?: { href: string; label: string };
  /** Extra content under the copy (e.g. buttons). */
  children?: ReactNode;
};

/**
 * Wide image card on one side (glow behind, caption chip, portrait plate
 * overlapping its corner) and the introduction on the other — the
 * reference's video-left / bio-right composition.
 */
export function AboutPreview({ locale, title, paragraphs, image, caption, points, link, children }: AboutPreviewProps) {
  return (
    <section className="section" aria-labelledby="about-preview-title">
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--cl" /></div>
      <div className={`container ${styles.grid}`}>
        <div className={`icon-trigger ${styles.visual}`} data-reveal="left">
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.frame}>
            <Media slot={image} locale={locale} sizes="(min-width: 1024px) 62vw, 100vw" className="zoom-on-hover" />
            <div className={styles.frameTint} aria-hidden="true" />
            <span className={`glass ${styles.caption}`}>
              <span className="icon-badge icon-badge--round">
                <Icon name="eye" size={16} />
              </span>
              {caption}
            </span>
          </div>
          <PortraitPlate locale={locale} className={styles.portrait} />
        </div>

        <div className={styles.copy}>
          <h2 id="about-preview-title" className="title-section" data-reveal>
            {title}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? styles.lead : "text-muted"} data-reveal style={{ "--d": i + 1 } as CSSProperties}>
              {p}
            </p>
          ))}
          {points && (
            <ul className={styles.points}>
              {points.map((point, i) => (
                <li key={point.text} data-reveal style={{ "--d": i + 2 } as CSSProperties}>
                  <Icon name={point.icon} size={20} className="icon-glow" />
                  {point.text}
                </li>
              ))}
            </ul>
          )}
          {link && (
            <Link href={link.href} className="link-arrow" data-reveal style={{ "--d": 4 } as CSSProperties}>
              {link.label}
              <Icon name="arrow" size={18} directional />
            </Link>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}
