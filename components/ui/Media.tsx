import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { media, type MediaKey } from "@/content/media";
import variants from "@/content/media-variants.generated.json";
import type { Locale } from "@/lib/i18n";

type Variant = { width: number; height: number; widths: number[]; color: string };
const manifest = variants as Record<string, Variant>;

type MediaProps = {
  slot: MediaKey;
  locale: Locale;
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string;
  /** Above-the-fold images load eagerly with high priority; everything else is lazy. */
  priority?: boolean;
  className?: string;
  /** Hide from assistive technology when the image is purely decorative. */
  decorative?: boolean;
};

/**
 * Static-export image: pre-generated WebP widths (`npm run images`) delivered
 * through `srcset`, with intrinsic dimensions to prevent layout shift and the
 * photo's dominant colour as a backdrop while it loads.
 */
export function Media({ slot, locale, sizes, priority, className, decorative }: MediaProps) {
  const item = media[slot];
  const variant = manifest[item.name];
  if (!variant) throw new Error(`No processed image for "${item.name}". Run \`npm run images\`.`);

  const base = `/media/photos/${item.name}`;
  const srcSet = variant.widths.map((w) => `${base}-${w}.webp ${w}w`).join(", ");
  const fallbackWidth = variant.widths.find((w) => w >= 1080) ?? variant.widths.at(-1);
  const src = `${base}-${fallbackWidth}.webp`;

  if (priority) {
    preload(src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  }

  const style = {
    "--pos": item.position,
    "--pos-mobile": item.positionMobile,
    backgroundColor: variant.color,
  } as CSSProperties;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export renders a plain responsive <img>
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={variant.width}
      height={variant.height}
      alt={decorative ? "" : item.alt[locale]}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={["media-img", item.flipIn ? `media-flip-${item.flipIn}` : null, className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
