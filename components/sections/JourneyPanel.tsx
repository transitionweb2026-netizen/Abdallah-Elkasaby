import { useId, type CSSProperties } from "react";
import { journey } from "@/content/practice";
import type { Locale } from "@/lib/i18n";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";
import styles from "./JourneyPanel.module.css";

/** Line-art stomach with a dashed "sleeve" line, pulsing nodes and a light pedestal. */
function CareArt() {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={styles.art} viewBox="0 0 240 260" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#077EA3" />
          <stop offset="100%" stopColor="#39B54A" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id}g)`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M112 14 C112 38 110 52 103 63 C86 88 68 112 70 142 C72 175 104 196 142 189 C173 184 193 162 189 136 C186 117 169 110 156 117 C145 123 143 137 130 139 C117 141 113 126 119 109 C125 92 130 72 128 50 C127 36 127 24 127 14" />
        <path d="M121 36 C119 66 108 94 101 122 C96 150 113 172 138 170" strokeDasharray="4 6" strokeOpacity="0.75" />
        <path d="M86 98 C98 104 104 118 100 132" strokeOpacity="0.4" />
        <path d="M160 140 C166 150 164 164 152 172" strokeOpacity="0.4" />
      </g>
      <g stroke={`url(#${id}g)`} fill="none" opacity="0.85">
        <line x1="128" y1="194" x2="128" y2="226" strokeWidth="1.4" />
        <ellipse cx="128" cy="232" rx="52" ry="8" fill="rgba(7,126,163,0.18)" stroke="none" />
        <ellipse cx="128" cy="232" rx="80" ry="13" strokeWidth="1" />
        <ellipse cx="128" cy="232" rx="100" ry="17" strokeWidth="0.8" opacity="0.5" />
      </g>
      <g>
        <circle className={styles.node} cx="103" cy="63" r="3" />
        <circle className={styles.node} cx="70" cy="142" r="3" style={{ animationDelay: "0.6s" }} />
        <circle className={styles.node} cx="189" cy="136" r="3" style={{ animationDelay: "1.2s" }} />
        <circle className={styles.node} cx="142" cy="189" r="3" style={{ animationDelay: "1.8s" }} />
        <circle cx="112" cy="118" r="3.5" fill="#fff" stroke="#077EA3" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

export function JourneyPanel({ locale, title, subtitle, id = "journey" }: { locale: Locale; title: string; subtitle?: string; id?: string }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="orb-layer" aria-hidden="true"><div className="orb orb--cyan orb--cr" /></div>
      <div className="container">
        <SectionHeading id={`${id}-title`} title={title} subtitle={subtitle} />
        <div className={`glass glass--teal ${styles.panel}`} data-reveal>
          <ol className={styles.steps}>
            {journey.map((step, i) => (
              <li key={step.title.en} className={styles.step} data-reveal style={{ "--d": i } as CSSProperties}>
                <span className={`icon-badge icon-badge--round ${i === journey.length - 1 ? "icon-badge--solid" : ""} ${styles.badge}`}>
                  <Icon name={step.icon} size={20} />
                </span>
                <div>
                  <p className={styles.count}>
                    {locale === "ar" ? `الخطوة ${(i + 1).toLocaleString("ar-EG")}` : `Step ${i + 1}`}
                  </p>
                  <h3 className={styles.title}>{step.title[locale]}</h3>
                  <p className={styles.text}>{step.text[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.visual}>
            <div className={styles.halo} aria-hidden="true" />
            <CareArt />
            <p className={styles.caption}>
              <Icon name="checkCircle" size={18} className="icon-glow" />
              {locale === "ar" ? "رعاية مستمرة قبل الجراحة وبعدها" : "Care that continues before and after surgery"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
