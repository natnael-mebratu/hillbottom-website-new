import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.js";
import { projectsRouter } from "./routes/projects.js";
import { progressRouter } from "./routes/progress.js";
import { pricingRouter } from "./routes/pricing.js";
import { teamRouter } from "./routes/team.js";
import { blogRouter } from "./routes/blog.js";
import { marketingRouter } from "./routes/marketing.js";
import { siteMediaRouter } from "./routes/site-media.js";
import { leadsRouter } from "./routes/leads.js";
import { sisterCompaniesRouter } from "./routes/sister-companies.js";
import { publishRouter } from "./routes/publish.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") ?? "*",
    }),
  );
  app.use(express.json({ limit: "2mb" }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/progress", progressRouter);
  app.use("/api/pricing", pricingRouter);
  app.use("/api/team", teamRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/marketing", marketingRouter);
  app.use("/api/site-media", siteMediaRouter);
  app.use("/api/leads", leadsRouter);
  app.use("/api/sister-companies", sisterCompaniesRouter);
  app.use("/api/publish", publishRouter);

  return app;
}
