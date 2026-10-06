/* Pushes a submitted lead into Odoo CRM as a crm.lead, the same record
   Odoo's own website "Contact Us" form snippet would create on submit —
   contact_name/email_from/phone/description from the form, an opportunity
   name synthesized the way Odoo defaults one when the form doesn't supply
   a subject, and no explicit team/source assignment so Odoo's own
   assignment rules route it exactly as they would for a native submission.

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

// Builds the description block the way a human reading the CRM record would
// want it: the message first, then where the lead came from.
function describeLead(input: OdooLeadInput): string {
  const lines = [];
  if (input.message) lines.push(input.message, "");
  lines.push(`Country of residence: ${input.country || "—"}`);
  lines.push(`Interested in: ${input.interestedIn || "—"}`);
  if (input.utmSource || input.utmMedium || input.utmCampaign) {
    lines.push(`Campaign: ${[input.utmSource, input.utmMedium, input.utmCampaign].filter(Boolean).join(" / ")}`);
  }
  if (input.landingPage) lines.push(`Landing page: ${input.landingPage}`);
  if (input.referrer) lines.push(`Referrer: ${input.referrer}`);
  return lines.join("\n");
}

// Returns the new crm.lead's id, or null if Odoo isn't configured —
// callers treat null as "skipped", not an error.
export async function pushLeadToOdoo(input: OdooLeadInput): Promise<number | null> {
  const cfg = config();
  if (!cfg) return null;

  const uid = await authenticate(cfg);
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
      },
    ],
  ]);

  return typeof leadId === "number" ? leadId : null;
}
