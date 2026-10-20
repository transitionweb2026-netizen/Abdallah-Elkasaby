import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero/Hero";
import { ArticleGrid, minutesLabel } from "@/components/sections/ArticleCards";
import { FinalCta } from "@/components/sections/FinalCta";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartLink } from "@/components/ui/SmartLink";
import { getContent } from "@/lib/content";
import { bookingAction } from "@/lib/contact";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { articleHref, articlePath, pageHref } from "@/lib/routes";
import { hasProductionUrl, siteUrl } from "@/lib/site-url";
import styles from "./page.module.css";

// Every article × language is generated at build time; nothing else exists.
// Reads the CMS-merged list, so a published article gets a real route too.
export const dynamicParams = false;

export function generateStaticParams() {
  return getContent().articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/articles/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getContent().articles.find((a) => a.slug === slug);
  if (!isLocale(locale) || !article) return {};
  return pageMetadata({ locale, path: articlePath(slug), title: article.title[locale], description: article.excerpt[locale], type: "article" });
}

const headingId = (index: number) => `section-${index + 1}`;

export default async function ArticlePage({ params }: PageProps<"/[locale]/articles/[slug]">) {
  const { locale, slug } = await params;
  const { articles, site } = getContent();
  const { doctor, navLabels, ui } = site;
  const article = articles.find((a) => a.slug === slug);
  if (!isLocale(locale) || !article) notFound();

  const ar = locale === "ar";
  const booking = bookingAction(locale);
  const headings = article.body.flatMap((block, i) => (block.type === "h2" ? [{ id: headingId(i), text: block.text[locale] }] : []));
  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: article.title[locale],
    description: article.excerpt[locale],
    inLanguage: locale,
    about: article.category[locale],
    publisher: { "@type": "Person", name: doctor.name[locale] },
    ...(hasProductionUrl ? { url: `${siteUrl}${articleHref(locale, slug)}` } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero
        locale={locale}
        eyebrow={`${article.category[locale]} · ${minutesLabel(article, locale)}`}
        title={[article.title[locale]]}
        lead={article.excerpt[locale]}
        primary={{ href: booking.href, external: booking.external, label: ui.bookConsultation[locale] }}
        secondary={{ href: pageHref(locale, "articles"), label: ar ? "كل المقالات" : "All articles", icon: "book" }}
        image={article.image}
        breadcrumb={[{ label: navLabels.articles[locale], href: pageHref(locale, "articles") }, { label: article.title[locale] }]}
      />

      <section className="section">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--cl" /></div>
        <div className={`container ${styles.layout}`}>
          <article className={`glass glass--strong ${styles.article}`} aria-labelledby="page-title" data-reveal>
            <div className={styles.prose}>
              {article.body.map((block, i) => {
                switch (block.type) {
                  case "h2":
                    return (
                      <h2 key={i} id={headingId(i)}>
                        {block.text[locale]}
                      </h2>
                    );
                  case "list":
                    return (
                      <ul key={i}>
                        {block.items.map((item) => (
                          <li key={item.en}>{item[locale]}</li>
                        ))}
                      </ul>
                    );
                  case "note":
                    return (
                      <p key={i} className={styles.note}>
                        <span className="icon-badge icon-badge--round">
                          <Icon name="info" size={17} />
                        </span>
                        <span>{block.text[locale]}</span>
                      </p>
                    );
                  default:
                    return (
                      <p key={i} className={i === 0 ? styles.intro : undefined}>
                        {block.text[locale]}
                      </p>
                    );
                }
              })}
            </div>
            <p className={styles.disclaimer}>{ui.medicalDisclaimer[locale]}</p>
          </article>

          <aside className={styles.aside}>
            <nav className={`glass glass--teal ${styles.toc}`} aria-labelledby="toc-title" data-reveal="left">
              <h2 id="toc-title" className={`micro ${styles.asideTitle}`}>
                {ar ? "في هذا المقال" : "In this article"}
              </h2>
              <ol>
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className={`glass glass--deep on-deep ${styles.ask}`} data-reveal="left" style={{ "--d": 1 } as CSSProperties}>
              <h2 className={styles.askTitle}>{ar ? "هل لديك سؤال عن حالتك؟" : "A question about your situation?"}</h2>
              <p>{ar ? "المقالات معلومات عامة. للحصول على إجابة تخص حالتك، احجز استشارة." : "Articles are general information. For an answer about your own situation, book a consultation."}</p>
              <SmartLink href={booking.href} locale={locale} external={booking.external} className="btn btn--white btn--sm">
                {ui.bookConsultation[locale]}
              </SmartLink>
            </div>
            <Link href={pageHref(locale, "articles")} className="link-arrow">
              <Icon name="arrow" size={16} className={styles.back} />
              {ar ? "العودة إلى المقالات" : "Back to articles"}
            </Link>
          </aside>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--cr" /></div>
        <div className="container">
          <SectionHeading id="related-title" title={ar ? "مقالات ذات صلة" : "Related articles"} />
          <ArticleGrid articles={related} locale={locale} />
        </div>
      </section>

      <FinalCta locale={locale} />
    </>
  );
}
