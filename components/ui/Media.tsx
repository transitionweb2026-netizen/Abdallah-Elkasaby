import type { CSSProperties } from "react";
import { preload } from "react-dom";
import { media, type ImageRef } from "@/content/media";
import variants from "@/content/media-variants.generated.json";
import type { Locale } from "@/lib/i18n";

type Variant = { width: number; height: number; widths: number[]; color: string };
const manifest = variants as Record<string, Variant>;

type MediaProps = {
  slot: ImageRef;
  locale: Locale;
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes: string;
  /** Above-the-fold images load eagerly with high priority; everything else is lazy. */
  priority?: boolean;
  className?: string;
  /** Hide from assistive technology when the image is purely decorative. */
  decorative?: boolean;
};

type Resolved = { src: string; srcSet: string; width: number; height: number; color: string; alt: string; position?: string; positionMobile?: string; flipIn?: "ltr" | "rtl" };

function resolveBundled(key: Exclude<ImageRef, { src: string }>, locale: Locale, decorative?: boolean): Resolved {
  const item = media[key];
  const variant = manifest[item.name];
  if (!variant) throw new Error(`No processed image for "${item.name}". Run \`npm run images\`.`);
  const base = `/media/photos/${item.name}`;
  const fallbackWidth = variant.widths.find((w) => w >= 1080) ?? variant.widths.at(-1);
  return {
    src: `${base}-${fallbackWidth}.webp`,
    srcSet: variant.widths.map((w) => `${base}-${w}.webp ${w}w`).join(", "),
    width: variant.width,
    height: variant.height,
    color: variant.color,
    alt: decorative ? "" : item.alt[locale],
    position: item.position,
    positionMobile: item.positionMobile,
    flipIn: item.flipIn,
  };
}

function resolveUploaded(image: Extract<ImageRef, { src: string }>, locale: Locale, decorative?: boolean): Resolved {
  return {
    src: image.src,
    srcSet: image.srcSet,
    width: image.width,
    height: image.height,
    color: image.color,
    // A replacement upload's own alt text when the editor gave one; otherwise
    // decorative rather than reusing the bundled photo's (now-inaccurate) caption.
    alt: decorative ? "" : image.alt?.[locale] ?? "",
  };
}

/**
 * Static-export image: pre-generated WebP widths delivered through `srcset`,
 * with intrinsic dimensions to prevent layout shift and a backdrop colour
 * while it loads. `slot` is either one of the site's bundled stock photos
 * (`npm run images`'s manifest) or a resolved CMS upload — same rendering
 * either way, just a different source for the numbers.
 */
export function Media({ slot, locale, sizes, priority, className, decorative }: MediaProps) {
  const { src, srcSet, width, height, color, alt, position, positionMobile, flipIn } =
    typeof slot === "string" ? resolveBundled(slot, locale, decorative) : resolveUploaded(slot, locale, decorative);

  if (priority) {
    preload(src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
  }

  const style = {
    "--pos": position,
    "--pos-mobile": positionMobile,
    backgroundColor: color,
  } as CSSProperties;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export renders a plain responsive <img>
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={["media-img", flipIn ? `media-flip-${flipIn}` : null, className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}
