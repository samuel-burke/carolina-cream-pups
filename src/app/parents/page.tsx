import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text } from "@/components/ui";
import { ParentProfile } from "@/components/sections/ParentProfile";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getParentsContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Meet the Parents",
  description:
    "Meet the dam and sire behind our English Cream Golden Retriever puppies — health clearances (OFA hips, elbows, heart, eyes) and temperament you can verify.",
  alternates: { canonical: "/parents" },
};

export default async function ParentsPage() {
  const content = await getParentsContent();
  const { pairing } = content;

  return (
    <>
      <Breadcrumbs href="/parents" />
      <Section>
        <Eyebrow>{content.eyebrow}</Eyebrow>
        <Heading level={1}>{content.heading}</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 600 }}>
          {content.intro}
        </Text>
      </Section>

      <Section flushTop>
        {content.parents.map((p) => (
          <ParentProfile key={p.role} {...p} />
        ))}
      </Section>

      {/* The pairing — what this specific cross produces */}
      <Section surface>
        <Eyebrow>{pairing.eyebrow}</Eyebrow>
        <Heading level={2} style={{ maxWidth: 620 }}>
          {pairing.heading}
        </Heading>
        <Grid cols={3} style={{ marginTop: "2rem" }}>
          {pairing.points.map(({ title, body }) => (
            <div key={title}>
              <Heading level={4}>{title}</Heading>
              <Text muted style={{ marginTop: "0.5rem" }}>
                {body}
              </Text>
            </div>
          ))}
        </Grid>
      </Section>
    </>
  );
}
