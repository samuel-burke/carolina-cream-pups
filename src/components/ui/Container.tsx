import type { CSSProperties, ReactNode } from "react";
import styles from "./Container.module.css";

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/** Centers content and applies the responsive max-width + horizontal gutter. */
export function Container({ children, className, style }: Props) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")} style={style}>
      {children}
    </div>
  );
}
