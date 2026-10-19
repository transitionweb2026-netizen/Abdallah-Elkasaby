"use client";

import { ChevronLeft, ChevronRight, FileBadge } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./CertificateCarousel.module.css";

type Item = { src: string | null; width: number; height: number; alt: string };

type CarouselProps = {
  items: Item[];
  labels: { region: string; previous: string; next: string; sample: string };
};

/**
 * Image-only certificate gallery. Native scroll-snap handles touch and
 * trackpads; the buttons move one card at a time and disable at the ends,
 * in both reading directions.
 */
export function CertificateCarousel({ items, labels }: CarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setAtStart(pos <= 2);
    setAtEnd(pos >= max - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const step = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const distance = (card?.getBoundingClientRect().width ?? el.clientWidth * 0.8) + gap;
    const rtl = getComputedStyle(el).direction === "rtl";
    el.scrollBy({ left: direction * distance * (rtl ? -1 : 1), behavior: "smooth" });
  };

  return (
    <div className={styles.carousel}>
      <ul ref={trackRef} className={styles.track} aria-label={labels.region} tabIndex={0}>
        {items.map((item, i) => (
          <li key={i} className={styles.slide} style={{ "--ratio": item.width / item.height } as CSSProperties}>
            <figure className={`glass glass-hover ${i % 2 ? "glass--mint" : "glass--teal"} ${styles.frame}`}>
              {item.src ? (
                // eslint-disable-next-line @next/next/no-img-element -- static export
                <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" className={styles.image} />
              ) : (
                <div className={styles.placeholder} role="img" aria-label={item.alt}>
                  <span className="hex" style={{ "--hex": "4.25rem" } as CSSProperties}>
                    <FileBadge size={26} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span>{labels.sample}</span>
                </div>
              )}
            </figure>
          </li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button type="button" className="icon-badge icon-badge--round" onClick={() => step(-1)} disabled={atStart}>
          <ChevronLeft size={22} aria-hidden="true" className="icon-directional" />
          <span className="visually-hidden">{labels.previous}</span>
        </button>
        <button type="button" className="icon-badge icon-badge--round icon-badge--solid" onClick={() => step(1)} disabled={atEnd}>
          <ChevronRight size={22} aria-hidden="true" className="icon-directional" />
          <span className="visually-hidden">{labels.next}</span>
        </button>
      </div>
    </div>
  );
}
