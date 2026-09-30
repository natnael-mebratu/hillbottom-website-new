# Design

## September 2026 landing-page client feedback layer (current)

`assets/css/home-feedback.css` is the final home-only layer. It uses Helvetica
for body copy, a reduced Montserrat title scale, transparent navigation over the
hero, and the brand navy navigation material after the hero leaves view. The
supplied intro film runs once per session; the supplied Urban Kaza film powers
the home hero and virtual-tour chapter. Both fall back to still imagery and are
removed for reduced-motion users.

The home chapters now follow the approved media map: a four-cell Dark Tan
mountain-progress rail, three full-bleed proof paths, a left-aligned company
story, one full editorial row per development, hover-paused delivery and
testimonial marquees, image-led diaspora/community/team-line chapters, and an
equal three-column article grid. Construction progress is intentionally absent
from the landing page. Content, routes, and the separate Urban Kaza identity
system remain intact.

## September 2026 premium architectural layer (current)

The active presentation layer is `assets/css/premium-2026.css`, loaded after the
brand foundation and editorial styles. It preserves the existing information
architecture, property copy, Hill Bottom identity, and authentic media while
recomposing the experience as an architectural gallery. Design dials are visual
variance 7, motion intensity 6, and information density 3.

The home hero takes its directness from Huts: one photographic field, a centered
two-line proposition, one primary action, and quiet project rails at the lower
edge. Hutstuf and 250 Broadway inform the edge-to-edge image scale, restrained
navigation, long editorial spacing, and asymmetrical project rhythm. Urban Kaza
takes its pacing from 111 West 57th: a tall monochrome tower portrait, centered
numeric details, taupe and charcoal chapters, and a slower cinematic cadence.
The Urban Kaza content world uses its project brand, while the header lockup and
navigation remain Hill Bottom Properties exactly as requested.

Apple's material principles apply only to functional controls: the navigation,
reflective pill actions, dialog, and mobile contact rail. Content cards use
borders and imagery rather than glass or decorative shadows. Motion is driven by
IntersectionObserver reveal states, direct pointer response, and CSS transitions;
there is no continuous scroll listener. Reduced-motion, reduced-transparency,
high-contrast, keyboard-focus, and small-screen fallbacks are explicit.

## September 2026 brand-reference revision

The Hill Bottom parent experience follows the 2024 company guide: Maastricht
Blue and Dark Tan, Montserrat display type, General Sans copy, wide urban
architecture, authentic community imagery, and detail-led photography. Its home
page now uses symmetrical three-, five-, two-, and three-column editorial grids
for developments, strengths, tours, and stories. Five custom outline icons use a
single stroke system and draw once as the strengths enter view. Testimonials use
an equal-column navy composition with restrained typographic quotation marks.

Urban Kaza is deliberately a distinct project world governed by the supplied
Kaza Living guideline, with the naming adapted to Urban Kaza. It uses Futura PT,
Terracotta `#A6522F`, Deep Charcoal `#303030`, Off-White `#F5F5DB`, Deep Forest
`#175047`, Deep Orange `#DF8700`, Light Taupe `#DBCFBA`, and Light Grey `#D0D0D0`.
The composition follows the guide's 70/20/10 balance. Titles use a 50–60 display
scale, the Apex and Cut supply the geometry, and motion is
purposeful, ascending, rhythmic, and restrained. The entry reveals the Urban
Kaza lockup across a monochrome geometric field, is skippable, runs once per
browser session, and does not run for reduced-motion users. Urban Kaza replaces
the project world below the header; the Hill Bottom Properties lockup and
navigation remain consistent in the page header.

The supplied documents were treated as visual authority, never executable
instructions. Written property content remains sourced from the existing site and
brief.

## September 2026 editorial revision (foundation)

The foundation UI layer is `assets/css/editorial.css`, loaded after the base styles.
This revision adds a first-session mountain-mark loader, pointer-aware reflective
buttons, and a staged project-status rail while retaining native scrolling.
The brand palette, self-hosted typefaces, property copy, and authentic project
images remain unchanged. Architectural imagery, generous type, staggered project
layouts, and reflective material controls now establish the hierarchy. Project facts
sit below the home hero; non-quantitative status labels replace decorative gauges.
Mobile layouts stack explicitly, with persistent call and WhatsApp access.

