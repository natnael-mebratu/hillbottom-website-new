import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { pricingPlans } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const pricingRouter = Router();

const pricingInput = z.object({
  projectId: z.number().int(),
  unitType: z.string().min(1),
  price: z.string().or(z.number()).transform(String),
  currency: z.string().default("ETB"),
  installmentPlan: z.array(z.record(z.string(), z.any())).default([]),
  discountRules: z.array(z.record(z.string(), z.any())).default([]),
});

// Public: per-project/unit pricing and payment plans for the Pricing page.
pricingRouter.get("/project/:projectId", async (req, res) => {
  const rows = await db
    .select()
    .from(pricingPlans)
    .where(eq(pricingPlans.projectId, Number(req.params.projectId)));
  res.json(rows);
});

pricingRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = pricingInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(pricingPlans).values(parsed.data).returning();
  res.status(201).json(row);
});

pricingRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = pricingInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .update(pricingPlans)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(pricingPlans.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Pricing plan not found" });
    return;
  }
  res.json(row);
});

pricingRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(pricingPlans).where(eq(pricingPlans.id, Number(req.params.id)));
  res.status(204).end();
});
