import { Heading, Text, ImageBox } from "@/components/ui";
import type { ImageAsset } from "@/lib/images";
import styles from "./FeatureRow.module.css";

type Props = {
  image: ImageAsset;
  title: string;
  body: string;
  /** Flip image/text order at desktop for an alternating rhythm. */
  reverse?: boolean;
};

export function FeatureRow({ image, title, body, reverse }: Props) {
  return (
    <div className={[styles.row, reverse ? styles.reverse : ""].filter(Boolean).join(" ")}>
      <div className={styles.media}>
        <ImageBox image={image} ratio="4/3" sizes="(max-width: 768px) 100vw, 55vw" />
      </div>
      <div className={styles.body}>
        <Heading level={3}>{title}</Heading>
        <Text muted style={{ marginTop: "0.75rem" }}>
          {body}
        </Text>
      </div>
    </div>
  );
}
