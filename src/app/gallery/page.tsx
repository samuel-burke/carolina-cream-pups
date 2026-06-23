import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, ImageBox } from "@/components/ui";
import { Masonry } from "@/components/sections/Masonry";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Photos of our recent English Cream Golden Retriever litters — and past puppies all grown up with their families across North Carolina.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const gallery = await getGallery();
  const { litter, alumni } = gallery;

  return (
    <>
      <Breadcrumbs href="/gallery" />
      <Section>
        <Eyebrow>{gallery.eyebrow}</Eyebrow>
        <Heading level={1}>{gallery.heading}</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 560 }}>
          {gallery.intro}
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
          <Heading level={3}>{litter.title}</Heading>
          <Text muted style={{ fontSize: "var(--size-sm)" }}>
            {litter.born}
          </Text>
        </div>
        <div style={{ marginTop: "1.25rem" }}>
          <Masonry items={litter.images} />
        </div>
      </Section>

      {/* Alumni — "where they are now" does real trust work */}
      <Section surface>
        <Eyebrow>{alumni.eyebrow}</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2rem", maxWidth: 600 }}>
          {alumni.heading}
        </Heading>
        <Grid cols={3}>
          {alumni.members.map(({ image, name, caption }) => (
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
