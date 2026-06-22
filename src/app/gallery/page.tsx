import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, ImageBox } from "@/components/ui";
import { Masonry } from "@/components/sections/Masonry";
import { images } from "@/lib/images";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photos of our recent English Cream Golden Retriever litters — and past puppies all grown up with their families across North Carolina.",
  alternates: { canonical: "/gallery" },
};

const springLitter = [
  { image: images.gallery1, ratio: "4/5" },
  { image: images.gallery2, ratio: "1/1" },
  { image: images.gallery3, ratio: "3/4" },
  { image: images.gallery4, ratio: "4/3" },
  { image: images.gallery5, ratio: "1/1" },
  { image: images.gallery6, ratio: "3/4" },
];

const alumni = [
  { image: images.alumniLuna, name: "Luna", caption: "Two years old · Charlotte, NC" },
  { image: images.alumniCooper, name: "Cooper", caption: "Therapy dog · Raleigh, NC" },
  { image: images.alumniDaisy, name: "Daisy", caption: "Three years old · the Outer Banks" },
];

export default function GalleryPage() {
  return (
    <>
      <Section>
        <Eyebrow>Photo gallery</Eyebrow>
        <Heading level={1}>Our litters, and where they are now.</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 560 }}>
          Browse recent litters — and meet some of our past puppies all grown up with their
          families.
        </Text>
      </Section>

      <Section flushTop>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "1rem",
          }}
        >
          <Heading level={3}>Spring 2026 litter</Heading>
          <Text muted style={{ fontSize: "var(--size-sm)" }}>
            Born March 2nd
          </Text>
        </div>
        <div style={{ marginTop: "1.25rem" }}>
          <Masonry items={springLitter} />
        </div>
      </Section>

      {/* Alumni — "where they are now" does real trust work */}
      <Section surface>
        <Eyebrow>Where they are now</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2rem", maxWidth: 600 }}>
          Our puppies, grown up and home.
        </Heading>
        <Grid cols={3}>
          {alumni.map(({ image, name, caption }) => (
            <div key={name}>
              <ImageBox image={image} ratio="1/1" sizes="(max-width: 768px) 100vw, 33vw" />
              <Text style={{ fontWeight: 600, marginTop: "0.75rem" }}>{name}</Text>
              <Text muted style={{ fontSize: "var(--size-sm)" }}>
                {caption}
              </Text>
            </div>
          ))}
        </Grid>
      </Section>
    </>
  );
}
