import { Section, Grid, Eyebrow, Heading, Text, Button, ImageBox, Card, ArchMark } from "@/components/ui";
import { HomeHero } from "@/components/sections/HomeHero";
import { LitterBand } from "@/components/sections/LitterBand";
import { FeatureRow } from "@/components/sections/FeatureRow";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { getHomeContent, getLitterStatus, getTestimonials } from "@/lib/content";

export default async function HomePage() {
  const home = await getHomeContent();
  const status = await getLitterStatus();
  const testimonials = await getTestimonials();
  const featured = testimonials.items.slice(0, 3);
  const { intro, differentiators, finalCta } = home;

  return (
    <>
      <HomeHero hero={home.hero} />
      <LitterBand status={status} />

      {/* Intro split — the personal story, given real weight */}
      <Section>
        <Grid cols={2} gap={5} templateDesktop="1fr 1fr" style={{ alignItems: "center" }}>
          <div>
            <Eyebrow>{intro.eyebrow}</Eyebrow>
            <Heading level={2}>{intro.heading}</Heading>
            <ArchMark />
            <Text muted style={{ marginTop: "0.5rem" }}>
              {intro.body}
            </Text>
            <div style={{ marginTop: "1.5rem" }}>
              <Button href={intro.cta.href} variant="ghost">
                {intro.cta.label}
              </Button>
            </div>
          </div>
          <ImageBox image={intro.image} ratio="4/5" sizes="(max-width: 768px) 100vw, 45vw" />
        </Grid>
      </Section>

      {/* Differentiators — substantial alternating rows */}
      <Section surface>
        <Eyebrow>{differentiators.eyebrow}</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2.5rem" }}>
          {differentiators.heading}
        </Heading>
        {differentiators.items.map((d, i) => (
          <FeatureRow key={d.title} {...d} reverse={i % 2 === 1} />
        ))}
      </Section>

      {/* Testimonials teaser */}
      <Section>
        <Eyebrow>{testimonials.eyebrow}</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2.5rem" }}>
          {testimonials.heading}
        </Heading>
        <Grid cols={3}>
          {featured.map((item, i) => (
            <TestimonialCard key={i} testimonial={item} />
          ))}
        </Grid>
        <div style={{ marginTop: "2rem" }}>
          <Button href="/testimonials" variant="ghost">
            Read more testimonials
          </Button>
        </div>
      </Section>

      {/* Final CTA */}
      <Section>
        <Card surface style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <Eyebrow>{finalCta.eyebrow}</Eyebrow>
          <Heading level={2}>{finalCta.heading}</Heading>
          <Text muted style={{ marginTop: "0.75rem", maxWidth: 460, margin: "0.75rem auto 0" }}>
            {finalCta.body}
          </Text>
          <div style={{ marginTop: "1.5rem" }}>
            <Button href={finalCta.cta.href}>{finalCta.cta.label}</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
