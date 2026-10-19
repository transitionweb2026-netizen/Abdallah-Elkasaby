import type { CSSProperties, ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  subtitle?: string;
  id?: string;
  align?: "center" | "start";
  /** Optional element (e.g. a "View all" link) shown beside a start-aligned heading. */
  action?: ReactNode;
  className?: string;
};

/** Title → subtitle, revealed in sequence (the reference's SectionHeading pattern). */
export function SectionHeading({ title, subtitle, id, align = "center", action, className }: SectionHeadingProps) {
  const heading = (
    <div className={["section-heading", align === "start" && "section-heading--start", className].filter(Boolean).join(" ")}>
      <span className="accent" aria-hidden="true" data-reveal="scale" />
      <h2 id={id} data-reveal style={{ "--d": 0.6 } as CSSProperties}>
        {title}
      </h2>
      {subtitle && (
        <p data-reveal style={{ "--d": 1.3 } as CSSProperties}>
          {subtitle}
        </p>
      )}
    </div>
  );
  if (!action) return heading;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem 2rem" }}>
      {heading}
      <div data-reveal style={{ marginBottom: "clamp(2.5rem, 2rem + 2vw, 3.5rem)" }}>
        {action}
      </div>
    </div>
  );
}
