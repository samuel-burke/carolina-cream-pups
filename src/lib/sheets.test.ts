import { describe, expect, it } from "vitest";
import { parseCsv, rowsToObjects } from "./sheets";
import { mapReserveRows, mapLitterStatusRows } from "./content";

describe("parseCsv", () => {
  it("parses simple rows", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([
      ["a", "b"],
      ["1", "2"],
    ]);
  });

  it("handles quoted fields with commas and escaped quotes", () => {
    const csv = 'name,note\n"Smith, Jane","She said ""hi"""';
    expect(parseCsv(csv)).toEqual([
      ["name", "note"],
      ["Smith, Jane", 'She said "hi"'],
    ]);
  });

  it("handles a quoted field containing a newline", () => {
    expect(parseCsv('a\n"line1\nline2"')).toEqual([["a"], ["line1\nline2"]]);
  });
});

describe("rowsToObjects", () => {
  it("keys cells by trimmed header", () => {
    expect(rowsToObjects([[" sex ", "state"], ["Male", "open"]])).toEqual([
      { sex: "Male", state: "open" },
    ]);
  });
});

const litterRows = [
  {
    status: "expected",
    title: "Summer 2026 litter",
    timingLabel: "Expected late July",
    counts: "",
    damName: "Maple",
    sireName: "Finn",
  },
];
const waitlistRows = [
  { sex: "Male", state: "open", reservations: "3", note: "" },
  { sex: "Female", state: "closed", reservations: "0", note: "Opens with this litter" },
];

describe("mapReserveRows", () => {
  it("maps sheet rows into ReserveContent with coercion", () => {
    const r = mapReserveRows(litterRows, waitlistRows);
    expect(r.status).toBe("expected");
    expect(r.title).toBe("Summer 2026 litter");
    expect(r.counts).toBeUndefined(); // empty string -> omitted
    expect(r.pairing.damName).toBe("Maple");
    expect(r.pairing.damImage.src.length).toBeGreaterThan(0);
    expect(r.waitlists.male).toMatchObject({ sex: "Male", state: "open", reservations: 3 });
    expect(r.waitlists.female).toMatchObject({ sex: "Female", state: "closed", reservations: 0 });
    expect(r.waitlists.female.note).toBe("Opens with this litter");
  });

  it("falls back safely on bad/missing values", () => {
    const r = mapReserveRows([{ status: "weird" }], [{ sex: "Male", state: "??", reservations: "x" }]);
    expect(r.status).toBe("born"); // unknown status -> born
    expect(r.waitlists.male.state).toBe("closed"); // unknown state -> closed
    expect(r.waitlists.male.reservations).toBe(0); // non-numeric -> 0
  });
});

describe("mapLitterStatusRows", () => {
  it("derives the home band headline from open lists", () => {
    const open = mapLitterStatusRows(litterRows, waitlistRows);
    expect(open.headline).toContain("waitlists open");
    const closed = mapLitterStatusRows(litterRows, [
      { sex: "Male", state: "full", reservations: "5" },
      { sex: "Female", state: "closed", reservations: "0" },
    ]);
    expect(closed.headline).not.toContain("waitlists open");
    expect(closed.cta.href).toBe("/reserve");
  });
});
