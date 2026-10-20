import { getContent } from "@/lib/content";
import { LOCALE_STORAGE_KEY, localeSettings, locales } from "@/lib/i18n";
import { localeHref } from "@/lib/routes";
import { Monogram } from "../brand/Logo";
import styles from "./LanguageGate.module.css";

type LanguageGateProps = {
  /** Shown above the language buttons, in both languages. */
  message: { en: string; ar: string };
  heading?: { en: string; ar: string };
};

/** Store an explicit choice so the next visit to `/` goes straight there. */
const rememberScript = `document.querySelectorAll("[data-locale-choice]").forEach(function(a){a.addEventListener("click",function(){try{localStorage.setItem(${JSON.stringify(
  LOCALE_STORAGE_KEY,
)},a.getAttribute("data-locale-choice"))}catch(e){}})});`;

/** Bilingual chooser used by the root entry page and the 404 page. */
export function LanguageGate({ message, heading }: LanguageGateProps) {
  const { doctor } = getContent().site;
  return (
    <main className={styles.gate}>
      <div className={`glass glass--hero ${styles.card}`}>
        <Monogram size={64} className={styles.mark} />
        <div className={styles.names}>
          <p className={styles.name} lang="en" dir="ltr">
            {doctor.name.en}
          </p>
          <p className={`${styles.name} ${styles.nameAr}`} lang="ar" dir="rtl">
            {doctor.name.ar}
          </p>
        </div>
        {heading && (
          <h1 className={styles.heading}>
            <span lang="en">{heading.en}</span>
            <span lang="ar" dir="rtl">
              {heading.ar}
            </span>
          </h1>
        )}
        <p className={styles.message}>
          <span lang="en">{message.en}</span>
          <span lang="ar" dir="rtl">
            {message.ar}
          </span>
        </p>
        <ul className={styles.choices}>
          {locales.map((locale) => (
            <li key={locale}>
              <a
                href={localeHref(locale)}
                hrefLang={locale}
                lang={locale}
                data-locale-choice={locale}
                className={`btn ${locale === "ar" ? "btn--primary" : "btn--glass"} ${styles.choice}`}
              >
                {localeSettings[locale].label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <script dangerouslySetInnerHTML={{ __html: rememberScript }} />
    </main>
  );
}
