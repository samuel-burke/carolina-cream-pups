import { Text } from "./Typography";
import { Grid } from "./Grid";
import styles from "./Steps.module.css";

export type Step = { head: string; body: string };

type Props = {
  steps: Step[];
  /** Number of columns at desktop (matches steps.length for the common case). */
  cols: 2 | 3 | 4;
};

/**
 * Numbered sequence used by the "first eight weeks" timeline (About) and the
 * "how reserving works" process (Reserve). Big display numerals, sage top rule.
 */
export function Steps({ steps, cols }: Props) {
  return (
    <Grid cols={cols} gap={3}>
      {steps.map((s, i) => (
        <div key={s.head} className={styles.step}>
          <div aria-hidden className={styles.num}>
            {i + 1}
          </div>
          <div>
            <Text style={{ fontWeight: 600 }}>{s.head}</Text>
            <Text muted style={{ marginTop: "0.25rem", fontSize: "var(--size-sm)" }}>
              {s.body}
            </Text>
          </div>
        </div>
      ))}
    </Grid>
  );
}
