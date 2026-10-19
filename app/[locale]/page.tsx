import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { ResultsShowcase } from "@/components/results/ResultsShowcase";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ArticleGrid } from "@/components/sections/ArticleCards";
import { CarePillars } from "@/components/sections/CarePillars";
import { FinalCta } from "@/components/sections/FinalCta";
import { JourneyPanel } from "@/components/sections/JourneyPanel";
import { Philosophy } from "@/components/sections/Philosophy";
import { ProcedureGrid } from "@/components/sections/ProcedureGrid";
import { procedureItems } from "@/components/sections/procedureItems";
import { ReviewsFaq } from "@/components/sections/ReviewsFaq";
import { SpecialtyHexGrid } from "@/components/sections/SpecialtyHexGrid";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { articles } from "@/content/articles";
import { home } from "@/content/home";
import { pages } from "@/content/pages";
import { ui } from "@/content/site";
import { bookingAction } from "@/lib/contact";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { pageHref } from "@/lib/routes";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { meta } = pages.home;
  return pageMetadata({ locale, path: "", title: meta.title[locale], description: meta.description[locale], absoluteTitle: true });
}

const PREVIEW_SERVICES = ["bariatric-surgery", "sleeve-gastrectomy", "gallbladder-surgery", "hernia-repair"];

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const booking = bookingAction(locale);

  return (
    <>
      {/* 1 · Hero (+ care pillars strip) */}
      <Hero {...heroProps("home", locale)} />
      <CarePillars locale={locale} />

      {/* 2 · Doctor introduction */}
      <AboutPreview
        locale={locale}
        title={home.intro.title[locale]}
        paragraphs={[home.intro.text[locale]]}
        image="surgicalTeam"
        caption={locale === "ar" ? "رعاية جراحية متكاملة" : "Comprehensive surgical care"}
        points={home.intro.points.map((p) => ({ icon: p.icon, text: p.text[locale] }))}
        link={{ href: pageHref(locale, "about"), label: home.intro.link[locale] }}
      />

      {/* 3 · Specialties */}
      <SpecialtyHexGrid locale={locale} title={home.specialties.title[locale]} subtitle={home.specialties.lead[locale]} />

      {/* 4 · Surgical services */}
      <section className="section" aria-labelledby="services-preview-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--teal orb--tl" /></div>
        <div className="container">
          <SectionHeading
            id="services-preview-title"
            align="start"
            title={home.services.title[locale]}
            subtitle={home.services.lead[locale]}
            action={
              <Link href={pageHref(locale, "services")} className="btn btn--ghost icon-trigger">
                {home.services.cta[locale]}
                <Icon name="arrow" size={18} directional className="icon-glow" />
              </Link>
            }
          />
          <ProcedureGrid
            items={procedureItems(locale, (slug) => PREVIEW_SERVICES.includes(slug))}
            booking={{ href: booking.href, external: booking.external, label: ui.bookConsultation[locale] }}
            labels={{ open: ui.learnMore[locale], close: ui.close[locale], details: home.services.cta[locale] }}
            detailsBase={pageHref(locale, "services")}
          />
        </div>
      </section>

      {/* 5 · Before & After */}
      <ResultsShowcase locale={locale} />

      {/* 6 · Patient journey */}
      <JourneyPanel locale={locale} title={home.journey.title[locale]} subtitle={home.journey.lead?.[locale]} />

      {/* 7 · Why patients choose this approach */}
      <WhyChoose locale={locale} />

      {/* 8 · Philosophy */}
      <Philosophy locale={locale} />

      {/* 9 · Reviews (with common questions) */}
      <ReviewsFaq locale={locale} />

      {/* 10 · Latest articles */}
      <section className="section" aria-labelledby="articles-preview-title">
        <div className="orb-layer" aria-hidden="true"><div className="orb orb--cyan orb--cr" /></div>
        <div className="container">
          <SectionHeading
            id="articles-preview-title"
            align="start"
            title={home.articles.title[locale]}
            subtitle={home.articles.lead[locale]}
            action={
              <Link href={pageHref(locale, "articles")} className="btn btn--ghost icon-trigger">
                {home.articles.cta[locale]}
                <Icon name="arrow" size={18} directional className="icon-glow" />
              </Link>
            }
          />
          <ArticleGrid articles={articles.slice(0, 3)} locale={locale} />
        </div>
      </section>

      {/* 11 · Final CTA — the footer (12) is rendered by the layout */}
      <FinalCta locale={locale} />
    </>
  );
}
