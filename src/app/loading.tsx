import { Container } from "@/components/ui";
import styles from "./loading.module.css";

/**
 * Route-level loading UI. Shown during navigation/streaming so the page never
 * flashes blank — a calm skeleton that mirrors the typical page header + grid.
 */
export default function Loading() {
  return (
    <Container>
      <div className={styles.wrap} aria-hidden="true">
        <div className={`${styles.line} ${styles.eyebrow}`} />
        <div className={`${styles.line} ${styles.heading}`} />
        <div className={`${styles.line} ${styles.text}`} />
        <div className={styles.grid}>
          <div className={styles.card} />
          <div className={styles.card} />
          <div className={styles.card} />
        </div>
      </div>
      <span className={styles.srOnly} role="status">
        Loading…
      </span>
    </Container>
  );
}
