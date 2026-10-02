import { Router } from "express";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/client.js";
import { siteMedia } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";

export const siteMediaRouter = Router();

const siteMediaInput = z.object({
  heroVideoUrl: z.string().optional(),
  featuredProjectVideoUrl: z.string().optional(),
  virtualTourProvider: z.enum(["iframe", "youtube", "vimeo", "external"]).optional(),
  virtualTourUrl: z.string().optional(),
  virtualTourTitle: z.string().optional(),
  promoVideoUrl: z.string().optional(),
  promoGiftTitle: z.string().optional(),
  promoGiftBody: z.string().optional(),
  promoPartnerUrl: z.string().optional(),
});

// Singleton config (hero video, featured project video, virtual tour
// provider/URL) — replaces the old localStorage adminStorage.ts fallback.
siteMediaRouter.get("/", async (_req, res) => {
  const [row] = await db.select().from(siteMedia).where(eq(siteMedia.id, 1));
  res.json(row ?? null);
});

siteMediaRouter.put("/", requireAdmin, async (req, res) => {
  const parsed = siteMediaInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .insert(siteMedia)
    .values({ id: 1, ...parsed.data })
    .onConflictDoUpdate({
      target: siteMedia.id,
      set: { ...parsed.data, updatedAt: new Date() },
    })
    .returning();
  res.json(row);
});
