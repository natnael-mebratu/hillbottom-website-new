/* Pushes a submitted lead into Odoo CRM as a crm.lead, the same record
   Odoo's own website "Contact Us" form snippet would create on submit —
   contact_name/email_from/phone/description from the form, an opportunity
   name synthesized the way Odoo defaults one when the form doesn't supply
   a subject, and no explicit team/source assignment so Odoo's own
   assignment rules route it exactly as they would for a native submission.

   Fields are mapped to Odoo's own structured columns wherever one exists
   (country_id, source_id/medium_id/campaign_id, referred, tag_ids) rather
   than dumped into the description note, so Odoo's own filters/reports
   on country and campaign attribution work on these leads too. Only what
   has no native field (the message itself, unit-type interest) goes into
   description.

   Talks to Odoo's standard external API over JSON-RPC (POST /jsonrpc),
   which is the same {common.authenticate, object.execute_kw} surface as
   XML-RPC — no extra XML dependency needed. Configured via env vars; if
   they're unset this becomes a no-op so leads still save locally even
   when Odoo isn't reachable or configured yet. */

type OdooLeadInput = {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  interestedIn?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage?: string;
  referrer?: string;
  // Every lead gets "Website Lead"; a specific page/campaign can add more
  // (e.g. the promo landing page also tagging "Promo") — see leads.ts.
  tags?: string[];
};

let uidCache: number | null = null;

function config() {
  const url = process.env.ODOO_URL;
  const db = process.env.ODOO_DB;
  const username = process.env.ODOO_USERNAME;
  const apiKey = process.env.ODOO_API_KEY;
  if (!url || !db || !username || !apiKey) return null;
  return { url: url.replace(/\/$/, ""), db, username, apiKey };
}

