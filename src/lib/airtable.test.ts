import { describe, expect, it } from "vitest";
import { mapReserveRows, mapLitterStatusRows } from "./content";

// Airtable returns typed fields: single-selects as strings, numbers as numbers,
// and omits empty fields entirely.
const litterRows = [
  {
    status: "expected",
    title: "Summer 2026 litter",
    timingLabel: "Expected late July",
    damName: "Maple",
    sireName: "Finn",
  },
];
const waitlistRows = [
  { sex: "Male", state: "open", reservations: 3 },
  { sex: "Female", state: "closed", reservations: 0, note: "Opens with this litter" },
];

describe("mapReserveRows", () => {
  it("maps Airtable rows into ReserveContent with coercion", () => {
    const r = mapReserveRows(litterRows, waitlistRows);
    expect(r.status).toBe("expected");
    expect(r.title).toBe("Summer 2026 litter");
    expect(r.counts).toBeUndefined(); // omitted field -> undefined
    expect(r.pairing.damName).toBe("Maple");
    expect(r.pairing.damImage.src.length).toBeGreaterThan(0);
    expect(r.waitlists.male).toMatchObject({ sex: "Male", state: "open", reservations: 3 });
    expect(r.waitlists.female).toMatchObject({ sex: "Female", state: "closed", reservations: 0 });
    expect(r.waitlists.female.note).toBe("Opens with this litter");
  });

  it("falls back safely on bad/missing values", () => {
    const r = mapReserveRows([{ status: "weird" }], [{ sex: "Male", state: "??", reservations: "x" }]);
    expect(r.status).toBe("born"); // unknown status -> born
    expect(r.title.length).toBeGreaterThan(0); // missing -> default
    expect(r.waitlists.male.state).toBe("closed"); // unknown state -> closed
    expect(r.waitlists.male.reservations).toBe(0); // non-numeric -> 0
    expect(r.waitlists.female.reservations).toBe(0); // missing row -> 0
  });
});

describe("mapLitterStatusRows", () => {
  it("derives the home band headline from open lists", () => {
    const open = mapLitterStatusRows(litterRows, waitlistRows);
    expect(open.headline).toContain("waitlists open");
    const closed = mapLitterStatusRows(litterRows, [
      { sex: "Male", state: "full", reservations: 5 },
      { sex: "Female", state: "closed", reservations: 0 },
    ]);
    expect(closed.headline).not.toContain("waitlists open");
    expect(closed.cta.href).toBe("/reserve");
  });
});
