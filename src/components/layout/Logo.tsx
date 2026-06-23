import styles from "./Logo.module.css";

/** Wordmark: "Carolina Cream Pups" with the middle word in italic sage. */
export function Logo({ on = "light" }: { on?: "light" | "dark" }) {
  return (
    <span className={[styles.logo, on === "dark" ? styles.dark : ""].filter(Boolean).join(" ")}>
      Carolina <span className={styles.accent}>Cream</span> Pups
    </span>
  );
}
