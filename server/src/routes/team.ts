import { Router } from "express";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "../db/client.js";
import { teamMembers } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const teamRouter = Router();

const teamInput = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  department: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

teamRouter.get("/", async (_req, res) => {
  const rows = await db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder));
  res.json(rows);
});

teamRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = teamInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(teamMembers).values(parsed.data).returning();
  res.status(201).json(row);
});

teamRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = teamInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .update(teamMembers)
    .set(parsed.data)
    .where(eq(teamMembers.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Team member not found" });
    return;
  }
  res.json(row);
});

teamRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(teamMembers).where(eq(teamMembers.id, Number(req.params.id)));
  res.status(204).end();
});
