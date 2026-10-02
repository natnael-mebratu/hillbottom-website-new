import { Router } from "express";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { progressUpdates, progressEntryTypeEnum } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const progressRouter = Router();

const progressInput = z.object({
  projectId: z.number().int(),
  type: z.enum(progressEntryTypeEnum.enumValues),
  mediaUrl: z.string().min(1),
  caption: z.string().optional(),
  milestoneLabel: z.string().optional(),
  completionPercent: z.number().int().min(0).max(100).optional(),
});

// Public: timestamped Dream vs. Actual update feed for a project, newest
// first, per Annex A's Progress Page.
progressRouter.get("/project/:projectId", async (req, res) => {
  const rows = await db
    .select()
    .from(progressUpdates)
    .where(eq(progressUpdates.projectId, Number(req.params.projectId)))
    .orderBy(desc(progressUpdates.postedAt));
  res.json(rows);
});

progressRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = progressInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(progressUpdates).values(parsed.data).returning();
  res.status(201).json(row);
});

progressRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db
    .delete(progressUpdates)
    .where(eq(progressUpdates.id, Number(req.params.id)));
  res.status(204).end();
});
