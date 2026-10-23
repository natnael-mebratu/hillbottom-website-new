import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { leads } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";
import { pushLeadToOdoo } from "../integrations/odoo.js";

export const leadsRouter = Router();

// The site's inquiry form (assets/js/hb.js submitInquiry) posts a FormData
// body, not JSON — no files, just text fields, so upload.none() is enough
// to get multer to populate req.body from a multipart request.
const parseMultipart = multer().none();

// Caps form-spam: this endpoint is public and unauthenticated by design,
// so it needs its own limiter (same shape as auth.ts's login limiter).
const leadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many submissions. Please try again later." },
});

const leadInput = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  interestedIn: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  // Odoo tags beyond the "Website Lead" every submission gets (see
  // odoo.ts) — e.g. the promo landing page's form also sending "Promo".
  // Not a DB column: CRM routing only, stripped before the local insert.
  tags: z.string().optional(),
});

// The form's own field names (name, interest, utm_source, …) don't match
// our column names 1:1 — translate rather than rename one side, since the
// form's names are also what's rendered in its `name=` attributes site-wide.
function fromFormFields(body: Record<string, unknown>) {
  return {
    fullName: body.name,
    email: body.email,
    phone: body.phone,
    country: body.country,
    interestedIn: body.interest,
    message: body.message,
    source: body.page,
    utmSource: body.utm_source,
    utmMedium: body.utm_medium,
    utmCampaign: body.utm_campaign,
    landingPage: body.landing_page,
    referrer: body.referrer,
    // Set via a hidden <input name="tags"> on the form itself (comma-
    // separated), so each page/campaign declares its own extra tags.
    tags: body.tags,
  };
}

// Public: the site's inquiry form (and any future "Register Interest"
// widget) submits here. Accepts either the form's multipart/form-data body
// or a plain JSON body with our own field names (for direct API use).
leadsRouter.post("/", leadLimiter, parseMultipart, async (req, res) => {
  const isFormSubmit = "name" in req.body || "interest" in req.body;
  const parsed = leadInput.safeParse(isFormSubmit ? fromFormFields(req.body) : req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { tags, ...leadFields } = parsed.data;
  const [row] = await db.insert(leads).values(leadFields).returning();

  // Best-effort: a lead is saved locally regardless of whether Odoo is
  // reachable or even configured — never let the CRM push fail the
  // visitor's submission.
  try {
    const odooLeadId = await pushLeadToOdoo({
      ...leadFields,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    });
    if (odooLeadId) {
      await db.update(leads).set({ odooLeadId }).where(eq(leads.id, row.id));
      row.odooLeadId = odooLeadId;
    }
  } catch (err) {
    console.error("Odoo push failed for lead", row.id, err);
  }

  res.status(201).json(row);
});

// Admin: view/export captured leads.
leadsRouter.get("/", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  res.json(rows);
});
