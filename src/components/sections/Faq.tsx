import type { Faq as FaqItem } from "@/lib/content-types";
import styles from "./Faq.module.css";

/**
 * FAQ accordion built on native <details>/<summary> — works without JS, fully
 * keyboard accessible — plus FAQPage structured data for rich results.
 */
export function Faq({ faqs }: { faqs: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className={styles.list}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      {faqs.map((f) => (
        <details key={f.question} className={styles.item}>
          <summary className={styles.summary}>
            <span>{f.question}</span>
            <span aria-hidden className={styles.icon} />
          </summary>
          <p className={styles.answer}>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
