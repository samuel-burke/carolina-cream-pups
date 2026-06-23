import { Card, Text, ImageBox } from "@/components/ui";
import type { Testimonial } from "@/lib/content-types";
import styles from "./TestimonialCard.module.css";

function Stars({ rating }: { rating: number }) {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div className={styles.stars} role="img" aria-label={`${r} out of 5 stars`}>
      {"★".repeat(r)}
      <span className={styles.starsEmpty}>{"★".repeat(5 - r)}</span>
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { quote, name, location, rating, image } = testimonial;
  return (
    <Card flush style={{ display: "flex", flexDirection: "column" }}>
      {image ? (
        <ImageBox
          image={image}
          ratio="4/3"
          radius="top"
          keyline={false}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : null}
      <div className={styles.body}>
        {rating ? <Stars rating={rating} /> : null}
        <blockquote className={styles.quote}>“{quote}”</blockquote>
        <Text style={{ fontWeight: 600, marginTop: "auto" }}>
          {name}
          {location ? <span className={styles.location}> · {location}</span> : null}
        </Text>
      </div>
    </Card>
  );
}
