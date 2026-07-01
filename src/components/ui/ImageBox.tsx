import type { CSSProperties } from "react";
import Image from "next/image";
import type { ImageAsset } from "@/lib/images";
import { blurDataUrlFor } from "@/lib/cloudinary";
import { CloudinaryImage } from "./CloudinaryImage";
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
 * Aspect-ratio image frame. Real photos render through Cloudinary (responsive
 * AVIF/WebP, blur-up, subject-aware cropping). The blur preview is fetched
 * server-side and doubles as an existence check: if the photo hasn't been
 * uploaded (or Cloudinary is unset), the local SVG placeholder renders instead
 * of a broken image.
 */
export async function ImageBox({
  image,
  ratio = "4/3",
  keyline = true,
  radius = "md",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  style,
}: Props) {
  const blur = image.cloudinaryId ? await blurDataUrlFor(image.cloudinaryId) : null;
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
      {image.cloudinaryId && blur ? (
        <CloudinaryImage
          publicId={image.cloudinaryId}
          alt={image.alt}
          blurDataURL={blur}
          sizes={sizes}
          priority={priority}
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
