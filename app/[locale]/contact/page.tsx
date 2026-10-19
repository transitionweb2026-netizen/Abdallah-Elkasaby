import { notFound } from "next/navigation";
import { ContactChannels, PrepareSection } from "@/components/contact/ContactSections";
import { Hero, heroProps } from "@/components/hero/Hero";
import { FinalCta } from "@/components/sections/FinalCta";
import { isLocale } from "@/lib/i18n";
import { topLevelMetadata } from "@/lib/metadata";

export const generateMetadata = topLevelMetadata("contact");

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === "ar";

  return (
    <>
      <Hero {...heroProps("contact", locale)} />
      <ContactChannels locale={locale} />
      <PrepareSection locale={locale} />
      <FinalCta
        locale={locale}
        icon="messages"
        title={ar ? "الخطوة الأولى بسيطة" : "The first step is a simple one"}
        text={ar ? "تواصل مع العيادة، وشارك ما يقلقك، وسنرتّب لك الموعد المناسب." : "Get in touch, share what is worrying you, and the clinic will arrange the right appointment."}
      />
    </>
  );
}
