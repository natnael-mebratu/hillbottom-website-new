# Hillbottom Properties API

Backend for the Hillbottom Properties website, replacing the old
`localStorage`-based admin fallback (`artifacts/hillbottom/src/lib/adminStorage.ts`)
with a real, persisted API.

Stack: Express + TypeScript + PostgreSQL (via Drizzle ORM).

## Setup

```bash
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, etc.
npm install
npm run db:generate    # only needed after changing src/db/schema.ts
npm run db:migrate
npm run db:seed         # creates the first admin user from SEED_ADMIN_* env vars
npm run dev              # starts on PORT (default 4000)
```

## Endpoints

All routes are namespaced under `/api`. Public GET endpoints are open;
writes require `Authorization: Bearer <token>` from `POST /api/auth/login`.

- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/projects` — projects listing/detail, filterable by `?status=`
- `GET/POST/DELETE /api/progress` — Dream vs. Actual progress feed per project
- `GET/POST/PUT/DELETE /api/pricing` — per-project/unit pricing & payment plans
- `GET/POST/PUT/DELETE /api/team`
- `GET/POST/PUT/DELETE /api/blog`
- `GET/POST/DELETE /api/marketing` — cumulative marketing campaign feed
- `GET/PUT /api/site-media` — hero/featured video URLs, virtual tour provider config

Contact Us and Book a Visit are intentionally not part of this API — those
pages live on the client's Odoo site (CRM + Calendar) per project decision.
