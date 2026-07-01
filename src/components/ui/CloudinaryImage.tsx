"use client";

import { CldImage } from "next-cloudinary";

type Props = {
  /** Cloudinary public id (the uploaded filename, e.g. "hero"). */
  publicId: string;
  alt: string;
  /** Server-generated tiny preview for the blur-up effect. */
  blurDataURL?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Thin client-component wrapper around next-cloudinary's <CldImage>.
 *
 * CldImage uses React hooks, so it must live behind a "use client" boundary —
 * rendering it directly from a Server Component crashes prerendering. Always
 * fills its parent (the aspect-ratio frame controls the size); crop="fill" with
 * gravity="auto" keeps the subject centered no matter the upload's shape, so
 * photos never need manual cropping or resizing.
 */
export function CloudinaryImage({ publicId, alt, blurDataURL, sizes, priority, className }: Props) {
  return (
    <CldImage
      src={publicId}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      crop="fill"
      gravity="auto"
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
      className={className}
    />
  );
}
