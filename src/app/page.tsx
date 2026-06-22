import { Section, Grid, Eyebrow, Heading, Text, Button, ImageBox, Card, ArchMark } from "@/components/ui";
import { HomeHero } from "@/components/sections/HomeHero";
import { LitterBand } from "@/components/sections/LitterBand";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { images } from "@/lib/images";

const differentiators = [
  {
    image: images.diffPuppyCulture,
    title: "Puppy Culture, start to finish",
    body: "A complete 12-week program — calmer, more confident, easier to train puppies. Most breeders don't do this. We do all of it.",
  },
  {
    image: images.diffHealthTested,
    title: "Both parents health tested",
    body: "OFA hips, elbows, heart, and eyes, plus full genetic panels. The clearances are on the parents' page — not just promised.",
  },
  {
    image: images.diffEns,
    title: "Early Neurological Stimulation from day 3",
    body: "A few minutes of gentle handling each day in the first weeks builds resilience that lasts a lifetime.",
  },
];

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <LitterBand />

      {/* Intro split — the personal story, given real weight */}
      <Section>
        <Grid cols={2} gap={5} templateDesktop="1fr 1fr" style={{ alignItems: "center" }}>
          <div>
            <Eyebrow>Hey y&apos;all</Eyebrow>
            <Heading level={2}>We&apos;re a family raising goldens underfoot — not a kennel.</Heading>
            <ArchMark />
            <Text muted style={{ marginTop: "0.5rem" }}>
              Your story in two or three sentences — who you are, how long you&apos;ve done this, and
              the one belief that shapes how you raise every litter.
            </Text>
            <div style={{ marginTop: "1.5rem" }}>
              <Button href="/about" variant="ghost">
                Read our story
              </Button>
            </div>
          </div>
          <ImageBox image={images.breederHome} ratio="4/5" sizes="(max-width: 768px) 100vw, 45vw" />
        </Grid>
      </Section>

      {/* Differentiators — substantial alternating rows */}
      <Section surface>
        <Eyebrow>Why families choose us</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2.5rem" }}>
          Three things that set our puppies apart.
        </Heading>
        {differentiators.map((d, i) => (
          <FeatureRow key={d.title} {...d} reverse={i % 2 === 1} />
        ))}
      </Section>

      {/* Final CTA */}
      <Section>
        <Card surface style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <Eyebrow>Ready when you are</Eyebrow>
          <Heading level={2}>Join the waitlist for an upcoming litter.</Heading>
          <Text muted style={{ marginTop: "0.75rem", maxWidth: 460, margin: "0.75rem auto 0" }}>
            A short application helps us match the right puppy to your home. No deposit to apply.
          </Text>
          <div style={{ marginTop: "1.5rem" }}>
            <Button href="/contact">Start your application</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
