import { site } from "@/lib/site";
import type { Testimonial } from "@/lib/content-types";

/**
 * Review + AggregateRating structured data so the testimonials can earn
 * star-rating rich results. Only includes ratings/aggregate when the
 * testimonials actually carry numeric ratings.
 */
export function ReviewsJsonLd({ testimonials }: { testimonials: Testimonial[] }) {
  const rated = testimonials.filter((t) => typeof t.rating === "number");
  if (rated.length === 0) return null;

  const avg = rated.reduce((sum, t) => sum + (t.rating ?? 0), 0) / rated.length;

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: new URL("/testimonials", site.url).toString(),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avg.toFixed(1),
      reviewCount: rated.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: rated.map((t) => ({
      "@type": "Review",
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5, worstRating: 1 },
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
