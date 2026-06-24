import type { Metadata } from "next";
import { Section, Eyebrow, Heading, Text, Button } from "@/components/ui";
import { Faq } from "@/components/sections/Faq";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { getFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about reserving an English Cream Golden Retriever from Carolina Cream Pups — waitlists, health testing, what's included, and going home.",
  alternates: { canonical: "/faq" },
};

export default async function FaqPage() {
  const faqs = await getFaqs();

  return (
    <>
      <Breadcrumbs href="/faq" />
      <Section>
        <Eyebrow>Questions</Eyebrow>
        <Heading level={1}>Frequently asked questions.</Heading>
        <Text muted style={{ marginTop: "1rem", maxWidth: 560 }}>
          Everything families usually ask before joining a waitlist. Still have a
          question? We&apos;re happy to help.
        </Text>
      </Section>

      <Section flushTop>
        <Faq faqs={faqs} />
        <div style={{ marginTop: "2rem" }}>
          <Button href="/contact">Ask us anything</Button>
        </div>
      </Section>
    </>
  );
}
