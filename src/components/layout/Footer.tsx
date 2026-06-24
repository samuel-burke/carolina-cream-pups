import Link from "next/link";
import { Container, Text } from "@/components/ui";
import { legalNav, nav, secondaryNav, site, socialLinks } from "@/lib/site";
import { Logo } from "./Logo";
import styles from "./Footer.module.css";

export function Footer() {
  const links = [...nav, ...secondaryNav];
  const socials = socialLinks();
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div>
          <Logo on="dark" />
          <Text className={styles.tagline}>
            AKC {site.breed}s · {site.location.city}, {site.location.regionCode}
          </Text>
          {socials.length > 0 && (
            <div className={styles.socials}>
              {socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
        <nav className={styles.links} aria-label="Footer">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className={styles.bottom}>
        <Text className={styles.copyright}>
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </Text>
        <nav className={styles.legal} aria-label="Legal">
          {legalNav.map(({ href, label }) => (
            <Link key={href} href={href} className={styles.link}>
              {label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
