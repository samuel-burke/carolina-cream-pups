import { Card, Heading, Text, Button, ImageBox } from "@/components/ui";
import { images } from "@/lib/images";
import type { ImageKey } from "@/lib/images";
import styles from "./PuppyCard.module.css";

type Props = {
  name: string;
  meta: string;
  note: string;
  available: boolean;
  imageKey: ImageKey;
};

export function PuppyCard({ name, meta, note, available, imageKey }: Props) {
  return (
    <Card flush>
      <ImageBox
        image={images[imageKey]}
        ratio="4/5"
        keyline={false}
        radius="top"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <div className={styles.body}>
        <div className={styles.head}>
          <Heading level={3}>{name}</Heading>
          <span className={available ? styles.available : styles.reserved}>
            {available ? "Available" : "Reserved"}
          </span>
        </div>
        <Text muted style={{ marginTop: "0.25rem", fontSize: "var(--size-sm)" }}>
          {meta}
        </Text>
        <Text style={{ marginTop: "0.75rem", fontSize: "var(--size-sm)" }}>{note}</Text>
        <div style={{ marginTop: "1rem" }}>
          <Button href="/contact" variant="ghost" full>
            Ask about {name}
          </Button>
        </div>
      </div>
    </Card>
  );
}
