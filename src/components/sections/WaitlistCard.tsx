import { Card, Heading, Text } from "@/components/ui";
import type { Waitlist } from "@/lib/content-types";
import styles from "./WaitlistCard.module.css";

const STATE_LABEL: Record<Waitlist["state"], string> = {
  open: "Open",
  full: "Full",
  closed: "Closed",
};

export function WaitlistCard({ waitlist }: { waitlist: Waitlist }) {
  const { sex, state, reservations, note } = waitlist;
  return (
    <Card>
      <div className={styles.head}>
        <Heading level={3}>{sex} list</Heading>
        <span className={[styles.badge, styles[state]].join(" ")}>{STATE_LABEL[state]}</span>
      </div>
      <Text style={{ marginTop: "0.75rem", fontWeight: 600 }}>
        {reservations} {reservations === 1 ? "reservation" : "reservations"}
      </Text>
      {note && (
        <Text muted style={{ marginTop: "0.5rem", fontSize: "var(--size-sm)" }}>
          {note}
        </Text>
      )}
    </Card>
  );
}
