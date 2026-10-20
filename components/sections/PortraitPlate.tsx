import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { Monogram } from "../brand/Logo";
import styles from "./PortraitPlate.module.css";

const caption = { en: "Official portrait coming soon", ar: "الصورة الرسمية قريبًا" };

/**
 * The doctor's portrait. Until a real photo is set (in content/about.ts, or
 * uploaded through the CMS) it renders a branded monogram plate — never a
 * stock photo presented as the doctor.
 */
export function PortraitPlate({ locale, className }: { locale: Locale; className?: string }) {
  const { about, site } = getContent();
  const { portrait } = about;
  const { doctor } = site;
  return (
    <figure className={[styles.frame, className].filter(Boolean).join(" ")}>
      {portrait.src ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export
        <img
          src={portrait.src}
          alt={portrait.alt[locale]}
          width={portrait.width}
          height={portrait.height}
          loading="lazy"
          decoding="async"
          className={styles.photo}
        />
      ) : (
        <div className={styles.plate} role="img" aria-label={`${doctor.name[locale]} — ${caption[locale]}`}>
          <span className={styles.rings} aria-hidden="true" />
          <Monogram size={104} className={styles.mark} />
          <span className={styles.name}>{doctor.name[locale]}</span>
          <span className={styles.role}>{doctor.specialty[locale]}</span>
          <span className={styles.note}>{caption[locale]}</span>
        </div>
      )}
    </figure>
  );
}
