import type { Metadata } from "next";
import { Section, Grid, Eyebrow, Heading, Text, Button, Steps } from "@/components/ui";
import { PuppyCard } from "@/components/sections/PuppyCard";
import { currentLitter } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reserve a Puppy",
  description:
    "Meet our current English Cream Golden Retriever litter and learn how reserving works — apply, deposit, pick day, and going home at eight weeks. No deposit to apply.",
  alternates: { canonical: "/reserve" },
};

const process = [
  { head: "Apply", body: "Tell us about your home. No deposit to apply — it just helps us match well." },
  { head: "Deposit", body: "Once we're a fit, a deposit holds your spot in the litter." },
  { head: "Pick", body: "Pick day, in birth order by deposit. We help you choose the right match." },
  { head: "Home", body: "At 8 weeks your puppy goes home, vetted and with a starter kit." },
];

export default function ReservePage() {
  return (
    <>
      <Section>
        <Eyebrow>Reserve a puppy</Eyebrow>
        <Heading level={1}>Meet the {currentLitter.title}.</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 560 }}>
          {currentLitter.readyNote}
        </Text>
      </Section>

      <Section flushTop>
        <Grid cols={3}>
          {currentLitter.puppies.map((p) => (
            <PuppyCard key={p.name} {...p} />
          ))}
        </Grid>
      </Section>

      {/* How reserving works */}
      <Section surface>
        <Eyebrow>How reserving works</Eyebrow>
        <Heading level={2} style={{ marginBottom: "2rem" }}>
          A simple, no-pressure process.
        </Heading>
        <Steps steps={process} cols={4} />
        <div style={{ marginTop: "2rem" }}>
          <Button href="/contact">Start your application</Button>
        </div>
      </Section>
    </>
  );
}
