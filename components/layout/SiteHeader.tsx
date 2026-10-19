"use client";

import { CalendarDays, ChevronRight, Languages, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { LOCALE_STORAGE_KEY, otherLocale, type Locale } from "@/lib/i18n";
import { localeHref, pathWithoutLocale } from "@/lib/routes";
import { Monogram } from "../brand/Logo";
import styles from "./SiteHeader.module.css";

export type NavItem = { key: string; label: string; href: string };

type SiteHeaderProps = {
  locale: Locale;
  brand: { name: string; specialty: string; homeHref: string; homeLabel: string };
  navigation: NavItem[];
  booking: { href: string; label: string; external: boolean };
  ui: {
    mainNavigation: string;
    openMenu: string;
    closeMenu: string;
    menu: string;
    switchLanguage: string;
    switchLanguageLabel: string;
    opensInNewTab: string;
  };
};

const normalize = (path: string) => `/${path.replace(/^\/+|\/+$/g, "")}`;
const ease = [0.16, 1, 0.3, 1] as const;

export function SiteHeader({ locale, brand, navigation, booking, ui }: SiteHeaderProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  // The menu is open only for the page it was opened on, so any navigation closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rtl = locale === "ar";

  const current = normalize(pathname);
  const homePath = normalize(localeHref(locale));
  const isActive = (href: string) => {
    const target = normalize(href);
    return target === homePath ? current === target : current === target || current.startsWith(`${target}/`);
  };

  const alternate = otherLocale(locale);
  const alternateHref = localeHref(alternate, pathWithoutLocale(pathname));
  const rememberLanguage = () => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, alternate);
    } catch {
      /* storage unavailable — the link still works */
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
    setOpenOn(pathname);
  };
  const closeMenu = useCallback(() => setOpenOn(null), []);
  const finishClose = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    document.documentElement.style.removeProperty("overflow");
    triggerRef.current?.focus();
  };

  const bookingLink = (className: string, children: ReactNode, onClick?: () => void) =>
    booking.external ? (
      <a href={booking.href} className={className} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {children}
        <span className="visually-hidden"> ({ui.opensInNewTab})</span>
      </a>
    ) : booking.href.startsWith("tel:") ? (
      <a href={booking.href} className={className} onClick={onClick}>
        {children}
      </a>
    ) : (
      <Link href={booking.href} className={className} onClick={onClick}>
        {children}
      </Link>
    );

  const languageLink = (className: string) => (
    <Link
      href={alternateHref}
      className={className}
      hrefLang={alternate}
      lang={alternate}
      onClick={rememberLanguage}
      aria-label={ui.switchLanguageLabel}
    >
      <Languages size={16} aria-hidden="true" />
      <span>{ui.switchLanguage}</span>
    </Link>
  );

  const brandLockup = (
    <>
      <Monogram size={40} className={styles.mark} />
      <span className={styles.brandText}>
        <span className={styles.brandName}>{brand.name}</span>
        <span className={styles.brandRole}>{brand.specialty}</span>
      </span>
    </>
  );

  return (
    <>
      <header className={styles.header} data-scrolled={scrolled || undefined}>
        <motion.nav
          className={`container ${styles.nav}`}
          aria-label={ui.mainNavigation}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <Link href={brand.homeHref} className={styles.brand} aria-label={brand.homeLabel}>
            {brandLockup}
          </Link>

          <ul className={styles.links}>
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.key} className={item.key === "home" ? styles.homeItem : undefined}>
                  <Link href={item.href} className={styles.link} aria-current={active ? "page" : undefined}>
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className={styles.underline}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className={styles.actions}>
            {languageLink(styles.lang)}
            {bookingLink(
              `btn btn--primary ${styles.book}`,
              <>
                <CalendarDays size={18} aria-hidden="true" />
                <span>{booking.label}</span>
              </>,
            )}
            <button
              ref={triggerRef}
              type="button"
              className={`icon-badge icon-badge--round ${styles.menuButton}`}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={openMenu}
            >
              <Menu size={22} aria-hidden="true" />
              <span className="visually-hidden">{ui.openMenu}</span>
            </button>
          </div>
        </motion.nav>
      </header>

      {/* Full-screen drawer: native <dialog> for focus trap + Escape, motion for the spring slide. */}
      <dialog
        ref={dialogRef}
        id="site-menu"
        className={styles.drawer}
        aria-label={ui.menu}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
      >
        <AnimatePresence onExitComplete={finishClose}>
          {open && (
            <motion.div
              key="drawer"
              className={styles.sheet}
              initial={{ x: rtl ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: rtl ? "-100%" : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
            >
              <div className={styles.orbA} aria-hidden="true" />
              <div className={styles.orbB} aria-hidden="true" />
              <div className={styles.sheetTop}>
                <Link href={brand.homeHref} className={styles.brand} aria-label={brand.homeLabel} onClick={closeMenu}>
                  {brandLockup}
                </Link>
                <div className={styles.sheetTopActions}>
                  {languageLink(styles.lang)}
                  <button type="button" className={`icon-badge icon-badge--round ${styles.closeButton}`} onClick={closeMenu}>
                    <X size={22} aria-hidden="true" />
                    <span className="visually-hidden">{ui.closeMenu}</span>
                  </button>
                </div>
              </div>

              <nav className={styles.drawerNav} aria-label={ui.mainNavigation}>
                {navigation.map((item, index) => {
                  const active = isActive(item.href);
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + index * 0.05, duration: 0.4, ease }}
                    >
                      <Link
                        href={item.href}
                        className={styles.drawerLink}
                        aria-current={active ? "page" : undefined}
                        onClick={closeMenu}
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={20} aria-hidden="true" className="icon-directional" />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4, ease }}
              >
                {bookingLink(
                  `btn btn--primary btn--lg ${styles.drawerBook}`,
                  <>
                    <CalendarDays size={18} aria-hidden="true" />
                    <span>{booking.label}</span>
                  </>,
                  closeMenu,
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
