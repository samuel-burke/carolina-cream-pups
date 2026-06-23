import styles from "./ArchMark.module.css";

/** Short sage rule used as a subtle divider between heading and body copy. */
export function ArchMark() {
  return <div aria-hidden className={styles.mark} />;
}
