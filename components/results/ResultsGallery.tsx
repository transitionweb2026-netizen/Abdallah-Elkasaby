"use client";

import { Columns2, Maximize2, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, type CSSProperties } from "react";
import type { ResolvedCase } from "@/lib/results";
import { Modal } from "../ui/Modal";
import { CompareSlider } from "./CompareSlider";
import { PairView } from "./PairView";
import styles from "./ResultsGallery.module.css";

type GalleryProps = {
  cases: ResolvedCase[];
  labels: { before: string; after: string; slider: string };
  text: { viewMode: string; compare: string; sideBySide: string; filter: string; all: string; enlarge: string; close: string; sample: string };
};

/**
 * Before & After gallery: view-mode switch (slider / side by side), category
 * filters once real cases span 2+ categories, and an enlarged view in the
 * shared glass modal.
 */
export function ResultsGallery({ cases, labels, text }: GalleryProps) {
  const [mode, setMode] = useState<"compare" | "pair">("compare");
  const [category, setCategory] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = cases.find((c) => c.id === activeId) ?? null;

  // Filters only make sense for authentic cases; placeholders never drive them.
  const categories = useMemo(() => Array.from(new Set(cases.filter((c) => !c.placeholder).map((c) => c.category))), [cases]);
  const shown = category ? cases.filter((c) => c.category === category) : cases;

  return (
    <div className={styles.gallery}>
      <div className={styles.toolbar}>
        <div className={`glass ${styles.segment}`} role="group" aria-label={text.viewMode}>
          <button type="button" aria-pressed={mode === "compare"} onClick={() => setMode("compare")}>
            <SlidersHorizontal size={16} aria-hidden="true" />
            {text.compare}
          </button>
          <button type="button" aria-pressed={mode === "pair"} onClick={() => setMode("pair")}>
            <Columns2 size={16} aria-hidden="true" />
            {text.sideBySide}
          </button>
        </div>
        {categories.length > 1 && (
          <div className={styles.filters} role="group" aria-label={text.filter}>
            <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>
              {text.all}
            </button>
            {categories.map((name) => (
              <button key={name} type="button" aria-pressed={category === name} onClick={() => setCategory(name)}>
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className={styles.grid}>
        {shown.map((item, i) => (
          <li key={item.id} data-reveal style={{ "--d": i % 2 } as CSSProperties}>
            <figure className={`glass glass-hover ${i % 2 ? "glass--mint" : "glass--teal"} ${styles.card}`}>
              <div className={styles.frame}>
                {mode === "compare" ? (
                  <CompareSlider before={item.before} after={item.after} labels={labels} aspect={item.aspect} />
                ) : (
                  <PairView before={item.before} after={item.after} labels={labels} aspect={item.aspect} />
                )}
              </div>
              <figcaption className={styles.caption}>
                <div className={styles.captionTop}>
                  <strong>{item.title}</strong>
                  {item.placeholder ? <span className="chip chip--sample">{text.sample}</span> : <span className="chip">{item.category}</span>}
                </div>
                <p>{item.caption}</p>
                <button type="button" className={`btn btn--ghost btn--sm ${styles.enlarge}`} onClick={() => setActiveId(item.id)}>
                  <Maximize2 size={15} aria-hidden="true" />
                  {text.enlarge}
                  <span className="visually-hidden">: {item.title}</span>
                </button>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Modal open={!!active} onClose={() => setActiveId(null)} label={active?.title ?? ""} closeLabel={text.close} size="lg">
        {active && (
          <div className={styles.modalBody} style={{ "--aspect": active.aspect } as CSSProperties}>
            <p className={styles.modalTitle}>{active.title}</p>
            <div className={styles.modalFrame}>
              <CompareSlider before={active.before} after={active.after} labels={labels} aspect={active.aspect} eager />
            </div>
            <p className={styles.modalCaption}>{active.caption}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
