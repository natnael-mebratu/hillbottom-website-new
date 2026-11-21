/* Pulls admin-managed content from Postgres and regenerates
   _build/generated-content.mjs, which the page templates import. Run before
   `node _build/build.mjs` as part of a publish — see server/src/routes/publish.ts.
   Requires DATABASE_URL in the environment (same one the server uses). */
import fs from "fs";
import path from "path";
import pg from "pg";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

const esc = (s) => JSON.stringify(String(s ?? ""));

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.log("fetchData: no DATABASE_URL set, leaving generated-content.mjs untouched");
    return;
  }
  const client = new pg.Client({ connectionString: url });
  await client.connect();
  try {
    const { rows } = await client.query(
      `select promo_video_url, promo_gift_title, promo_gift_body, promo_partner_url,
              price_calc_promo_active, price_calc_promo_text
       from site_media where id = 1`,
    );
    const row = rows[0] ?? {};

    // Operational fields only — status/progress/stage, the things that
    // actually change week to week. Editorial copy (taglines, CTA labels,
    // hero images) stays hand-authored in data.mjs; this overlays onto it
    // by slug, it doesn't replace it. See data.mjs's PROJECTS/CONSTRUCTION
    // merge for how the two combine.
    const { rows: projectRows } = await client.query(
      `select slug, status, completion_percent, current_stage, next_milestone
       from projects`,
    );

    // Construction Updates (construction.html): "dream" entries are the
    // architect's final render for a project (we take the most recently
    // posted one as the hero image); "actual" entries are real dated
    // site-progress photos, surfaced oldest-first for the chronological
    // auto-scrolling marquee. Joined by slug so data.mjs can merge them
    // into CONSTRUCTION alongside status/stage/milestone.
    const { rows: progressRows } = await client.query(
      `select p.slug, pu.type, pu.media_url, pu.caption, pu.posted_at
       from progress_updates pu
       join projects p on p.id = pu.project_id
       order by pu.posted_at asc`,
    );
    const progressBySlug = {};
    for (const r of progressRows) {
      (progressBySlug[r.slug] ??= []).push(r);
    }
    const projectsLive = projectRows.map((p) => {
      const entries = progressBySlug[p.slug] || [];
      const dreams = entries.filter((e) => e.type === "dream");
      const actuals = entries.filter((e) => e.type === "actual");
      return {
        slug: p.slug,
        status: p.status,
        completionPercent: p.completion_percent,
        currentStage: p.current_stage,
        nextMilestone: p.next_milestone,
        finalRenderUrl: dreams.length ? dreams[dreams.length - 1].media_url : null,
        progressPhotos: actuals.map((e) => ({
          url: e.media_url,
          caption: e.caption,
          postedAt: e.posted_at,
        })),
      };
    });

    // Marketing Feed (marketing.html) — fully DB-driven, no static fallback
    // content, since this is meant to be current/live, not evergreen copy.
    const { rows: marketingRows } = await client.query(
      `select id, title, body, media_url, campaign_tag, published_at
       from marketing_posts order by published_at desc`,
    );
    const marketingPosts = marketingRows.map((m) => ({
      id: m.id,
      title: m.title,
      body: m.body,
      mediaUrl: m.media_url,
      campaignTag: m.campaign_tag,
      publishedAt: m.published_at,
    }));

    // Team page (team.html) — fully DB-driven, no static fallback content,
    // mirroring the MARKETING_POSTS pattern above.
    const { rows: teamRows } = await client.query(
      `select id, name, role, department, bio, photo_url, sort_order
       from team_members order by sort_order asc`,
    );
    const teamMembers = teamRows.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      department: t.department,
      bio: t.bio,
      photoUrl: t.photo_url,
      sortOrder: t.sort_order,
    }));

    // Home page "What Our Residents Say" marquee — fully DB-driven, no
    // static fallback content, mirroring the TEAM_MEMBERS pattern above.
    const { rows: testimonialRows } = await client.query(
      `select id, author_name, location, quote, photo_url, sort_order
       from testimonials order by sort_order asc`,
    );
    const testimonials = testimonialRows.map((t) => ({
      id: t.id,
      authorName: t.author_name,
      location: t.location,
      quote: t.quote,
      photoUrl: t.photo_url,
      sortOrder: t.sort_order,
    }));

    // Careers page (careers.html) — open roles only; closed postings stay
    // in the DB (for their application history) but never reach the
    // static build. No merge needed — rendered as-is.
    const { rows: jobRows } = await client.query(
      `select id, title, department, location, employment_type, description, sort_order
       from jobs where is_open = true order by sort_order asc`,
    );
    const jobs = jobRows.map((j) => ({
      id: j.id,
      title: j.title,
      department: j.department,
      location: j.location,
      employmentType: j.employment_type,
      description: j.description,
      sortOrder: j.sort_order,
    }));

    // Price Calculator (price-calculator.html) — admin-set price/stock
    // overrides, keyed by unitType so data.mjs can overlay them onto the
    // static UK_PRICE_LIST by matching unitType to "<unit id> <floors>"
    // (e.g. "UK 1 4 – 15 Floor") — see mergeLivePricing() in data.mjs. A
    // unitType with no match is simply never applied; an empty table (no
    // admin rows yet) falls back entirely to the static sheet values.
    const { rows: pricingRows } = await client.query(
      `select pp.unit_type, pp.price, pp.units_left
       from pricing_plans pp
       join projects p on p.id = pp.project_id
       where p.slug = 'urban-kaza'`,
    );
    const pricingLive = pricingRows.map((p) => ({
      unitType: p.unit_type,
      price: p.price,
      unitsLeft: p.units_left,
    }));

    const header = [
      "/* Regenerated by node _build/fetchData.mjs from the admin-managed",
      "   database before every publish. Checked in with safe fallbacks so",
      "   a fresh clone (or a DB-less build) still produces a working site. Never",
      "   hand-edit — your changes will be overwritten on the next publish. */",
    ].join("\n");
    const out = `${header}
export const PROMO = {
  videoUrl: ${esc(row.promo_video_url)},
  giftTitle: ${esc(row.promo_gift_title)},
  giftBody: ${esc(row.promo_gift_body)},
  partnerUrl: ${esc(row.promo_partner_url)},
};

// price-calculator.html's own promo banner — hidden unless an admin turns
// it on for an active discount campaign.
export const PRICE_CALC_PROMO = {
  active: ${JSON.stringify(!!row.price_calc_promo_active)},
  text: ${esc(row.price_calc_promo_text)},
};

// Keyed by project slug, overlaid onto data.mjs's PROJECTS/CONSTRUCTION —
// see mergeLiveProject() in data.mjs. finalRenderUrl/progressPhotos come
// from progress_updates ("dream" = final render, "actual" = dated
// progress photos, oldest first) and drive construction.html's hero
// render + auto-scrolling photo marquee per project.
export const PROJECTS_LIVE = ${JSON.stringify(projectsLive, null, 2)};

// marketing.html's feed, newest first. No merge needed — rendered as-is.
export const MARKETING_POSTS = ${JSON.stringify(marketingPosts, null, 2)};

// team.html's member grid, by sortOrder. No merge needed — rendered as-is;
// team.html falls back to generic hero/stats copy when this is empty.
export const TEAM_MEMBERS = ${JSON.stringify(teamMembers, null, 2)};

// Home page "What Our Residents Say" marquee, by sortOrder. No merge
// needed — rendered as-is; the section is skipped on the home page when
// this is empty.
export const TESTIMONIALS_LIVE = ${JSON.stringify(testimonials, null, 2)};

// careers.html's open-roles list, by sortOrder. No merge needed — rendered
// as-is; careers.html falls back to a "no open roles right now" message
// when this is empty.
export const JOBS = ${JSON.stringify(jobs, null, 2)};

// Urban Kaza admin price/stock overrides, see note above. No merge needed
// here — the actual overlay onto UK_PRICE_LIST happens in data.mjs.
export const PRICING_LIVE = ${JSON.stringify(pricingLive, null, 2)};
`;
    fs.writeFileSync(path.join(ROOT, "generated-content.mjs"), out);
    console.log(`fetchData: generated-content.mjs written from site_media + ${projectsLive.length} projects + ${marketingPosts.length} marketing posts + ${teamMembers.length} team members + ${testimonials.length} testimonials + ${jobs.length} open jobs + ${pricingLive.length} pricing overrides`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("fetchData failed:", err);
  process.exit(1);
});
