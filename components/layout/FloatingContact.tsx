"use client";

import { MessagesSquare, Phone } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { SocialIcon } from "../ui/SocialIcon";
import styles from "./FloatingContact.module.css";

type Props = {
  rtl: boolean;
  whatsapp: { href: string; label: string } | null;
  phone: { href: string; label: string } | null;
  contactPage: { href: string; label: string };
  regionLabel: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

function Floater({ rtl, delay, className, children }: { rtl: boolean; delay: number; className: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: rtl ? -40 : 40 }}
      animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.5, delay, ease },
        x: { duration: 0.5, delay, ease },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Floating quick-contact buttons. WhatsApp/phone appear only once real
 * numbers exist; until then one button leads to the contact page. On phones
 * they wait until the hero has scrolled away, and they step aside near the
 * bottom of every page so they never cover the footer.
 */
export function FloatingContact({ rtl, whatsapp, phone, contactPage, regionLabel }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const update = () => {
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 260;
      setVisible(!nearBottom && (desktop.matches || window.scrollY > window.innerHeight * 0.55));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <motion.nav
      aria-label={regionLabel}
      className={styles.dock}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      inert={!visible}
    >
      {whatsapp && (
        <Floater rtl={rtl} delay={0.4} className={`${styles.button} ${styles.whatsapp}`}>
          <a href={whatsapp.href} target="_blank" rel="noopener noreferrer" aria-label={whatsapp.label}>
            <SocialIcon platform="whatsapp" size={22} />
          </a>
        </Floater>
      )}
      {phone && (
        <Floater rtl={rtl} delay={0.55} className={styles.button}>
          <a href={phone.href} aria-label={phone.label}>
            <Phone size={20} strokeWidth={2} aria-hidden="true" />
          </a>
        </Floater>
      )}
      {!whatsapp && !phone && (
        <Floater rtl={rtl} delay={0.4} className={styles.button}>
          <Link href={contactPage.href} aria-label={contactPage.label}>
            <MessagesSquare size={21} strokeWidth={2} aria-hidden="true" />
          </Link>
        </Floater>
      )}
    </motion.nav>
  );
}
