import { Grid, Eyebrow, Heading, Text, ImageBox } from "@/components/ui";
import type { ParentProfile as ParentProfileContent } from "@/lib/content-types";
import styles from "./ParentProfile.module.css";

export function ParentProfile({
  role,
  name,
  registeredName,
  chicNumber,
  verifyUrl,
  description,
  clearances,
  titles,
  image,
}: ParentProfileContent) {
  return (
    <Grid cols={2} gap={4} templateDesktop="1fr 1.2fr" className={styles.profile} style={{ alignItems: "start" }}>
      <ImageBox image={image} ratio="4/5" sizes="(max-width: 768px) 100vw, 45vw" />
      <div>
        <Eyebrow>{role}</Eyebrow>
        <Heading level={3}>{name}</Heading>
        {registeredName ? (
          <Text muted style={{ fontSize: "var(--size-sm)", marginTop: "0.25rem" }}>
            {registeredName}
            {chicNumber ? ` · CHIC ${chicNumber}` : ""}
          </Text>
        ) : null}
        <Text muted style={{ marginTop: "1rem" }}>
          {description}
        </Text>

        <dl className={styles.clearances}>
          {clearances.map((c) => (
            <div key={c.test} className={styles.row}>
              <dt className={styles.test}>{c.test}</dt>
              <dd className={styles.result}>{c.result}</dd>
            </div>
          ))}
        </dl>

        {verifyUrl ? (
          <a className={styles.verify} href={verifyUrl} target="_blank" rel="noopener noreferrer">
            Verify on OFA →
          </a>
        ) : null}

        {titles && titles.length > 0 ? (
          <div className={styles.titles}>
            <span className={styles.titlesLabel}>Titles &amp; accomplishments</span>
            <ul className={styles.badges}>
              {titles.map((t) => (
                <li key={t} className={styles.badge}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Grid>
  );
}
