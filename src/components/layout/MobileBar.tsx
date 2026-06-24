"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileBar.module.css";

/**
 * Mobile conversion aids, rendered once in the layout:
 *  - A sticky bottom CTA bar (mobile only) linking to the waitlist + contact.
 *    Hidden on the pages it would point to (/reserve, /contact).
 *  - A "back to top" button that fades in after scrolling, on all viewports.
 *
 * Client component: it reads scroll position and the current path.
 */
export function MobileBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  // Don't show the CTA bar on the pages it links to.
  const showCta = pathname !== "/reserve" && pathname !== "/contact";

  return (
    <>
      {showCta && (
        <div className={styles.bar} role="region" aria-label="Quick actions">
          <Link href="/reserve" className={`${styles.action} ${styles.solid}`}>
            Reserve a puppy
          </Link>
          <Link href="/contact" className={`${styles.action} ${styles.ghost}`}>
            Contact
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={toTop}
        aria-label="Back to top"
        className={[styles.toTop, scrolled ? styles.visible : "", showCta ? styles.aboveBar : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </>
  );
}
