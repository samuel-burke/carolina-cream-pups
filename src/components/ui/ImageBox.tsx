import type { CSSProperties } from "react";
import Image from "next/image";
import type { ImageAsset } from "@/lib/images";
import styles from "./ImageBox.module.css";

type Props = {
  image: ImageAsset;
  /** CSS aspect-ratio, e.g. "4/3", "16/6". */
  ratio?: string;
  /** Thin sage keyline border. */
  keyline?: boolean;
  /** Border radius token: "none" | "md" (default) | "top". */
  radius?: "none" | "md" | "top";
  /** Render at higher fetch priority (use for above-the-fold hero only). */
  priority?: boolean;
  /** Responsive sizes hint for the browser. */
  sizes?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Aspect-ratio image frame backed by next/image. Local SVG placeholders are
 * served unoptimized; real raster photos dropped into /public are optimized
 * (AVIF/WebP) automatically.
 */
export function ImageBox({
  image,
  ratio = "4/3",
  keyline = true,
  radius = "md",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  style,
}: Props) {
  const isSvg = image.src.endsWith(".svg");
  const cls = [
    styles.frame,
    keyline ? styles.keyline : styles.plainLine,
    radius === "none" ? styles.radiusNone : radius === "top" ? styles.radiusTop : styles.radiusMd,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} style={{ aspectRatio: ratio, ...style }}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={isSvg}
        className={styles.img}
      />
    </div>
  );
}