async function jsonRpc(url: string, service: string, method: string, args: unknown[]) {
  const res = await fetch(`${url}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
  });
  const payload = (await res.json()) as { result?: unknown; error?: { message?: string; data?: { message?: string } } };
  if (payload.error) {
    throw new Error(payload.error.data?.message || payload.error.message || "Odoo JSON-RPC error");
  }
  return payload.result;
}

async function authenticate(cfg: NonNullable<ReturnType<typeof config>>): Promise<number> {
  if (uidCache) return uidCache;
  const uid = await jsonRpc(cfg.url, "common", "authenticate", [cfg.db, cfg.username, cfg.apiKey, {}]);
  if (!uid || typeof uid !== "number") throw new Error("Odoo authentication failed — check ODOO_DB/ODOO_USERNAME/ODOO_API_KEY");
  uidCache = uid;
  return uid;
}

// Builds the description block for what Odoo has no structured field for —
// the message itself and which unit type they're interested in (country and
// UTM attribution now go to real fields instead, see resolveCountryId /
// resolveUtmId below).
function describeLead(input: OdooLeadInput): string {
  const lines = [];
  if (input.message) lines.push(input.message, "");
  lines.push(`Interested in: ${input.interestedIn || "—"}`);
  if (input.landingPage) lines.push(`Landing page: ${input.landingPage}`);
  return lines.join("\n");
}

// Common short forms the "Country of residence" free-text field collects
// that don't match Odoo's official res.country names — without this, "USA"
// or "UK" would silently fail to resolve and the country would be dropped.
const COUNTRY_ALIASES: Record<string, string> = {
  usa: "United States",
  us: "United States",
  "u.s.a.": "United States",
  "u.s.": "United States",
  uk: "United Kingdom",
  "u.k.": "United Kingdom",
  uae: "United Arab Emirates",
};

// res.country is a fixed list in Odoo — look it up, never create one. No
// match (typo, an unrecognized country) just leaves country_id unset; the
// visitor's original text isn't lost, it's still on the local lead record.
async function resolveCountryId(
  cfg: NonNullable<ReturnType<typeof config>>,
  uid: number,
  name: string | undefined,
): Promise<number | null> {
  if (!name?.trim()) return null;
  const query = COUNTRY_ALIASES[name.trim().toLowerCase()] ?? name.trim();
  const matches = (await jsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "res.country",
    "search_read",
    [[["name", "=ilike", query]]],
    { fields: ["id"], limit: 1 },
  ])) as { id: number }[];
  return matches[0]?.id ?? null;
}

// utm.source/utm.medium/utm.campaign are freely created in Odoo (unlike
// countries) — find-or-create, same shape as resolveTagIds below.
async function resolveUtmId(
  cfg: NonNullable<ReturnType<typeof config>>,
  uid: number,
  model: "utm.source" | "utm.medium" | "utm.campaign",
  name: string | undefined,
): Promise<number | null> {
  if (!name?.trim()) return null;
  const value = name.trim();
  const matches = (await jsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    model,
    "search_read",
    [[["name", "=", value]]],
    { fields: ["id"], limit: 1 },
  ])) as { id: number }[];
  if (matches[0]) return matches[0].id;

  const id = await jsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    model,
    "create",
    [{ name: value }],
  ]);
  return typeof id === "number" ? id : null;
}

// crm.tag has no unique constraint on name, so a plain create() would
// duplicate a tag on every lead — search first, create only what's missing,
// one search_read covering every requested name rather than one per tag.
async function resolveTagIds(
  cfg: NonNullable<ReturnType<typeof config>>,
  uid: number,
  names: string[],
): Promise<number[]> {
  const unique = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  if (!unique.length) return [];

  const existing = (await jsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "crm.tag",
    "search_read",
    [[["name", "in", unique]]],
    { fields: ["id", "name"] },
  ])) as { id: number; name: string }[];

  const ids = existing.map((t) => t.id);
  const missing = unique.filter((n) => !existing.some((t) => t.name === n));
  for (const name of missing) {
    const id = await jsonRpc(cfg.url, "object", "execute_kw", [
      cfg.db,
      uid,
      cfg.apiKey,
      "crm.tag",
      "create",
      [{ name }],
    ]);
    if (typeof id === "number") ids.push(id);
  }
  return ids;
}

// Returns the new crm.lead's id, or null if Odoo isn't configured —
// callers treat null as "skipped", not an error.
export async function pushLeadToOdoo(input: OdooLeadInput): Promise<number | null> {
  const cfg = config();
  if (!cfg) return null;

  const uid = await authenticate(cfg);
  const tagIds = await resolveTagIds(cfg, uid, ["Website Lead", ...(input.tags ?? [])]);
  const countryId = await resolveCountryId(cfg, uid, input.country);
  // A lead arriving through this integration is, by definition, from the
  // website — default the medium even when no utm_medium param was present
  // (a direct/organic visit), so Odoo's own attribution reports still group
  // it correctly instead of showing blank.
  const sourceId = await resolveUtmId(cfg, uid, "utm.source", input.utmSource);
  const mediumId = await resolveUtmId(cfg, uid, "utm.medium", input.utmMedium || "Website");
  const campaignId = await resolveUtmId(cfg, uid, "utm.campaign", input.utmCampaign);

  const leadId = await jsonRpc(cfg.url, "object", "execute_kw", [
    cfg.db,
    uid,
    cfg.apiKey,
    "crm.lead",
    "create",
    [
      {
        name: `Website Inquiry — ${input.interestedIn || "General"}`,
        contact_name: input.fullName,
        email_from: input.email,
        phone: input.phone || false,
        description: describeLead(input),
        tag_ids: [[6, 0, tagIds]],
        country_id: countryId || false,
        source_id: sourceId || false,
        medium_id: mediumId || false,
        campaign_id: campaignId || false,
        referred: input.referrer || false,
        website: input.landingPage || false,
      },
    ],
  ]);

  return typeof leadId === "number" ? leadId : null;
}
