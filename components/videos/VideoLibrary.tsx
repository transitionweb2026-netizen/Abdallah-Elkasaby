"use client";

import { Clock3, Play } from "lucide-react";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { VideoSource } from "@/content/videos";
import { Modal } from "../ui/Modal";
import styles from "./VideoLibrary.module.css";

export type LibraryItem = {
  id: string;
  topic: string;
  title: string;
  summary: string;
  source: VideoSource | null;
  /** Server-rendered portrait poster. */
  poster: ReactNode;
};

type VideoLibraryProps = {
  items: LibraryItem[];
  text: { play: string; comingSoon: string; close: string };
};

function Player({ item }: { item: LibraryItem }) {
  if (!item.source) return null;
  return item.source.type === "youtube" ? (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${item.source.id}?autoplay=1&rel=0`}
      title={item.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className={styles.player}
    />
  ) : (
    <video src={item.source.src} controls autoPlay playsInline className={styles.player} />
  );
}

/**
 * Nine portrait video cards in three vertical stacks on wide screens (a
 * single stack on phones). Videos load only once the visitor presses play
 * (YouTube via youtube-nocookie). A topic without a published source shows
 * "Coming soon" and its card is disabled, rather than opening an empty player.
 */
export function VideoLibrary({ items, text }: VideoLibraryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((i) => i.id === activeId) ?? null;

  return (
    <>
      <ul className={styles.grid}>
        {items.map((item, i) => (
          <li key={item.id} data-reveal style={{ "--d": i % 3 } as CSSProperties}>
            <article className={`glass glass-hover ${i % 2 ? "glass--mint" : ""} ${styles.card}`}>
              <button
                type="button"
                className={styles.button}
                onClick={() => setActiveId(item.id)}
                disabled={!item.source}
                aria-haspopup={item.source ? "dialog" : undefined}
              >
                <div className={styles.thumb}>
                  {item.poster}
                  <span className="img-fade" aria-hidden="true" />
                  <span className={`chip ${styles.topic}`}>{item.topic}</span>
                  <div className={styles.center}>
                    {item.source ? (
                      <span className={styles.play} aria-hidden="true">
                        <Play size={22} fill="currentColor" />
                      </span>
                    ) : (
                      <span className={`glass ${styles.soon}`}>
                        <Clock3 size={14} aria-hidden="true" />
                        {text.comingSoon}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <h3 className="title-card">{item.title}</h3>
                  <p className={styles.cardText}>{item.summary}</p>
                </div>
                <span className="visually-hidden">{item.source ? `${text.play}: ${item.title}` : `${item.title} — ${text.comingSoon}`}</span>
              </button>
            </article>
          </li>
        ))}
      </ul>

      <Modal open={!!active} onClose={() => setActiveId(null)} label={active?.title ?? ""} closeLabel={text.close} size="lg">
        {active && (
          <div className={styles.modalBody}>
            <div className={styles.modalStage}>
              <Player item={active} />
            </div>
            <h2 className="title-card">{active.title}</h2>
            <p className="text-muted">{active.summary}</p>
          </div>
        )}
      </Modal>
    </>
  );
}
