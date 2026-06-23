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
        {content.parents.map((p, i) => (
          <ParentProfile key={`${p.role}-${i}`} {...p} />
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

      {/* Health testing & ethics — verifiable proof */}
      <Section>
        <Eyebrow>{content.health.eyebrow}</Eyebrow>
        <Heading level={2} style={{ maxWidth: 640 }}>
          {content.health.heading}
        </Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 620 }}>
          {content.health.body}
        </Text>
        <Grid cols={2} gap={4} style={{ marginTop: "2rem", alignItems: "start" }}>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {content.health.standards.map((s) => (
              <li key={s}>
                <Text as="span">{s}</Text>
              </li>
            ))}
          </ul>
          <div>
            <Text style={{ fontWeight: 600 }}>Verify our dogs</Text>
            <ul style={{ listStyle: "none", margin: "0.5rem 0 0", padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {content.health.links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--color-sage-deep)", fontWeight: 600, borderBottom: "1px solid var(--color-sage)" }}
                  >
                    {l.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Grid>
      </Section>
    </>
  );
}
