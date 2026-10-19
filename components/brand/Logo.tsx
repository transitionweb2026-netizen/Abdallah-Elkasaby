import { useId } from "react";

/**
 * TEMPORARY MONOGRAM — a text-and-symbol mark created for the website until an
 * official logo is supplied. Replace this component (and app/icon.svg,
 * app/apple-icon.png via `npm run brand`) when the real logo is available.
 */
export function Monogram({ size = 44, className }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#077EA3" />
          <stop offset="0.62" stopColor="#0A8F9B" />
          <stop offset="1" stopColor="#39B54A" />
        </linearGradient>
        <radialGradient id={`${id}h`} cx="0.25" cy="0.15" r="0.85">
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill={`url(#${id}g)`} />
      <rect width="48" height="48" rx="14" fill={`url(#${id}h)`} />
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="13.25" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.5" />
      <g fill="none" stroke="#fff" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 33.5 20 14.5l7 19" />
        <path d="M15.9 26.5h8.2" />
        <path d="M31.5 14.5v19M31.5 14.5h7M31.5 24h5.6M31.5 33.5h7" />
      </g>
    </svg>
  );
}
