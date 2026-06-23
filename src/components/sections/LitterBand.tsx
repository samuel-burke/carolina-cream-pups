import Link from "next/link";
import { Container, Text } from "@/components/ui";
import type { LitterStatus } from "@/lib/content-types";
import styles from "./LitterBand.module.css";

/** Sage status band that answers the #1 visitor question: any puppies available? */
export function LitterBand({ status }: { status: LitterStatus }) {
  return (
    <div className={styles.band}>
      <Container className={styles.inner}>
        <div className={styles.status}>
          <span aria-hidden className={styles.dot} />
          <Text className={styles.headline}>{status.headline}</Text>
          <Text className={styles.detail}>{status.detail}</Text>
        </div>
        <Link href={status.cta.href} className={styles.cta}>
          {status.cta.label} →
        </Link>
      </Container>
    </div>
  );
}
