import styles from "./CreditBadge.module.css";

/**
 * "Designed & developed by Transition" signature. Fixed, not localized and
 * not CMS content — it's the agency's own credit, independent of the page's
 * language. Source order is [Arabic label, mark, "Transition"]; which side
 * each label lands on follows the page's own dir (rtl/ltr) automatically.
 */
export function CreditBadge() {
  return (
    <p className={styles.badge}>
      <span>تصميم وتطوير</span>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export renders a plain <img> */}
      <img src="/brand/transition-mark.png" alt="Transition" width={28} height={28} className={styles.mark} />
      <span>Transition</span>
    </p>
  );
}
