import { Section, Eyebrow, Heading, Text, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <Section>
      <Eyebrow>Page not found</Eyebrow>
      <Heading level={1} style={{ maxWidth: 600 }}>
        We couldn&apos;t find that page.
      </Heading>
      <Text muted style={{ marginTop: "1rem", maxWidth: 520 }}>
        The link may be old or mistyped. Let&apos;s get you back to the puppies.
      </Text>
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Button href="/">Back home</Button>
        <Button href="/reserve" variant="ghost">
          See available puppies
        </Button>
      </div>
    </Section>
  );
}
