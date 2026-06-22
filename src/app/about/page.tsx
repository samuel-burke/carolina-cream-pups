import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, ImageBox, Steps } from "@/components/ui";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "How we raise our English Cream Golden Retrievers — in our home, with our family, following an intentional eight-week head start for every puppy.",
  alternates: { canonical: "/about" },
};

const timeline = [
  { head: "Days 1–3 · ENS begins", body: "Gentle daily handling builds early resilience." },
  { head: "Week 4 · Weaning pen", body: "More space, a potty area, and new textures to explore." },
  { head: "Weeks 5–7 · Training", body: "Come, sit, leash, crate time, and lots of calm affection." },
  { head: "Week 8 · Vet & home", body: "First vaccines, deworming, vet check — ready to go home." },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs href="/about" />
      <Section>
        <Eyebrow>About us</Eyebrow>
        <Heading level={1} style={{ maxWidth: 700 }}>
          Who we are, and how we raise them.
        </Heading>
      </Section>

      <Section flushTop>
        <Grid cols={2} gap={5} templateDesktop="1.2fr 1fr" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Text style={{ fontSize: "var(--size-lg)", lineHeight: 1.6 }}>
              We started raising English Cream Goldens because we wanted to do it the right way — in
              our home, with our kids, our cats, and a few farm animals underfoot.
            </Text>
            <Text muted>
              Your origin story continues — how long you&apos;ve done this, what you&apos;ve learned,
              the standard you hold yourself to.
            </Text>
            <Text muted>
              What a family can expect from you: communication, lifetime support, and a puppy raised
              for temperament first.
            </Text>
          </div>
          <ImageBox image={images.aboutPortrait} ratio="3/4" sizes="(max-width: 768px) 100vw, 40vw" />
        </Grid>
      </Section>

      {/* Timeline — the centerpiece: proof of method */}
      <Section surface>
        <Eyebrow>The first eight weeks</Eyebrow>
        <Heading level={2} style={{ maxWidth: 640 }}>
          Every puppy follows the same intentional head start.
        </Heading>
        <Text muted style={{ marginTop: "1rem", marginBottom: "2.5rem", maxWidth: 560 }}>
          This is the part most people never see — and it&apos;s the difference between a puppy
          that&apos;s merely cute and one that&apos;s genuinely ready for your home.
        </Text>
        <Steps steps={timeline} cols={4} />
      </Section>
    </>
  );
}
