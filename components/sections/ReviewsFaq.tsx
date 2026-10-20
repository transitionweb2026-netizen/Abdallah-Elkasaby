import Link from "next/link";
import type { CSSProperties } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { Accordion } from "../ui/Accordion";
import { ReviewCard } from "./ReviewCard";
import styles from "./ReviewsFaq.module.css";

/** Reviews panel beside a compact FAQ panel — the reference's paired-panel row. */
export function ReviewsFaq({ locale }: { locale: Locale }) {
  const { home, reviews: allReviews, faq: faqGroups, site } = getContent();
  const shown = allReviews.filter((r) => !r.sample || site.settings.showSampleContent).slice(0, 3);
  const faq = faqGroups.flatMap((g) => g.items).slice(0, 5);

  return (
    <section className="section" aria-label={home.reviews.title[locale]}>
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--bl" /></div>
      <div className={`container ${styles.grid}`}>
        <div className={`glass glass--strong ${styles.reviews}`} data-reveal>
          <h2 className={styles.title}>{home.reviews.title[locale]}</h2>
          <p className={styles.subtitle}>{home.reviews.lead[locale]}</p>
          {shown.length ? (
            <ul className={styles.cards}>
              {shown.map((review, i) => (
                <li key={review.id} data-reveal style={{ "--d": i } as CSSProperties}>
                  <ReviewCard review={review} locale={locale} tone={i % 2 ? "mint" : "teal"} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">
              {locale === "ar"
                ? "ستُنشر هنا مراجعات المرضى الموثّقة بعد الحصول على إذنهم."
                : "Verified patient reviews will be published here, with each patient's permission."}
            </p>
          )}
          <Link href={pageHref(locale, "reviews")} className={`btn btn--outline btn--sm ${styles.more}`}>
            {home.reviews.cta[locale]}
          </Link>
        </div>

        <div className={`glass glass--teal ${styles.faq}`} data-reveal style={{ "--d": 2 } as CSSProperties}>
          <div className={styles.faqHead}>
            <h2 className={styles.title}>{locale === "ar" ? "أسئلة شائعة" : "Common questions"}</h2>
            <Link href={pageHref(locale, "reviews", "faq")} className="link-underline">
              {locale === "ar" ? "عرض الكل" : "View all"}
            </Link>
          </div>
          <Accordion compact items={faq.map((item) => ({ question: item.q[locale], answer: item.a[locale] }))} />
        </div>
      </div>
    </section>
  );
}
