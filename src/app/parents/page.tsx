import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text } from "@/components/ui";
import { ParentProfile } from "@/components/sections/ParentProfile";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Meet the Parents",
  description:
    "Meet the dam and sire behind our English Cream Golden Retriever puppies — health clearances (OFA hips, elbows, heart, eyes) and temperament you can verify.",
  alternates: { canonical: "/parents" },
};

const clearances = ["OFA Hips", "Elbows", "Heart", "Eyes", "Genetic Panel"];

const parents = [
  {
    role: "Dam",
    name: "Name",
    description: "Temperament, weight, color, and a sentence on personality and lineage.",
    clearances,
    image: images.parentDam,
  },
  {
    role: "Sire",
    name: "Name",
    description: "Temperament, weight, color, and a sentence on personality and lineage.",
    clearances,
    image: images.parentSire,
  },
];

const pairing = [
  {
    h: "Temperament",
    b: "Calm, biddable, people-oriented — bred for family and therapy-style dispositions.",
  },
  { h: "Conformation", b: "True English Cream type: blocky heads, light coats, sturdy build." },
  {
    h: "Health depth",
    b: "Generations of cleared lines behind both parents, not just the parents themselves.",
  },
];

export default function ParentsPage() {
  return (
    <>
      <Section>
        <Eyebrow>Meet the parents</Eyebrow>
        <Heading level={1}>Our dams &amp; sires.</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 600 }}>
          Health clearances and temperament are everything. Here&apos;s who your puppy comes from —
          and what these two bring together.
        </Text>
      </Section>

      <Section flushTop>
        {parents.map((p) => (
          <ParentProfile key={p.role} {...p} />
        ))}
      </Section>

      {/* The pairing — what this specific cross produces */}
      <Section surface>
        <Eyebrow>The pairing</Eyebrow>
        <Heading level={2} style={{ maxWidth: 620 }}>
          What this cross is bred for.
        </Heading>
        <Grid cols={3} style={{ marginTop: "2rem" }}>
          {pairing.map(({ h, b }) => (
            <div key={h}>
              <Heading level={4}>{h}</Heading>
              <Text muted style={{ marginTop: "0.5rem" }}>
                {b}
              </Text>
            </div>
          ))}
        </Grid>
      </Section>
    </>
  );
}
