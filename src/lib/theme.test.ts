import { describe, expect, it } from "vitest";
import { cssVariables, space, theme } from "./theme";

describe("space()", () => {
  it("maps the 8px grid to rem", () => {
    expect(space(0)).toBe("0rem");
    expect(space(1)).toBe("0.5rem");
    expect(space(3)).toBe("1.5rem");
  });
});

describe("cssVariables()", () => {
  const css = cssVariables();

  it("emits a single :root block", () => {
    expect(css.startsWith(":root{")).toBe(true);
    expect(css.endsWith("}")).toBe(true);
  });

  it("includes every color token as a kebab-cased custom property", () => {
    for (const key of Object.keys(theme.color)) {
      const kebab = key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
      expect(css).toContain(`--color-${kebab}:`);
    }
  });

  it("exposes font, size, radius, and layout tokens", () => {
    expect(css).toContain("--font-display:");
    expect(css).toContain("--size-hero:");
    expect(css).toContain("--radius-pill:");
    expect(css).toContain("--max-width:");
    expect(css).toContain("--breakpoint:");
  });
});
