import { Card, Heading, Text, Button, ImageBox } from "@/components/ui";
import type { Puppy } from "@/lib/content-types";
import styles from "./PuppyCard.module.css";

export function PuppyCard({ name, meta, note, available, image }: Puppy) {
  return (
    <Card flush>
      <ImageBox
        image={image}
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
