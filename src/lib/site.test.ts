import { describe, expect, it } from "vitest";
import { images } from "./images";
import { currentLitter, nav } from "./site";

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

describe("current litter", () => {
  it("references image keys that exist in the manifest", () => {
    for (const puppy of currentLitter.puppies) {
      expect(images).toHaveProperty(puppy.imageKey);
    }
  });

  it("gives every puppy a name and note", () => {
    for (const puppy of currentLitter.puppies) {
      expect(puppy.name.trim().length).toBeGreaterThan(0);
      expect(puppy.note.trim().length).toBeGreaterThan(0);
    }
  });
});
