import Link from "next/link";
import { Container, Text } from "@/components/ui";
import { nav, secondaryNav, site } from "@/lib/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  const links = [...nav, ...secondaryNav];
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div>
          <Logo on="dark" />
          <Text className={styles.tagline}>
            AKC {site.breed}s · {site.location.city}, {site.location.regionCode}
          </Text>
        </div>
        <nav className={styles.links} aria-label="Footer">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container>
        <Text className={styles.copyright}>
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
