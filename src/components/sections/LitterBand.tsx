import Link from "next/link";
import { Container, Text } from "@/components/ui";
import { litterStatus } from "@/lib/site";
import styles from "./LitterBand.module.css";

/** Sage status band that answers the #1 visitor question: any puppies available? */
export function LitterBand() {
  return (
    <div className={styles.band}>
      <Container className={styles.inner}>
        <div className={styles.status}>
          <span aria-hidden className={styles.dot} />
          <Text className={styles.headline}>{litterStatus.headline}</Text>
          <Text className={styles.detail}>{litterStatus.detail}</Text>
        </div>
        <Link href={litterStatus.ctaHref} className={styles.cta}>
          {litterStatus.ctaLabel} →
        </Link>
      </Container>
    </div>
  );
}
