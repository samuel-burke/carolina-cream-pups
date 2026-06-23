import type { CSSProperties, ReactNode } from "react";
import styles from "./Grid.module.css";

type Props = {
  children: ReactNode;
  /** Column count at desktop width. Collapses to a single column on mobile. */
  cols: 2 | 3 | 4;
  /** Gap in rem (8px grid: 3 = 1.5rem). Defaults to 1.5rem / 2rem responsive. */
  gap?: number;
  /** Override grid-template-columns at desktop (e.g. "1.2fr 1fr"). */
  templateDesktop?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Responsive grid. One column under 768px; `cols` columns at/above it.
 * `templateDesktop` overrides the equal-fraction default for asymmetric layouts.
 */
export function Grid({ children, cols, gap, templateDesktop, className, style }: Props) {
  const vars: CSSProperties & Record<string, string | number> = {
    "--grid-cols": cols,
    ...(templateDesktop ? { "--grid-template": templateDesktop } : {}),
    ...(gap != null ? { "--grid-gap": `${gap * 0.5}rem` } : {}),
    ...style,
  };
  return (
    <div className={[styles.grid, className].filter(Boolean).join(" ")} style={vars}>
      {children}
    </div>
  );
}
