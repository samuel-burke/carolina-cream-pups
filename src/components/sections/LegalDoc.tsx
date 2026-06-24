import { Section, Eyebrow, Heading, Text } from "@/components/ui";
import type { LegalDocument } from "@/lib/legal";
import styles from "./LegalDoc.module.css";

/** Renders a legal document (Privacy Policy / Terms) as readable prose. */
export function LegalDoc({ doc }: { doc: LegalDocument }) {
  return (
    <>
      <Section>
        <Eyebrow>Legal</Eyebrow>
        <Heading level={1}>{doc.title}</Heading>
        <Text muted style={{ marginTop: "0.75rem", fontSize: "var(--size-sm)" }}>
          Effective {doc.effectiveDate}
        </Text>
        <Text style={{ marginTop: "1.5rem", maxWidth: 680 }}>{doc.intro}</Text>
      </Section>

      <Section flushTop>
        <div className={styles.body}>
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <Heading level={3} style={{ marginBottom: "0.75rem" }}>
                {s.heading}
              </Heading>
              {s.paragraphs?.map((p) => (
                <Text key={p} muted style={{ marginTop: "0.75rem" }}>
                  {p}
                </Text>
              ))}
              {s.bullets ? (
                <ul className={styles.list}>
                  {s.bullets.map((b) => (
                    <li key={b}>
                      <Text as="span" muted>
                        {b}
                      </Text>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