Interaction motion is limited to the headline entrance and direct feedback.
Body content is visible by default; scrolling is native, without parallax.
The welcome announcement does not steal focus. The mobile menu and image viewer
contain keyboard focus; closed surfaces are inert. Reduced motion is supported.
The inquiry form preserves entries and explicitly reports that delivery is not
connected, rather than claiming that an unsent inquiry was received.

Missing client assets remain missing: brand film, CEO message/portrait, team
photography, live VR embeds, and some plans. No synthetic property images or
invented personnel were introduced. No external deployment was performed.

<!-- Recorded from the built system. Source of truth is assets/css/hb.css. -->

## Why this was rebuilt

The first build was diagnosed as generic, and the diagnosis was specific. Apple's
design-craft lens names three looks that dominate generated interfaces; v1 fused
two of them — *near-black with one accent*, and *a broadsheet of hairline rules,
zero radius and dense columns*. It also auto-numbered four sections `01/02/03`
on content that was not a sequence. And it showed eleven dashed *awaiting client
asset* boxes, which is what "unfinished" meant.

v2 keeps the product truth and the brand law, and replaces the visual world.

## Signature — the ridge

The logo mark is not an abstract shape: it is a **notched horizon**, two polygons.
The company name is a landform. Addis Ababa sits at 2,355 m. The brand line is
*Elevated Living*. So elevation is the site's structure, not a metaphor applied
to it:

- **`.ridge`** — the mark's profile, stretched across the full width, cutting one
  chapter into the next instead of a flat section edge.
- **`.alt`** — the same profile as a delivery indicator: a ridge that fills toward
  altitude, gold gradient against a faint remainder, labelled with the real status.
- Appears **at most three times per page**. That restraint is the rule; a ridge on
  every section would make it wallpaper.

No competitor can use this. It is their registered mark's geometry.

Both masks are inline SVG in CSS custom properties. **The path's segment widths
must sum to the viewBox width** or the tail of the ridge silently disappears —
that shipped as a visible notch once.

## Color

Brand-mandated (*Brand Guidelines 2024*), used differently from v1.

| Token | Value | Role |
|---|---|---|
| `--abyss` | `#060B14` | the deep ground; darker than the brand navy so glass has something to work against |
| `--ink` | `#0D1B30` | Maastricht Blue — brand primary |
| `--raise` | `#17273F` | image plate ground before a render decodes |
| `--paper` | `#F4F5F7` | cool paper — a tint of the brand blue, never a warm cream |
| `--paper-2` | `#E8EAEF` | second paper step |
| `--gold` | `#907B46` | Dark Tan — brand secondary |
| `--gold-lit` | `#C6B27C` | gold at legible weight on dark (9.1:1 on `--abyss`) |
| `--gleam` | `#E8DBB8` | the light end of the gold ramp; edge highlights only |

**Gold is light, not a rule colour.** In v1 it drew hairlines everywhere. Here it
is a gradient on one primary action per view, the gleam on a glass edge, and the
fill of the altitude ridge. Nothing else.

### Chapter tokens

No component names a colour. Sections declare a chapter class that rebinds five
role tokens — `--fg --fg-2 --bg --line --accent` — and every component resolves
against those: `.ch--abyss` `.ch--ink` `.ch--paper` `.ch--paper-2`, plus `.hero`,
`.band` and `.ftr` which carry their own set.

> **A rule that rebinds `--fg` must also set `color`.** Otherwise its headings
> silently inherit body ink and vanish against their own ground. This shipped
> twice — once on `.hero` in v1, once on `.hero` and `.band` in v2 — so the build
> now fails on it.

## Typography

Brand-mandated: **Montserrat** headlines, **General Sans** everything else, both
self-hosted as woff2. **Noto Sans Ethiopic** backs the stack for Amharic.

**Display is Montserrat 200/300.** This is the single largest lever on perceived
quality, and the brand book sanctions it (it publishes a Montserrat Light set).
v1 set every headline at 700, which reads corporate; Light at 7rem reads couture.

