import type { CSSProperties, ReactNode } from "react";
import styles from "./Typography.module.css";

/** Small italic display label that sits above headings — a typographic signature. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className={styles.eyebrow}>{children}</div>;
}

type HeadingProps = {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/** Display heading. `level` controls both the tag (h1–h4) and the type size. */
export function Heading({ children, level = 2, className, style, id }: HeadingProps) {
  const Tag = `h${level}` as const;
  const sizeClass = styles[`h${level}`];
  return (
    <Tag id={id} className={[styles.heading, sizeClass, className].filter(Boolean).join(" ")} style={style}>
      {children}
    </Tag>
  );
}

type TextProps = {
  children: ReactNode;
  muted?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: "p" | "span" | "div";
};

/** Body copy. `muted` switches to the secondary text color. */
export function Text({ children, muted, className, style, as = "p" }: TextProps) {
  const Tag = as;
  return (
    <Tag
      className={[styles.text, muted ? styles.muted : "", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
