import { Router } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { requireAdmin } from "../middleware/auth.js";

export const publishRouter = Router();

const execFileAsync = promisify(execFile);

// Repo root is this file's directory walked up two levels (server/src/routes -> repo root).
const REPO_ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "../../..");

// Regenerates the static site from the DB (fetchData -> build), commits, and
// pushes — Vercel's deploy hook on the pushed branch picks it up from there.
// This is the one write path that touches the git repo directly; everything
// else only ever writes to Postgres.
publishRouter.post("/", requireAdmin, async (_req, res) => {
  const branch = process.env.PUBLISH_BRANCH || "main";
  const log: string[] = [];
  const run = async (cmd: string, args: string[]) => {
    const { stdout, stderr } = await execFileAsync(cmd, args, { cwd: REPO_ROOT });
    log.push(`$ ${cmd} ${args.join(" ")}\n${stdout}${stderr}`);
  };

  try {
    await run("npm", ["run", "fetch-data"]);
    await run("npm", ["run", "build"]);

    const { stdout: status } = await execFileAsync("git", ["status", "--porcelain"], { cwd: REPO_ROOT });
    if (!status.trim()) {
      res.json({ published: false, reason: "no changes after regeneration", log });
      return;
    }

    await run("git", ["add", "-A"]);
    await run("git", ["commit", "-m", "Publish: content update from admin"]);
    await run("git", ["push", "origin", `HEAD:${branch}`]);

    res.json({ published: true, log });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message, log });
  }
});
