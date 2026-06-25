"use client";

import { CldImage } from "next-cloudinary";

type Props = {
  /** Cloudinary public id, e.g. "home/hero". */
  publicId: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Thin client-component wrapper around next-cloudinary's <CldImage>.
 *
 * CldImage uses React hooks, so it must live behind a "use client" boundary —
 * rendering it directly from a Server Component pushes its hooks into the RSC
 * runtime and crashes prerendering ("useState is not a function"). Always fills
 * its parent (the aspect-ratio frame controls the size); Cloudinary handles
 * responsive sizing, AVIF/WebP, blur-up, and CDN caching.
 */
export function CloudinaryImage({ publicId, alt, sizes, priority, className }: Props) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      crop="fill"
      gravity="auto"
      placeholder="blur"
      className={className}
    />
  );
}
