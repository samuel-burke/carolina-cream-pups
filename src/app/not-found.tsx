import Link from "next/link";
import { Section, Eyebrow, Heading, Text, Button } from "@/components/ui";

const popular = [
  { href: "/reserve", label: "Reserve a puppy" },
  { href: "/parents", label: "Meet the parents" },
  { href: "/gallery", label: "Photo gallery" },
  { href: "/contact", label: "Contact us" },
];

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

      <Text muted style={{ marginTop: "2.5rem", fontSize: "var(--size-sm)" }}>
        Or try one of these:
      </Text>
      <ul
        style={{
          margin: "0.75rem 0 0",
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem 1.25rem",
        }}
      >
        {popular.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              style={{
                color: "var(--color-sage-deep)",
                fontWeight: 600,
                borderBottom: "1px solid var(--color-sage)",
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