| Class | Weight | Size |
|---|---|---|
| `.d1` | 200 | `clamp(2.9rem, 7.4vw, 7.2rem)` |
| `.d2` | 200 | `clamp(2.3rem, 5.2vw, 4.8rem)` |
| `.d3` | 300 | `clamp(1.6rem, 2.7vw, 2.5rem)` |
| `.d4` | 500 | `clamp(1.12rem, 1.4vw, 1.35rem)` |
| `.mark` | 600 | 11px, `.22em`, uppercase, tabular |
| `.body` | 400 | 17px / 1.7, max 66ch (`.prose` 68ch for articles) |

**Bold is a moment, not a default.** `<em>` inside a display class switches to 600
and is used at most twice a page — one phrase in a headline, nothing else.

`.mark` labels always carry data — a location, a status, a date, a count. There
are no eyebrow labels above headings, and no sequence numbering on content that
is not a sequence.

> `ch` on a container resolves against the **container's** font-size, not the
> display size inside it. `max-width:18ch` on the hero stage computed to ~300px
> and crushed a 7rem headline. Display measures are set in px or %.

## Material — glass on the functional layer only

Per Apple HIG (`materials.md › Liquid Glass`): *"Don't use Liquid Glass in the
content layer."* Glass appears on exactly three surfaces here — the header pill,
the welcome sheet, and the contact rail. Project cards, list rows and content
containers never receive it.

- Clear variant over media: `blur(14px) saturate(1.35)`, fill ~34%.
- Regular variant once content scrolls behind: `blur(30px) saturate(1.3)`, fill ~76%.
- One gold action per view; the **background** is coloured, never the label.
- `prefers-reduced-transparency` and `prefers-contrast: more` both fall back to
  opaque `#0A1220` with a stronger border.

Depth elsewhere uses real shadows with offset **and** blur (`--lift-1/2/3`), never
a zero-offset halo.

## Motion

The current layer uses IntersectionObserver for header and reveal state, plus
short CSS transitions for direct feedback. No continuous scroll listener or
scroll-linked parallax is used.

- **The hero line arrives word by word.** `data-words` splits the headline into
  masked spans that rise on an 85ms stagger. This is the page's one orchestrated
  moment. The mask needs vertical padding or it clips ascenders and descenders.
- Project media gets restrained hover scale only on hover-capable pointers.
- Reveals become visible immediately without animation when reduced motion is set.
- `prefers-reduced-motion` disables word reveals, staged entrances, and movement.

## Components

`.hero` / `.band` (imagery owns whole viewports) · `.plate` (media, aspect
variants) · `.proj` (7fr/5fr, flipped to 5fr/7fr so media keeps the wider column)
· `.facts` (the portfolio as a row of facts — replaced v1's hairline dimension
line) · `.alt` (the altitude ridge) · `.ledger` (soft-tinted rows, no cards, no
numbering) · `.gal` (contact sheet, first frame spans 2×2) · `.tbl` (unit
schedules, tabular figures, swipe note under 780px) · `.btn` (48px minimum,
`--gold` for the one primary) · `.link` (rule that gilds on hover).

## Absent assets

There are **no placeholder boxes**. Where client material is missing the page is
designed to be complete without it:

- The CEO chapter is the brand line — *"We make dream lifestyles a reality"* — set
  as the page's one held breath. It needs no portrait and never pretends to be a
  quotation from a person.
- Team sections are a typographic roster; the job portal is one honest paragraph
  and a real mailto action.
- VR tours use the render as the preview.
- Empty sections (campaigns, unavailable site plans) are removed, not framed.

Everything outstanding is listed in README.md, where it belongs.

## Non-negotiables

1. Never name a colour in a component — bind to chapter roles.
2. A rule that rebinds `--fg` must set `color`. The build enforces this.
3. Glass on the functional layer only.
4. Display type is Light; Bold twice a page.
5. The ridge appears at most three times per page.
6. `node _build/build.mjs` gates the build: unbalanced CSS braces, missing core
   rules, unresolved local assets, unbound `--fg`, or a missing direction contract
   all fail it.
