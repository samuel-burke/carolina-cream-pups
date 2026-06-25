import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, Card, Button, ImageBox, Steps } from "@/components/ui";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getGoingHomeContent } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Going Home",
  description: `What comes home with every ${site.name} puppy — vet check, vaccinations, microchip, AKC paperwork, a one-year health guarantee, and a starter kit — plus how to prepare and what to expect the first days.`,
  alternates: { canonical: "/going-home" },
};

export default async function GoingHomePage() {
  const content = await getGoingHomeContent();
  const { included, prepare, firstDays, support, cta } = content;

  return (
    <>
      <Breadcrumbs href="/going-home" />
      <Section>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading level={1} style={{ maxWidth: 720 }}>
          {content.heading}
        </Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 600 }}>
          {content.intro}
        </Text>
      </Section>

      {/* What's included */}
      <Section flushTop>
        <Eyebrow>{included.eyebrow}</Eyebrow>
        <Heading level={2} style={{ maxWidth: 560, marginBottom: "2rem" }}>
          {included.heading}
        </Heading>
        <Grid cols={3} gap={4}>
          {included.items.map((item) => (
            <Card key={item.title}>
              <Heading level={4}>{item.title}</Heading>
              <Text muted style={{ marginTop: "0.5rem", fontSize: "var(--size-sm)" }}>
                {item.body}
              </Text>
            </Card>
          ))}
        </Grid>
      </Section>

      {/* How to prepare */}
      <Section surface>
        <Eyebrow>{prepare.eyebrow}</Eyebrow>
        <Heading level={2} style={{ maxWidth: 560 }}>
          {prepare.heading}
        </Heading>
        <Text muted style={{ marginTop: "1rem", marginBottom: "2.5rem", maxWidth: 560 }}>
          {prepare.body}
        </Text>
        <Steps steps={prepare.steps} cols={4} />
      </Section>

      {/* The first days home */}
      <Section>
        <Grid cols={2} gap={5} templateDesktop="1fr 1.1fr" style={{ alignItems: "center" }}>
          <ImageBox image={firstDays.image} ratio="4/3" sizes="(max-width: 768px) 100vw, 45vw" />
          <div>
            <Eyebrow>{firstDays.eyebrow}</Eyebrow>
            <Heading level={2} style={{ maxWidth: 480 }}>
              {firstDays.heading}
            </Heading>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
              {firstDays.paragraphs.map((p) => (
                <Text key={p} muted>
                  {p}
                </Text>
              ))}
            </div>
          </div>
        </Grid>
      </Section>

      {/* Lifetime support */}
      <Section surface>
        <Eyebrow>{support.eyebrow}</Eyebrow>
        <Heading level={2} style={{ maxWidth: 480 }}>
          {support.heading}
        </Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 600 }}>
          {support.body}
        </Text>
      </Section>

      {/* Final CTA */}
      <Section>
        <Card surface style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <Eyebrow>{cta.eyebrow}</Eyebrow>
          <Heading level={2}>{cta.heading}</Heading>
          <Text muted style={{ marginTop: "0.75rem", maxWidth: 460, margin: "0.75rem auto 0" }}>
            {cta.body}
          </Text>
          <div style={{ marginTop: "1.5rem" }}>
            <Button href={cta.cta.href}>{cta.cta.label}</Button>
          </div>
        </Card>
      </Section>
    </>
  );
}
