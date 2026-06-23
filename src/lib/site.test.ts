import { describe, expect, it } from "vitest";
import { nav } from "./site";

describe("navigation", () => {
  it("uses absolute, root-relative hrefs", () => {
    for (const item of nav) {
      expect(item.href.startsWith("/")).toBe(true);
    }
  });

  it("has no duplicate routes or labels", () => {
    expect(new Set(nav.map((n) => n.href)).size).toBe(nav.length);
    expect(new Set(nav.map((n) => n.label)).size).toBe(nav.length);
  });
});
