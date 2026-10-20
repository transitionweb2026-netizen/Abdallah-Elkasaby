import Link from "next/link";
import { notFound } from "next/navigation";
import { CertificateCarousel } from "@/components/about/CertificateCarousel";
import { Hero, heroProps } from "@/components/hero/Hero";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { Philosophy } from "@/components/sections/Philosophy";
import { SpecialtyGrid } from "@/components/sections/SpecialtyGrid";
import { Timeline } from "@/components/sections/Timeline";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";
import { pageHref } from "@/lib/routes";

export const generateMetadata = topLevelMetadata("about");

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const { about, home, site } = getContent();
  const { biography, certificates, credentials, timeline } = about;
  const { settings, ui } = site;
  const shownCredentials = credentials.filter((c) => !c.sample || settings.showSampleContent);
  const shownTimeline = timeline.filter((e) => !e.sample || settings.showSampleContent);
  const shownCertificates = certificates.filter((c) => c.src || settings.showSampleContent);

  return (
    <>
      <Hero {...heroProps("about", locale)} />

      <AboutPreview
        locale={locale}
        title={biography.title[locale]}
        paragraphs={biography.paragraphs.map((p) => p[locale])}
        image={biography.image}
        caption={biography.caption[locale]}
      >
        <Link href={pageHref(locale, "services")} className="btn btn--primary">
          {locale === "ar" ? "مجالات الرعاية" : "Areas of care"}
          <Icon name="arrow" size={18} directional />
        </Link>
      </AboutPreview>

      <Philosophy locale={locale} showLink={false} />

      {shownCredentials.length > 0 && (
        <FeatureGrid
          id="credentials-title"
          title={locale === "ar" ? "المؤهلات والشهادات" : "Qualifications & credentials"}
          subtitle={
            locale === "ar"
              ? "الدرجات العلمية والتدريب والعضويات المهنية، تُدرج بعد التحقق منها."
              : "Degrees, training and professional memberships, listed as they are verified."
          }
          columns={4}
          features={shownCredentials.map((c) => ({
            icon: c.icon,
            title: c.title[locale],
            text: c.detail[locale],
            tag: c.sample ? ui.sample[locale] : undefined,
          }))}
        />
      )}

      {shownTimeline.length > 0 && (
        <Timeline
          locale={locale}
          id="timeline-title"
          title={locale === "ar" ? "الخبرة والتدريب" : "Experience & training"}
          entries={shownTimeline.map((e) => ({ period: e.period[locale], title: e.title[locale], detail: e.detail[locale], sample: e.sample }))}
        />
      )}

      <SpecialtyGrid locale={locale} title={home.specialties.title[locale]} subtitle={home.specialties.lead[locale]} />

      {shownCertificates.length > 0 && (
        <section className="section" aria-labelledby="certificates-title">
          <div className="orb-layer" aria-hidden="true"><div className="orb orb--green orb--cl" /></div>
          <div className="container">
            <SectionHeading
              id="certificates-title"
              title={locale === "ar" ? "الشهادات" : "Certificates"}
              subtitle={locale === "ar" ? "صور الشهادات الأصلية تُضاف بعد توفيرها." : "Scans of the original certificates are added once supplied."}
            />
            <CertificateCarousel
              items={shownCertificates.map((c) => ({ src: c.src, width: c.width, height: c.height, alt: c.alt[locale] }))}
              labels={{
                region: locale === "ar" ? "معرض الشهادات" : "Certificate gallery",
                previous: ui.previous[locale],
                next: ui.next[locale],
                sample: locale === "ar" ? "تُضاف صورة الشهادة" : "Certificate image to be added",
              }}
            />
          </div>
        </section>
      )}

      <FinalCta locale={locale} />
    </>
  );
}
