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

  return (
    <>
      <Hero {...heroProps("contact", locale)} />
      <ContactChannels locale={locale} />
      <PrepareSection locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
