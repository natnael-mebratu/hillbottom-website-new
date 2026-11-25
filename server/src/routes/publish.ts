import { Router } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { requireAdmin } from "../middleware/auth.js";

export const publishRouter = Router();

const execFileAsync = promisify(execFile);

// Repo root is this file's directory walked up two levels (server/src/routes -> repo root).
const REPO_ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"), "../../..");

// Regenerates the static site from the DB (fetchData -> build) right here
// in place. This server's own checkout (/var/www/hillbottom) is what nginx
// serves directly, so a rebuild IS the deploy — no git push/webhook needed
// (that round-trip only made sense under the old Vercel-hosted setup).
// Deliberately doesn't touch git at all: committing the regenerated static
// files from a live production checkout would conflict with the normal
// git pull workflow used to ship code changes to this same checkout.
publishRouter.post("/", requireAdmin, async (_req, res) => {
  const log: string[] = [];
  const run = async (cmd: string, args: string[]) => {
    const { stdout, stderr } = await execFileAsync(cmd, args, { cwd: REPO_ROOT });
    log.push(`$ ${cmd} ${args.join(" ")}\n${stdout}${stderr}`);
  };

  try {
    await run("npm", ["run", "fetch-data"]);
    await run("npm", ["run", "build"]);
    res.json({ published: true, log });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message, log });
  }
});
