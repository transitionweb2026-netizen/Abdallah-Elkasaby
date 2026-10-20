import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { ArticleGrid, FeaturedArticle } from "@/components/sections/ArticleCards";
import { FinalCta } from "@/components/sections/FinalCta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";

export const generateMetadata = topLevelMetadata("articles");

export default async function ArticlesPage({ params }: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [featured, ...rest] = getContent().articles;
  const ar = locale === "ar";

  return (
    <>
      <Hero {...heroProps("articles", locale)} />
      <section className="section" aria-label={ar ? "المقال المميّز" : "Featured article"}>
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--lg orb--tl" /></div>
        <div className="container">
          <FeaturedArticle article={featured} locale={locale} />
        </div>
      </section>
      <section className="section" aria-labelledby="all-articles-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--cr" /></div>
        <div className="container">
          <SectionHeading
            id="all-articles-title"
            title={ar ? "مكتبة التثقيف الصحي" : "The patient education library"}
            subtitle={ar ? "معلومات عامة مكتوبة بعناية، لا تُغني عن الاستشارة الطبية الشخصية." : "Carefully written general information — never a substitute for personal medical advice."}
          />
          <ArticleGrid articles={rest} locale={locale} />
        </div>
      </section>
      <FinalCta locale={locale} />
    </>
  );
}
