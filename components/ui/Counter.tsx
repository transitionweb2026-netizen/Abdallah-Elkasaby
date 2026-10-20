"use client";

import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CounterProps = {
  target: number;
  suffix?: string;
  duration?: number;
  locale: "en" | "ar";
};

/**
 * Animated count-up, triggered once when scrolled into view. Jumps straight
 * to the final value for visitors who prefer reduced motion.
 */
export function Counter({ target, suffix = "", duration = 1.8, locale }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame: number;
    if (reduceMotion) {
      // Deferred to a frame (not called synchronously in the effect body) so a
      // single state update still lands after this commit, not during it.
      frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="ltr-run">
      {value.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")}
      {suffix}
    </span>
  );
}
