/**
 * THEME KIT — design tokens (single source of truth).
 *
 * These values are emitted as CSS custom properties at the document root (see
 * `cssVariables()` consumed in `app/layout.tsx`). Components reference them via
 * `var(--token)` in CSS Modules, so re-theming the entire site = edit this file.
 *
 * The TS object is also exported for the rare case JS needs a raw value
 * (e.g. computing an inline gradient). Prefer the CSS variables in components.
 */

export const breakpointPx = 768;

export const theme = {
  color: {
    bg: "#FAF7F2",
    surface: "#F5EFE6",
    line: "#E4DACA",
    placeholder: "#E9E1D3",
    text: "#3A352E",
    textOn: "#FFFDF8", // text on dark/photo backgrounds
    muted: "#8C857A",
    sage: "#8A9A85",
    sageDeep: "#6E7E69",
    taupe: "#B7A892",
  },
  font: {
    display: "'Cormorant Garamond', Georgia, serif",
    body: "'Inter', system-ui, sans-serif",
  },
  /**
   * Fluid type scale using clamp() so sizes flex between mobile and desktop
   * without JS width detection. [minPx, maxPx] -> clamp(min, fluid, max).
   */
  size: {
    xs: "0.75rem", // 12
    sm: "0.875rem", // 14
    base: "1rem", // 16
    lg: "1.25rem", // 20
    xl: "clamp(1.375rem, 1.1rem + 1.4vw, 1.75rem)", // 22 -> 28
    xxl: "clamp(1.875rem, 1.4rem + 2.4vw, 2.5rem)", // 30 -> 40
    hero: "clamp(2.375rem, 1.4rem + 4.9vw, 3.5rem)", // 38 -> 56
    mega: "clamp(4rem, 2rem + 10vw, 6.5rem)", // 64 -> 104
  },
  radius: {
    sm: "6px",
    md: "12px",
    lg: "20px",
    pill: "999px",
  },
  maxWidth: "1120px",
} as const;

/** Spacing helper — 8px base grid. Returns a rem string. */
export const space = (n: number): string => `${n * 0.5}rem`;

/** Emits the token set as a `:root { ... }` CSS custom-property block. */
export function cssVariables(): string {
  const lines: string[] = [];
  for (const [k, v] of Object.entries(theme.color)) {
    lines.push(`--color-${kebab(k)}: ${v};`);
  }
  lines.push(`--font-display: ${theme.font.display};`);
  lines.push(`--font-body: ${theme.font.body};`);
  for (const [k, v] of Object.entries(theme.size)) {
    lines.push(`--size-${k}: ${v};`);
  }
  for (const [k, v] of Object.entries(theme.radius)) {
    lines.push(`--radius-${k}: ${v};`);
  }
  lines.push(`--max-width: ${theme.maxWidth};`);
  lines.push(`--breakpoint: ${breakpointPx}px;`);
  return `:root{${lines.join("")}}`;
}

function kebab(s: string): string {
  return s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}
