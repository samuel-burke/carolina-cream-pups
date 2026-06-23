/**
 * GOOGLE SHEETS read helper — the editable source for operational data
 * (current litter + the two waitlists). No API key or service account: the sheet
 * is shared "anyone with the link can view" and read via the public gviz CSV
 * endpoint. Server-only (called from content accessors), cached via ISR.
 *
 * Set GOOGLE_SHEET_ID to enable; when unset, callers fall back to in-code data.
 *
 * Expected tabs (header row + data rows):
 *   Litter:    status | title | timingLabel | counts | damName | sireName
 *   Waitlists: sex | state | reservations | note
 */
const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? "";

export const sheetsConfigured = (): boolean => SHEET_ID.length > 0;

/** Parse CSV (handles quoted fields, embedded commas/newlines, "" escapes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/** Turn a CSV matrix (first row = headers) into row objects keyed by header. */
export function rowsToObjects(matrix: string[][]): Record<string, string>[] {
  if (matrix.length === 0) return [];
  const headers = matrix[0].map((h) => h.trim());
  return matrix.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (cells[i] ?? "").trim()));
    return obj;
  });
}

/** Fetch one tab as row objects. Throws on non-OK so callers can fall back. */
export async function fetchSheetRows(tab: string): Promise<Record<string, string>[]> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { next: { revalidate: 300, tags: ["reserve"] } });
  if (!res.ok) throw new Error(`Sheets fetch failed for "${tab}": ${res.status}`);
  return rowsToObjects(parseCsv(await res.text()));
}
