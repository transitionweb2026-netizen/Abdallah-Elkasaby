import { getContent } from "@/lib/content";
import type { Locale } from "./i18n";
import { pageHref } from "./routes";

const { contact, socials, ui } = getContent().site;

/** Values still set to `REPLACE_WITH_…` (or empty) are never rendered as links. */
export function isConfigured(value: string | null | undefined): value is string {
  return Boolean(value && value.trim() && !value.trim().startsWith("REPLACE_WITH_"));
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

export function mailHref(email: string): string {
  return `mailto:${email}`;
}

export const hasPhone = isConfigured(contact.phone);
export const hasWhatsapp = isConfigured(contact.whatsapp);
export const hasEmail = isConfigured(contact.email);
export const hasAddress = isConfigured(contact.address.en) && isConfigured(contact.address.ar);
export const hasMap = isConfigured(contact.mapEmbedUrl);

export const configuredSocials = socials.filter((s) => isConfigured(s.url));

export type ContactAction = {
  kind: "whatsapp" | "phone" | "contact";
  href: string;
  label: string;
  external: boolean;
};

/**
 * The single "book a consultation" action used across the site. There is no
 * online booking system, so it opens WhatsApp or the phone dialler when those
 * are configured, and otherwise leads to the contact page.
 */
export function bookingAction(locale: Locale): ContactAction {
  if (hasWhatsapp) {
    return {
      kind: "whatsapp",
      href: whatsappHref(contact.whatsapp, contact.whatsappMessage[locale]),
      label: ui.bookConsultation[locale],
      external: true,
    };
  }
  if (hasPhone) {
    return { kind: "phone", href: telHref(contact.phone), label: ui.bookConsultation[locale], external: false };
  }
  return { kind: "contact", href: pageHref(locale, "contact"), label: ui.bookConsultation[locale], external: false };
}
