import { Router } from "express";
import { z } from "zod";
import { desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { leads } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const leadsRouter = Router();

const leadInput = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  interestedIn: z.string().optional(),
  message: z.string().optional(),
  source: z.string().optional(),
});

// Public: any "Register Interest" widget on the site submits here.
leadsRouter.post("/", async (req, res) => {
  const parsed = leadInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(leads).values(parsed.data).returning();
  res.status(201).json(row);
});

// Admin: view/export captured leads.
leadsRouter.get("/", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  res.json(rows);
});
