import Link from "next/link";
import type { ReactNode } from "react";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type SmartLinkProps = {
  href: string;
  locale: Locale;
  external?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/**
 * Internal pages use the client router; `tel:`, `mailto:` and external links
 * use a plain anchor (external ones open in a new tab and say so).
 */
export function SmartLink({ href, locale, external, className, children, ...rest }: SmartLinkProps) {
  const { ui } = getContent().site;
  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer" aria-label={rest["aria-label"]}>
        {children}
        {!rest["aria-label"] && <span className="visually-hidden"> ({ui.opensInNewTab[locale]})</span>}
      </a>
    );
  }
  if (/^(tel:|mailto:|#)/.test(href)) {
    return (
      <a href={href} className={className} aria-label={rest["aria-label"]}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-label={rest["aria-label"]}>
      {children}
    </Link>
  );
}
