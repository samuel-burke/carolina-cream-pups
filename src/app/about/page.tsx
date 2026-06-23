import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, ImageBox, Steps } from "@/components/ui";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getAboutContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "How we raise our English Cream Golden Retrievers — in our home, with our family, following an intentional eight-week head start for every puppy.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const about = await getAboutContent();
  const { intro, timeline } = about;

  return (
    <>
      <Breadcrumbs href="/about" />
      <Section>
        <Eyebrow>{about.eyebrow}</Eyebrow>
        <Heading level={1} style={{ maxWidth: 700 }}>
          {about.heading}
        </Heading>
      </Section>

      <Section flushTop>
        <Grid cols={2} gap={5} templateDesktop="1.2fr 1fr" style={{ alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <Text style={{ fontSize: "var(--size-lg)", lineHeight: 1.6 }}>{intro.lead}</Text>
            {intro.paragraphs.map((p) => (
              <Text key={p} muted>
                {p}
              </Text>
            ))}
          </div>
          <ImageBox image={intro.image} ratio="3/4" sizes="(max-width: 768px) 100vw, 40vw" />
        </Grid>
      </Section>

      {/* Timeline — the centerpiece: proof of method */}
      <Section surface>
        <Eyebrow>{timeline.eyebrow}</Eyebrow>
        <Heading level={2} style={{ maxWidth: 640 }}>
          {timeline.heading}
        </Heading>
        <Text muted style={{ marginTop: "1rem", marginBottom: "2.5rem", maxWidth: 560 }}>
          {timeline.body}
        </Text>
        <Steps steps={timeline.steps} cols={4} />
      </Section>
    </>
  );
}
