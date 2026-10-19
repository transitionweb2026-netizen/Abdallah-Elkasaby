import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { ResultsGallery } from "@/components/results/ResultsGallery";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resultsDisclaimer } from "@/content/results";
import { ui } from "@/content/site";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";
import { resultLabels, visibleCases } from "@/lib/results";
import styles from "./page.module.css";

export const generateMetadata = topLevelMetadata("results");

export default async function ResultsPage({ params }: PageProps<"/[locale]/before-after">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const cases = visibleCases(locale);
  const ar = locale === "ar";

  return (
    <>
      <Hero {...heroProps("results", locale)} />

      <section className="section" aria-labelledby="gallery-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--lg orb--tl" /></div>
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--br" /></div>
        <div className="container">
          <SectionHeading
            id="gallery-title"
            title={ar ? "قارن بنفسك" : "Compare for yourself"}
            subtitle={
              ar
                ? "اسحب الفاصل أو استخدم مفاتيح الأسهم للمقارنة، أو اعرض الصورتين جنبًا إلى جنب."
                : "Drag the divider or use the arrow keys to compare — or view both photographs side by side."
            }
          />
          {cases.length > 0 ? (
            <ResultsGallery
              cases={cases}
              labels={resultLabels(locale)}
              text={{
                viewMode: ar ? "طريقة العرض" : "View mode",
                compare: ar ? "مقارنة بالسحب" : "Compare slider",
                sideBySide: ar ? "جنبًا إلى جنب" : "Side by side",
                filter: ar ? "تصفية حسب الإجراء" : "Filter by procedure",
                all: ar ? "الكل" : "All",
                enlarge: ar ? "عرض أكبر" : "View larger",
                close: ui.close[locale],
                sample: ui.sample[locale],
              }}
            />
          ) : (
            <p className={`glass ${styles.note}`}>
              {ar ? "ستُنشر هنا صور قبل وبعد بعد الحصول على موافقة المرضى." : "Before-and-after photographs will be published here once patients have given their consent."}
            </p>
          )}
          <p className={`glass glass--teal ${styles.note}`} data-reveal>
            <span className="icon-badge icon-badge--round">
              <Icon name="info" size={18} />
            </span>
            <span>{resultsDisclaimer[locale]}</span>
          </p>
        </div>
      </section>

      <FeatureGrid
        id="policy-title"
        orb="green"
        columns={4}
        title={ar ? "كيف نعرض النتائج" : "How results are shared"}
        subtitle={ar ? "معايير ثابتة لكل صورة تُنشر في هذا المعرض." : "Fixed standards for every photograph published in this gallery."}
        features={[
          { icon: "shield", title: ar ? "موافقة كتابية" : "Written consent", text: ar ? "لا تُنشر أي صورة إلا بإذن كتابي من المريض." : "Every photograph is published only with the patient's written permission." },
          { icon: "lock", title: ar ? "دون ما يكشف الهوية" : "No identifying details", text: ar ? "لا تُعرض الوجوه أو الأسماء أو العلامات المميزة." : "Faces, names and distinguishing marks are never shown." },
          { icon: "columns", title: ar ? "مقارنة صادقة" : "Honest comparison", text: ar ? "لا تُعدّل الصور، وتُطابق كل صورتين في الوضعية والإطار والإضاءة." : "Photos are not retouched; pairs are matched in pose, framing and light." },
          { icon: "info", title: ar ? "النتائج تختلف" : "Results vary", text: ar ? "تعكس كل حالة شخصًا واحدًا، وتعتمد نتيجتك على عوامل كثيرة." : "Each case reflects one person; your own result depends on many factors." },
        ]}
      />

      <FinalCta
        locale={locale}
        icon="scale"
        title={ar ? "اسأل عمّا يمكن توقّعه في حالتك" : "Ask what to expect in your situation"}
        text={
          ar
            ? "لا تستطيع الصور أن تخبرك بما يناسبك، لكن الاستشارة تستطيع. ناقش أهدافك والخيارات الواقعية المتاحة لك."
            : "Photographs cannot tell you what is right for you — a consultation can. Discuss your goals and the realistic options available to you."
        }
      />
    </>
  );
}
