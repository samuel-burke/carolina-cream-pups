"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui";
import { nav } from "@/lib/site";
import { Logo } from "./Logo";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.header}>
      <Container className={styles.bar}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={[styles.link, isActive(href) ? styles.active : ""].filter(Boolean).join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          className={styles.toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </Container>

      {open && (
        <nav id="mobile-menu" className={styles.mobileNav} aria-label="Primary">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={[styles.mobileLink, isActive(href) ? styles.mobileActive : ""]
                .filter(Boolean)
                .join(" ")}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
