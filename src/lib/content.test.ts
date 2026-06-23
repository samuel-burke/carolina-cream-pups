import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ImageAsset } from "./images";
import {
  getAboutContent,
  getFaqs,
  getGallery,
  getHomeContent,
  getLitter,
  getLitterStatus,
  getParentsContent,
} from "./content";

const PUBLIC = join(process.cwd(), "public");

/** Every image embedded in content must resolve to a real file with alt text. */
function expectValidImage(img: ImageAsset) {
  expect(img.alt.trim().length).toBeGreaterThan(0);
  expect(img.width).toBeGreaterThan(0);
  expect(img.height).toBeGreaterThan(0);
  expect(existsSync(join(PUBLIC, img.src))).toBe(true);
}

describe("getHomeContent()", () => {
  it("returns hero, intro, differentiators, and final CTA with valid images", async () => {
    const home = await getHomeContent();
    expectValidImage(home.hero.image);
    expectValidImage(home.intro.image);
    expect(home.hero.cta.href.startsWith("/")).toBe(true);
    expect(home.differentiators.items.length).toBeGreaterThan(0);
    for (const item of home.differentiators.items) {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expectValidImage(item.image);
    }
    expect(home.finalCta.cta.href.startsWith("/")).toBe(true);
  });
});

describe("getAboutContent()", () => {
  it("returns intro copy, an image, and timeline steps", async () => {
    const about = await getAboutContent();
    expect(about.heading.trim().length).toBeGreaterThan(0);
    expectValidImage(about.intro.image);
    expect(about.intro.paragraphs.length).toBeGreaterThan(0);
    expect(about.timeline.steps.length).toBeGreaterThan(0);
  });
});

describe("getParentsContent()", () => {
  it("returns parent profiles with clearances, images, and pairing points", async () => {
    const content = await getParentsContent();
    expect(content.parents.length).toBe(3);
    for (const p of content.parents) {
      expect(p.clearances.length).toBeGreaterThan(0);
      expectValidImage(p.image);
    }
    expect(content.pairing.points.length).toBeGreaterThan(0);
  });
});

describe("getLitter() & getLitterStatus()", () => {
  it("returns puppies with names, notes, and valid images", async () => {
    const litter = await getLitter();
    expect(litter.puppies.length).toBeGreaterThan(0);
    for (const puppy of litter.puppies) {
      expect(puppy.name.trim().length).toBeGreaterThan(0);
      expect(puppy.note.trim().length).toBeGreaterThan(0);
      expectValidImage(puppy.image);
    }
  });

  it("returns a status band with a root-relative CTA", async () => {
    const status = await getLitterStatus();
    expect(status.headline.trim().length).toBeGreaterThan(0);
    expect(status.cta.href.startsWith("/")).toBe(true);
  });
});

describe("getGallery()", () => {
  it("returns litter photos and alumni with valid images", async () => {
    const gallery = await getGallery();
    expect(gallery.litter.images.length).toBeGreaterThan(0);
    for (const { image } of gallery.litter.images) expectValidImage(image);
    expect(gallery.alumni.members.length).toBeGreaterThan(0);
    for (const m of gallery.alumni.members) expectValidImage(m.image);
  });
});

describe("getFaqs()", () => {
  it("returns non-empty question/answer pairs", async () => {
    const faqs = await getFaqs();
    expect(faqs.length).toBeGreaterThan(0);
    for (const f of faqs) {
      expect(f.question.trim().length).toBeGreaterThan(0);
      expect(f.answer.trim().length).toBeGreaterThan(0);
    }
  });
});
