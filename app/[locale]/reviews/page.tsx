import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { FaqFull } from "@/components/sections/FaqFull";
import { FinalCta } from "@/components/sections/FinalCta";
import { ReviewCard } from "@/components/sections/ReviewCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviews } from "@/content/reviews";
import { settings } from "@/content/site";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const generateMetadata = topLevelMetadata("reviews");

export default async function ReviewsPage({ params }: PageProps<"/[locale]/reviews">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";
  const shown = reviews.filter((r) => !r.sample || settings.showSampleContent);

  return (
    <>
      <Hero {...heroProps("reviews", locale)} />
      <section className="section" aria-labelledby="reviews-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--tr" /></div>
        <div className="container">
          <SectionHeading
            id="reviews-title"
            title={ar ? "تجارب يشاركها المرضى" : "Experiences shared by patients"}
            subtitle={
              ar
                ? "تُنشر المراجعات بإذن أصحابها ودون بيانات تكشف هويتهم. وتعكس كل مراجعة تجربة شخصية، وتختلف النتائج من مريض لآخر."
                : "Reviews are published with permission and without identifying details. Each reflects a personal experience; results differ between patients."
            }
          />
          {shown.length ? (
            <ul className={styles.grid}>
              {shown.map((review, i) => (
                <li key={review.id} data-reveal style={{ "--d": i } as CSSProperties}>
                  <ReviewCard review={review} locale={locale} tone={i % 2 ? "mint" : "teal"} />
                </li>
              ))}
            </ul>
          ) : (
            <p className={`glass ${styles.empty}`}>
              {ar ? "ستُنشر هنا مراجعات المرضى الموثّقة بعد الحصول على إذنهم." : "Verified patient reviews will be published here, with each patient's permission."}
            </p>
          )}
        </div>
      </section>
      <FaqFull locale={locale} />
      <FinalCta
        locale={locale}
        icon="help"
        title={ar ? "اسأل مباشرةً عن حالتك" : "Ask about your own situation"}
        text={
          ar
            ? "الإجابات العامة مفيدة، لكن حالتك تستحق تقييمًا شخصيًا. تواصل مع العيادة لترتيب استشارة."
            : "General answers help, but your situation deserves an individual assessment. Contact the clinic to arrange a consultation."
        }
      />
    </>
  );
}
