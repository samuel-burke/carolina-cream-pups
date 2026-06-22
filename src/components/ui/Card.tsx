import type { CSSProperties, ReactNode } from "react";
import styles from "./Card.module.css";

type Props = {
  children: ReactNode;
  /** Removes default padding (for cards that contain an edge-to-edge image). */
  flush?: boolean;
  /** Surface fill with no border (used for CTA panels). */
  surface?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function Card({ children, flush, surface, className, style }: Props) {
  const cls = [styles.card, flush ? styles.flush : "", surface ? styles.surface : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}
