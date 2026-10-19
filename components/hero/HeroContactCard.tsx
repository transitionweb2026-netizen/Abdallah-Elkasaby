"use client";

import { Phone } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import type { SocialPlatform } from "@/content/site";
import { SocialIcon } from "../ui/SocialIcon";
import styles from "./HeroContactCard.module.css";

type Social = { platform: SocialPlatform; label: string; url: string | null };

type HeroContactCardProps = {
  socials: Social[];
  phone: { href: string; display: string } | null;
  text: {
    heading: string;
    socialProfiles: string;
    callClinic: string;
    phoneComingSoon: string;
    comingSoon: string;
    linkComingSoon: string;
    opensInNewTab: string;
  };
};

/** Bounded, spring-eased pull toward the cursor (the reference's magnetic icons). */
function Magnetic({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });

  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.35);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`icon-badge icon-badge--round ${styles.social}`}
    >
      {children}
    </motion.a>
  );
}

/**
 * "Connect with us" — social icons, a divider and the phone number on ONE
 * line (wraps only below 360px). Platforms or numbers that have not been
 * supplied render as muted, non-interactive placeholders.
 */
export function HeroContactCard({ socials, phone, text }: HeroContactCardProps) {
  return (
    <div className={`glass glass--strong ${styles.card}`}>
      <p className={`micro ${styles.heading}`}>{text.heading}</p>
      <div className={styles.row}>
        <ul className={styles.socials} aria-label={text.socialProfiles}>
          {socials.map((social, i) => (
            <li key={social.platform} style={{ animationDelay: `${0.6 + i * 0.08}s` }}>
              {social.url ? (
                <Magnetic href={social.url} label={`${social.label} (${text.opensInNewTab})`}>
                  <SocialIcon platform={social.platform} size={18} />
                </Magnetic>
              ) : (
                <span
                  className={`icon-badge icon-badge--round ${styles.social} ${styles.pending}`}
                  role="img"
                  aria-label={`${social.label} — ${text.linkComingSoon}`}
                  title={`${social.label} — ${text.linkComingSoon}`}
                >
                  <SocialIcon platform={social.platform} size={18} />
                </span>
              )}
            </li>
          ))}
        </ul>

        <span className={styles.divider} aria-hidden="true" />

        {(() => {
          const inner = (
            <>
              <span className={`icon-badge icon-badge--round icon-badge--solid ${styles.phoneIcon}`}>
                <Phone size={16} strokeWidth={2} aria-hidden="true" />
              </span>
              <span className={styles.phoneText}>
                <span className={styles.phoneLabel}>{text.callClinic}</span>
                {phone ? (
                  <span className={`${styles.phoneNumber} ltr-run`}>{phone.display}</span>
                ) : (
                  <span className={`${styles.phoneNumber} ${styles.phonePending}`}>
                    <span className={styles.pendingLong}>{text.phoneComingSoon}</span>
                    <span className={styles.pendingShort} aria-hidden="true">
                      {text.comingSoon}
                    </span>
                  </span>
                )}
              </span>
            </>
          );
          return phone ? (
            <a href={phone.href} className={`icon-trigger ${styles.phone}`}>
              {inner}
            </a>
          ) : (
            <span className={styles.phone}>{inner}</span>
          );
        })()}
      </div>
    </div>
  );
}
