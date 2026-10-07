import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { projects, projectStatusEnum } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const projectsRouter = Router();

const projectInput = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  status: z.enum(projectStatusEnum.enumValues),
  location: z.string().optional(),
  summary: z.string().optional(),
  heroImageUrl: z.string().optional(),
  unitTypes: z.array(z.record(z.string(), z.any())).default([]),
  floorPlans: z.array(z.record(z.string(), z.any())).default([]),
  completionPercent: z.number().int().min(0).max(100).optional(),
  currentStage: z.string().optional(),
  nextMilestone: z.string().optional(),
});

// Public: list projects, filterable by status (Completed / Ongoing /
// Under Construction / Upcoming) per Annex A's Projects Listing page.
projectsRouter.get("/", async (req, res) => {
  const status = req.query.status as string | undefined;
  const rows = status
    ? await db
        .select()
        .from(projects)
        .where(eq(projects.status, status as (typeof projectStatusEnum.enumValues)[number]))
    : await db.select().from(projects);
  res.json(rows);
});

projectsRouter.get("/:slug", async (req, res) => {
  const [row] = await db
    .select()
    .from(projects)
    .where(eq(projects.slug, req.params.slug));
  if (!row) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(row);
});

projectsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = projectInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(projects).values(parsed.data).returning();
  res.status(201).json(row);
});

projectsRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = projectInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .update(projects)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(projects.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  res.json(row);
});

projectsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(projects).where(eq(projects.id, Number(req.params.id)));
  res.status(204).end();
});
