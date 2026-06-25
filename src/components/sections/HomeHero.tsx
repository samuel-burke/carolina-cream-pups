import Image from "next/image";
import { Container, Heading, Button } from "@/components/ui";
import { CloudinaryImage } from "@/components/ui/CloudinaryImage";
import type { HomeContent } from "@/lib/content-types";
import styles from "./HomeHero.module.css";

export function HomeHero({ hero }: { hero: HomeContent["hero"] }) {
  return (
    <section className={styles.hero} aria-label="Welcome">
      {hero.image.cloudinaryId ? (
        <CloudinaryImage
          publicId={hero.image.cloudinaryId}
          alt={hero.image.alt}
          priority
          sizes="100vw"
          className={styles.img}
        />
      ) : (
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          fill
          priority
          sizes="100vw"
          unoptimized={hero.image.src.endsWith(".svg")}
          className={styles.img}
        />
      )}
      <div aria-hidden className={styles.scrim} />
      <Container className={styles.content}>
        <p className={styles.place}>{hero.place}</p>
        <Heading level={1} className={styles.title}>
          {hero.tagline}
        </Heading>
        <div className={styles.actions}>
          <Button href={hero.cta.href}>{hero.cta.label}</Button>
        </div>
      </Container>
    </section>
  );
}
