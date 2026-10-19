import { notFound } from "next/navigation";
import { Hero, heroProps } from "@/components/hero/Hero";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { JourneyPanel } from "@/components/sections/JourneyPanel";
import { ProcedureGrid } from "@/components/sections/ProcedureGrid";
import { procedureItems } from "@/components/sections/procedureItems";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { expectations, serviceGroups, servicesNote, type ServiceGroupKey } from "@/content/practice";
import { ui } from "@/content/site";
import { bookingAction } from "@/lib/contact";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";
import styles from "./page.module.css";

export const generateMetadata = topLevelMetadata("services");

const groupOrder: ServiceGroupKey[] = ["bariatric", "general"];

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const booking = bookingAction(locale);

  return (
    <>
      <Hero {...heroProps("services", locale)} />

      {groupOrder.map((key, i) => (
        <section key={key} id={`group-${key}`} className="section" aria-labelledby={`group-${key}-title`}>
          <div className="orb-layer" aria-hidden="true"><div className={`orb ${i ? "orb--green orb--cr" : "orb--teal orb--cl"}`} /></div>
          <div className="container">
            <SectionHeading id={`group-${key}-title`} title={serviceGroups[key].title[locale]} subtitle={serviceGroups[key].intro[locale]} />
            <ProcedureGrid
              items={procedureItems(locale, (_, group) => group === key)}
              booking={{ href: booking.href, external: booking.external, label: ui.bookConsultation[locale] }}
              labels={{ open: ui.learnMore[locale], close: ui.close[locale] }}
            />
          </div>
        </section>
      ))}

      <div className="container">
        <p className={`glass glass--teal ${styles.note}`} data-reveal>
          <span className="icon-badge icon-badge--round">
            <Icon name="info" size={18} />
          </span>
          <span>{servicesNote[locale]}</span>
        </p>
      </div>

      <FeatureGrid
        id="why-services-title"
        orb="green"
        title={locale === "ar" ? "لماذا يثق المرضى بهذا النهج" : "Why patients trust this approach"}
        subtitle={
          locale === "ar"
            ? "كل خطة علاجية تقوم على التقييم الدقيق والسلامة والرعاية الحقيقية للإنسان خلف التشخيص."
            : "Every treatment plan is built on careful assessment, safety and genuine care for the person behind the diagnosis."
        }
        features={expectations.map((e) => ({ icon: e.icon, title: e.title[locale], text: e.text[locale] }))}
      />

      <JourneyPanel
        locale={locale}
        id="approach"
        title={locale === "ar" ? "من الاستشارة الأولى إلى المتابعة" : "From first consultation to follow-up"}
        subtitle={
          locale === "ar"
            ? "كل خدمة جراحية تمر بالمراحل نفسها، وتبدأ دائمًا بالتقييم لا بالعملية."
            : "Every surgical service follows the same path — and always starts with assessment, not with an operation."
        }
      />

      <FinalCta
        locale={locale}
        icon="route"
        title={locale === "ar" ? "لست متأكدًا من الإجراء المناسب لك؟" : "Not sure which procedure is right for you?"}
        text={
          locale === "ar"
            ? "هذا بالضبط ما تجيب عنه الاستشارة. أحضر تقاريرك وأسئلتك، وسنناقش الخيارات معًا."
            : "That is exactly what a consultation is for. Bring your reports and your questions, and the options will be discussed together."
        }
      />
    </>
  );
}
