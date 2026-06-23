import { Grid, Eyebrow, Heading, Text, ImageBox } from "@/components/ui";
import type { ParentProfile as ParentProfileContent } from "@/lib/content-types";
import styles from "./ParentProfile.module.css";

export function ParentProfile({
  role,
  name,
  description,
  clearances,
  image,
}: ParentProfileContent) {
  return (
    <Grid cols={2} gap={4} templateDesktop="1fr 1.2fr" className={styles.profile} style={{ alignItems: "center" }}>
      <ImageBox image={image} ratio="4/5" sizes="(max-width: 768px) 100vw, 45vw" />
      <div>
        <Eyebrow>{role}</Eyebrow>
        <Heading level={3}>{name}</Heading>
        <Text muted style={{ marginTop: "1rem" }}>
          {description}
        </Text>
        <ul className={styles.badges}>
          {clearances.map((c) => (
            <li key={c} className={styles.badge}>
              {c} ✓
            </li>
          ))}
        </ul>
      </div>
    </Grid>
  );
}
