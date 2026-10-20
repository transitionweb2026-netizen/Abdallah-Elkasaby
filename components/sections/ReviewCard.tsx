import type { Review } from "@/content/reviews";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import styles from "./ReviewCard.module.css";

/** Testimonial card. Sample entries carry a visible label; no star ratings are invented. */
export function ReviewCard({ review, locale, tone = "teal" }: { review: Review; locale: Locale; tone?: "teal" | "mint" }) {
  const { ui } = getContent().site;
  return (
    <figure className={`glass ${tone === "mint" ? "glass--mint" : ""} ${styles.card}`}>
      <span className={`icon-badge icon-badge--round ${styles.quote}`} aria-hidden="true">
        <Icon name="quote" size={18} />
      </span>
      <blockquote className={styles.text}>
        <p>{review.text[locale]}</p>
      </blockquote>
      <figcaption className={styles.author}>
        <strong>{review.author[locale]}</strong>
        {review.context && <span>{review.context[locale]}</span>}
        {review.sample && <span className={`chip chip--sample ${styles.sample}`}>{ui.sample[locale]}</span>}
      </figcaption>
    </figure>
  );
}
