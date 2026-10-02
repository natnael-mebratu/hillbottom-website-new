import { Router } from "express";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { marketingPosts } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const marketingRouter = Router();

const marketingInput = z.object({
  title: z.string().min(1),
  body: z.string().optional(),
  mediaUrl: z.string().optional(),
  campaignTag: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
});

// Public: cumulative feed of all marketing campaign posts, newest first,
// per Annex A's Marketing Campaign Posts page.
marketingRouter.get("/", async (_req, res) => {
  const rows = await db
    .select()
    .from(marketingPosts)
    .orderBy(desc(marketingPosts.publishedAt));
  res.json(rows);
});

marketingRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = marketingInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { publishedAt, ...rest } = parsed.data;
  const [row] = await db
    .insert(marketingPosts)
    .values({ ...rest, publishedAt: publishedAt ? new Date(publishedAt) : undefined })
    .returning();
  res.status(201).json(row);
});

marketingRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(marketingPosts).where(eq(marketingPosts.id, Number(req.params.id)));
  res.status(204).end();
});
