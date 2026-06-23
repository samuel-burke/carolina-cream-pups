import { ImageBox } from "@/components/ui";
import type { ImageAsset } from "@/lib/images";
import styles from "./Masonry.module.css";

/** CSS multi-column masonry. Items keep their natural aspect ratio. */
export function Masonry({ items }: { items: { image: ImageAsset; ratio: string }[] }) {
  return (
    <div className={styles.masonry}>
      {items.map(({ image, ratio }, i) => (
        <div key={i} className={styles.item}>
          <ImageBox image={image} ratio={ratio} sizes="(max-width: 768px) 50vw, 33vw" />
        </div>
      ))}
    </div>
  );
}
