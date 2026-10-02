import { Router } from "express";
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { db } from "../db/client.js";
import { blogPosts } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const blogRouter = Router();

const blogInput = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().optional(),
  author: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.string().datetime().optional(),
});

blogRouter.get("/", async (_req, res) => {
  const rows = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.published, true))
    .orderBy(desc(blogPosts.publishedAt));
  res.json(rows);
});

blogRouter.get("/admin", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  res.json(rows);
});

blogRouter.get("/:slug", async (req, res) => {
  const [row] = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.slug, req.params.slug), eq(blogPosts.published, true)));
  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(row);
});

blogRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = blogInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { publishedAt, ...rest } = parsed.data;
  const [row] = await db
    .insert(blogPosts)
    .values({ ...rest, publishedAt: publishedAt ? new Date(publishedAt) : undefined })
    .returning();
  res.status(201).json(row);
});

blogRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = blogInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { publishedAt, ...rest } = parsed.data;
  const [row] = await db
    .update(blogPosts)
    .set({
      ...rest,
      ...(publishedAt ? { publishedAt: new Date(publishedAt) } : {}),
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(row);
});

blogRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(blogPosts).where(eq(blogPosts.id, Number(req.params.id)));
  res.status(204).end();
});
