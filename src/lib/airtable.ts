/**
 * AIRTABLE read helper — the editable source for operational data (current
 * litter + the two waitlists). Server-only (called from content accessors),
 * cached via ISR. Uses a Personal Access Token; no UI/CRUD to build — Airtable
 * provides the database, validation, and grid editor.
 *
 * Set AIRTABLE_API_KEY + AIRTABLE_BASE_ID to enable; when unset, callers fall
 * back to in-code defaults. See docs/ADMIN-AIRTABLE.md.
 *
 * Expected tables:
 *   Litter:    status (expected|born) | title | timingLabel | counts | damName | sireName
 *   Waitlists: sex (Male|Female) | state (open|full|closed) | reservations (number) | note
 */
const API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";

export const airtableConfigured = (): boolean => API_KEY.length > 0 && BASE_ID.length > 0;

type AirtableResponse = { records?: { fields?: Record<string, unknown> }[] };

/** Fetch one table's rows (field objects). Throws on non-OK so callers fall back. */
export async function fetchTable(table: string): Promise<Record<string, unknown>[]> {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(table)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${API_KEY}` },
    next: { revalidate: 300, tags: ["reserve"] },
  });
  if (!res.ok) throw new Error(`Airtable fetch failed for "${table}": ${res.status}`);
  const data = (await res.json()) as AirtableResponse;
  return (data.records ?? []).map((r) => r.fields ?? {});
}
