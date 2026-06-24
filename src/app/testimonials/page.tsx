import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, Button } from "@/components/ui";
import { TestimonialCard } from "@/components/sections/TestimonialCard";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { ReviewsJsonLd } from "@/components/seo/ReviewsJsonLd";
import { getTestimonials } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "What families say about their English Cream Golden Retrievers from Carolina Cream Pups — temperament, health, and lifetime breeder support.",
  alternates: { canonical: "/testimonials" },
};

export default async function TestimonialsPage() {
  const t = await getTestimonials();

  return (
    <>
      <Breadcrumbs href="/testimonials" />
      <ReviewsJsonLd testimonials={t.items} />

      <Section>
        <Eyebrow>{t.eyebrow}</Eyebrow>
        <Heading level={1}>{t.heading}</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 560 }}>
          {t.intro}
        </Text>
      </Section>

      <Section flushTop>
        <Grid cols={2}>
          {t.items.map((item, i) => (
            <TestimonialCard key={i} testimonial={item} />
          ))}
        </Grid>
      </Section>

      <Section surface>
        <Eyebrow>Ready when you are</Eyebrow>
        <Heading level={2}>Join a waitlist for an upcoming litter.</Heading>
        <Text muted style={{ marginTop: "0.75rem", maxWidth: 460 }}>
          A short application helps us match the right puppy to your home. No deposit to apply.
        </Text>
        <div style={{ marginTop: "1.5rem" }}>
          <Button href="/reserve">See the waitlists</Button>
        </div>
      </Section>
    </>
  );
}
