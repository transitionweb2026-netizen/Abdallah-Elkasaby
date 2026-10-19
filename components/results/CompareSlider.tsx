"use client";

import { MoveHorizontal } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { ResultVisual, type VisualData } from "./ResultVisual";
import styles from "./Results.module.css";

type CompareSliderProps = {
  before: VisualData;
  after: VisualData;
  labels: { before: string; after: string; slider: string };
  /** Width / height of the photographs. */
  aspect: number;
  eager?: boolean;
};

/**
 * Before/after comparison. A transparent native range input sits on top, so
 * dragging, touch, keyboard arrows and screen readers all work without custom
 * gesture code. "Before" is always on the reading-start side (left in English,
 * right in Arabic); the range input mirrors automatically in RTL.
 */
export function CompareSlider({ before, after, labels, aspect, eager }: CompareSliderProps) {
  const [value, setValue] = useState(50);

  return (
    <div className={styles.compare} style={{ "--pos": `${value}%`, aspectRatio: aspect } as CSSProperties}>
      <div className={styles.layer}>
        <ResultVisual visual={before} eager={eager} />
      </div>
      <div className={`${styles.layer} ${styles.afterLayer}`}>
        <ResultVisual visual={after} eager={eager} />
      </div>
      <span className={`${styles.stateLabel} ${styles.stateBefore}`}>{labels.before}</span>
      <span className={`${styles.stateLabel} ${styles.stateAfter}`}>{labels.after}</span>
      <div className={styles.handle} aria-hidden="true">
        <span className={styles.knob}>
          <MoveHorizontal size={20} strokeWidth={2} />
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className={styles.range}
        aria-label={labels.slider}
        aria-valuetext={`${labels.before} ${value}% · ${labels.after} ${100 - value}%`}
      />
    </div>
  );
}
