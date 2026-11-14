import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { eq, asc, desc } from "drizzle-orm";
import { db } from "../db/client.js";
import { jobs, jobApplications } from "../db/schema.js";
import { requireAdmin } from "../middleware/auth.js";
import { sendJobApplicationEmail } from "../integrations/mailer.js";
import { UPLOADS_DIR } from "./uploads.js";

export const jobsRouter = Router();

const jobInput = z.object({
  title: z.string().min(1),
  department: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  description: z.string().min(1),
  isOpen: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

// Public: careers.html's job list. Admins see closed roles too via the
// admin panel's own GET (not exposed here) — the public site only ever
// shows what's actually open.
jobsRouter.get("/", async (_req, res) => {
  const rows = await db.select().from(jobs).where(eq(jobs.isOpen, true)).orderBy(asc(jobs.sortOrder));
  res.json(rows);
});

jobsRouter.get("/all", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(jobs).orderBy(asc(jobs.sortOrder));
  res.json(rows);
});

jobsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = jobInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db.insert(jobs).values(parsed.data).returning();
  res.status(201).json(row);
});

jobsRouter.put("/:id", requireAdmin, async (req, res) => {
  const parsed = jobInput.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [row] = await db
    .update(jobs)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(jobs.id, Number(req.params.id)))
    .returning();
  if (!row) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(row);
});

jobsRouter.delete("/:id", requireAdmin, async (req, res) => {
  await db.delete(jobs).where(eq(jobs.id, Number(req.params.id)));
  res.status(204).end();
});

// Admin: view submitted applications for a job (or all, if no jobId).
jobsRouter.get("/applications/list", requireAdmin, async (req, res) => {
  const jobId = req.query.jobId ? Number(req.query.jobId) : undefined;
  const rows = jobId
    ? await db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId)).orderBy(desc(jobApplications.createdAt))
    : await db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt));
  res.json(rows);
});

// --- Apply ----------------------------------------------------------------

const ALLOWED_CV_TYPES: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

const cvStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => cb(null, `${crypto.randomUUID()}${ALLOWED_CV_TYPES[file.mimetype] ?? ".bin"}`),
});

const uploadCv = multer({
  storage: cvStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in ALLOWED_CV_TYPES)) {
      cb(new Error("CV must be a PDF or Word document"));
      return;
    }
    cb(null, true);
  },
});

// Public and unauthenticated by design (anyone can apply) — same shape of
// limiter as leads.ts and uploads.ts use for their own public/sensitive
// endpoints.
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many applications submitted. Please try again later." },
});

const applicationInput = z.object({
  jobId: z.coerce.number().int(),
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  coverNote: z.string().optional(),
});

jobsRouter.post("/apply", applyLimiter, uploadCv.single("cv"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "A CV file (PDF or Word doc) is required" });
    return;
  }
  const parsed = applicationInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const [job] = await db.select().from(jobs).where(eq(jobs.id, parsed.data.jobId));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  const cvUrl = `/uploads/${req.file.filename}`;
  const [row] = await db
    .insert(jobApplications)
    .values({ ...parsed.data, cvUrl })
    .returning();

  // Best-effort: the application is saved regardless of whether the
  // notification email actually goes out (SMTP may not be configured yet).
  try {
    const sent = await sendJobApplicationEmail({
      jobTitle: job.title,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      coverNote: parsed.data.coverNote,
      cvPath: path.join(UPLOADS_DIR, req.file.filename),
      cvFilename: req.file.originalname,
    });
    if (sent) {
      await db.update(jobApplications).set({ emailedAt: new Date() }).where(eq(jobApplications.id, row.id));
    }
  } catch (err) {
    console.error("Job application email failed for application", row.id, err);
  }

  res.status(201).json({ ok: true });
});

// Multer's fileFilter/limit errors reach here rather than the handler above.
jobsRouter.use(
  (err: Error, _req: unknown, res: import("express").Response, _next: import("express").NextFunction) => {
    res.status(400).json({ error: err.message });
  },
);
