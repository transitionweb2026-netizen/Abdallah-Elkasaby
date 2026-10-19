import type { SocialPlatform } from "@/content/site";

/*
 * Brand marks drawn as 24×24 stroke icons so they sit naturally beside the
 * lucide interface icons (lucide no longer ships brand logos).
 */
const paths: Record<SocialPlatform | "whatsapp", React.ReactNode> = {
  facebook: <path d="M17.5 2.75h-2.75a4.75 4.75 0 0 0-4.75 4.75v2.75H7.25v3.5H10v7.5h3.5v-7.5h2.85l.65-3.5h-3.5V7.75a1 1 0 0 1 1-1h3z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <path d="M17.4 6.6h.01" strokeWidth="2.6" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.6 16.8a24 24 0 0 1 0-9.6 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16 0 2 2 0 0 1 1.4 1.4 24 24 0 0 1 0 9.6 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16 0 2 2 0 0 1-1.4-1.4" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
  tiktok: <path d="M20.5 8.2v3.6a8.9 8.9 0 0 1-4.6-1.6v5.3a5.9 5.9 0 1 1-7.1-5.8v3.7a2.3 2.3 0 1 0 3.3 2.1V3h3.7a4.9 4.9 0 0 0 4.7 5.2z" />,
  x: (
    <>
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M4 20l6.8-6.8M13.2 10.8 20 4" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.2 20.8 4.6 16.6a8.6 8.6 0 1 1 3.3 3.1z" />
      <path d="M9 9.6c0 2.9 2.5 5.4 5.4 5.4l1.2-1.3-1.8-1-.9.7a4 4 0 0 1-2.3-2.3l.7-.9-1-1.8z" />
    </>
  ),
};

export function SocialIcon({ platform, size = 20 }: { platform: SocialPlatform | "whatsapp"; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[platform]}
    </svg>
  );
}
