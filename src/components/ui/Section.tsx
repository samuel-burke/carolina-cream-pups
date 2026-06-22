import type { CSSProperties, ReactNode } from "react";
import { Container } from "./Container";
import styles from "./Section.module.css";

type Props = {
  children: ReactNode;
  /** Surface-tinted background band. */
  surface?: boolean;
  /** Reduced vertical padding. */
  compact?: boolean;
  /** Remove top padding (to butt against the previous section). */
  flushTop?: boolean;
  /** Optional landmark id for in-page anchors. */
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export function Section({ children, surface, compact, flushTop, id, className, style }: Props) {
  const cls = [
    styles.section,
    "fade-up",
    surface ? styles.surface : "",
    compact ? styles.compact : "",
    flushTop ? styles.flushTop : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <section id={id} className={cls} style={style}>
      <Container>{children}</Container>
    </section>
  );
}
