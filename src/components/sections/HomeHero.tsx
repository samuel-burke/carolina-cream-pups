import Image from "next/image";
import { Container, Heading, Button } from "@/components/ui";
import { images } from "@/lib/images";
import { site } from "@/lib/site";
import styles from "./HomeHero.module.css";

export function HomeHero() {
  const hero = images.heroHome;
  return (
    <section className={styles.hero} aria-label="Welcome">
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        unoptimized={hero.src.endsWith(".svg")}
        className={styles.img}
      />
      <div aria-hidden className={styles.scrim} />
      <Container className={styles.content}>
        <p className={styles.place}>
          {site.location.city}, {site.location.region}
        </p>
        <Heading level={1} className={styles.title}>
          {site.tagline}
        </Heading>
        <div className={styles.actions}>
          <Button href="/reserve">Join the Waitlist</Button>
        </div>
      </Container>
    </section>
  );
}
