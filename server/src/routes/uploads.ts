import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { requireAdmin } from "../middleware/auth.js";

export const uploadsRouter = Router();

// Admin-only already, but caps runaway disk usage from a compromised token
// or a buggy client retry loop — same shape as the other limiters.
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many uploads. Please try again later." },
});

// Served statically by app.ts at /uploads — images admins attach to team
// members, testimonials, projects, blog posts, etc. land here and are
// referenced from the DB by their public URL, same as any pasted-in URL.
export const UPLOADS_DIR = path.resolve(
  new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
  "../../uploads",
);
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// The saved extension is derived from this map, keyed by the mimetype WE
// validated — never from the client-supplied filename/mimetype directly.
// multipart Content-Type is just a header the client sets, so trusting
// req.file.originalname's extension would let a spoofed image/png upload
// actually save as, say, .svg or .html — which /uploads then serves as a
// live document (express.static has no idea it's supposed to be an image),
// letting embedded script run same-origin. Whitelisting the save extension
// to one of exactly these 4 closes that off regardless of what the client
// claims.
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    cb(null, `${crypto.randomUUID()}${ALLOWED_TYPES[file.mimetype] ?? ".bin"}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in ALLOWED_TYPES)) {
      cb(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
      return;
    }
    cb(null, true);
  },
});

// Admin: upload a single image, get back the URL to paste into any
// *Url field (team photo, testimonial photo, hero image, blog cover, …).
uploadsRouter.post("/", requireAdmin, uploadLimiter, upload.single("file"), (req, res) => {
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
