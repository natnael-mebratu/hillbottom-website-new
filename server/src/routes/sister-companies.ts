import { Router } from "express";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "../db/client.js";
import { sisterCompanies } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const sisterCompaniesRouter = Router();

const sisterCompanyInput = z.object({
  name: z.string().min(1),
  summary: z.string().optional(),
  logoUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

sisterCompaniesRouter.get("/", async (_req, res) => {
  const rows = await db
    .select()
    .from(sisterCompanies)
    .orderBy(asc(sisterCompanies.sortOrder));
  res.json(rows);
});

sisterCompaniesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = sisterCompanyInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(sisterCompanies).values(parsed.data).returning();
  res.status(201).json(row);
});

sisterCompaniesRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = sisterCompanyInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .update(sisterCompanies)
    .set(parsed.data)
    .where(eq(sisterCompanies.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Sister company not found" });
    return;
  }
  res.json(row);
});

sisterCompaniesRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(sisterCompanies).where(eq(sisterCompanies.id, Number(req.params.id)));
  res.status(204).end();
});
