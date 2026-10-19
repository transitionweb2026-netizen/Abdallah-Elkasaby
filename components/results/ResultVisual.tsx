import { ImageOff } from "lucide-react";
import styles from "./Results.module.css";

export type VisualData =
  | { kind: "image"; src: string; alt: string }
  | { kind: "placeholder"; state: "before" | "after"; title: string; note: string };

/**
 * One side of a before/after pair. Placeholders are neutral frames, clearly
 * labelled — never a stock photo standing in for a patient result.
 */
export function ResultVisual({ visual, eager }: { visual: VisualData; eager?: boolean }) {
  if (visual.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export
      <img
        src={visual.src}
        alt={visual.alt}
        className={styles.photo}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
      />
    );
  }
  return (
    <div className={`${styles.placeholder} ${visual.state === "after" ? styles.placeholderAfter : ""}`}>
      <span className={styles.placeholderIcon}>
        <ImageOff size={26} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className={styles.placeholderTitle}>{visual.title}</span>
      <span className={styles.placeholderNote}>{visual.note}</span>
    </div>
  );
}
