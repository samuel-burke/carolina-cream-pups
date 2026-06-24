import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, Card, ImageBox } from "@/components/ui";
import { ContactForm } from "@/components/sections/ContactForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { images } from "@/lib/images";
import { site, socialLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name} in ${site.location.city}, ${site.location.region}. We typically reply within a day and are always happy to arrange a visit to meet the dogs.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const socials = socialLinks();
  return (
    <>
      <Breadcrumbs href="/contact" />
      <Section>
        <Eyebrow>Contact</Eyebrow>
        <Heading level={1}>Let&apos;s talk.</Heading>
      </Section>

      <Section flushTop>
        <Grid cols={2} gap={5}>
          <Card>
            <ContactForm />
          </Card>
          <div>
            <Heading level={3}>{site.name}</Heading>
            <Text muted style={{ marginTop: "1rem" }}>
              {site.location.city}, {site.location.region}
            </Text>
            <Text muted style={{ marginTop: "0.5rem" }}>
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
            </Text>
            {site.contact.phone ? (
              <Text muted style={{ marginTop: "0.5rem" }}>
                <a href={`tel:${site.contact.phone}`}>{site.contact.phone}</a>
              </Text>
            ) : null}
            {socials.length > 0 ? (
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem" }}>
                {socials.map((s) => (
                  <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1.25rem",
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <Text style={{ fontWeight: 600 }}>We&apos;re real people, and we answer.</Text>
              <Text muted style={{ marginTop: "0.5rem", fontSize: "var(--size-sm)" }}>
                We typically reply within a day. We&apos;re always happy to talk, answer questions,
                and arrange a visit to meet the dogs before you decide.
              </Text>
            </div>
            <ImageBox
              image={images.contactMap}
              ratio="4/3"
              style={{ marginTop: "1.5rem" }}
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </Grid>
      </Section>
    </>
  );
}
