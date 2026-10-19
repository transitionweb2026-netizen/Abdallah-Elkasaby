"use client";

import { ArrowUpRight, CalendarDays, Check } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Modal } from "../ui/Modal";
import styles from "./ProcedureGrid.module.css";

export type ProcedureItem = {
  id: string;
  group: string;
  title: string;
  summary: string;
  body: string;
  points: string[];
  /** Server-rendered images: card thumbnail and modal header. */
  image: ReactNode;
  modalImage: ReactNode;
};

type ProcedureGridProps = {
  items: ProcedureItem[];
  booking: { href: string; external: boolean; label: string };
  labels: { open: string; close: string; details?: string };
  /** Services page URL; the modal links to `{detailsBase}#{id}`. */
  detailsBase?: string;
  columns?: 3 | 4;
};

/**
 * Image-led procedure cards (4:3 photo fading into the glass, title,
 * summary, arrow badge). Each opens a detail modal — the reference's
 * ProcedureCardGrid. Every card keeps an id anchor for deep links.
 */
export function ProcedureGrid({ items, booking, labels, detailsBase, columns = 4 }: ProcedureGridProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((item) => item.id === activeId) ?? null;

  return (
    <>
      <ul className={`${styles.grid} ${columns === 3 ? styles.three : ""}`}>
        {items.map((item, i) => (
          <li key={item.id} id={item.id} className={styles.cell} data-reveal style={{ "--d": i % 4 } as CSSProperties}>
            <article className={`glass glass-hover icon-trigger ${styles.card}`}>
              <button type="button" className={styles.button} onClick={() => setActiveId(item.id)} aria-haspopup="dialog">
                <span className={styles.media}>
                  {item.image}
                  <span className="img-fade" aria-hidden="true" />
                  <span className={`chip ${styles.group}`}>{item.group}</span>
                </span>
                <span className={styles.body}>
                  <span className={styles.title}>{item.title}</span>
                  <span className={styles.summary}>{item.summary}</span>
                  <span className={styles.arrow} aria-hidden="true">
                    <ArrowUpRight size={20} className="icon-directional" />
                  </span>
                  <span className="visually-hidden">{labels.open}</span>
                </span>
              </button>
            </article>
          </li>
        ))}
      </ul>

      <Modal open={!!active} onClose={() => setActiveId(null)} label={active?.title ?? ""} closeLabel={labels.close}>
        {active && (
          <>
            <div className={styles.modalMedia}>
              {active.modalImage}
              <span className="img-fade" aria-hidden="true" />
            </div>
            <div className={styles.modalBody}>
              <span className="chip">{active.group}</span>
              <h2 className={styles.modalTitle}>{active.title}</h2>
              <p className={styles.modalLead}>{active.summary}</p>
              <p className="text-muted">{active.body}</p>
              <ul className={styles.points}>
                {active.points.map((point) => (
                  <li key={point}>
                    <span className="icon-badge icon-badge--round icon-badge--green">
                      <Check size={14} strokeWidth={2.6} aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className={styles.modalActions}>
                {booking.external ? (
                  <a href={booking.href} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
                    <CalendarDays size={18} aria-hidden="true" />
                    {booking.label}
                  </a>
                ) : (
                  <Link href={booking.href} className="btn btn--primary">
                    <CalendarDays size={18} aria-hidden="true" />
                    {booking.label}
                  </Link>
                )}
                {detailsBase && labels.details && (
                  <Link href={`${detailsBase}#${active.id}`} className="btn btn--ghost">
                    {labels.details}
                  </Link>
                )}
              </div>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
