# Hill Bottom Properties — website

Marketing site for Hill Bottom Properties (Addis Ababa): Hill Bottom Village in Ayat,
Urban Kaza in Kazanchis, and the Phase 3 Commercial + Recreation Centre.

**Live:** https://hillbottom-properties.vercel.app

The site is **static HTML, CSS and vanilla JS**. A small Node script in `_build/`
generates the HTML pages from templates and content data. There is no framework and
no runtime dependency, and the repository root *is* the deployable site.

> Taking this project over? Start with **[HANDOVER.md](HANDOVER.md)**.

## Quick start

```bash
npm install        # only needed for the image/model tooling and the test harness
npm run build      # regenerate every HTML page from _build/
npm run serve      # http://localhost:8422
npm run check      # 139 interaction, layout and brand checks in headless Edge
```

Deploy (Vercel, project `hillbottom-properties`):

```bash
npm run deploy     # = vercel deploy --prod --yes --archive=tgz
```

## Where things live

| Path | What it is |
|---|---|
| `*.html`, `projects/`, `news/` | **Generated output.** Do not hand-edit; run `npm run build`. |
| `assets/css/` | Stylesheets, loaded in order: `hb` → `editorial` → `kaza` → `premium-2026` → `home-feedback` → `site-unified` → `refine-2026` (the last one wins). |
| `assets/js/hb.js` | All behaviour: intros, menu, lightbox, forms, zoning model, reveals. |
| `assets/img/` | Responsive WebP renders (`name-1400.webp`, `name-800.webp`, some `-2400`). |
| `assets/img/zoning/` | 18 Blender renders for the Urban Kaza zoning model (3 views × 6 states × 2 sizes). |
| `assets/fonts/` | Self-hosted Montserrat, General Sans, Inter, Noto Ethiopic, Futura PT. |
| `assets/video/` | `urban-kaza-showcase.mp4`, the home hero and virtual-tour loop. |
| `_build/data.mjs` | **All site content**: projects, floors, units, testimonials, contacts. |
| `_build/pages/*.mjs` | Page templates. `ui.mjs` holds shared components; `intros.mjs` holds the two brand intros. |
| `_build/build.mjs` | Writes every page, then fails the build on missing assets, unbalanced CSS, or a missing design contract. |
| `_build/kaza3d/` | Blender model + render script for the zoning section. |
| `_build/kaza-fix/`, `_build/vfix/` | The scripts that re-signed "Kaza Living" → "Urban Kaza" on renders and on the video. |
| `DESIGN.md`, `PRODUCT.md` | Design system and product context. |

## Rules that keep the site healthy

- Internal links are written with `.html`. **Do not enable `cleanUrls`** in `vercel.json`;
  it would turn every internal link into a 308 redirect.
- Deploy with `--archive=tgz`. Plain uploads fail on this project.
- Never strip a CSS block with a regex. The build gates on brace balance because a
  broken block once silently disabled every rule after it.
- Any rule that sets `--fg` must also set `color` (the build enforces this).
