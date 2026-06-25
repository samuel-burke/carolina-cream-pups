import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, Button, Card, ImageBox, Steps } from "@/components/ui";
import { WaitlistCard } from "@/components/sections/WaitlistCard";
import { Faq } from "@/components/sections/Faq";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { FaqJsonLd } from "@/components/seo/FaqJsonLd";
import { getFaqs, getReserve } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reserve a Puppy",
  description:
    "Reserve an English Cream Golden Retriever by joining our male or female waitlist. See the current litter, its parents, and where each list stands. Your position is your pick order.",
  alternates: { canonical: "/reserve" },
};

const process = [
  { head: "Apply", body: "Tell us about your home. There's no deposit to apply; it just helps us find the right fit." },
  { head: "Join a list", body: "Choose the male or female waitlist; a deposit holds your numbered spot in line." },
  { head: "Litter arrives", body: "When the puppies are born, we contact families in list order as their turn comes up." },
  { head: "Pick & go home", body: "1st on the male list gets first pick of the males (same for females). Puppies go home at 8 weeks." },
];

export default async function ReservePage() {
  const reserve = await getReserve();
  const faqs = await getFaqs();
  const { pairing, waitlists } = reserve;

  return (
    <>
      <Breadcrumbs href="/reserve" />
      <FaqJsonLd faqs={faqs} />
      <Section>
        <Eyebrow>Reserve a puppy</Eyebrow>
        <Heading level={1}>Join the waitlist.</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 620 }}>
          {reserve.summary}
        </Text>
      </Section>

      {/* Litter information + parent pairing */}
      <Section flushTop>
        <Card>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
            <Heading level={2}>{reserve.title}</Heading>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--size-xs)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--color-sage-deep)",
              }}
            >
              {reserve.status === "born" ? "Born" : "Expected"}
            </span>
          </div>
          <Text muted style={{ marginTop: "0.5rem" }}>
            {reserve.timingLabel}
            {reserve.counts ? ` · ${reserve.counts}` : ""}
          </Text>

          <Grid cols={2} gap={3} style={{ marginTop: "1.5rem", alignItems: "start" }}>
            {[
              { role: "Dam", name: pairing.damName, image: pairing.damImage },
              { role: "Sire", name: pairing.sireName, image: pairing.sireImage },
            ].map((p) => (
              <div key={p.role} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: 96, flexShrink: 0 }}>
                  <ImageBox image={p.image} ratio="1/1" sizes="96px" />
                </div>
                <div>
                  <Text muted style={{ fontSize: "var(--size-xs)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {p.role}
                  </Text>
                  <Text style={{ fontWeight: 600 }}>{p.name}</Text>
                </div>
              </div>
            ))}
          </Grid>

          <div style={{ marginTop: "1.5rem" }}>
            <Button href="/parents" variant="ghost">
              Meet the parents
            </Button>
          </div>
        </Card>
      </Section>

      {/* Waitlist status */}
      <Section surface>
        <Eyebrow>Waitlist status</Eyebrow>
        <Heading level={2} style={{ marginBottom: "0.75rem" }}>
          Two lists: male and female.
        </Heading>
        <Text muted style={{ maxWidth: 620, marginBottom: "2rem" }}>
          Your number on a list is your pick order. The 1st spot on the male list gets first pick of
          the available males; the 1st on the female list, first pick of the females.
        </Text>
        <Grid cols={2}>
          <WaitlistCard waitlist={waitlists.male} />
          <WaitlistCard waitlist={waitlists.female} />
        </Grid>
        <div style={{ marginTop: "2rem" }}>
          <Button href="/contact">Join a waitlist</Button>
        </div>
      </Section>

      {/* How reserving works */}
      <Section>
        <Eyebrow>How reserving works</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2rem" }}>
          A simple, no-pressure process.
        </Heading>
        <Steps steps={process} cols={4} />
      </Section>

      {/* FAQ */}
      <Section surface>
        <Eyebrow>Questions</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2rem" }}>
          Frequently asked questions.
        </Heading>
        <Faq faqs={faqs} />
      </Section>
    </>
  );
}
