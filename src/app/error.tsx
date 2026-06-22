"use client";

import { useEffect } from "react";
import { Section, Eyebrow, Heading, Text, Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook a real error reporter (Sentry, etc.) in here.
    console.error(error);
  }, [error]);

  return (
    <Section>
      <Eyebrow>Something went wrong</Eyebrow>
      <Heading level={1} style={{ maxWidth: 600 }}>
        Sorry — something broke on our end.
      </Heading>
      <Text muted style={{ marginTop: "1rem", maxWidth: 520 }}>
        Please try again. If it keeps happening, reach out and we&apos;ll help.
      </Text>
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <Button onClick={reset}>Try again</Button>
        <Button href="/" variant="ghost">
          Back home
        </Button>
      </div>
    </Section>
  );
}
