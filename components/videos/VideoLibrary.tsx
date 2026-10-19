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
  /** Server-rendered posters (wide for the featured slot, portrait for cards). */
  poster: ReactNode;
};

type VideoLibraryProps = {
  items: LibraryItem[];
  text: { play: string; comingSoon: string; planned: string; featured: string; close: string };
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
 * Featured video + portrait library cards. Videos load only after the
 * visitor presses play (YouTube via youtube-nocookie). Planned topics show
 * "Coming soon" and no play control.
 */
export function VideoLibrary({ items, text }: VideoLibraryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = items.find((i) => i.id === activeId) ?? null;
  const featuredIndex = Math.max(0, items.findIndex((i) => i.source));
  const featured = items[featuredIndex];
  const rest = items.filter((_, i) => i !== featuredIndex);

  const playOrSoon = (item: LibraryItem, size: "lg" | "sm") =>
    item.source ? (
      <button type="button" className={`${styles.play} ${size === "sm" ? styles.playSm : ""}`} onClick={() => setActiveId(item.id)}>
        <Play size={size === "lg" ? 34 : 24} fill="currentColor" aria-hidden="true" />
        <span className="visually-hidden">
          {text.play}: {item.title}
        </span>
      </button>
    ) : (
      <span className={`glass ${styles.soon}`}>
        <Clock3 size={15} aria-hidden="true" />
        {text.comingSoon}
      </span>
    );

  return (
    <div className={styles.library}>
      <article className={styles.featured} aria-labelledby="featured-video-title" data-reveal>
        <div className={styles.featuredVisual}>
          <div className={styles.glow} aria-hidden="true" />
          <div className={styles.stage}>
            {featured.poster}
            <span className={styles.stageTint} aria-hidden="true" />
            <div className={styles.center}>{playOrSoon(featured, "lg")}</div>
          </div>
        </div>
        <div className={`glass glass--strong ${styles.featuredBody}`}>
          <div className={styles.meta}>
            <span className="chip">{featured.topic}</span>
            <span className={styles.status}>{featured.source ? text.featured : text.planned}</span>
          </div>
          <h2 id="featured-video-title" className="title-card">
            {featured.title}
          </h2>
          <p className="text-muted">{featured.summary}</p>
        </div>
      </article>

      <ul className={styles.grid}>
        {rest.map((item, i) => (
          <li key={item.id} data-reveal style={{ "--d": i % 3 } as CSSProperties}>
            <article className={`glass glass-hover ${i % 2 ? "glass--mint" : ""} ${styles.card}`}>
              <div className={styles.thumb}>
                {item.poster}
                <span className="img-fade" aria-hidden="true" />
                <span className={`chip ${styles.topic}`}>{item.topic}</span>
                <div className={styles.center}>{playOrSoon(item, "sm")}</div>
              </div>
              <div className={styles.cardBody}>
                <h3 className="title-card">{item.title}</h3>
                <p className={styles.cardText}>{item.summary}</p>
              </div>
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
    </div>
  );
}
