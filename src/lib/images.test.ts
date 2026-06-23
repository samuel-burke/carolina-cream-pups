import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { images } from "./images";

const PUBLIC = join(process.cwd(), "public");

describe("image manifest", () => {
  for (const [key, asset] of Object.entries(images)) {
    const isRemote = /^https?:\/\//.test(asset.src);
    describe(key, () => {
      it(isRemote ? "uses an absolute CDN URL" : "points at a file that exists in /public", () => {
        if (isRemote) {
          expect(() => new URL(asset.src)).not.toThrow();
        } else {
          expect(existsSync(join(PUBLIC, asset.src))).toBe(true);
        }
      });

      it("has non-empty descriptive alt text", () => {
        expect(asset.alt.trim().length).toBeGreaterThan(0);
      });

      it("declares positive intrinsic dimensions", () => {
        expect(asset.width).toBeGreaterThan(0);
        expect(asset.height).toBeGreaterThan(0);
      });
    });
  }
});
