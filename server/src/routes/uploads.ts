import { Router } from "express";
import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middleware/auth.js";

export const uploadsRouter = Router();

// Served statically by app.ts at /uploads — images admins attach to team
// members, testimonials, projects, blog posts, etc. land here and are
// referenced from the DB by their public URL, same as any pasted-in URL.
export const UPLOADS_DIR = path.resolve(
  new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
  "../../uploads",
);
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

// Admin: upload a single image, get back the URL to paste into any
// *Url field (team photo, testimonial photo, hero image, blog cover, …).
uploadsRouter.post("/", requireAdmin, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

// Multer's fileFilter/limit errors reach here rather than the handler above.
uploadsRouter.use(
  (err: Error, _req: unknown, res: import("express").Response, _next: import("express").NextFunction) => {
    res.status(400).json({ error: err.message });
  },
);
