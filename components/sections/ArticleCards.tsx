import Link from "next/link";
import type { CSSProperties } from "react";
import { readingMinutes, type Article } from "@/content/articles";
import { ui } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { articleHref } from "@/lib/routes";
import { Icon } from "../ui/Icon";
import { Media } from "../ui/Media";
import styles from "./ArticleCards.module.css";

export function minutesLabel(article: Article, locale: Locale) {
  const n = readingMinutes(article, locale);
  if (locale === "en") return `${n} ${ui.minRead.en}`;
  // Arabic number agreement: singular, dual, 3–10 plural, 11+ singular.
  if (n === 1) return "دقيقة قراءة";
  if (n === 2) return "دقيقتا قراءة";
  return `${n.toLocaleString("ar-EG")} ${n <= 10 ? "دقائق" : "دقيقة"} قراءة`;
}

/** Reference insight card: inset rounded image, category chip + reading time, title, excerpt, link. */
export function ArticleCard({ article, locale, index = 0, headingLevel = 3 }: { article: Article; locale: Locale; index?: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      className={`glass glass-hover icon-trigger ${index % 2 ? "glass--mint" : ""} ${styles.card}`}
      data-reveal
      style={{ "--d": index % 3 } as CSSProperties}
    >
      <div className={styles.media}>
        <Media slot={article.image} locale={locale} sizes="(min-width: 1100px) 380px, (min-width: 640px) 50vw, 100vw" className="zoom-on-hover" />
      </div>
      <div className={styles.meta}>
        <span className={`chip ${index % 2 ? "chip--green" : ""}`}>{article.category[locale]}</span>
        <span className={styles.time}>
          <Icon name="clock" size={14} />
          {minutesLabel(article, locale)}
        </span>
      </div>
      <Heading className={styles.title}>
        <Link href={articleHref(locale, article.slug)} className={styles.link}>
          {article.title[locale]}
        </Link>
      </Heading>
      <p className={styles.excerpt}>{article.excerpt[locale]}</p>
      <span className={`link-arrow ${styles.more}`} aria-hidden="true">
        {ui.readArticle[locale]}
        <Icon name="arrow" size={16} directional />
      </span>
    </article>
  );
}

export function ArticleGrid({ articles, locale, headingLevel = 3 }: { articles: Article[]; locale: Locale; headingLevel?: 2 | 3 }) {
  return (
    <ul className={styles.grid}>
      {articles.map((article, i) => (
        <li key={article.slug}>
          <ArticleCard article={article} locale={locale} index={i} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

/** Large two-column glass card for the featured article (reference FeaturedArticle). */
export function FeaturedArticle({ article, locale }: { article: Article; locale: Locale }) {
  return (
    <article className={`glass glass--strong glass-hover icon-trigger ${styles.featured}`} data-reveal>
      <div className={styles.featuredMedia}>
        <Media slot={article.image} locale={locale} sizes="(min-width: 1024px) 50vw, 100vw" className="zoom-on-hover" />
        <div className={styles.featuredTint} aria-hidden="true" />
        <span className={`chip ${styles.featuredFlag}`}>
          <Icon name="sparkles" size={14} />
          {locale === "ar" ? "مقال مميّز" : "Featured"}
        </span>
      </div>
      <div className={styles.featuredBody}>
        <div className={styles.meta}>
          <span className="chip">{article.category[locale]}</span>
          <span className={styles.time}>
            <Icon name="clock" size={14} />
            {minutesLabel(article, locale)}
          </span>
        </div>
        <h2 className="title-section">
          <Link href={articleHref(locale, article.slug)} className={styles.link}>
            {article.title[locale]}
          </Link>
        </h2>
        <p className={styles.featuredExcerpt}>{article.excerpt[locale]}</p>
        <span className="btn btn--primary" aria-hidden="true">
          {ui.readArticle[locale]}
          <Icon name="arrow" size={18} directional />
        </span>
      </div>
    </article>
  );
}
