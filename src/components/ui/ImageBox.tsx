import type { CSSProperties } from "react";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
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
 * Aspect-ratio image frame. Real photos render through Cloudinary (<CldImage> —
 * responsive AVIF/WebP, blur-up, CDN cache); when Cloudinary isn't configured,
 * the local SVG placeholder is shown via next/image.
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
      {image.cloudinaryId ? (
        <CldImage
          src={image.cloudinaryId}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          crop="fill"
          gravity="auto"
          placeholder="blur"
          className={styles.img}
        />
      ) : (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={image.src.endsWith(".svg")}
          className={styles.img}
        />
      )}
    </div>
  );
}
