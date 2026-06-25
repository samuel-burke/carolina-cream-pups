import type { Faq } from "@/lib/content-types";

/**
 * FAQPage structured data so the Q&A can earn FAQ rich results in search.
 * Render once per page that shows a list of FAQs.
 */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return null;

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
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
