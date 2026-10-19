import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { RippleEffect } from "@/components/layout/RippleEffect";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { specialties } from "@/content/practice";
import { contact, doctor, navLabels, socials, ui } from "@/content/site";
import { bookingAction, hasPhone, hasWhatsapp, isConfigured, telHref, whatsappHref } from "@/lib/contact";
import { fontVariables } from "@/lib/fonts";
import { isLocale, localeSettings, locales, type Locale } from "@/lib/i18n";
import { localeHref, pageHref, pageKeys } from "@/lib/routes";
import { allowIndexing, hasProductionUrl, siteUrl } from "@/lib/site-url";
import "../globals.css";

// Only `/ar/` and `/en/` exist; both are generated at build time.
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const l: Locale = isLocale(locale) ? locale : "en";
  return {
    metadataBase: new URL(siteUrl),
    title: { default: doctor.name[l], template: `%s | ${doctor.name[l]}` },
    description: doctor.description[l],
    applicationName: doctor.name[l],
    robots: allowIndexing ? undefined : { index: false, follow: false },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#eaf7f8",
  colorScheme: "light",
};

/** Adds the `js` class before first paint so scroll reveals never hide content without JS. */
const jsFlag = "document.documentElement.classList.add('js')";

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const booking = bookingAction(locale);

  // Structured data limited to verifiable facts: no address, rating or credentials are invented.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name[locale],
    description: doctor.description[locale],
    medicalSpecialty: ["Surgical"],
    knowsAbout: specialties.map((s) => s.title[locale]),
    ...(hasProductionUrl ? { url: `${siteUrl}${localeHref(locale)}` } : {}),
    ...(hasPhone ? { telephone: contact.phone } : {}),
    ...(socials.some((s) => isConfigured(s.url)) ? { sameAs: socials.filter((s) => isConfigured(s.url)).map((s) => s.url) } : {}),
  };

  return (
    <html lang={locale} dir={localeSettings[locale].dir} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <MotionProvider>
        <a href="#main" className="skip-link">
          {ui.skipToContent[locale]}
        </a>
        <SiteHeader
          locale={locale}
          brand={{
            name: doctor.name[locale],
            specialty: doctor.specialty[locale],
            homeHref: localeHref(locale),
            homeLabel: ui.homeLink[locale],
          }}
          navigation={pageKeys.map((key) => ({ key, label: navLabels[key][locale], href: pageHref(locale, key) }))}
          booking={{ href: booking.href, label: booking.label, external: booking.external }}
          ui={{
            mainNavigation: ui.mainNavigation[locale],
            openMenu: ui.openMenu[locale],
            closeMenu: ui.closeMenu[locale],
            menu: ui.menu[locale],
            switchLanguage: ui.switchLanguage[locale],
            switchLanguageLabel: ui.switchLanguageLabel[locale],
            opensInNewTab: ui.opensInNewTab[locale],
          }}
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter locale={locale} />
        <FloatingContact
          rtl={localeSettings[locale].dir === "rtl"}
          whatsapp={
            hasWhatsapp
              ? { href: whatsappHref(contact.whatsapp, contact.whatsappMessage[locale]), label: `${ui.whatsappUs[locale]} (${ui.opensInNewTab[locale]})` }
              : null
          }
          phone={hasPhone ? { href: telHref(contact.phone), label: ui.callClinic[locale] } : null}
          contactPage={{ href: pageHref(locale, "contact"), label: ui.floatingContact[locale] }}
          regionLabel={locale === "ar" ? "تواصل سريع" : "Quick contact"}
        />
        <RevealObserver />
        <RippleEffect />
        </MotionProvider>
      </body>
    </html>
  );
}
