import { Router } from "express";
import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { db } from "../db/client.js";
import { testimonials } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const testimonialsRouter = Router();

const testimonialInput = z.object({
  authorName: z.string().min(1),
  location: z.string().optional(),
  quote: z.string().min(1),
  photoUrl: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

testimonialsRouter.get("/", async (_req, res) => {
  const rows = await db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
  res.json(rows);
});

testimonialsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = testimonialInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(testimonials).values(parsed.data).returning();
  res.status(201).json(row);
});

testimonialsRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = testimonialInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .update(testimonials)
    .set(parsed.data)
    .where(eq(testimonials.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }
  res.json(row);
});

testimonialsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(testimonials).where(eq(testimonials.id, Number(req.params.id)));
  res.status(204).end();
});
